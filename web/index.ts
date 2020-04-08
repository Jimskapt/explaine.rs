import * as messages from "./messages";
import renderer, { pure } from "./renderer";
import { addClass, removeClass } from "./util";
import worker from "./worker-client";
import { reportHit } from "./logging";

import { TextMarker, Editor } from "codemirror";

import { generateLink, whatsThis, toggleEdit, showAll } from "./header";
import { aside } from "./explanation-aside";
import codemirror from "./editor";
import {
  Location,
  MissingHint,
  PENDING,
  CompilationState,
  ERROR,
  SUCCESS,
} from "./types";

declare global {
  var __ANALYTICS_URL__: any;
  var __PRODUCTION__: any;
}

const document = window.document;
const querySelector = (selector: string) => document.querySelector(selector);

reportHit();

const IS_TOUCH_DEVICE = "ontouchstart" in window;

addClass(document.body, IS_TOUCH_DEVICE ? "touch-device" : "non-touch-device");

/* CODEMIRROR INIT */
let cm: Editor;
let codemirrorEl: HTMLElement;

codemirror({
  isTouchDevice: IS_TOUCH_DEVICE,
  anchor: querySelector(".codemirror-anchor") as HTMLElement,
  onClick() {
    onCmClick();
  },
  onMouseMove(_cm: any, e: MouseEvent) {
    onCmMouseMove(e);
  },
  onChange() {
    onCmChange();
  },
})
  .then(({ cm: instance, codemirrorEl: el }) => {
    cm = instance;

    if (!self.__PRODUCTION__) {
      (window as any).cm = cm;
    }
    codemirrorEl = el;

    return initialCodeRender(cm);
  })
  .then(() => {
    addClass(document.body, "codemirror-rendered");
    setState({ editorReady: true });
  });

/* HEADER */

const renderGenerateLink = generateLink({
  onAddress(address: string) {
    setState({ address });
  },
  getValue() {
    return cm && cm.getValue();
  },
});

whatsThis();

const renderToggleEdit = toggleEdit({
  onToggleEdit() {
    setState(({ editable }: State) => ({ editable: !editable }));
  },
});

const renderShowAll = showAll({
  onToggleShowAll() {
    setState(({ compilation }: State) => ({
      compilation: {
        ...compilation,
        showAll: !compilation.showAll,
      },
    }));
  },
});

/* EXPLANATION ASIDE */

const renderAside = aside({
  onWrapInBlock() {
    if (cm == null) return;
    const lines = cm.lineCount();
    for (let i = 0; i < lines; i++) {
      cm.indentLine(i, "add");
    }
    cm.replaceRange("fn main() {\n", { line: 0, ch: 0 });
    cm.replaceRange("\n}", {
      line: lines,
      ch: cm.getLineHandle(lines).text.length,
    });
  },
});

/* "REACT" */
export type CompilationError = Span & { isBlock: boolean; msg: string };
export type Elaboration = {
  location: Span;
  title: string;
  elaboration: string;
  book: string | null;
  keyword: string | null;
};

type State = {
  editable: boolean;
  compilation: {
    state: CompilationState;
    showAll: boolean;
    hoverEl: EventTarget | null;
    elaboration: Elaboration | null;
    explanation: Span | null;
    exploration: boolean;
    error: CompilationError | null;
    missing: MissingHint | null;
  };
  address: string | null;
  editorReady: boolean;
  empty: boolean;
};

type Span = {
  start: Location;
  end: Location;
};

let state: State = {
  compilation: {
    state: PENDING,
    showAll: false,
    hoverEl: null,
    explanation: null,
    elaboration: null,
    exploration: false,
    error: null,
    missing: null,
  },
  editable: !IS_TOUCH_DEVICE,
  address: null,
  editorReady: false,
  empty: false,
};

const initialCompilation = state.compilation;

type NonUIState = {
  lastRule: number;
  mark: TextMarker | null;
  hoverMark: TextMarker | null;
  computedMarks: TextMarker[] | null;
  errorMark: TextMarker | null;
  errorContextMark: TextMarker | null;
  hoverIndex: number | null;
  compilationIndex: number;
  elaborationIndex: number | null;
  lastElaborationRequest: Location | null;
};

