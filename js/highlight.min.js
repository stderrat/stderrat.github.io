/*!
  Highlight.js v11.12.0 (git: f7f7d3803b)
  (c) 2006-2026 Josh Goebel <hello@joshgoebel.com> and other contributors
  License: BSD-3-Clause
 */
var hljs=function(){"use strict";function e(t){
return t instanceof Map?t.clear=t.delete=t.set=()=>{
throw Error("map is read-only")}:t instanceof Set&&(t.add=t.clear=t.delete=()=>{
throw Error("set is read-only")
}),Object.freeze(t),Object.getOwnPropertyNames(t).forEach(n=>{
const i=t[n],s=typeof i;"object"!==s&&"function"!==s||Object.isFrozen(i)||e(i)
}),t}class t{constructor(e){
void 0===e.data&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}
ignoreMatch(){this.isMatchIgnored=!0}}function n(e){
return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")
}function i(e,...t){const n=Object.create(null);for(const t in e)n[t]=e[t]
;return t.forEach(e=>{for(const t in e)n[t]=e[t]}),n}const s=e=>!!e.scope
;class r{constructor(e,t){
this.buffer="",this.classPrefix=t.classPrefix,e.walk(this)}addText(e){
this.buffer+=n(e)}openNode(e){if(!s(e))return;const t=((e,{prefix:t})=>{
if(e.startsWith("language:"))return e.replace("language:","language-")
;if(e.includes(".")){const n=e.split(".")
;return[`${t}${n.shift()}`,...n.map((e,t)=>`${e}${"_".repeat(t+1)}`)].join(" ")}
return`${t}${e}`})(e.scope,{prefix:this.classPrefix});this.span(t)}closeNode(e){
s(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){
this.buffer+=`<span class="${e}">`}}const o=(e={})=>{const t={children:[]}
;return Object.assign(t,e),t};class a{constructor(){
this.rootNode=o(),this.stack=[this.rootNode]}get top(){
return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){
this.top.children.push(e)}openNode(e){const t=o({scope:e})
;this.add(t),this.stack.push(t)}closeNode(){
if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){
for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}
walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,t){
return"string"==typeof t?e.addText(t):t.children&&(e.openNode(t),
t.children.forEach(t=>this._walk(e,t)),e.closeNode(t)),e}static _collapse(e){
"string"!=typeof e&&e.children&&(e.children.every(e=>"string"==typeof e)?e.children=[e.children.join("")]:e.children.forEach(e=>{
a._collapse(e)}))}}class c extends a{constructor(e){super(),this.options=e}
addText(e){""!==e&&this.add(e)}startScope(e){this.openNode(e)}endScope(){
this.closeNode()}__addSublanguage(e,t){const n=e.root
;t&&(n.scope="language:"+t),this.add(n)}toHTML(){
return new r(this,this.options).value()}finalize(){
return this.closeAllNodes(),!0}}function l(e){
return e?"string"==typeof e?e:e.source:null}function g(e){return h("(?=",e,")")}
function u(e){return h("(?:",e,")*")}function d(e){return h("(?:",e,")?")}
function h(...e){return e.map(e=>l(e)).join("")}function f(...e){const t=(e=>{
const t=e[e.length-1]
;return"object"==typeof t&&t.constructor===Object?(e.splice(e.length-1,1),t):{}
})(e);return"("+(t.capture?"":"?:")+e.map(e=>l(e)).join("|")+")"}function p(e){
return RegExp(e.toString()+"|").exec("").length-1}
const b=RegExp(f(/\[(?:[^\\\]]|\\.)*\]/,/\(\?<(?![=!])[^>]+>/,/\(\?'[^']+'/,/\(\??/,/\\([1-9][0-9]*)/,/\\./))
;function m(e,{joinWith:t}){let n=0;return e.map(e=>{n+=1;const t=n
;let i=l(e),s="";for(;i.length>0;){const e=b.exec(i);if(!e){s+=i;break}
s+=i.substring(0,e.index),
i=i.substring(e.index+e[0].length),"\\"===e[0][0]&&e[1]?s+="\\"+(Number(e[1])+t):(s+=e[0],
("("===e[0]||/^\(\?[<']/.test(e[0]))&&n++)}return s}).map(e=>`(${e})`).join(t)}
const E="[a-zA-Z]\\w*",x="[a-zA-Z_]\\w*",y="\\b\\d+(\\.\\d+)?",_="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",w="\\b(0b[01]+)",O={
begin:"\\\\[\\s\\S]",relevance:0},k={scope:"string",begin:"'",end:"'",
illegal:"\\n",contains:[O]},v={scope:"string",begin:'"',end:'"',illegal:"\\n",
contains:[O]},N=(e,t,n={})=>{const s=i({scope:"comment",begin:e,end:t,
contains:[]},n);s.contains.push({scope:"doctag",
begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0})
;const r=f("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/)
;return s.contains.push({begin:h(/[ ]+/,"(",r,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),s
},S=N("//","$"),M=N("/\\*","\\*/"),R=N("#","$");var j=Object.freeze({
__proto__:null,APOS_STRING_MODE:k,BACKSLASH_ESCAPE:O,BINARY_NUMBER_MODE:{
scope:"number",begin:w,relevance:0},BINARY_NUMBER_RE:w,COMMENT:N,
C_BLOCK_COMMENT_MODE:M,C_LINE_COMMENT_MODE:S,C_NUMBER_MODE:{scope:"number",
begin:_,relevance:0},C_NUMBER_RE:_,END_SAME_AS_BEGIN:e=>Object.assign(e,{
"on:begin":(e,t)=>{t.data._beginMatch=e[1]},"on:end":(e,t)=>{
t.data._beginMatch!==e[1]&&t.ignoreMatch()}}),HASH_COMMENT_MODE:R,IDENT_RE:E,
MATCH_NOTHING_RE:/\b\B/,METHOD_GUARD:{begin:"\\.\\s*"+x,relevance:0},
NUMBER_MODE:{scope:"number",begin:y,relevance:0},NUMBER_RE:y,
PHRASAL_WORDS_MODE:{
begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
},QUOTE_STRING_MODE:v,REGEXP_MODE:{scope:"regexp",begin:/\/(?=[^/\n]*\/)/,
end:/\/[gimuy]*/,contains:[O,{begin:/\[/,end:/\]/,relevance:0,contains:[O]}]},
RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
SHEBANG:(e={})=>{const t=/^#![ ]*\//
;return e.binary&&(e.begin=h(t,/.*\b/,e.binary,/\b.*/)),i({scope:"meta",begin:t,
end:/$/,relevance:0,"on:begin":(e,t)=>{0!==e.index&&t.ignoreMatch()}},e)},
TITLE_MODE:{scope:"title",begin:E,relevance:0},UNDERSCORE_IDENT_RE:x,
UNDERSCORE_TITLE_MODE:{scope:"title",begin:x,relevance:0}});function A(e,t){
"."===e.input[e.index-1]&&t.ignoreMatch()}function I(e,t){
void 0!==e.className&&(e.scope=e.className,delete e.className)}function T(e,t){
t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",
e.__beforeBegin=A,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,
void 0===e.relevance&&(e.relevance=0))}function L(e,t){
Array.isArray(e.illegal)&&(e.illegal=f(...e.illegal))}function B(e,t){
if(e.match){
if(e.begin||e.end)throw Error("begin & end are not supported with match")
;e.begin=e.match,delete e.match}}function P(e,t){
void 0===e.relevance&&(e.relevance=1)}const D=(e,t)=>{if(!e.beforeMatch)return
;if(e.starts)throw Error("beforeMatch cannot be used with starts")
;const n=Object.assign({},e);Object.keys(e).forEach(t=>{delete e[t]
}),e.keywords=n.keywords,e.begin=h(n.beforeMatch,g(n.begin)),e.starts={
relevance:0,contains:[Object.assign(n,{endsParent:!0})]
},e.relevance=0,delete n.beforeMatch
},H=["of","and","for","in","not","or","if","then","parent","list","value"]
;function C(e,t,n="keyword"){const i=Object.create(null)
;return"string"==typeof e?s(n,e.split(" ")):Array.isArray(e)?s(n,e):Object.keys(e).forEach(n=>{
Object.assign(i,C(e[n],t,n))}),i;function s(e,n){
t&&(n=n.map(e=>e.toLowerCase())),n.forEach(t=>{const n=t.split("|")
;i[n[0]]=[e,$(n[0],n[1])]})}}function $(e,t){
return t?Number(t):(e=>H.includes(e.toLowerCase()))(e)?0:1}const U={},z=e=>{
console.error(e)},W=(e,...t)=>{console.log("WARN: "+e,...t)},X=(e,t)=>{
U[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),U[`${e}/${t}`]=!0)
},G=Error();function K(e,t,{key:n}){let i=0;const s=e[n],r={},o={}
;for(let e=1;e<=t.length;e++)o[e+i]=s[e],r[e+i]=!0,i+=p(t[e-1])
;e[n]=o,e[n]._emit=r,e[n]._multi=!0}function F(e){(e=>{
e.scope&&"object"==typeof e.scope&&null!==e.scope&&(e.beginScope=e.scope,
delete e.scope)})(e),"string"==typeof e.beginScope&&(e.beginScope={
_wrap:e.beginScope}),"string"==typeof e.endScope&&(e.endScope={_wrap:e.endScope
}),(e=>{if(Array.isArray(e.begin)){
if(e.skip||e.excludeBegin||e.returnBegin)throw z("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),
G
;if("object"!=typeof e.beginScope||null===e.beginScope)throw z("beginScope must be object"),
G;K(e,e.begin,{key:"beginScope"}),e.begin=m(e.begin,{joinWith:""})}})(e),(e=>{
if(Array.isArray(e.end)){
if(e.skip||e.excludeEnd||e.returnEnd)throw z("skip, excludeEnd, returnEnd not compatible with endScope: {}"),
G
;if("object"!=typeof e.endScope||null===e.endScope)throw z("endScope must be object"),
G;K(e,e.end,{key:"endScope"}),e.end=m(e.end,{joinWith:""})}})(e)}function Z(e){
function t(t,n){
return RegExp(l(t),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(n?"g":""))
}class n{constructor(){
this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}
addRule(e,t){
t.position=this.position++,this.matchIndexes[this.matchAt]=t,this.regexes.push([t,e]),
this.matchAt+=p(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null)
;const e=this.regexes.map(e=>e[1]);this.matcherRe=t(m(e,{joinWith:"|"
}),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex
;const t=this.matcherRe.exec(e);if(!t)return null
;const n=t.findIndex((e,t)=>t>0&&void 0!==e),i=this.matchIndexes[n]
;return t.splice(0,n),Object.assign(t,i)}}class s{constructor(){
this.rules=[],this.multiRegexes=[],
this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){
if(this.multiRegexes[e])return this.multiRegexes[e];const t=new n
;return this.rules.slice(e).forEach(([e,n])=>t.addRule(e,n)),
t.compile(),this.multiRegexes[e]=t,t}resumingScanAtSamePosition(){
return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,t){
this.rules.push([e,t]),"begin"===t.type&&this.count++}exec(e){
const t=this.getMatcher(this.regexIndex);t.lastIndex=this.lastIndex
;let n=t.exec(e)
;if(this.resumingScanAtSamePosition())if(n&&n.index===this.lastIndex);else{
const t=this.getMatcher(0);t.lastIndex=this.lastIndex+1,n=t.exec(e)}
return n&&(this.regexIndex+=n.position+1,
this.regexIndex===this.count&&this.considerAll()),n}}
if(e.compilerExtensions||(e.compilerExtensions=[]),
e.contains&&e.contains.includes("self"))throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.")
;return e.classNameAliases=i(e.classNameAliases||{}),function n(r,o){const a=r
;if(r.isCompiled)return a
;[I,B,F,D].forEach(e=>e(r,o)),e.compilerExtensions.forEach(e=>e(r,o)),
r.__beforeBegin=null,[T,L,P].forEach(e=>e(r,o)),r.isCompiled=!0;let c=null
;return"object"==typeof r.keywords&&r.keywords.$pattern&&(r.keywords=Object.assign({},r.keywords),
c=r.keywords.$pattern,
delete r.keywords.$pattern),c=c||/\w+/,r.keywords&&(r.keywords=C(r.keywords,e.case_insensitive)),
a.keywordPatternRe=t(c,!0),
o&&(r.begin||(r.begin=/\B|\b/),a.beginRe=t(a.begin),r.end||r.endsWithParent||(r.end=/\B|\b/),
r.end&&(a.endRe=t(a.end)),
a.terminatorEnd=l(a.end)||"",r.endsWithParent&&o.terminatorEnd&&(a.terminatorEnd+=(r.end?"|":"")+o.terminatorEnd)),
r.illegal&&(a.illegalRe=t(r.illegal)),
r.contains||(r.contains=[]),r.contains=[].concat(...r.contains.map(e=>(e=>(e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(t=>i(e,{
variants:null},t))),e.cachedVariants?e.cachedVariants:V(e)?i(e,{
starts:e.starts?i(e.starts):null
}):Object.isFrozen(e)?i(e):e))("self"===e?r:e))),r.contains.forEach(e=>{n(e,a)
}),r.starts&&n(r.starts,o),a.matcher=(e=>{const t=new s
;return e.contains.forEach(e=>t.addRule(e.begin,{rule:e,type:"begin"
})),e.terminatorEnd&&t.addRule(e.terminatorEnd,{type:"end"
}),e.illegal&&t.addRule(e.illegal,{type:"illegal"}),t})(a),a}(e)}function V(e){
return!!e&&(e.endsWithParent||V(e.starts))}class q extends Error{
constructor(e,t){super(e),this.name="HTMLInjectionError",this.html=t}}
const J=n,Y=i,Q=Symbol("nomatch"),ee=n=>{
const i=Object.create(null),s=Object.create(null),r=[];let o=!0
;const a="Could not find the language '{}', did you forget to load/include a language module?",l={
disableAutodetect:!0,name:"Plain text",contains:[]};let p={
ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,
languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",
cssSelector:"pre code",languages:null,__emitter:c};function b(e){
return p.noHighlightRe.test(e)}function m(e,t,n){let i="",s=""
;"object"==typeof t?(i=e,
n=t.ignoreIllegals,s=t.language):(X("10.7.0","highlight(lang, code, ...args) has been deprecated."),
X("10.7.0","Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"),
s=e,i=t),void 0===n&&(n=!0);const r={code:i,language:s};N("before:highlight",r)
;const o=r.result?r.result:E(r.language,r.code,n)
;return o.code=r.code,N("after:highlight",o),o}function E(e,n,s,r){
const c=Object.create(null);function l(e,t){return e.keywords[t]}function g(){
if(!S.keywords)return void R.addText(j);let e=0;S.keywordPatternRe.lastIndex=0
;let t=S.keywordPatternRe.exec(j),n="";for(;t;){n+=j.substring(e,t.index)
;const i=k.case_insensitive?t[0].toLowerCase():t[0],s=l(S,i);if(s){const[e,r]=s
;if(R.addText(n),
n="",c[i]=(c[i]||0)+1,c[i]<=7&&(A+=r),e.startsWith("_"))n+=t[0];else{
const n=k.classNameAliases[e]||e;d(t[0],n)}}else n+=t[0]
;e=S.keywordPatternRe.lastIndex,t=S.keywordPatternRe.exec(j)}
n+=j.substring(e),R.addText(n)}function u(){null!=S.subLanguage?(()=>{
if(""===j)return;let e=null;if("string"==typeof S.subLanguage){
if(!i[S.subLanguage])return void R.addText(j)
;e=E(S.subLanguage,j,!0,M[S.subLanguage]),M[S.subLanguage]=e._top
}else e=x(j,S.subLanguage.length?S.subLanguage:null)
;S.relevance>0&&(A+=e.relevance),R.__addSublanguage(e._emitter,e.language)
})():g(),j=""}function d(e,t){
""!==e&&(R.startScope(t),R.addText(e),R.endScope())}function h(e,t){let n=1
;const i=t.length-1;for(;n<=i;){if(!e._emit[n]){n++;continue}
const i=k.classNameAliases[e[n]]||e[n],s=t[n];i?d(s,i):(j=s,g(),j=""),n++}}
function f(e,t){
return e.scope&&"string"==typeof e.scope&&R.openNode(k.classNameAliases[e.scope]||e.scope),
e.beginScope&&(e.beginScope._wrap?(d(j,k.classNameAliases[e.beginScope._wrap]||e.beginScope._wrap),
j=""):e.beginScope._multi&&(h(e.beginScope,t),j="")),S=Object.create(e,{parent:{
value:S}}),S}function b(e,n,i){let s=((e,t)=>{const n=e&&e.exec(t)
;return n&&0===n.index})(e.endRe,i);if(s){if(e["on:end"]){const i=new t(e)
;e["on:end"](n,i),i.isMatchIgnored&&(s=!1)}if(s){
for(;e.endsParent&&e.parent;)e=e.parent;return e}}
if(e.endsWithParent)return b(e.parent,n,i)}function m(e){
return 0===S.matcher.regexIndex?(j+=e[0],1):(L=!0,0)}function y(e){
const t=e[0],i=n.substring(e.index),s=b(S,e,i);if(!s)return Q;const r=S
;S.endScope&&S.endScope._wrap?(u(),
d(t,S.endScope._wrap)):S.endScope&&S.endScope._multi?(u(),
h(S.endScope,e)):r.skip?j+=t:(r.returnEnd||r.excludeEnd||(j+=t),
u(),r.excludeEnd&&(j=t));do{
S.scope&&R.closeNode(),S.skip||S.subLanguage||(A+=S.relevance),S=S.parent
}while(S!==s.parent);return s.starts&&f(s.starts,e),r.returnEnd?0:t.length}
let _={};function w(i,r){const a=r&&r[0];if(j+=i,null==a)return u(),0
;if("begin"===_.type&&"end"===r.type&&_.index===r.index&&""===a){
if(j+=n.slice(r.index,r.index+1),!o){const t=Error(`0 width match regex (${e})`)
;throw t.languageName=e,t.badRule=_.rule,t}return 1}
if(_=r,"begin"===r.type)return(e=>{
const n=e[0],i=e.rule,s=new t(i),r=[i.__beforeBegin,i["on:begin"]]
;for(const t of r)if(t&&(t(e,s),s.isMatchIgnored))return m(n)
;return i.skip?j+=n:(i.excludeBegin&&(j+=n),
u(),i.returnBegin||i.excludeBegin||(j=n)),f(i,e),i.returnBegin?0:n.length})(r)
;if("illegal"===r.type&&!s){
const e=Error('Illegal lexeme "'+a+'" for mode "'+(S.scope||"<unnamed>")+'"')
;throw e.mode=S,e}if("end"===r.type){const e=y(r);if(e!==Q)return e}
if("illegal"===r.type&&""===a)return r.index===n.length||(j+="\n"),1
;if(T>1e5&&T>3*r.index)throw Error("potential infinite loop, way more iterations than matches")
;return j+=a,a.length}const k=O(e)
;if(!k)throw z(a.replace("{}",e)),Error('Unknown language: "'+e+'"')
;const v=Z(k);let N="",S=r||v;const M={},R=new p.__emitter(p);(()=>{const e=[]
;for(let t=S;t!==k;t=t.parent)t.scope&&e.unshift(t.scope)
;e.forEach(e=>R.openNode(e))})();let j="",A=0,I=0,T=0,L=!1;try{
if(k.__emitTokens)k.__emitTokens(n,R);else{for(S.matcher.considerAll();;){
T++,L?L=!1:S.matcher.considerAll(),S.matcher.lastIndex=I
;const e=S.matcher.exec(n);if(!e)break;const t=w(n.substring(I,e.index),e)
;I=e.index+t}w(n.substring(I))}return R.finalize(),N=R.toHTML(),{language:e,
value:N,relevance:A,illegal:!1,_emitter:R,_top:S}}catch(t){
if(t.message&&t.message.includes("Illegal"))return{language:e,value:J(n),
illegal:!0,relevance:0,_illegalBy:{message:t.message,index:I,
context:n.slice(I-100,I+100),mode:t.mode,resultSoFar:N},_emitter:R};if(o)return{
language:e,value:J(n),illegal:!1,relevance:0,errorRaised:t,_emitter:R,_top:S}
;throw t}}function x(e,t){t=t||p.languages||Object.keys(i);const n=(e=>{
const t={value:J(e),illegal:!1,relevance:0,_top:l,_emitter:new p.__emitter(p)}
;return t._emitter.addText(e),t})(e),s=t.filter(O).filter(v).map(t=>E(t,e,!1))
;s.unshift(n);const r=s.sort((e,t)=>{
if(e.relevance!==t.relevance)return t.relevance-e.relevance
;if(e.language&&t.language){if(O(e.language).supersetOf===t.language)return 1
;if(O(t.language).supersetOf===e.language)return-1}return 0}),[o,a]=r,c=o
;return c.secondBest=a,c}function y(e){let t=null;const n=(e=>{
let t=e.className+" ";t+=e.parentNode?e.parentNode.className:""
;const n=p.languageDetectRe.exec(t);if(n){const t=O(n[1])
;return t||(W(a.replace("{}",n[1])),
W("Falling back to no-highlight mode for this block.",e)),t?n[1]:"no-highlight"}
return t.split(/\s+/).find(e=>b(e)||O(e))})(e);if(b(n))return
;if(N("before:highlightElement",{el:e,language:n
}),e.dataset.highlighted)return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",e)
;if(e.children.length>0&&(p.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),
console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),
console.warn("The element with unescaped HTML:"),
console.warn(e)),p.throwUnescapedHTML))throw new q("One of your code blocks includes unescaped HTML.",e.innerHTML)
;t=e;const i=t.textContent,r=n?m(i,{language:n,ignoreIllegals:!0}):x(i)
;e.innerHTML=r.value,e.dataset.highlighted="yes",((e,t,n)=>{const i=t&&s[t]||n
;e.classList.add("hljs"),e.classList.add("language-"+i)
})(e,n,r.language),e.result={language:r.language,re:r.relevance,
relevance:r.relevance},r.secondBest&&(e.secondBest={
language:r.secondBest.language,relevance:r.secondBest.relevance
}),N("after:highlightElement",{el:e,result:r,text:i})}let _=!1;function w(){
if("loading"===document.readyState)return _||window.addEventListener("DOMContentLoaded",()=>{
w()},!1),void(_=!0);document.querySelectorAll(p.cssSelector).forEach(y)}
function O(e){return e=(e||"").toLowerCase(),i[e]||i[s[e]]}
function k(e,{languageName:t}){"string"==typeof e&&(e=[e]),e.forEach(e=>{
s[e.toLowerCase()]=t})}function v(e){const t=O(e);return t&&!t.disableAutodetect
}function N(e,t){const n=e;r.forEach(e=>{e[n]&&e[n](t)})}Object.assign(n,{
highlight:m,highlightAuto:x,highlightAll:w,highlightElement:y,
highlightBlock:e=>(X("10.7.0","highlightBlock will be removed entirely in v12.0"),
X("10.7.0","Please use highlightElement now."),y(e)),configure:e=>{p=Y(p,e)},
initHighlighting:()=>{
w(),X("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")},
initHighlightingOnLoad:()=>{
w(),X("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")
},registerLanguage:(e,t)=>{let s=null;try{s=t(n)}catch(t){
if(z("Language definition for '{}' could not be registered.".replace("{}",e)),
!o)throw t;z(t),s=l}
s.name||(s.name=e),i[e]=s,s.rawDefinition=t.bind(null,n),s.aliases&&k(s.aliases,{
languageName:e})},unregisterLanguage:e=>{delete i[e]
;for(const t of Object.keys(s))s[t]===e&&delete s[t]},
listLanguages:()=>Object.keys(i),getLanguage:O,registerAliases:k,
autoDetection:v,inherit:Y,addPlugin:e=>{(e=>{
e["before:highlightBlock"]&&!e["before:highlightElement"]&&(e["before:highlightElement"]=t=>{
e["before:highlightBlock"](Object.assign({block:t.el},t))
}),e["after:highlightBlock"]&&!e["after:highlightElement"]&&(e["after:highlightElement"]=t=>{
e["after:highlightBlock"](Object.assign({block:t.el},t))})})(e),r.push(e)},
removePlugin:e=>{const t=r.indexOf(e);-1!==t&&r.splice(t,1)}}),n.debugMode=()=>{
o=!1},n.safeMode=()=>{o=!0},n.versionString="11.12.0",n.regex={concat:h,
lookahead:g,either:f,optional:d,anyNumberOfTimes:u}
;for(const t in j)"object"==typeof j[t]&&e(j[t]);return Object.assign(n,j),n
},te=ee({});return te.newInstance=()=>ee({}),te}()
;"object"==typeof exports&&"undefined"!=typeof module&&(module.exports=hljs);/*! `apache` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{const n={className:"number",
begin:/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?/};return{
name:"Apache config",aliases:["apacheconf"],case_insensitive:!0,
contains:[e.HASH_COMMENT_MODE,{className:"section",begin:/<\/?/,end:/>/,
contains:[n,{className:"number",begin:/:\d{1,5}/
},e.inherit(e.QUOTE_STRING_MODE,{relevance:0})]},{className:"attribute",
begin:/\w+/,relevance:0,keywords:{
_:["order","deny","allow","setenv","rewriterule","rewriteengine","rewritecond","documentroot","sethandler","errordocument","loadmodule","options","header","listen","serverroot","servername"]
},starts:{end:/$/,relevance:0,keywords:{literal:"on off all deny allow"},
contains:[{scope:"punctuation",match:/\\\n/},{className:"meta",begin:/\s\[/,
end:/\]$/},{className:"variable",begin:/[\$%]\{/,end:/\}/,contains:["self",{
className:"number",begin:/[$%]\d+/}]},n,{className:"number",begin:/\b\d+/
},e.QUOTE_STRING_MODE]}}],illegal:/\S/}}})();hljs.registerLanguage("apache",e)
})();/*! `asciidoc` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{const n=e.regex,a=[{
className:"strong",begin:/\*{2}([^\n]+?)\*{2}/},{className:"strong",
begin:n.concat(/\*\*/,/((\*(?!\*)|\\[^\n]|[^*\n\\])+\n)+/,/(\*(?!\*)|\\[^\n]|[^*\n\\])*/,/\*\*/),
relevance:0},{className:"strong",begin:/\B\*(\S|\S[^\n]*?\S)\*(?!\w)/},{
className:"strong",begin:/\*[^\s]([^\n]+\n)+([^\n]+)\*/}],s=[{
className:"emphasis",begin:/_{2}([^\n]+?)_{2}/},{className:"emphasis",
begin:n.concat(/__/,/((_(?!_)|\\[^\n]|[^_\n\\])+\n)+/,/(_(?!_)|\\[^\n]|[^_\n\\])*/,/__/),
relevance:0},{className:"emphasis",begin:/\b_(\S|\S[^\n]*?\S)_(?!\w)/},{
className:"emphasis",begin:/_[^\s]([^\n]+\n)+([^\n]+)_/},{className:"emphasis",
begin:"\\B'(?!['\\s])",end:"(\\n{2}|')",contains:[{begin:"\\\\'\\w",relevance:0
}],relevance:0}];return{name:"AsciiDoc",aliases:["adoc"],
contains:[e.COMMENT("^/{4,}\\n","\\n/{4,}$",{relevance:10
}),e.COMMENT("^//","$",{relevance:0}),{className:"title",begin:"^\\.\\w.*$"},{
begin:"^[=\\*]{4,}\\n",end:"\\n^[=\\*]{4,}$",relevance:10},{className:"section",
relevance:10,variants:[{begin:"^(={1,6})[ \t].+?([ \t]\\1)?$"},{
begin:"^[^\\[\\]\\n]+?\\n[=\\-~\\^\\+]{2,}$"}]},{className:"meta",
begin:"^:.+?:",end:"\\s",excludeEnd:!0,relevance:10},{className:"meta",
begin:"^\\[.+?\\]$",relevance:0},{className:"quote",begin:"^_{4,}\\n",
end:"\\n_{4,}$",relevance:10},{className:"code",begin:"^[\\-\\.]{4,}\\n",
end:"\\n[\\-\\.]{4,}$",relevance:10},{begin:"^\\+{4,}\\n",end:"\\n\\+{4,}$",
contains:[{begin:"<",end:">",subLanguage:"xml",relevance:0}],relevance:10},{
className:"bullet",begin:"^(\\*+|-+|\\.+|[^\\n]+?::)\\s+"},{className:"symbol",
begin:"^(NOTE|TIP|IMPORTANT|WARNING|CAUTION):\\s+",relevance:10},{
begin:/\\[*_`]/},{begin:/\\\\\*{2}[^\n]*?\*{2}/},{begin:/\\\\_{2}[^\n]*_{2}/},{
begin:/\\\\`{2}[^\n]*`{2}/},{begin:/[:;}][*_`](?![*_`])/},...a,...s,{
className:"string",variants:[{begin:"``.+?''"},{begin:"`.+?'"}]},{
className:"code",begin:/`{2}/,end:/(\n{2}|`{2})/},{className:"code",
begin:"(`.+?`|\\+.+?\\+)",relevance:0},{className:"code",begin:"^[ \\t]",
end:"$",relevance:0},{begin:"^'{3,}[ \\t]*$",relevance:10},{
begin:"(link:)?(http|https|ftp|file|irc|image:?):\\S+?\\[[^[]*?\\]",
returnBegin:!0,contains:[{begin:"(link|image:?):",relevance:0},{
className:"link",begin:"\\w",end:"[^\\[]+",relevance:0},{className:"string",
begin:"\\[",end:"\\]",excludeBegin:!0,excludeEnd:!0,relevance:0}],relevance:10}]
}}})();hljs.registerLanguage("asciidoc",e)})();/*! `bash` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{const s=e.regex,t={},n={begin:/\$\{/,
end:/\}/,contains:["self",{begin:/:-/,contains:[t]}]};Object.assign(t,{
className:"variable",variants:[{
begin:s.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},n]});const a={
className:"subst",begin:/\$\(/,end:/\)/,contains:[e.BACKSLASH_ESCAPE]
},i=e.inherit(e.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),c={
begin:/<<-?\s*(?=\w+)/,starts:{contains:[e.END_SAME_AS_BEGIN({begin:/(\w+)/,
end:/(\w+)/,className:"string"})]}},o={className:"string",begin:/"/,end:/"/,
contains:[e.BACKSLASH_ESCAPE,t,a]};a.contains.push(o);const r={begin:/\$?\(\(/,
end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},e.NUMBER_MODE,t]
},l=e.SHEBANG({binary:"(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",relevance:10
}),m={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,
contains:[e.inherit(e.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0};return{
name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,
keyword:["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],
literal:["true","false"],
built_in:["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset","alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias","set","shopt","autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp","chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"]
},contains:[l,e.SHEBANG(),m,r,i,c,{match:/(\/[a-z._-]+)+/},o,{match:/\\"/},{
className:"string",begin:/'/,end:/'/},{match:/\\'/},t]}}})()
;hljs.registerLanguage("bash",e)})();/*! `css` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict"
;const e=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","optgroup","option","p","picture","q","quote","samp","section","select","source","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video","defs","g","marker","mask","pattern","svg","switch","symbol","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feGaussianBlur","feImage","feMerge","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","linearGradient","radialGradient","stop","circle","ellipse","image","line","path","polygon","polyline","rect","text","use","textPath","tspan","foreignObject","clipPath"],t=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"].sort().reverse(),i=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"].sort().reverse(),o=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"].sort().reverse(),r=["accent-color","align-content","align-items","align-self","alignment-baseline","all","anchor-name","animation","animation-composition","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-range","animation-range-end","animation-range-start","animation-timeline","animation-timing-function","appearance","aspect-ratio","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","baseline-shift","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-end-end-radius","border-end-start-radius","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-align","box-decoration-break","box-direction","box-flex","box-flex-group","box-lines","box-ordinal-group","box-orient","box-pack","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","contain-intrinsic-block-size","contain-intrinsic-height","contain-intrinsic-inline-size","contain-intrinsic-size","contain-intrinsic-width","container","container-name","container-type","content","content-visibility","corner-bottom-left-shape","corner-bottom-right-shape","corner-shape","corner-top-left-shape","corner-top-right-shape","counter-increment","counter-reset","counter-set","cue","cue-after","cue-before","cursor","cx","cy","direction","display","dominant-baseline","empty-cells","enable-background","field-sizing","fill","fill-opacity","fill-rule","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","flood-color","flood-opacity","flow","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-palette","font-size","font-size-adjust","font-smooth","font-smoothing","font-stretch","font-style","font-synthesis","font-synthesis-position","font-synthesis-small-caps","font-synthesis-style","font-synthesis-weight","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-emoji","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","forced-color-adjust","gap","glyph-orientation-horizontal","glyph-orientation-vertical","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphenate-character","hyphenate-limit-chars","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","initial-letter","initial-letter-align","inline-size","inset","inset-area","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","kerning","left","letter-spacing","lighting-color","line-break","line-height","line-height-step","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","margin-trim","marker","marker-end","marker-mid","marker-start","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","masonry-auto-flow","math-depth","math-shift","math-style","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-anchor","overflow-block","overflow-clip-margin","overflow-inline","overflow-wrap","overflow-x","overflow-y","overlay","overscroll-behavior","overscroll-behavior-block","overscroll-behavior-inline","overscroll-behavior-x","overscroll-behavior-y","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","paint-order","pause","pause-after","pause-before","perspective","perspective-origin","place-content","place-items","place-self","pointer-events","position","position-anchor","position-visibility","print-color-adjust","quotes","r","resize","rest","rest-after","rest-before","right","rotate","row-gap","ruby-align","ruby-position","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scroll-timeline","scroll-timeline-axis","scroll-timeline-name","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","shape-rendering","speak","speak-as","src","stop-color","stop-opacity","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","table-layout","text-align","text-align-all","text-align-last","text-anchor","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-offset","text-underline-position","text-wrap","text-wrap-mode","text-wrap-style","timeline-scope","top","touch-action","transform","transform-box","transform-origin","transform-style","transition","transition-behavior","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","unicode-range","user-modify","user-select","vector-effect","vertical-align","view-timeline","view-timeline-axis","view-timeline-inset","view-timeline-name","view-transition-name","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","white-space","white-space-collapse","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","x","y","z-index","zoom"].sort().reverse()
;return n=>{const a=n.regex,l=(e=>({IMPORTANT:{scope:"meta",begin:"!important"},
BLOCK_COMMENT:e.C_BLOCK_COMMENT_MODE,HEXCOLOR:{scope:"number",
begin:/#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/},UNICODE_RANGE:{
scope:"number",
begin:/\b[Uu]\+[0-9A-Fa-f][0-9A-Fa-f?]{0,5}(-[0-9A-Fa-f][0-9A-Fa-f]{0,5})?/},
FUNCTION_DISPATCH:{className:"built_in",begin:/[\w-]+(?=\()/},
ATTRIBUTE_SELECTOR_MODE:{scope:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",
contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},CSS_NUMBER_MODE:{
scope:"number",
begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
relevance:0},CSS_VARIABLE:{className:"attr",begin:/--[A-Za-z_][A-Za-z0-9_-]*/}
}))(n),s=[n.APOS_STRING_MODE,n.QUOTE_STRING_MODE];return{name:"CSS",
case_insensitive:!0,illegal:/[=|'\$]/,keywords:{keyframePosition:"from to"},
classNameAliases:{keyframePosition:"selector-tag"},contains:[l.BLOCK_COMMENT,{
begin:/-(webkit|moz|ms|o)-(?=[a-z])/},l.CSS_NUMBER_MODE,{
className:"selector-id",begin:/#[A-Za-z0-9_-]+/,relevance:0},{
className:"selector-class",begin:"\\.[a-zA-Z-][a-zA-Z0-9_-]*",relevance:0
},l.ATTRIBUTE_SELECTOR_MODE,{className:"selector-pseudo",variants:[{
begin:":("+i.join("|")+")"},{begin:":(:)?("+o.join("|")+")"}]},l.CSS_VARIABLE,{
className:"attribute",begin:"\\b("+r.join("|")+")\\b"},{begin:/:/,end:/[;}{]/,
contains:[l.BLOCK_COMMENT,l.HEXCOLOR,l.IMPORTANT,l.CSS_NUMBER_MODE,l.UNICODE_RANGE,...s,{
begin:/(url|data-uri)\(/,end:/\)/,relevance:0,keywords:{built_in:"url data-uri"
},contains:[...s,{className:"string",begin:/[^)]/,endsWithParent:!0,
excludeEnd:!0}]},l.FUNCTION_DISPATCH]},{begin:a.lookahead(/@/),end:"[{;]",
relevance:0,illegal:/:/,contains:[{className:"keyword",begin:/@-?\w[\w]*(-\w+)*/
},{begin:/\s/,endsWithParent:!0,excludeEnd:!0,relevance:0,keywords:{
$pattern:/[a-z-]+/,keyword:"and or not only",attribute:t.join(" ")},contains:[{
begin:/[a-z-]+(?=:)/,className:"attribute"},...s,l.CSS_NUMBER_MODE]}]},{
className:"selector-tag",begin:"\\b("+e.join("|")+")\\b"}]}}})()
;hljs.registerLanguage("css",e)})();/*! `diff` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{const d=e.regex;return{name:"Diff",
aliases:["patch"],contains:[{className:"meta",relevance:10,
match:d.either(/^@@ +-\d+,\d+ +\+\d+,\d+ +@@/,/^@@ +-\d+ +\+\d+,\d+ +@@/,/^@@ +-\d+,\d+ +\+\d+ +@@/,/^@@ +-\d+ +\+\d+ +@@/,/^\*\*\* +\d+,\d+ +\*\*\*\*$/,/^--- +\d+,\d+ +----$/)
},{className:"comment",variants:[{
begin:d.either(/Index: /,/^index/,/={3,}/,/^-{3}/,/^\*{3} /,/^\+{3}/,/^diff --git/),
end:/$/},{match:/^\*{15}$/}]},{className:"addition",begin:/^\+/,end:/$/},{
className:"deletion",begin:/^-/,end:/$/},{className:"addition",begin:/^!/,
end:/$/}]}}})();hljs.registerLanguage("diff",e)})();/*! `dockerfile` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>({name:"Dockerfile",aliases:["docker"],
case_insensitive:!0,
keywords:["from","maintainer","expose","env","arg","user","onbuild","stopsignal"],
contains:[e.HASH_COMMENT_MODE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,e.NUMBER_MODE,{
beginKeywords:"run cmd entrypoint volume add copy workdir label healthcheck shell",
starts:{end:/[^\\]$/,subLanguage:"bash"}}],illegal:"</"})})()
;hljs.registerLanguage("dockerfile",e)})();/*! `go` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{const a={
keyword:["break","case","chan","const","continue","default","defer","else","fallthrough","for","func","go","goto","if","import","interface","map","package","range","return","select","struct","switch","type","var"],
type:["bool","byte","complex64","complex128","error","float32","float64","int8","int16","int32","int64","string","uint8","uint16","uint32","uint64","int","uint","uintptr","rune"],
literal:["true","false","iota","nil"],
built_in:["append","cap","close","complex","copy","imag","len","make","new","panic","print","println","real","recover","delete"]
};return{name:"Go",aliases:["golang"],keywords:a,illegal:"</",
contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"string",
variants:[e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{begin:"`",end:"`"}]},{
className:"number",variants:[{
match:/-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,relevance:0
},{
match:/-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,
relevance:0},{match:/-?\b0[oO](_?[0-7])*i?/,relevance:0},{
match:/-?\b0[bB](_?[01])*i?/,relevance:0},{
match:/-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,relevance:0},{
match:/-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,relevance:0}]},{
begin:/:=/},{className:"function",beginKeywords:"func",end:"\\s*(\\{|$)",
excludeEnd:!0,contains:[e.TITLE_MODE,{className:"params",begin:/\(/,end:/\)/,
endsParent:!0,keywords:a,illegal:/["']/}]}]}}})();hljs.registerLanguage("go",e)
})();/*! `groovy` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict"
;var e="[0-9](_*[0-9])*",a=`\\.(${e})`,n="[0-9a-fA-F](_*[0-9a-fA-F])*",t={
className:"number",variants:[{
begin:`(\\b(${e})((${a})|\\.)?|(${a}))[eE][+-]?(${e})[fFdD]?\\b`},{
begin:`\\b(${e})((${a})[fFdD]?\\b|\\.([fFdD]\\b)?)`},{begin:`(${a})[fFdD]?\\b`
},{begin:`\\b(${e})[fFdD]\\b`},{
begin:`\\b0[xX]((${n})\\.?|(${n})?\\.(${n}))[pP][+-]?(${e})[fFdD]?\\b`},{
begin:"\\b(0|[1-9](_*[0-9])*)[lL]?\\b"},{begin:`\\b0[xX](${n})[lL]?\\b`},{
begin:"\\b0(_*[0-7])*[lL]?\\b"},{begin:"\\b0[bB][01](_*[01])*[lL]?\\b"}],
relevance:0};function r(e,a={}){return a.variants=e,a}return e=>{
const a=e.regex,n="[A-Za-z0-9_$]+",i=r([e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.COMMENT("/\\*\\*","\\*/",{
relevance:0,contains:[{begin:/\w+@/,relevance:0},{className:"doctag",
begin:"@[A-Za-z]+"}]})]),s={className:"regexp",begin:/~?\/[^\/\n]+\//,
contains:[e.BACKSLASH_ESCAPE]},l=t,b=r([{begin:/"""/,end:/"""/},{begin:/'''/,
end:/'''/},{begin:"\\$/",end:"/\\$",relevance:10
},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE],{className:"string"}),c={
match:[/(class|interface|trait|enum|record|extends|implements)/,/\s+/,e.UNDERSCORE_IDENT_RE],
scope:{1:"keyword",3:"title.class"}};return{name:"Groovy",keywords:{
"variable.language":"this super",literal:"true false null",
type:["byte","short","char","int","long","boolean","float","double","void"],
keyword:["def","as","in","assert","trait","abstract","static","volatile","transient","public","private","protected","synchronized","final","class","interface","enum","if","else","for","while","switch","case","break","default","continue","throw","throws","try","catch","finally","implements","extends","new","import","package","return","instanceof","var"]
},contains:[e.SHEBANG({binary:"groovy",relevance:10}),i,b,s,l,c,{
className:"meta",begin:"@[A-Za-z]+",relevance:0},{className:"attr",
begin:n+"[ \t]*:",relevance:0},{begin:/\?/,end:/:/,relevance:0,
contains:[i,b,s,l,"self"]},{className:"symbol",
begin:"^[ \t]*"+a.lookahead(n+":"),excludeBegin:!0,end:n+":",relevance:0}],
illegal:/#|<\//}}})();hljs.registerLanguage("groovy",e)})();/*! `http` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{const n="HTTP/([32]|1\\.[01])",a={
className:"attribute",
begin:e.regex.concat("^",/[A-Za-z][A-Za-z0-9-]*/,"(?=\\:\\s)"),starts:{
contains:[{className:"punctuation",begin:/: /,relevance:0,starts:{end:"$",
relevance:0}}]}},s=[a,{begin:"\\n\\n",starts:{subLanguage:[],endsWithParent:!0}
}];return{name:"HTTP",aliases:["https"],illegal:/\S/,contains:[{
begin:"^(?="+n+" \\d{3})",end:/$/,contains:[{className:"meta",begin:n},{
className:"number",begin:"\\b\\d{3}\\b"}],starts:{end:/\b\B/,illegal:/\S/,
contains:s}},{begin:"(?=^[A-Z]+ (.*?) "+n+"$)",end:/$/,contains:[{
className:"string",begin:" ",end:" ",excludeBegin:!0,excludeEnd:!0},{
className:"meta",begin:n},{className:"keyword",begin:"[A-Z]+"}],starts:{
end:/\b\B/,illegal:/\S/,contains:s}},e.inherit(a,{relevance:0})]}}})()
;hljs.registerLanguage("http",e)})();/*! `ini` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{const n=e.regex,a={className:"number",
relevance:0,variants:[{begin:/([+-]+)?[\d]+_[\d_]+/},{begin:e.NUMBER_RE}]
},s=e.COMMENT();s.variants=[{begin:/;/,end:/$/},{begin:/#/,end:/$/}];const i={
className:"variable",variants:[{begin:/\$[\w\d"][\w\d_]*/},{begin:/\$\{(.*?)\}/
}]},t={className:"literal",begin:/\bon|off|true|false|yes|no\b/},r={
className:"string",contains:[e.BACKSLASH_ESCAPE],variants:[{begin:"'''",
end:"'''",relevance:10},{begin:'"""',end:'"""',relevance:10},{begin:'"',end:'"'
},{begin:"'",end:"'"}]},l={begin:/\[/,end:/\]/,contains:[s,t,i,r,a,"self"],
relevance:0},c=n.either(/[A-Za-z0-9_-]+/,/"(\\"|[^"])*"/,/'[^']*'/);return{
name:"TOML, also INI",aliases:["toml"],case_insensitive:!0,illegal:/\S/,
contains:[s,{className:"section",begin:/\[+/,end:/\]+/},{
begin:n.concat(c,"(\\s*\\.\\s*",c,")*",n.lookahead(/\s*=\s*[^#\s]/)),
className:"attr",starts:{end:/$/,contains:[s,l,t,i,r,a]}}]}}})()
;hljs.registerLanguage("ini",e)})();/*! `java` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict"
;var e="[0-9](_*[0-9])*",a=`\\.(${e})`,s="[0-9a-fA-F](_*[0-9a-fA-F])*",n={
className:"number",variants:[{
begin:`(\\b(${e})((${a})|\\.)?|(${a}))[eE][+-]?(${e})[fFdD]?\\b`},{
begin:`\\b(${e})((${a})[fFdD]?\\b|\\.([fFdD]\\b)?)`},{begin:`(${a})[fFdD]?\\b`
},{begin:`\\b(${e})[fFdD]\\b`},{
begin:`\\b0[xX]((${s})\\.?|(${s})?\\.(${s}))[pP][+-]?(${e})[fFdD]?\\b`},{
begin:"\\b(0|[1-9](_*[0-9])*)[lL]?\\b"},{begin:`\\b0[xX](${s})[lL]?\\b`},{
begin:"\\b0(_*[0-7])*[lL]?\\b"},{begin:"\\b0[bB][01](_*[01])*[lL]?\\b"}],
relevance:0};function t(e,a,s){return-1===s?"":e.replace(a,n=>t(e,a,s-1))}
return e=>{
const a=e.regex,s="[\xc0-\u02b8a-zA-Z_$][\xc0-\u02b8a-zA-Z_$0-9]*",i="(?:(?:\\s*\\[\\s*])+)?",r=s+"<@@@>"+i,l="(?:\\?(?:\\s+(?:extends|super)\\s+"+r+")?|"+r+")",c=t("(?:\\s*<\\s*"+l+"(?:\\s*,\\s*"+l+")*\\s*>)?",/<@@@>/g,2),o={
keyword:["synchronized","abstract","private","var","static","if","const ","for","while","strictfp","finally","protected","import","native","final","void","enum","else","break","transient","catch","instanceof","volatile","case","assert","package","default","public","try","switch","continue","throws","protected","public","private","module","requires","exports","do","sealed","yield","permits","goto","when"],
literal:["false","true","null"],
type:["char","boolean","long","float","int","byte","short","double"],
built_in:["super","this"]},b={className:"meta",begin:"@"+s,contains:[{
begin:/\(/,end:/\)/,contains:["self"]}]},_={className:"params",begin:/\(/,
end:/\)/,keywords:o,relevance:0,contains:[e.C_BLOCK_COMMENT_MODE],endsParent:!0}
;return{name:"Java",aliases:["jsp"],keywords:o,illegal:/<\/|#/,
contains:[e.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{begin:/\w+@/,
relevance:0},{className:"doctag",begin:"@[A-Za-z]+"}]}),{
begin:/import java\.[a-z]+\./,keywords:"import",relevance:2
},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{begin:/"""/,end:/"""/,
className:"string",contains:[e.BACKSLASH_ESCAPE]
},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{
match:[/\b(?:class|interface|enum|extends|implements|new)/,/\s+/,s],className:{
1:"keyword",3:"title.class"}},{match:/non-sealed/,scope:"keyword"},{
beginKeywords:"new throw return else yield assert",relevance:0},{
begin:[s,a.concat(c,i,/\s+/),s,i,/\s*/,/=(?!=)/],className:{1:"type",
3:"variable",6:"operator"}},{begin:[/record/,/\s+/,s],className:{1:"keyword",
3:"title.class"},contains:[_,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{
begin:[s,a.concat(c,i,/\s+/),s,/\s*(?=\()/],className:{1:"type",
3:"title.function"},keywords:o,contains:[{className:"params",begin:/\(/,
end:/\)/,keywords:o,relevance:0,
contains:[b,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,n,e.C_BLOCK_COMMENT_MODE]
},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},n,b]}}})()
;hljs.registerLanguage("java",e)})();/*! `javascript` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict"
;const e="[A-Za-z$_][0-9A-Za-z$_]*",n=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],a=["true","false","null","undefined","NaN","Infinity"],t=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],s=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],r=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],c=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","self","global"],i=[].concat(r,t,s)
;return o=>{const l=o.regex,d=e,b={begin:/<[A-Za-z0-9\\._:-]+/,
end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(e,n)=>{
const a=e[0].length+e.index,t=e.input[a]
;if("<"===t||","===t)return void n.ignoreMatch();let s
;">"===t&&(((e,{after:n})=>{const a="</"+e[0].slice(1)
;return-1!==e.input.indexOf(a,n)})(e,{after:a})||n.ignoreMatch())
;const r=e.input.substring(a)
;((s=r.match(/^\s*=/))||(s=r.match(/^\s+extends\s+/))&&0===s.index)&&n.ignoreMatch()
}},g={$pattern:e,keyword:n,literal:a,built_in:i,"variable.language":c
},u="[0-9](_?[0-9])*",m=`\\.(${u})`,E="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",A={
className:"number",variants:[{
begin:`(\\b(${E})((${m})|\\.)?|(${m}))[eE][+-]?(${u})\\b`},{
begin:`\\b(${E})\\b((${m})\\b|\\.)?|(${m})\\b`},{
begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{
begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{
begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{
begin:"\\b0[0-7]+n?\\b"}],relevance:0},y={className:"subst",begin:"\\$\\{",
end:"\\}",keywords:g,contains:[]},h={begin:".?html`",end:"",starts:{end:"`",
returnEnd:!1,contains:[o.BACKSLASH_ESCAPE,y],subLanguage:"xml"}},_={
begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,
contains:[o.BACKSLASH_ESCAPE,y],subLanguage:"css"}},N={begin:".?gql`",end:"",
starts:{end:"`",returnEnd:!1,contains:[o.BACKSLASH_ESCAPE,y],
subLanguage:"graphql"}},f={className:"string",begin:"`",end:"`",
contains:[o.BACKSLASH_ESCAPE,y]},p={className:"comment",
variants:[o.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{
begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",
begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,
excludeBegin:!0,relevance:0},{className:"variable",begin:d+"(?=\\s*(-)|$)",
endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]
}),o.C_BLOCK_COMMENT_MODE,o.C_LINE_COMMENT_MODE]
},v=[o.APOS_STRING_MODE,o.QUOTE_STRING_MODE,h,_,N,f,{match:/\$\d+/},A]
;y.contains=v.concat({begin:/\{/,end:/\}/,keywords:g,contains:["self"].concat(v)
});const S=[].concat(p,y.contains),w=S.concat([{begin:/(\s*)\(/,end:/\)/,
keywords:g,contains:["self"].concat(S)}]),R={className:"params",begin:/(\s*)\(/,
end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:g,contains:w},O={variants:[{
match:[/class/,/\s+/,d,/\s+/,/extends/,/\s+/,l.concat(d,"(",l.concat(/\./,d),")*")],
scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{
match:[/class/,/\s+/,d],scope:{1:"keyword",3:"title.class"}}]},k={relevance:0,
match:l.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
className:"title.class",keywords:{_:[...t,...s]}},I={variants:[{
match:[/function/,/\s+/,d,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],
className:{1:"keyword",3:"title.function"},label:"func.def",contains:[R],
illegal:/%/},x={
match:l.concat(/\b/,(T=[...r,"super","import","await"].map(e=>e+"\\s*\\("),
l.concat("(?!",T.join("|"),")")),d,l.lookahead(/\s*\(/)),
className:"title.function",relevance:0};var T;const C={
begin:l.concat(/\./,l.lookahead(l.concat(d,/(?![0-9A-Za-z$_(])/))),end:d,
excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},M={
match:[/get|set/,/\s+/,d,/(?=\()/],className:{1:"keyword",3:"title.function"},
contains:[{begin:/\(\)/},R]
},B="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+o.UNDERSCORE_IDENT_RE+")\\s*=>",Z={
match:[/const|var|let/,/\s+/,d,/\s*/,/=\s*/,/(async\s*)?/,l.lookahead(B)],
keywords:"async",className:{1:"keyword",3:"title.function"},contains:[R]}
;return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:g,exports:{
PARAMS_CONTAINS:w,CLASS_REFERENCE:k},illegal:/#(?![$_A-Za-z])/,
contains:[o.SHEBANG({label:"shebang",binary:"node",relevance:5}),{
label:"use_strict",className:"meta",relevance:10,
begin:/^\s*['"]use (strict|asm)['"]/
},o.APOS_STRING_MODE,o.QUOTE_STRING_MODE,h,_,N,f,p,{match:/\$\d+/},A,k,{
scope:"attr",match:d+l.lookahead(":"),relevance:0},Z,{
begin:"("+o.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",
keywords:"return throw case",relevance:0,contains:[p,o.REGEXP_MODE,{
className:"function",begin:B,returnBegin:!0,end:"\\s*=>",contains:[{
className:"params",variants:[{begin:o.UNDERSCORE_IDENT_RE,relevance:0},{
className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,
excludeBegin:!0,excludeEnd:!0,keywords:g,contains:w}]}]},{begin:/,/,relevance:0
},{match:/\s+/,relevance:0},{variants:[{begin:"<>",end:"</>"},{
match:/<[A-Za-z0-9\\._:-]+\s*\/>/},{begin:b.begin,
"on:begin":b.isTrulyOpeningTag,end:b.end}],subLanguage:"xml",contains:[{
begin:b.begin,end:b.end,skip:!0,contains:["self"]}]}]},I,{
beginKeywords:"while if switch catch for"},{
begin:"\\b(?!function)"+o.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
returnBegin:!0,label:"func.def",contains:[R,o.inherit(o.TITLE_MODE,{begin:d,
className:"title.function"})]},{match:/\.\.\./,relevance:0},C,{match:"\\$"+d,
relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},
contains:[R]},x,{relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,
className:"variable.constant"},O,M,{match:/\$[(.]/}]}}})()
;hljs.registerLanguage("javascript",e)})();/*! `json` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";const e={scope:"number",
match:"([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity",
relevance:0};return n=>{const a=["true","false","null"],s={scope:"literal",
beginKeywords:a.join(" ")};return{name:"JSON",aliases:["jsonc","json5"],
keywords:{literal:a},contains:[{className:"attr",
begin:/(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,relevance:1.01},{
match:/[{}[\],:]/,className:"punctuation",relevance:0
},n.APOS_STRING_MODE,n.QUOTE_STRING_MODE,s,e,n.C_LINE_COMMENT_MODE,n.C_BLOCK_COMMENT_MODE],
illegal:"\\S"}}})();hljs.registerLanguage("json",e)})();/*! `latex` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{const n=[{begin:/\^{6}[0-9a-f]{6}/},{
begin:/\^{5}[0-9a-f]{5}/},{begin:/\^{4}[0-9a-f]{4}/},{begin:/\^{3}[0-9a-f]{3}/
},{begin:/\^{2}[0-9a-f]{2}/},{begin:/\^{2}[\u0000-\u007f]/}],a=[{
className:"keyword",begin:/\\/,relevance:0,contains:[{endsParent:!0,
begin:e.regex.either(...["(?:NeedsTeXFormat|RequirePackage|GetIdInfo)","Provides(?:Expl)?(?:Package|Class|File)","(?:DeclareOption|ProcessOptions)","(?:documentclass|usepackage|input|include)","makeat(?:letter|other)","ExplSyntax(?:On|Off)","(?:new|renew|provide)?command","(?:re)newenvironment","(?:New|Renew|Provide|Declare)(?:Expandable)?DocumentCommand","(?:New|Renew|Provide|Declare)DocumentEnvironment","(?:(?:e|g|x)?def|let)","(?:begin|end)","(?:part|chapter|(?:sub){0,2}section|(?:sub)?paragraph)","caption","(?:label|(?:eq|page|name)?ref|(?:paren|foot|super)?cite)","(?:alpha|beta|[Gg]amma|[Dd]elta|(?:var)?epsilon|zeta|eta|[Tt]heta|vartheta)","(?:iota|(?:var)?kappa|[Ll]ambda|mu|nu|[Xx]i|[Pp]i|varpi|(?:var)rho)","(?:[Ss]igma|varsigma|tau|[Uu]psilon|[Pp]hi|varphi|chi|[Pp]si|[Oo]mega)","(?:frac|sum|prod|lim|infty|times|sqrt|leq|geq|left|right|middle|[bB]igg?)","(?:[lr]angle|q?quad|[lcvdi]?dots|d?dot|hat|tilde|bar)"].map(e=>e+"(?![a-zA-Z@:_])"))
},{endsParent:!0,
begin:RegExp(["(?:__)?[a-zA-Z]{2,}_[a-zA-Z](?:_?[a-zA-Z])+:[a-zA-Z]*","[lgc]__?[a-zA-Z](?:_?[a-zA-Z])*_[a-zA-Z]{2,}","[qs]__?[a-zA-Z](?:_?[a-zA-Z])+","use(?:_i)?:[a-zA-Z]*","(?:else|fi|or):","(?:if|cs|exp):w","(?:hbox|vbox):n","::[a-zA-Z]_unbraced","::[a-zA-Z:]"].map(e=>e+"(?![a-zA-Z:_])").join("|"))
},{endsParent:!0,variants:n},{endsParent:!0,relevance:0,variants:[{
begin:/[a-zA-Z@]+/},{begin:/[^a-zA-Z@]?/}]}]},{className:"params",relevance:0,
begin:/#+\d?/},{variants:n},{className:"built_in",relevance:0,begin:/[$&^_]/},{
className:"meta",begin:/% ?!(T[eE]X|tex|BIB|bib)/,end:"$",relevance:10
},e.COMMENT("%","$",{relevance:0})],i={begin:/\{/,end:/\}/,relevance:0,
contains:["self",...a]},t=e.inherit(i,{relevance:0,endsParent:!0,
contains:[i,...a]}),r={begin:/\[/,end:/\]/,endsParent:!0,relevance:0,
contains:[i,...a]},s={begin:/\s+/,relevance:0},c=[t],l=[r],o=(e,n)=>({
contains:[s],starts:{relevance:0,contains:e,starts:n}}),d=(e,n)=>({
begin:"\\\\"+e+"(?![a-zA-Z@:_])",keywords:{$pattern:/\\[a-zA-Z]+/,keyword:"\\"+e
},relevance:0,contains:[s],starts:n}),g=(n,a)=>e.inherit({
begin:"\\\\begin(?=[ \t]*(\\r?\\n[ \t]*)?\\{"+n+"\\})",keywords:{
$pattern:/\\[a-zA-Z]+/,keyword:"\\begin"},relevance:0
},o(c,a)),m=(n="string")=>e.END_SAME_AS_BEGIN({className:n,begin:/(.|\r?\n)/,
end:/(.|\r?\n)/,excludeBegin:!0,excludeEnd:!0,endsParent:!0}),b=e=>({
className:"string",end:"(?=\\\\end\\{"+e+"\\})"}),p=(e="string")=>({relevance:0,
begin:/\{/,starts:{endsParent:!0,contains:[{className:e,end:/(?=\})/,
endsParent:!0,contains:[{begin:/\{/,end:/\}/,relevance:0,contains:["self"]}]}]}
});return{name:"LaTeX",aliases:["tex"],
contains:[...["verb","lstinline"].map(e=>d(e,{contains:[m()]})),d("mint",o(c,{
contains:[m()]})),d("mintinline",o(c,{contains:[p(),m()]})),d("url",{
contains:[p("link"),p("link")]}),d("hyperref",{contains:[p("link")]
}),d("href",o(l,{contains:[p("link")]
})),...[].concat(...["","\\*"].map(e=>[g("verbatim"+e,b("verbatim"+e)),g("filecontents"+e,o(c,b("filecontents"+e))),...["","B","L"].map(n=>g(n+"Verbatim"+e,o(l,b(n+"Verbatim"+e))))])),g("minted",o(l,o(c,b("minted")))),...a]
}}})();hljs.registerLanguage("latex",e)})();/*! `makefile` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{const i={className:"variable",
variants:[{begin:"\\$\\("+e.UNDERSCORE_IDENT_RE+"\\)",
contains:[e.BACKSLASH_ESCAPE]},{begin:/\$[@%<?\^\+\*]/}]},a={className:"string",
begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,i]},n={className:"variable",
begin:/\$\([\w-]+\s/,end:/\)/,keywords:{
built_in:"subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value"
},contains:[i,a]},s={begin:"^"+e.UNDERSCORE_IDENT_RE+"\\s*(?=[:+?]?=)"},r={
className:"section",begin:/^[^\s]+:/,end:/$/,contains:[i]};return{
name:"Makefile",aliases:["mk","mak","make"],keywords:{$pattern:/[\w-]+/,
keyword:"define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath"
},contains:[e.HASH_COMMENT_MODE,i,a,n,s,{className:"meta",begin:/^\.PHONY:/,
end:/$/,keywords:{$pattern:/[\.\w]+/,keyword:".PHONY"}},r]}}})()
;hljs.registerLanguage("makefile",e)})();/*! `markdown` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{const n={begin:/<\/?[A-Za-z_]/,
end:">",subLanguage:"xml",relevance:0},a={variants:[{begin:/\[.+?\]\[.*?\]/,
relevance:0},{
begin:/\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
relevance:2},{
begin:e.regex.concat(/\[.+?\]\(/,/[A-Za-z][A-Za-z0-9+.-]*/,/:\/\/.*?\)/),
relevance:2},{begin:/\[.+?\]\([./?&#].*?\)/,relevance:1},{
begin:/\[.*?\]\(.*?\)/,relevance:0}],returnBegin:!0,contains:[{match:/\[(?=\])/
},{className:"string",relevance:0,begin:"\\[",end:"\\]",excludeBegin:!0,
returnEnd:!0},{className:"link",relevance:0,begin:"\\]\\(",end:"\\)",
excludeBegin:!0,excludeEnd:!0},{className:"symbol",relevance:0,begin:"\\]\\[",
end:"\\]",excludeBegin:!0,excludeEnd:!0}]},i={className:"strong",contains:[],
variants:[{begin:/_{2}(?!\s)/,end:/_{2}/},{begin:/\*{2}(?!\s)/,end:/\*{2}/}]
},s={className:"emphasis",contains:[],variants:[{begin:/\*(?![*\s])/,end:/\*/},{
begin:/_(?![_\s])/,end:/_/,relevance:0}]},c=e.inherit(i,{contains:[]
}),t=e.inherit(s,{contains:[]});i.contains.push(t),s.contains.push(c)
;let g=[n,a];return[i,s,c,t].forEach(e=>{e.contains=e.contains.concat(g)
}),g=g.concat(i,s),{name:"Markdown",aliases:["md","mkdown","mkd"],contains:[{
className:"section",variants:[{begin:"^#{1,6}",end:"$",contains:g},{
begin:"(?=^.+?\\n[=-]{2,}$)",contains:[{begin:"^[=-]*$"},{begin:"^",end:"\\n",
contains:g}]}]},n,{className:"bullet",begin:"^[ \t]*([*+-]|(\\d+\\.))(?=\\s+)",
end:"\\s+",excludeEnd:!0},{match:/^ {0,3}([-*_])[ \t]*(?:\1[ \t]*){2,}$/},i,s,{
className:"quote",begin:"^>\\s+",contains:g,end:"$"},{className:"code",
variants:[{begin:"(`{3,})[^`](.|\\n)*?\\1`*[ ]*"},{
begin:"(~{3,})[^~](.|\\n)*?\\1~*[ ]*"},{begin:"```",end:"```+[ ]*$"},{
begin:"~~~",end:"~~~+[ ]*$"},{begin:"`.+?`"},{begin:"(?=^( {4}|\\t))",
contains:[{begin:"^( {4}|\\t)",end:"(\\n)$"}],relevance:0}]},a,{
begin:/^\[[^\n]+\]:/,returnBegin:!0,contains:[{className:"symbol",begin:/\[/,
end:/\]/,excludeBegin:!0,excludeEnd:!0},{className:"link",begin:/:\s*/,end:/$/,
excludeBegin:!0}]},{scope:"literal",
match:/&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/}]}}})()
;hljs.registerLanguage("markdown",e)})();/*! `nginx` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{const n=e.regex,a={
className:"variable",variants:[{begin:/\$\d+/},{begin:/\$\{\w+\}/},{
begin:n.concat(/[$@]/,e.UNDERSCORE_IDENT_RE)}]},s={endsWithParent:!0,keywords:{
$pattern:/[a-z_]{2,}|\/dev\/poll/,
literal:["on","off","yes","no","true","false","none","blocked","debug","info","notice","warn","error","crit","select","break","last","permanent","redirect","kqueue","rtsig","epoll","poll","/dev/poll"]
},relevance:0,illegal:"=>",contains:[e.HASH_COMMENT_MODE,{className:"string",
contains:[e.BACKSLASH_ESCAPE,a],variants:[{begin:/"/,end:/"/},{begin:/'/,end:/'/
}]},{begin:"([a-z]+):/",end:"\\s",endsWithParent:!0,excludeEnd:!0,contains:[a]
},{className:"regexp",contains:[e.BACKSLASH_ESCAPE,a],variants:[{begin:"\\s\\^",
end:"\\s|\\{|;",returnEnd:!0},{begin:"~\\*?\\s+",end:"\\s|\\{|;",returnEnd:!0},{
begin:"\\*(\\.[a-z\\-]+)+"},{begin:"([a-z\\-]+\\.)+\\*"}]},{className:"number",
begin:"\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b"},{
className:"number",begin:"\\b\\d+[kKmMgGdshdwy]?\\b",relevance:0},a]};return{
name:"Nginx config",aliases:["nginxconf"],contains:[e.HASH_COMMENT_MODE,{
beginKeywords:"upstream location",end:/;|\{/,contains:s.contains,keywords:{
section:"upstream location"}},{className:"section",
begin:n.concat(e.UNDERSCORE_IDENT_RE+n.lookahead(/\s+\{/)),relevance:0},{
begin:n.lookahead(e.UNDERSCORE_IDENT_RE+"\\s"),end:";|\\{",contains:[{
className:"attribute",begin:e.UNDERSCORE_IDENT_RE,starts:s}],relevance:0}],
illegal:"[^\\s\\}\\{]"}}})();hljs.registerLanguage("nginx",e)})();/*! `plaintext` grammar compiled for Highlight.js 11.12.0 */
(()=>{var t=(()=>{"use strict";return t=>({name:"Plain text",
aliases:["text","txt"],disableAutodetect:!0})})()
;hljs.registerLanguage("plaintext",t)})();/*! `powershell` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{const n={$pattern:/-?[A-z\.\-]+\b/,
keyword:"if else foreach return do while until elseif begin for trap data dynamicparam end break throw param continue finally in switch exit filter try process catch hidden static parameter",
built_in:"ac asnp cat cd CFS chdir clc clear clhy cli clp cls clv cnsn compare copy cp cpi cpp curl cvpa dbp del diff dir dnsn ebp echo|0 epal epcsv epsn erase etsn exsn fc fhx fl ft fw gal gbp gc gcb gci gcm gcs gdr gerr ghy gi gin gjb gl gm gmo gp gps gpv group gsn gsnp gsv gtz gu gv gwmi h history icm iex ihy ii ipal ipcsv ipmo ipsn irm ise iwmi iwr kill lp ls man md measure mi mount move mp mv nal ndr ni nmo npssc nsn nv ogv oh popd ps pushd pwd r rbp rcjb rcsn rd rdr ren ri rjb rm rmdir rmo rni rnp rp rsn rsnp rujb rv rvpa rwmi sajb sal saps sasv sbp sc scb select set shcm si sl sleep sls sort sp spjb spps spsv start stz sujb sv swmi tee trcm type wget where wjb write"
},s={begin:"`[\\s\\S]",relevance:0},i={className:"variable",variants:[{
begin:/\$\B/},{className:"keyword",begin:/\$this/},{begin:/\$[\w\d][\w\d_:]*/}]
},a={className:"string",variants:[{begin:/"/,end:/"/},{begin:/@"/,end:/^"@/}],
contains:[s,i,{className:"variable",begin:/\$[A-z]/,end:/[^A-z]/}]},t={
className:"string",variants:[{begin:/'/,end:/'/},{begin:/@'/,end:/^'@/}]
},r=e.inherit(e.COMMENT(null,null),{variants:[{begin:/#/,end:/$/},{begin:/<#/,
end:/#>/}],contains:[{className:"doctag",variants:[{
begin:/\.(synopsis|description|example|inputs|outputs|notes|link|component|role|functionality)/
},{
begin:/\.(parameter|forwardhelptargetname|forwardhelpcategory|remotehelprunspace|externalhelp)\s+\S+/
}]}]}),c={className:"class",beginKeywords:"class enum",end:/\s*[{]/,
excludeEnd:!0,relevance:0,contains:[e.TITLE_MODE]},l={className:"function",
begin:/function\s+/,end:/\s*\{|$/,excludeEnd:!0,returnBegin:!0,relevance:0,
contains:[{begin:"function",relevance:0,className:"keyword"},{className:"title",
begin:/\w[\w\d]*((-)[\w\d]+)*/,relevance:0},{begin:/\(/,end:/\)/,
className:"params",relevance:0,contains:[i]}]},o={begin:/using\s/,end:/$/,
returnBegin:!0,contains:[a,t,{className:"keyword",
begin:/(using|assembly|command|module|namespace|type)/}]},p={
className:"function",begin:/\[.*\]\s*[\w]+[ ]??\(/,end:/$/,returnBegin:!0,
relevance:0,contains:[{className:"keyword",
begin:"(".concat(n.keyword.toString().replace(/\s/g,"|"),")\\b"),endsParent:!0,
relevance:0},e.inherit(e.TITLE_MODE,{endsParent:!0})]
},g=[p,r,s,e.NUMBER_MODE,a,t,{className:"built_in",variants:[{
begin:"(Add|Clear|Close|Copy|Enter|Exit|Find|Format|Get|Hide|Join|Lock|Move|New|Open|Optimize|Pop|Push|Redo|Remove|Rename|Reset|Resize|Search|Select|Set|Show|Skip|Split|Step|Switch|Undo|Unlock|Watch|Backup|Checkpoint|Compare|Compress|Convert|ConvertFrom|ConvertTo|Dismount|Edit|Expand|Export|Group|Import|Initialize|Limit|Merge|Mount|Out|Publish|Restore|Save|Sync|Unpublish|Update|Approve|Assert|Build|Complete|Confirm|Deny|Deploy|Disable|Enable|Install|Invoke|Register|Request|Restart|Resume|Start|Stop|Submit|Suspend|Uninstall|Unregister|Wait|Debug|Measure|Ping|Repair|Resolve|Test|Trace|Connect|Disconnect|Read|Receive|Send|Write|Block|Grant|Protect|Revoke|Unblock|Unprotect|Use|ForEach|Sort|Tee|Where)+(-)[\\w\\d]+"
}]},i,{className:"literal",begin:/\$(null|true|false)\b/},{
className:"selector-tag",begin:/@\B/,relevance:0}],m={begin:/\[/,end:/\]/,
excludeBegin:!0,excludeEnd:!0,relevance:0,contains:[].concat("self",g,{
begin:"(string|char|byte|int|long|bool|decimal|single|double|DateTime|xml|array|hashtable|void)",
className:"built_in",relevance:0},{className:"type",begin:/[\.\w\d]+/,
relevance:0})};return p.contains.unshift(m),{name:"PowerShell",
aliases:["pwsh","ps","ps1"],case_insensitive:!0,keywords:n,
contains:g.concat(c,l,o,{variants:[{className:"operator",
begin:"(-and|-as|-band|-bnot|-bor|-bxor|-casesensitive|-ccontains|-ceq|-cge|-cgt|-cle|-clike|-clt|-cmatch|-cne|-cnotcontains|-cnotlike|-cnotmatch|-contains|-creplace|-csplit|-eq|-exact|-f|-file|-ge|-gt|-icontains|-ieq|-ige|-igt|-ile|-ilike|-ilt|-imatch|-in|-ine|-inotcontains|-inotlike|-inotmatch|-ireplace|-is|-isnot|-isplit|-join|-le|-like|-lt|-match|-ne|-not|-notcontains|-notin|-notlike|-notmatch|-or|-regex|-replace|-shl|-shr|-split|-wildcard|-xor)\\b"
},{className:"literal",begin:/(-){1,2}[\w\d-]+/,relevance:0}]},m)}}})()
;hljs.registerLanguage("powershell",e)})();/*! `properties` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{
const n="[ \\t\\f]*",t=n+"[:=]"+n,s="[ \\t\\f]+",a="([^\\\\:= \\t\\f\\n]|\\\\.)+",r={
end:"("+t+"|"+s+")",relevance:0,starts:{className:"string",end:/$/,relevance:0,
contains:[{begin:"\\\\\\\\"},{begin:"\\\\\\n"}]}};return{name:".properties",
disableAutodetect:!0,case_insensitive:!0,illegal:/\S/,
contains:[e.COMMENT("^\\s*[!#]","$"),{returnBegin:!0,variants:[{begin:a+t},{
begin:a+s}],contains:[{className:"attr",begin:a,endsParent:!0}],starts:r},{
className:"attr",begin:a+n+"$"}]}}})();hljs.registerLanguage("properties",e)
})();/*! `python` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{
const n=e.regex,a=/[\p{XID_Start}_]\p{XID_Continue}*/u,t=["and","as","assert","async","await","break","case","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","lazy","match","nonlocal|10","not","or","pass","raise","return","try","while","with","yield"],i={
$pattern:/[A-Za-z]\w+|__\w+__/,keyword:t,
built_in:["__import__","abs","aiter","all","anext","any","ascii","bin","bool","breakpoint","bytearray","bytes","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","exec","filter","float","format","frozendict","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","print","property","range","repr","reversed","round","sentinel","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip"],
literal:["__debug__","Ellipsis","False","None","NotImplemented","True"],
type:["Any","Callable","Coroutine","Dict","List","Literal","Generic","Optional","Sequence","Set","Tuple","Type","Union"]
},s={className:"meta",begin:/^(>>>|\.\.\.) /},r={className:"subst",begin:/\{/,
end:/\}/,keywords:i,illegal:/#/},l={begin:/\{\{/,relevance:0},o={
className:"string",contains:[e.BACKSLASH_ESCAPE],variants:[{
begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,end:/'''/,
contains:[e.BACKSLASH_ESCAPE,s],relevance:10},{
begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,end:/"""/,
contains:[e.BACKSLASH_ESCAPE,s],relevance:10},{
begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])'''/,end:/'''/,
contains:[e.BACKSLASH_ESCAPE,s,l,r]},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])"""/,
end:/"""/,contains:[e.BACKSLASH_ESCAPE,s,l,r]},{begin:/([uU]|[rR])'/,end:/'/,
relevance:10},{begin:/([uU]|[rR])"/,end:/"/,relevance:10},{
begin:/([bB]|[bB][rR]|[rR][bB])'/,end:/'/},{begin:/([bB]|[bB][rR]|[rR][bB])"/,
end:/"/},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])'/,end:/'/,
contains:[e.BACKSLASH_ESCAPE,l,r]},{begin:/([fFtT][rR]|[rR][fFtT]|[fFtT])"/,
end:/"/,contains:[e.BACKSLASH_ESCAPE,l,r]
},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]
},b="[0-9](_?[0-9])*",c=`(\\b(${b}))?\\.(${b})|\\b(${b})\\.`,d="\\b|"+t.join("|"),g={
className:"number",relevance:0,variants:[{
begin:`(\\b(${b})|(${c}))[eE][+-]?(${b})[jJ]?(?=${d})`},{begin:`(${c})[jJ]?`},{
begin:`\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${d})`},{
begin:`\\b0[bB](_?[01])+[lL]?(?=${d})`},{begin:`\\b0[oO](_?[0-7])+[lL]?(?=${d})`
},{begin:`\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${d})`},{begin:`\\b(${b})[jJ](?=${d})`
}]},p={className:"comment",begin:n.lookahead(/# type:/),end:/$/,keywords:i,
contains:[{begin:/# type:/},{begin:/#/,end:/\b\B/,endsWithParent:!0}]},m={
className:"params",variants:[{className:"",begin:/\(\s*\)/,skip:!0},{begin:/\(/,
end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:i,
contains:["self",s,g,o,e.HASH_COMMENT_MODE]}]};return r.contains=[o,g,s],{
name:"Python",aliases:["py","gyp","ipython"],unicodeRegex:!0,keywords:i,
illegal:/(<\/|\?)|=>/,contains:[s,g,{scope:"variable.language",match:/\bself\b/
},{beginKeywords:"if",relevance:0},{match:/\bor\b/,scope:"keyword"
},o,p,e.HASH_COMMENT_MODE,{match:[/\bdef/,/\s+/,a],scope:{1:"keyword",
3:"title.function"},contains:[m]},{variants:[{
match:[/\bclass/,/\s+/,a,/\s*/,/\(\s*/,a,/\s*\)/]},{match:[/\bclass/,/\s+/,a]}],
scope:{1:"keyword",3:"title.class",6:"title.class.inherited"}},{
className:"meta",begin:/^[\t ]*@/,end:/(?=#)|$/,contains:[g,m,o]}]}}})()
;hljs.registerLanguage("python",e)})();/*! `shell` grammar compiled for Highlight.js 11.12.0 */
(()=>{var s=(()=>{"use strict";return s=>({name:"Shell Session",
aliases:["console","shellsession"],contains:[{className:"meta.prompt",
begin:/^\s{0,3}[./~\w\d[\]()@-]*[>%$#][ ]?/,starts:{end:/[^\\](?=\s*$)/,
subLanguage:"bash"}}]})})();hljs.registerLanguage("shell",s)})();/*! `sql` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{
const r=e.regex,t=e.COMMENT("--","$"),a=["abs","acos","array_agg","asin","atan","avg","cast","ceil","ceiling","coalesce","corr","cos","cosh","count","covar_pop","covar_samp","cume_dist","dense_rank","deref","element","exp","extract","first_value","floor","json_array","json_arrayagg","json_exists","json_object","json_objectagg","json_query","json_table","json_table_primitive","json_value","lag","last_value","lead","listagg","ln","log","log10","lower","max","min","mod","nth_value","ntile","nullif","percent_rank","percentile_cont","percentile_disc","position","position_regex","power","rank","regr_avgx","regr_avgy","regr_count","regr_intercept","regr_r2","regr_slope","regr_sxx","regr_sxy","regr_syy","row_number","sin","sinh","sqrt","stddev_pop","stddev_samp","substring","substring_regex","sum","tan","tanh","translate","translate_regex","treat","trim","trim_array","unnest","upper","value_of","var_pop","var_samp","width_bucket"],n=a,s=["abs","acos","all","allocate","alter","and","any","are","array","array_agg","array_max_cardinality","as","asensitive","asin","asymmetric","at","atan","atomic","authorization","avg","begin","begin_frame","begin_partition","between","bigint","binary","blob","boolean","both","by","call","called","cardinality","cascaded","case","cast","ceil","ceiling","char","char_length","character","character_length","check","classifier","clob","close","coalesce","collate","collect","column","commit","condition","connect","constraint","contains","convert","copy","corr","corresponding","cos","cosh","count","covar_pop","covar_samp","create","cross","cube","cume_dist","current","current_catalog","current_date","current_default_transform_group","current_path","current_role","current_row","current_schema","current_time","current_timestamp","current_path","current_role","current_transform_group_for_type","current_user","cursor","cycle","date","day","deallocate","dec","decimal","decfloat","declare","default","define","delete","dense_rank","deref","describe","deterministic","disconnect","distinct","double","drop","dynamic","each","element","else","empty","end","end_frame","end_partition","end-exec","equals","escape","every","except","exec","execute","exists","exp","external","extract","false","fetch","filter","first_value","float","floor","for","foreign","frame_row","free","from","full","function","fusion","get","global","grant","group","grouping","groups","having","hold","hour","identity","in","indicator","initial","inner","inout","insensitive","insert","int","integer","intersect","intersection","interval","into","is","join","json_array","json_arrayagg","json_exists","json_object","json_objectagg","json_query","json_table","json_table_primitive","json_value","lag","language","large","last_value","lateral","lead","leading","left","like","like_regex","listagg","ln","local","localtime","localtimestamp","log","log10","lower","match","match_number","match_recognize","matches","max","member","merge","method","min","minute","mod","modifies","module","month","multiset","national","natural","nchar","nclob","new","no","none","normalize","not","nth_value","ntile","null","nullif","numeric","octet_length","occurrences_regex","of","offset","old","omit","on","one","only","open","or","order","out","outer","over","overlaps","overlay","parameter","partition","pattern","per","percent","percent_rank","percentile_cont","percentile_disc","period","portion","position","position_regex","power","precedes","precision","prepare","primary","procedure","ptf","range","rank","reads","real","recursive","ref","references","referencing","regr_avgx","regr_avgy","regr_count","regr_intercept","regr_r2","regr_slope","regr_sxx","regr_sxy","regr_syy","release","result","return","returns","revoke","right","rollback","rollup","row","row_number","rows","running","savepoint","scope","scroll","search","second","seek","select","sensitive","session_user","set","show","similar","sin","sinh","skip","smallint","some","specific","specifictype","sql","sqlexception","sqlstate","sqlwarning","sqrt","start","static","stddev_pop","stddev_samp","submultiset","subset","substring","substring_regex","succeeds","sum","symmetric","system","system_time","system_user","table","tablesample","tan","tanh","then","time","timestamp","timezone_hour","timezone_minute","to","trailing","translate","translate_regex","translation","treat","trigger","trim","trim_array","true","truncate","uescape","union","unique","unknown","unnest","update","upper","user","using","value","values","value_of","var_pop","var_samp","varbinary","varchar","varying","versioning","when","whenever","where","width_bucket","window","with","within","without","year","add","asc","collation","desc","final","first","last","view"].filter(e=>!a.includes(e)),i={
match:r.concat(/\b/,r.either(...n),/\s*\(/),relevance:0,keywords:{built_in:n}}
;function o(e){
return r.concat(/\b/,r.either(...e.map(e=>e.replace(/\s+/,"\\s+"))),/\b/)}
const c={scope:"keyword",
match:o(["create table","insert into","primary key","foreign key","not null","alter table","add constraint","grouping sets","on overflow","character set","respect nulls","ignore nulls","nulls first","nulls last","depth first","breadth first"]),
relevance:0};return{name:"SQL",case_insensitive:!0,illegal:/[{}]|<\//,keywords:{
$pattern:/\b[\w\.]+/,keyword:((e,{exceptions:r,when:t}={})=>{const a=t
;return r=r||[],e.map(e=>e.match(/\|\d+$/)||r.includes(e)?e:a(e)?e+"|0":e)})(s,{
when:e=>e.length<3}),literal:["true","false","unknown"],
type:["bigint","binary","blob","boolean","char","character","clob","date","dec","decfloat","decimal","float","int","integer","interval","nchar","nclob","national","numeric","real","row","smallint","time","timestamp","varchar","varying","varbinary"],
built_in:["current_catalog","current_date","current_default_transform_group","current_path","current_role","current_schema","current_transform_group_for_type","current_user","session_user","system_time","system_user","current_time","localtime","current_timestamp","localtimestamp"]
},contains:[{scope:"type",
match:o(["double precision","large object","with timezone","without timezone"])
},c,i,{scope:"variable",match:/@[a-z0-9][a-z0-9_]*/},{scope:"string",variants:[{
begin:/'/,end:/'/,contains:[{match:/''/}]}]},{begin:/"/,end:/"/,contains:[{
match:/""/}]},e.C_NUMBER_MODE,e.C_BLOCK_COMMENT_MODE,t,{scope:"operator",
match:/[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,relevance:0}]}}})()
;hljs.registerLanguage("sql",e)})();/*! `xml` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{
const a=e.regex,n=a.concat(/[\p{L}_]/u,a.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),s={
className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},t={begin:/\s/,
contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]
},i=e.inherit(t,{begin:/\(/,end:/\)/}),c=e.inherit(e.APOS_STRING_MODE,{
className:"string"}),l=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),r={
endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",
begin:/[\p{L}0-9._:-]+/u,relevance:0},{begin:/=\s*/,relevance:0,contains:[{
className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[s]},{
begin:/'/,end:/'/,contains:[s]},{begin:/[^\s"'=<>`]+/}]}]}]};return{
name:"HTML, XML",
aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],
case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,
end:/>/,relevance:10,contains:[t,l,c,i,{begin:/\[/,end:/\]/,contains:[{
className:"meta",begin:/<![a-z]/,end:/>/,contains:[t,i,l,c]}]}]
},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,
relevance:10},s,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,
relevance:10,contains:[l]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",
begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[r],starts:{
end:/<\/style>/,returnEnd:!0,subLanguage:"css"}},{className:"tag",
begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[r],starts:{
end:/<\/script>/,returnEnd:!0,subLanguage:"javascript"}},{className:"tag",
begin:/<>|<\/>/},{className:"tag",
begin:a.concat(/</,a.lookahead(a.concat(n,a.either(/\/>/,/>/,/\s/)))),
end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:r}]},{
className:"tag",begin:a.concat(/<\//,a.lookahead(a.concat(n,/>/))),contains:[{
className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}
})();hljs.registerLanguage("xml",e)})();/*! `yaml` grammar compiled for Highlight.js 11.12.0 */
(()=>{var e=(()=>{"use strict";return e=>{
const n="true false yes no null",a="[\\w#;/?:@&=+$,.~*'()[\\]]+",s={
className:"string",relevance:0,variants:[{begin:/"/,end:/"/},{begin:/\S+/}],
contains:[e.BACKSLASH_ESCAPE,{className:"template-variable",variants:[{
begin:/\{\{/,end:/\}\}/},{begin:/%\{/,end:/\}/}]}]},i=e.inherit(s,{variants:[{
begin:/'/,end:/'/,contains:[{begin:/''/,relevance:0}]},{begin:/"/,end:/"/},{
begin:/[^\s,{}[\]]+/}]}),l={end:",",endsWithParent:!0,excludeEnd:!0,keywords:n,
relevance:0},t={begin:/\{/,end:/\}/,contains:[l],illegal:"\\n",relevance:0},c={
begin:"\\[",end:"\\]",contains:[l],illegal:"\\n",relevance:0},r=[{
className:"attr",variants:[{begin:/[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/},{
begin:/"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/},{
begin:/'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/}]},{className:"meta",
begin:"^---\\s*$",relevance:10},{className:"string",
begin:"[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"},{
begin:"<%[%=-]?",end:"[%-]?%>",subLanguage:"ruby",excludeBegin:!0,excludeEnd:!0,
relevance:0},{className:"type",begin:"!\\w+!"+a},{className:"type",
begin:"!<"+a+">"},{className:"type",begin:"!"+a},{className:"type",begin:"!!"+a
},{className:"meta",begin:"&"+e.UNDERSCORE_IDENT_RE+"$"},{className:"meta",
begin:"\\*"+e.UNDERSCORE_IDENT_RE+"$"},{className:"bullet",begin:"-(?=[ ]|$)",
relevance:0},e.HASH_COMMENT_MODE,{beginKeywords:n,keywords:{literal:n}},{
className:"number",
begin:"\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b"
},{className:"number",begin:e.C_NUMBER_RE+"\\b",relevance:0},t,c,{
className:"string",relevance:0,begin:/'/,end:/'/,contains:[{match:/''/,
scope:"char.escape",relevance:0}]},s],g=[...r]
;return g.pop(),g.push(i),l.contains=g,{name:"YAML",case_insensitive:!0,
aliases:["yml"],contains:r}}})();hljs.registerLanguage("yaml",e)})();