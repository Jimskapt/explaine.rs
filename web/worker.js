import wasm_bindgen from "../pkg/explainers";
import * as messages from "./messages";
import wasmUrl from "../pkg/explainers_bg.wasm";
import { logInfo, reportError, handleLogging } from "./logging";

logInfo("workerMain");

let instance;
let isMain = true;

const state = {
  source: null,
  session: null,
  explanation: null,
  exploration: null,
};

self.onmessage = (e) => {
  const { data } = e;
  logInfo(isMain ? "Main" : "Secondary", "worker received", data.type, data);
  switch (data.type) {
    case messages.MAIN_LOAD:
      compileWasm(null);
      return;
    case messages.SECONDARY_LOAD:
      isMain = false;
      compileWasm(data.compiledModule);
      return;
    case messages.STOP_COMPILATION:
      if (!isMain && state.session) {
        state.session.free();
        state.session = null;
      }
      return;
    case messages.COMPILE:
      compile(data.source);
      return;
    case messages.EXPLAIN:
      if (isMain) {
        explain(data.location);
      }
      return;
    case messages.ELABORATE:
      if (isMain) {
        elaborate(data.location);
      }
      return;
    default:
      if (!self.__PRODUCTION__) {
        if (handleLogging(data)) {
          return;
        }
      }
      console.error("Unexpected message in worker", data);
  }
};

function compileWasm(compiledModule) {
  wasm_bindgen(compiledModule || wasmUrl)
    .then(() => {
      instance = wasm_bindgen;
      postMessage({
        type: messages.READY,
        compiledModule: wasm_bindgen.__wbindgen_wasm_module,
      });
    })
    .catch((e) => reportError("wasm_bindgen", e));
}

function compile(source) {
  if (state.session) {
    state.session.free();
    state.session = null;
  }
  const result = instance.Session.new(source);
  const errorMsg = result.error_message();
  const location = result.error_location();

  const error =
    errorMsg != null
      ? {
          msg: errorMsg,
          start: {
            line: location[0] - 1,
            ch: location[1],
          },
          end: {
            line: location[2] - 1,
            ch: location[3],
          },
          isBlock: result.is_block(),
        }
      : null;

  state.session = result.session();
  state.error = error;

  if (isMain) {
    notifySession();
  } else {
    exploreLoop(state.session, true);
  }
}

function notifySession() {
  postMessage({
    type:
      state.session != null ? messages.COMPILED : messages.COMPILATION_ERROR,
    error: state.error,
  });
}

function exploreLoop(session, init = false) {
  if (session != state.session || state.session == null) {
    return;
  }

  const LENGTH = 500;

  if (init) {
    state.exploration = {
      buffer: new self.Uint32Array(LENGTH * 4),
      result: [],
      byStart: new Map(),
      start: Date.now(),
    };
  }

  const { buffer, result, byStart } = state.exploration;
  const written = state.session.explore(buffer);

  for (let i = 0; i < written; i++) {
    const span = {
      start: { line: buffer[4 * i] - 1, ch: buffer[4 * i + 1] },
      end: { line: buffer[4 * i + 2] - 1, ch: buffer[4 * i + 3] },
    };
    if (!byStart.has(span.start.line)) {
      byStart.set(span.start.line, []);
    }

    const exists = byStart
      .get(span.start.line)
      .some(
        (s) =>
          s.start.line === span.start.line &&
          s.start.ch === span.start.ch &&
          s.end.line === span.end.line &&
          s.end.ch === span.end.ch
      );
    if (!exists) {
      byStart.get(span.start.line).push(span);
      result.push(span);
    }
  }

  if (written === 0) {
    logInfo("Exploration finished...");
    postMessage({
      type: messages.EXPLORATION,
      exploration: state.exploration.result,
    });
    return;
  }

  setImmediate(() => exploreLoop(session));
}

function explain(location) {
  doExplain(location);
  notifyExplanation();
}

function elaborate(location) {
  doExplain(location);
  notifyElaboration();
}

function doExplain(location) {
  if (state.explanation) {
    state.explanation.free();
    state.explanation = null;
  }

  state.explanation =
    state.session && state.session.explain(location.line + 1, location.ch);
}

function notifyExplanation() {
  postMessage({
    type: messages.EXPLANATION,
    location: explanationLocation(state.explanation),
  });
}

function notifyElaboration() {
  postMessage({
    type: messages.ELABORATION,
    location: explanationLocation(state.explanation),
    elaboration: state.explanation && state.explanation.elaborate(),
    title: state.explanation && state.explanation.title(),
    book: state.explanation && state.explanation.book(),
    keyword: state.explanation && state.explanation.keyword(),
    std: state.explanation && state.explanation.std(),
  });
}

function explanationLocation(explanation) {
  return explanation != null
    ? {
        start: {
          line: explanation.start_line - 1,
          ch: explanation.start_column,
        },
        end: {
          line: explanation.end_line - 1,
          ch: explanation.end_column,
        },
      }
    : null;
}

const setImmediate = (() => {
  let callbacks = new Map();
  let count = 0;

  let channel = new MessageChannel();

  channel.port1.onmessage = (event) => {
    let id = event.data;
    let callback = callbacks.get(id);
    callbacks.delete(id);
    callback();
  };

  return (fn) => {
    let id = count;
    callbacks.set(id, fn);
    count++;
    channel.port2.postMessage(id);
  };
})();