let nonUiState: NonUIState = {
  lastRule: -1,
  mark: null,
  hoverMark: null,
  computedMarks: null,
  errorMark: null,
  errorContextMark: null,
  hoverIndex: null,
  compilationIndex: 0,
  elaborationIndex: null,
  lastElaborationRequest: null,
};

const setState = renderer<State>(
  () => {
    const { compilation } = state;

    // EDITOR
    renderHover({ hoverEl: compilation.hoverEl });
    renderErrorMarks({ error: compilation.error });
    renderElaborationMark({ elaboration: compilation.elaboration });
    renderExplanationMark({ explanation: compilation.explanation });
    renderCodeEditor({
      showAll: compilation.showAll,
      editable: state.editable,
    });
    // renderMissingTooltip({
    //   missing: compilation.missing,
    // });

    // ASIDE
    renderAside({
      elaboration: compilation.elaboration,
      error: compilation.error,
      compilationState: compilation.state,
      missing: compilation.missing,
    });

    // HEADER
    renderGenerateLink({
      address: state.address,
      enabled: state.editorReady,
    });
    renderToggleEdit({
      editable: state.editable,
      enabled: state.editorReady,
    });
    renderShowAll({
      showAll: compilation.showAll,
      empty: state.empty,
      canShow: compilation.exploration != null,
      failedCompilation: compilation.state === ERROR,
    });
  },
  {
    get() {
      return state;
    },
    set(nextState: State) {
      state = nextState;
      if (!self.__PRODUCTION__) {
        (window as any).state = state;
      }
    },
  }
);

/* WORKER */

let { postMessage: postToWorker, ready: workerIsReadyPromise } = worker({
  onMessage(data) {
    switch (data.type) {
      case messages.COMPILED:
        setState({ compilation: { ...initialCompilation, state: SUCCESS } });
        break;
      case messages.COMPILATION_ERROR:
        setState({
          compilation: {
            ...initialCompilation,
            state: ERROR,
            error: data.error,
          },
        });
        break;
      case messages.EXPLANATION:
        setState(({ compilation }: State) => ({
          compilation: { ...compilation, explanation: data.location },
        }));
        onExplanation();
        break;
      case messages.ELABORATION:
        onElaboration(data);
        break;
      case messages.EXPLORATION:
        computeExploration(data.exploration);
        setState(({ compilation }: State) => ({
          compilation: { ...compilation, exploration: true },
        }));
        break;
      default:
        console.error("Unexpected message in window", data);
    }
  },
});

/* CODE */

const styleSheet = (() => {
  const styleEl = document.createElement("style");
  document.head.appendChild(styleEl);
  return styleEl.sheet as CSSStyleSheet;
})();

function initialCodeRender(cm: any) {
  let promise = Promise.resolve();

  const codeParam = [...new window.URLSearchParams(location.search)].find(
    ([key, value]) => key === "code"
  );
  const code =
    codeParam != null ? window.decodeURIComponent(codeParam[1]) : null;

  if (code != null && code.trim() !== "") {
    cm.setValue(code);
    return promise;
  }

  const local = window.localStorage.getItem("code");
  if (local != null && local.trim() !== "") {
    cm.setValue(local);
    return promise;
  }

  promise =
    document.readyState === "loading"
      ? new Promise((resolve) => {
          document.addEventListener("DOMContentLoaded", () => resolve());
        })
      : Promise.resolve();

  promise = promise.then(() =>
    cm.setValue((querySelector(".default-code") as any).value)
  );

  return promise;
}

const compileOnChange = (() => {
  let workerIsReady = false;
  workerIsReadyPromise.then(() => {
    workerIsReady = true;
  });
  let firstCompilationEnqueued = false;

  return () => {
    if (workerIsReady) {
      doCompile();
    } else if (!firstCompilationEnqueued) {
      firstCompilationEnqueued = true;
      workerIsReadyPromise.then(() => doCompile());
    }
  };
})();

function onCmChange() {
  nonUiState.compilationIndex += 1;
  setState({
    compilation: initialCompilation,
    address: null,
    empty: cm.getValue() === "",
  });
  compileOnChange();
}

function onCmMouseMove(e: MouseEvent) {
  if (state.compilation.state !== SUCCESS) {
    return;
  }

  if (nonUiState.computedMarks) {
    setState(({ compilation }: State) => ({
      compilation: { ...compilation, hoverEl: e.target },
    }));
    return;
  }

  explain(e);
}

