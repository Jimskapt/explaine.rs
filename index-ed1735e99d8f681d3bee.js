!function(e){function n(n){for(var o,r,l=n[0],a=n[1],i=0,s=[];i<l.length;i++)r=l[i],Object.prototype.hasOwnProperty.call(t,r)&&t[r]&&s.push(t[r][0]),t[r]=0;for(o in a)Object.prototype.hasOwnProperty.call(a,o)&&(e[o]=a[o]);for(c&&c(n);s.length;)s.shift()()}var o={},t={1:0};function r(n){if(o[n])return o[n].exports;var t=o[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,r),t.l=!0,t.exports}r.e=function(e){var n=[],o=t[e];if(0!==o)if(o)n.push(o[2]);else{var l=new Promise((function(n,r){o=t[e]=[n,r]}));n.push(o[2]=l);var a,i=document.createElement("script");i.charset="utf-8",i.timeout=120,r.nc&&i.setAttribute("nonce",r.nc),i.src=function(e){return r.p+""+({}[e]||e)+"-"+{0:"034151694adf91cc34b3",3:"b4c99bb7ecb9a7c8ce61",4:"f930fbdd8b1b2ad47c2a"}[e]+".js"}(e);var c=new Error;a=function(n){i.onerror=i.onload=null,clearTimeout(s);var o=t[e];if(0!==o){if(o){var r=n&&("load"===n.type?"missing":n.type),l=n&&n.target&&n.target.src;c.message="Loading chunk "+e+" failed.\n("+r+": "+l+")",c.name="ChunkLoadError",c.type=r,c.request=l,o[1](c)}t[e]=void 0}};var s=setTimeout((function(){a({type:"timeout",target:i})}),12e4);i.onerror=i.onload=a,document.head.appendChild(i)}return Promise.all(n)},r.m=e,r.c=o,r.d=function(e,n,o){r.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,n){if(1&n&&(e=r(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var t in e)r.d(o,t,function(n){return e[n]}.bind(null,t));return o},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r.p="",r.oe=function(e){throw console.error(e),e};var l=this.webpackJsonp=this.webpackJsonp||[],a=l.push.bind(l);l.push=n,l=l.slice();for(var i=0;i<l.length;i++)n(l[i]);var c=a;r(r.s=2)}([function(e,n,o){e.exports=function(){return new Worker(o.p+"d473afc45306640d1d2c.worker.js")}},,function(e,n,o){"use strict";o.r(n),o.d(n,"PENDING",(function(){return g})),o.d(n,"SUCCESS",(function(){return y})),o.d(n,"ERROR",(function(){return k}));const t=()=>{};function r(e,n){let o={},r=null;return l=>{const a="function"==typeof l?l({...n.get(),...o}):l;t("setState: ",a),Object.assign(o,a),null==r&&(r=window.requestAnimationFrame(()=>(()=>{const t=Object.assign({},n.get(),o),l=n.get();n.set(t),o={},r=null,e(l)})()))}}function l(e){let n={_sentinel:{}};return o=>{const t=Object.keys({...n,...o}).some(e=>n[e]!==o[e]);n=o,t&&e(o)}}function a(e,n){e.classList.add(n)}function i(e,n){e.classList.remove(n)}function c(e,n){e.textContent=n}function s(e,n){e.innerHTML=n}function u(e,n){e.style.display=n}var d=o(0),p=o.n(d);const m=e=>document.querySelector(e);const h=e=>document.querySelector(e);let f=Promise.all([o.e(0).then(o.t.bind(null,3,7)),Promise.all([o.e(0),o.e(4)]).then(o.t.bind(null,4,7)),Promise.all([o.e(0),o.e(3)]).then(o.t.bind(null,5,7))]);const b=window.document,w=e=>b.querySelector(e),g=0,y=1,k=2;fetch("https://tzl3kczlk5.execute-api.us-east-1.amazonaws.com/default/explainer",{method:"POST"});const v="ontouchstart"in window;let M,S;a(b.body,v?"touch-device":"non-touch-device"),function({anchor:e,isTouchDevice:n,onChange:o,onMouseMove:t,onClick:r}){let l=f.then(([{default:l}])=>{const a=l.fromTextArea(e,{mode:"rust",lineNumbers:!0,theme:"solarized",readOnly:!!n&&"nocursor",indentUnit:4}),i=a.getWrapperElement();return a.on("change",e=>o(a,e)),i.addEventListener("mousemove",e=>t(a,e)),i.addEventListener("click",e=>r(a,e)),{cm:a,codemirrorEl:i}});return l.catch(e=>console.error(e)),l}({isTouchDevice:v,anchor:w(".codemirror-anchor"),onClick(){!function(e){O.compilation.state!==y||O.empty||q({type:"elaborate",location:e})}(M.getCursor("from"))},onMouseMove(e,n){!function(e){if(O.compilation.state!==y)return;if(P.computedMarks)return void T(({compilation:n})=>({compilation:{...n,hoverEl:e.target}}));const{clientX:n,clientY:o}=e;I({clientX:n,clientY:o})}(n)},onChange(){T({compilation:{state:g},address:null,empty:""===M.getValue()}),j()}}).then(({cm:e,codemirrorEl:n})=>(M=e,S=n,function(e){let n=Promise.resolve();const o=[...new window.URLSearchParams(location.search)].find(([e,n])=>"code"===e),t=null!=o?window.decodeURIComponent(o[1]):null;if(null!=t&&""!==t.trim())return e.setValue(t),n;const r=window.localStorage.getItem("code");if(null!=r&&""!==r.trim())return e.setValue(r),n;return n="loading"===b.readyState?new Promise(e=>{b.addEventListener("DOMContentLoaded",e)}):Promise.resolve(),n=n.then(()=>e.setValue(w(".default-code").value)),n}(M))).then(()=>{a(b.body,"codemirror-rendered"),T({editorReady:!0})});const x=function({onAddress:e,getValue:n}){const o=m(".generate"),t=m(".link");return o.addEventListener("click",()=>{if(null==n())return;let o=new window.URL(window.location.href),t=new window.URLSearchParams;t.append("code",n()),o.search=`?${t.toString()}`,e(o.toString())}),l((function({address:e,enabled:n}){o.disabled=!n,e?(u(o,"none"),i(t,"hidden"),t.href=e):(a(t,"hidden"),u(o,null))}))}({onAddress(e){T({address:e})},getValue:()=>M&&M.getValue()});!function(){const e=m(".modal"),n=m(".overlay");let o={showModal:!1};const t=r(t=>{o.showModal?(a(e,"show-modal"),a(n,"show-modal")):(i(e,"show-modal"),i(n,"show-modal"))},{get:()=>o,set(e){o=e}});m(".whats-this").addEventListener("click",()=>{t(({showModal:e})=>({showModal:!e}))}),n.addEventListener("click",()=>{t({showModal:!1})}),m(".close-modal").addEventListener("click",()=>{t({showModal:!1})})}();const E=function({onToggleEdit:e}){const n=m(".toggle-edit");return n.addEventListener("click",()=>{e()}),l(({enabled:e,editable:o})=>{n.disabled=!e,c(n,o?"Disable editing":"Enable editing")})}({onToggleEdit(){T(({editable:e})=>({editable:!e}))}}),L=function({onToggleShowAll:e}){const n=m(".show-all"),o=m(".show-all-text"),t=(m(".show-all > .spinner"),o.textContent);return n.addEventListener("click",()=>{e()}),l((function({showAll:e,empty:r,canShow:l,failedCompilation:s}){n.disabled=!l,(l||s||r?a:i)(n,"show-all-loaded"),c(o,e?"Hide elements":t)}))}({onToggleShowAll(){T(({compilation:e})=>({compilation:{...e,showAll:!e.showAll}}))}}),C=function({onWrapInBlock:e}){const n=h(".explanation"),o=n.querySelector(".loading"),t=n.querySelector(".loaded"),r=n.querySelector(".item-container"),a=r.querySelector(".item-title"),i=r.querySelector(".item"),d=r.querySelector(".error-message-container"),p=r.querySelector(".error-message"),m=n.querySelector(".more-info"),f=m.querySelector(".book-row"),b=f.querySelector("a"),w=m.querySelector(".keyword-row"),y=w.querySelector("a"),v=h(".info-wip"),M=i.innerHTML,S=a.innerHTML,x=l(function({onWrapInBlock:e}){const n=h(".can-be-block");return h(".wrap-in-block").addEventListener("click",()=>{e()}),({canBeBlock:e})=>{u(n,e?"block":"none")}}({onWrapInBlock:e})),E=l((function({elaboration:e}){null!=e?(u(m,"block"),u(f,e.book?"block":"none"),u(w,e.keyword?"block":"none"),b.href=e.book||"",y.href=e.keyword||"",u(v,e.book||e.keyword?"none":"initial")):u(m,"none")})),L=l((function({error:e,compilationState:n,elaboration:r}){o.style.display=n===g?"initial":"none",t.style.display=n!==g?"initial":"none",n===k?(s(a,"Oops! 💥"),s(i,"There is a syntax error in your code:"),u(d,"block"),c(p,e.msg)):null!=r?(s(a,r.title),s(i,r.elaboration),u(d,"none")):(s(a,S),s(i,M),u(d,"none"))}));return({elaboration:e,error:n,compilationState:o})=>{x({canBeBlock:n&&n.isBlock}),E({elaboration:e}),L({error:n,compilationState:o,elaboration:e})}}({onWrapInBlock(){if(null==M)return;const e=M.lineCount();for(let n=0;n<e;n++)M.indentLine(n,"add");M.replaceRange("fn main() {\n",{line:0,ch:0}),M.replaceRange("\n}",{line:e,ch:M.getLineHandle(e).text.length})}});let O={compilation:{state:g},editable:!1},P={lastRule:-1};const T=r(e=>{const{compilation:n}=O;_({hoverEl:n.hoverEl}),$({error:n.error}),D({elaboration:n.elaboration}),H({explanation:n.explanation}),N({showAll:n.showAll,editable:O.editable}),C({elaboration:n.elaboration,error:n.error,compilationState:n.state}),x({address:O.address,enabled:O.editorReady}),E({editable:O.editable,enabled:O.editorReady}),L({showAll:n.showAll,empty:O.empty,canShow:null!=n.exploration,failedCompilation:n.state===k})},{get:()=>O,set(e){O=e}});let{postMessage:q,ready:R}=function({onMessage:e}){const n=new p.a;let o,r=new Promise(e=>{o=e});return n.onerror=e=>console.error(e),n.onmessage=n=>{const{data:r}=n;t("Window received",r.type,r),"ready"!==r.type?e(r):o()},{postMessage:e=>n.postMessage(e),ready:r}}({onMessage(e){switch(e.type){case"compiled":T({compilation:{state:y}});break;case"compilation-error":T({compilation:{state:k,error:e.error}});break;case"explanation":T(({compilation:n})=>({compilation:{...n,explanation:e.location}})),function(){if(P.computedMarks)return;B()}();break;case"elaboration":T(({compilation:n})=>({compilation:{...n,elaboration:null!=e.location?e:null}}));break;case"exploration":!function(e){P.computedMarks=e.map(({start:e,end:n},o)=>z({start:e,end:n},`computed-${o}`));for(let n=P.lastRule+1;n<e.length;n++)A.insertRule(`.hover-${n} .computed-${n} { background: #eee8d5 }`,A.cssRules.length);P.lastRule=Math.max(e.length,P.lastRule),P.hoverMark&&P.hoverMark.clear()}(e.exploration),T(({compilation:e})=>({compilation:{...e,exploration:!0}}));break;default:console.error("Unexpected message in window",e)}}});const A=(()=>{const e=b.createElement("style");return b.head.appendChild(e),e.sheet})();const j=(()=>{let e=!1;R.then(()=>{e=!0});let n=!1;return()=>{e?U():n||(n=!0,R.then(()=>U()))}})();const{debounced:I,done:B}=function(e,n){let o=!0;const t={};let r=t,l=!1;const a=()=>{r!==t?l||(l=!0,window.setTimeout(()=>{l=!1;const n=r;r=t,e(n,a)},n)):o=!0};return{done:a,debounced(n){o?(o=!1,e(n,a)):r=n}}}((function({clientX:e,clientY:n},o){const{compilation:t}=O;if(t.state!==y)return o();let{line:r,ch:l}=M.coordsChar({left:e,top:n},"window");V({line:r,ch:l}),V.cached&&o()}),200),V=function(e,n){let o={},t=r=>{n(o,r)?(o=r,t.cached=!0):(o=r,t.cached=!1,e(r))};return t}((function({line:e,ch:n}){q({type:"explain",location:{line:e,ch:n}})}),(e,n)=>{if(e.line===n.line&&e.ch===n.ch)return!0;const{explanation:o}=O.compilation;return null!=o&&function({line:e,ch:n},o,t){return(o.line<e||o.line===e&&o.ch<=n)&&(e<t.line||e===t.line&&n<=t.ch)}(n,o.start,o.end)});const W=function(e,n){let o=null,t=null;const r=()=>e(t);return e=>{t=e,null!=o&&window.clearTimeout(o),o=setTimeout(r,n)}}(e=>q({type:"compile",source:e}),128);function U(){const e=M.getValue();window.localStorage.setItem("code",e),""===e.trim()?T({compilation:{state:y}}):W(M.getValue());const{computedMarks:n}=P;P.computedMarks=null,n&&requestAnimationFrame(()=>n.forEach(e=>e.clear()))}const _=l((function({hoverEl:e}){const n=e&&[...e.classList].find(e=>e.startsWith("computed-")),o=n&&Number(n.replace("computed-",""));null!=P.hoverIndex&&o!==P.hoverIndex&&i(S,`hover-${P.hoverIndex}`),null!=o&&a(S,`hover-${o}`),P.hoverIndex=o})),$=l((function({error:e}){P.errorMark&&P.errorMark.clear(),P.errorContextMark&&P.errorContextMark.clear(),null!=e&&(P.errorMark=z(e,"compilation-error"),P.errorContextMark=z({start:{...e.start,ch:0},end:{...e.end,ch:M.getLine(e.end.line).length}},"compilation-error"))})),D=l((function({elaboration:e}){P.mark&&P.mark.clear(),null!=e&&(P.mark=z(e.location))})),H=l((function({explanation:e}){P.hoverMark&&P.hoverMark.clear(),null!=e&&null==P.computedMarks&&(P.hoverMark=z(e))})),N=l((function({showAll:e,editable:n}){M.setOption("readOnly",!n&&"nocursor"),e?a(S,"show-all-computed"):i(S,"show-all-computed")}));function z(e,n="highlighted"){return M.markText(e.start,e.end,{className:n})}}]);