function onCmClick() {
  elaborate(cm.getCursor("from"));
}

function elaborate(location: Location) {
  if (state.compilation.state !== SUCCESS || state.empty) return;
  nonUiState.elaborationIndex = nonUiState.compilationIndex;
  nonUiState.lastElaborationRequest = location;
  postToWorker({
    type: messages.ELABORATE,
    location,
  });
}

const { debounced: explain, done: doneAfterExplanation } = debounceUntilDone(
  function explain(
    { clientX: left, clientY: top }: MouseEvent,
    done: () => void
  ) {
    const { compilation } = state;

    if (compilation.state !== SUCCESS) {
      return done();
    }

    let { line, ch } = cm.coordsChar({ left, top }, "window");

    explainLocation({ line, ch });

    if (explainLocation.cached) {
      done();
    }
  },
  200
);

const explainLocation = memoize(
  function explainLocation({ line, ch }: Location) {
    postToWorker({
      type: messages.EXPLAIN,
      location: { line, ch },
    });
  },
  (prev: Location, current: Location) => {
    if (prev.line === current.line && prev.ch === current.ch) {
      return true;
    }

    const { explanation } = state.compilation;

    return (
      explanation != null &&
      withinRange(current, explanation.start, explanation.end)
    );
  }
);

function onExplanation() {
  if (nonUiState.computedMarks) return;
  doneAfterExplanation();
}

function onElaboration(elaboration: Elaboration | { location: null }) {
  if (nonUiState.compilationIndex !== nonUiState.elaborationIndex) return;

  let missing: MissingHint | null = null;

  if (elaboration.location == null) {
    const MARGIN = 5;
    const { line, ch } = nonUiState.lastElaborationRequest!!;
    const minLine = Math.max(0, line - MARGIN);
    const maxLine = Math.min(cm.lineCount() - 1, line + MARGIN);
    let lines = [...new Array(maxLine - minLine)].map((_, i) =>
      cm.getLine(minLine + i)
    );
    const emptyRe = /^ *$/;
    const indentation = lines
      .filter((line) => !emptyRe.test(line))
      .reduce(
        (acc, line) => Math.min(acc, line.match(/^ */)?.[0].length ?? 0),
        Number.POSITIVE_INFINITY
      );
    if (indentation > 0) {
      const re = new RegExp("^" + " ".repeat(indentation));
      lines.forEach((line, i) => {
        if (!emptyRe.test(line)) {
          lines[i] = line.replace(re, "");
        }
      });
    }
    lines.forEach((line, i) => {
      lines[i] = `${String(i).padStart(2, " ")} | ${line}`;
    });
    lines.splice(
      line - minLine + 1,
      0,
      `   | ${" ".repeat(ch - indentation)}↑`
    );

    missing = {
      code: lines.join("\n"),
      location: {
        line: line - minLine,
        ch: ch - indentation,
      },
    };
  }

  setState(({ compilation }: State) => ({
    compilation: {
      ...compilation,
      elaboration: elaboration.location != null ? elaboration : null,
      missing,
    },
  }));
}

function computeExploration(exploration: Span[]) {
  nonUiState.computedMarks = exploration.map(({ start, end }, i) => {
    return getMark({ start, end }, `computed-${i}`);
  });

  for (let i = nonUiState.lastRule + 1; i < exploration.length; i++) {
    styleSheet.insertRule(
      `.hover-${i} .computed-${i} { background: #eee8d5 }`,
      styleSheet.cssRules.length
    );
  }

  nonUiState.lastRule = Math.max(exploration.length, nonUiState.lastRule);

  nonUiState.hoverMark && nonUiState.hoverMark.clear();
}

const debouncedCompile = debounce(
  (source: string) =>
    postToWorker({
      type: messages.COMPILE,
      source,
    }),
  128
);

function doCompile() {
  const code = cm.getValue();
  window.localStorage.setItem("code", code);

  if (code.trim() === "") {
    setState({ compilation: { ...initialCompilation, state: SUCCESS } });
  } else {
    debouncedCompile(cm.getValue());
  }

  const { computedMarks } = nonUiState;
  nonUiState.computedMarks = null;
  computedMarks &&
    requestAnimationFrame(() => computedMarks.forEach((mark) => mark.clear()));
}

const renderHover = pure(function renderHover({
  hoverEl,
}: {
  hoverEl: EventTarget | null;
}) {
  const klass =
    hoverEl &&
    [...(hoverEl as HTMLElement).classList].find((klass) =>
      klass.startsWith("computed-")
    );
  const newIndex =
    klass != null ? Number(klass.replace("computed-", "")) : null;

  if (nonUiState.hoverIndex != null && newIndex !== nonUiState.hoverIndex) {
    removeClass(codemirrorEl, `hover-${nonUiState.hoverIndex}`);
  }

  if (newIndex != null) {
    addClass(codemirrorEl, `hover-${newIndex}`);
  }

  nonUiState.hoverIndex = newIndex;
});

const renderErrorMarks = pure(function renderErrorMarks({
  error,
}: {
  error: CompilationError | null;
}) {
  nonUiState.errorMark && nonUiState.errorMark.clear();
  nonUiState.errorContextMark && nonUiState.errorContextMark.clear();

  if (error != null) {
    nonUiState.errorMark = getMark(error, "compilation-error");
    nonUiState.errorContextMark = getMark(
      {
        start: {
          ...error.start,
          ch: 0,
        },
        end: {
          ...error.end,
          ch: cm.getLine(error.end.line).length,
        },
      },
      "compilation-error"
    );
  }
});

const renderElaborationMark = pure(function renderElaborationMark({
  elaboration,
}: {
  elaboration: Elaboration | null;
}) {
  nonUiState.mark && nonUiState.mark.clear();

  if (elaboration != null) {
    nonUiState.mark = getMark(elaboration.location);
  }
});

const renderExplanationMark = pure(function renderExplanationMark({
  explanation,
}: {
  explanation: Span | null;
}) {
  nonUiState.hoverMark && nonUiState.hoverMark.clear();
  if (explanation == null || nonUiState.computedMarks != null) return;
  nonUiState.hoverMark = getMark(explanation);
});

const renderCodeEditor = pure(function renderCodeEditor({
  showAll,
  editable,
}: {
  showAll: boolean;
  editable: boolean;
}) {
  cm.setOption("readOnly", editable ? false : "nocursor");

  if (showAll) {
    addClass(codemirrorEl, "show-all-computed");
  } else {
    removeClass(codemirrorEl, "show-all-computed");
  }
});

/* HELPERS */

function getMark(location: Span, className = "highlighted") {
  return cm.markText(location.start, location.end, {
    className,
  });
}

function debounce<T>(fn: (arg: T) => void, delay: number) {
  let enqueued: number | null = null;
  let lastArg: T | null = null;
  const wrapped = () => fn(lastArg!!);

  return (arg: T) => {
    lastArg = arg;
    if (enqueued != null) {
      window.clearTimeout(enqueued);
    }
    enqueued = window.setTimeout(wrapped, delay);
  };
}

function memoize<T>(fn: any, memoizer: (prev: T, next: T) => boolean) {
  let last: any = {};

  let memoized: any = (arg: T) => {
    if (memoizer(last, arg)) {
      last = arg;
      memoized.cached = true;
    } else {
      last = arg;
      memoized.cached = false;
      fn(arg);
    }
  };

  return memoized;
}

function debounceUntilDone<T>(
  fn: (arg: T, done: () => void) => void,
  delay: number
) {
  let isOpen = true;
  const sentinel = {};
  let last = sentinel;
  let enqueued = false;

  const done = () => {
    if (last !== sentinel) {
      if (!enqueued) {
        enqueued = true;
        window.setTimeout(() => {
          enqueued = false;
          const arg = last;
          last = sentinel;
          fn(arg as T, done);
        }, delay);
      }
    } else {
      isOpen = true;
    }
  };

  return {
    done,
    debounced(arg: T) {
      if (isOpen) {
        isOpen = false;
        fn(arg, done);
      } else {
        last = arg;
      }
    },
  };
}

function withinRange({ line, ch }: Location, start: Location, end: Location) {
  return (
    (start.line < line || (start.line === line && start.ch <= ch)) &&
    (line < end.line || (line === end.line && ch <= end.ch))
  );
}

if (!self.__PRODUCTION__) {
  (window as any).nonUiState = nonUiState;
}