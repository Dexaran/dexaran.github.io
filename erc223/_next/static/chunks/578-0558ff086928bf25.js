(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[578],{9008:function(e,t,n){e.exports=n(4605)},6202:function(e,t,n){"use strict";n.d(t,{YF:function(){return floating_ui_react_useFloating},XI:function(){return useHover},NI:function(){return useInteractions}});let o=Math.min,i=Math.max,l=Math.round,createCoords=e=>({x:e,y:e});function floating_ui_utils_getSide(e){return e.split("-")[0]}function floating_ui_utils_getSideAxis(e){return["top","bottom"].includes(floating_ui_utils_getSide(e))?"y":"x"}function floating_ui_utils_rectToClientRect(e){return{...e,top:e.y,left:e.x,right:e.x+e.width,bottom:e.y+e.height}}function computeCoordsFromPlacement(e,t,n){let o,{reference:i,floating:l}=e,r=floating_ui_utils_getSideAxis(t),u="x"===floating_ui_utils_getSideAxis(t)?"y":"x",s="y"===u?"height":"width",c=floating_ui_utils_getSide(t),a="y"===r,f=i.x+i.width/2-l.width/2,d=i.y+i.height/2-l.height/2,_=i[s]/2-l[s]/2;switch(c){case"top":o={x:f,y:i.y-l.height};break;case"bottom":o={x:f,y:i.y+i.height};break;case"right":o={x:i.x+i.width,y:d};break;case"left":o={x:i.x-l.width,y:d};break;default:o={x:i.x,y:i.y}}switch(t.split("-")[1]){case"start":o[u]-=_*(n&&a?-1:1);break;case"end":o[u]+=_*(n&&a?-1:1)}return o}let computePosition=async(e,t,n)=>{let{placement:o="bottom",strategy:i="absolute",middleware:l=[],platform:r}=n,u=l.filter(Boolean),s=await (null==r.isRTL?void 0:r.isRTL(t)),c=await r.getElementRects({reference:e,floating:t,strategy:i}),{x:a,y:f}=computeCoordsFromPlacement(c,o,s),d=o,_={},m=0;for(let n=0;n<u.length;n++){let{name:l,fn:g}=u[n],{x:p,y:v,data:y,reset:h}=await g({x:a,y:f,initialPlacement:o,placement:d,strategy:i,middlewareData:_,rects:c,platform:r,elements:{reference:e,floating:t}});if(a=null!=p?p:a,f=null!=v?v:f,_={..._,[l]:{..._[l],...y}},h&&m<=50){m++,"object"==typeof h&&(h.placement&&(d=h.placement),h.rects&&(c=!0===h.rects?await r.getElementRects({reference:e,floating:t,strategy:i}):h.rects),{x:a,y:f}=computeCoordsFromPlacement(c,d,s)),n=-1;continue}}return{x:a,y:f,placement:d,strategy:i,middlewareData:_}};function getNodeName(e){return isNode(e)?(e.nodeName||"").toLowerCase():"#document"}function floating_ui_utils_dom_getWindow(e){var t;return(null==e?void 0:null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function floating_ui_utils_dom_getDocumentElement(e){var t;return null==(t=(isNode(e)?e.ownerDocument:e.document)||window.document)?void 0:t.documentElement}function isNode(e){return e instanceof Node||e instanceof floating_ui_utils_dom_getWindow(e).Node}function floating_ui_utils_dom_isElement(e){return e instanceof Element||e instanceof floating_ui_utils_dom_getWindow(e).Element}function floating_ui_utils_dom_isHTMLElement(e){return e instanceof HTMLElement||e instanceof floating_ui_utils_dom_getWindow(e).HTMLElement}function isShadowRoot(e){return"undefined"!=typeof ShadowRoot&&(e instanceof ShadowRoot||e instanceof floating_ui_utils_dom_getWindow(e).ShadowRoot)}function isOverflowElement(e){let{overflow:t,overflowX:n,overflowY:o,display:i}=floating_ui_utils_dom_getComputedStyle(e);return/auto|scroll|overlay|hidden|clip/.test(t+o+n)&&!["inline","contents"].includes(i)}function isContainingBlock(e){let t=isWebKit(),n=floating_ui_utils_dom_getComputedStyle(e);return"none"!==n.transform||"none"!==n.perspective||!!n.containerType&&"normal"!==n.containerType||!t&&!!n.backdropFilter&&"none"!==n.backdropFilter||!t&&!!n.filter&&"none"!==n.filter||["transform","perspective","filter"].some(e=>(n.willChange||"").includes(e))||["paint","layout","strict","content"].some(e=>(n.contain||"").includes(e))}function isWebKit(){return"undefined"!=typeof CSS&&!!CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")}function isLastTraversableNode(e){return["html","body","#document"].includes(getNodeName(e))}function floating_ui_utils_dom_getComputedStyle(e){return floating_ui_utils_dom_getWindow(e).getComputedStyle(e)}function getNodeScroll(e){return floating_ui_utils_dom_isElement(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function getParentNode(e){if("html"===getNodeName(e))return e;let t=e.assignedSlot||e.parentNode||isShadowRoot(e)&&e.host||floating_ui_utils_dom_getDocumentElement(e);return isShadowRoot(t)?t.host:t}function getCssDimensions(e){let t=floating_ui_utils_dom_getComputedStyle(e),n=parseFloat(t.width)||0,o=parseFloat(t.height)||0,i=floating_ui_utils_dom_isHTMLElement(e),r=i?e.offsetWidth:n,u=i?e.offsetHeight:o,s=l(n)!==r||l(o)!==u;return s&&(n=r,o=u),{width:n,height:o,$:s}}function unwrapElement(e){return floating_ui_utils_dom_isElement(e)?e:e.contextElement}function getScale(e){let t=unwrapElement(e);if(!floating_ui_utils_dom_isHTMLElement(t))return createCoords(1);let n=t.getBoundingClientRect(),{width:o,height:i,$:r}=getCssDimensions(t),u=(r?l(n.width):n.width)/o,s=(r?l(n.height):n.height)/i;return u&&Number.isFinite(u)||(u=1),s&&Number.isFinite(s)||(s=1),{x:u,y:s}}let r=createCoords(0);function getVisualOffsets(e){let t=floating_ui_utils_dom_getWindow(e);return isWebKit()&&t.visualViewport?{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}:r}function getBoundingClientRect(e,t,n,o){var i;void 0===t&&(t=!1),void 0===n&&(n=!1);let l=e.getBoundingClientRect(),r=unwrapElement(e),u=createCoords(1);t&&(o?floating_ui_utils_dom_isElement(o)&&(u=getScale(o)):u=getScale(e));let s=(void 0===(i=n)&&(i=!1),o&&(!i||o===floating_ui_utils_dom_getWindow(r))&&i)?getVisualOffsets(r):createCoords(0),c=(l.left+s.x)/u.x,a=(l.top+s.y)/u.y,f=l.width/u.x,d=l.height/u.y;if(r){let e=floating_ui_utils_dom_getWindow(r),t=o&&floating_ui_utils_dom_isElement(o)?floating_ui_utils_dom_getWindow(o):o,n=e.frameElement;for(;n&&o&&t!==e;){let e=getScale(n),t=n.getBoundingClientRect(),o=floating_ui_utils_dom_getComputedStyle(n),i=t.left+(n.clientLeft+parseFloat(o.paddingLeft))*e.x,l=t.top+(n.clientTop+parseFloat(o.paddingTop))*e.y;c*=e.x,a*=e.y,f*=e.x,d*=e.y,c+=i,a+=l,n=floating_ui_utils_dom_getWindow(n).frameElement}}return floating_ui_utils_rectToClientRect({width:f,height:d,x:c,y:a})}function getWindowScrollBarX(e){return getBoundingClientRect(floating_ui_utils_dom_getDocumentElement(e)).left+getNodeScroll(e).scrollLeft}function getClientRectFromClippingAncestor(e,t,n){let o;if("viewport"===t)o=function(e,t){let n=floating_ui_utils_dom_getWindow(e),o=floating_ui_utils_dom_getDocumentElement(e),i=n.visualViewport,l=o.clientWidth,r=o.clientHeight,u=0,s=0;if(i){l=i.width,r=i.height;let e=isWebKit();(!e||e&&"fixed"===t)&&(u=i.offsetLeft,s=i.offsetTop)}return{width:l,height:r,x:u,y:s}}(e,n);else if("document"===t)o=function(e){let t=floating_ui_utils_dom_getDocumentElement(e),n=getNodeScroll(e),o=e.ownerDocument.body,l=i(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),r=i(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight),u=-n.scrollLeft+getWindowScrollBarX(e),s=-n.scrollTop;return"rtl"===floating_ui_utils_dom_getComputedStyle(o).direction&&(u+=i(t.clientWidth,o.clientWidth)-l),{width:l,height:r,x:u,y:s}}(floating_ui_utils_dom_getDocumentElement(e));else if(floating_ui_utils_dom_isElement(t))o=function(e,t){let n=getBoundingClientRect(e,!0,"fixed"===t),o=n.top+e.clientTop,i=n.left+e.clientLeft,l=floating_ui_utils_dom_isHTMLElement(e)?getScale(e):createCoords(1),r=e.clientWidth*l.x,u=e.clientHeight*l.y,s=i*l.x,c=o*l.y;return{width:r,height:u,x:s,y:c}}(t,n);else{let n=getVisualOffsets(e);o={...t,x:t.x-n.x,y:t.y-n.y}}return floating_ui_utils_rectToClientRect(o)}function getTrueOffsetParent(e,t){return floating_ui_utils_dom_isHTMLElement(e)&&"fixed"!==floating_ui_utils_dom_getComputedStyle(e).position?t?t(e):e.offsetParent:null}function getOffsetParent(e,t){let n=floating_ui_utils_dom_getWindow(e);if(!floating_ui_utils_dom_isHTMLElement(e))return n;let o=getTrueOffsetParent(e,t);for(;o&&["table","td","th"].includes(getNodeName(o))&&"static"===floating_ui_utils_dom_getComputedStyle(o).position;)o=getTrueOffsetParent(o,t);return o&&("html"===getNodeName(o)||"body"===getNodeName(o)&&"static"===floating_ui_utils_dom_getComputedStyle(o).position&&!isContainingBlock(o))?n:o||function(e){let t=getParentNode(e);for(;floating_ui_utils_dom_isHTMLElement(t)&&!isLastTraversableNode(t);){if(isContainingBlock(t))return t;t=getParentNode(t)}return null}(e)||n}let getElementRects=async function(e){let{reference:t,floating:n,strategy:o}=e,i=this.getOffsetParent||getOffsetParent,l=this.getDimensions;return{reference:function(e,t,n){let o=floating_ui_utils_dom_isHTMLElement(t),i=floating_ui_utils_dom_getDocumentElement(t),l="fixed"===n,r=getBoundingClientRect(e,!0,l,t),u={scrollLeft:0,scrollTop:0},s=createCoords(0);if(o||!o&&!l){if(("body"!==getNodeName(t)||isOverflowElement(i))&&(u=getNodeScroll(t)),o){let e=getBoundingClientRect(t,!0,l,t);s.x=e.x+t.clientLeft,s.y=e.y+t.clientTop}else i&&(s.x=getWindowScrollBarX(i))}return{x:r.left+u.scrollLeft-s.x,y:r.top+u.scrollTop-s.y,width:r.width,height:r.height}}(t,await i(n),o),floating:{x:0,y:0,...await l(n)}}},u={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{rect:t,offsetParent:n,strategy:o}=e,i=floating_ui_utils_dom_isHTMLElement(n),l=floating_ui_utils_dom_getDocumentElement(n);if(n===l)return t;let r={scrollLeft:0,scrollTop:0},u=createCoords(1),s=createCoords(0);if((i||!i&&"fixed"!==o)&&(("body"!==getNodeName(n)||isOverflowElement(l))&&(r=getNodeScroll(n)),floating_ui_utils_dom_isHTMLElement(n))){let e=getBoundingClientRect(n);u=getScale(n),s.x=e.x+n.clientLeft,s.y=e.y+n.clientTop}return{width:t.width*u.x,height:t.height*u.y,x:t.x*u.x-r.scrollLeft*u.x+s.x,y:t.y*u.y-r.scrollTop*u.y+s.y}},getDocumentElement:floating_ui_utils_dom_getDocumentElement,getClippingRect:function(e){let{element:t,boundary:n,rootBoundary:l,strategy:r}=e,u="clippingAncestors"===n?function(e,t){let n=t.get(e);if(n)return n;let o=(function floating_ui_utils_dom_getOverflowAncestors(e,t){var n;void 0===t&&(t=[]);let o=function getNearestOverflowAncestor(e){let t=getParentNode(e);return isLastTraversableNode(t)?e.ownerDocument?e.ownerDocument.body:e.body:floating_ui_utils_dom_isHTMLElement(t)&&isOverflowElement(t)?t:getNearestOverflowAncestor(t)}(e),i=o===(null==(n=e.ownerDocument)?void 0:n.body),l=floating_ui_utils_dom_getWindow(o);return i?t.concat(l,l.visualViewport||[],isOverflowElement(o)?o:[]):t.concat(o,floating_ui_utils_dom_getOverflowAncestors(o))})(e).filter(e=>floating_ui_utils_dom_isElement(e)&&"body"!==getNodeName(e)),i=null,l="fixed"===floating_ui_utils_dom_getComputedStyle(e).position,r=l?getParentNode(e):e;for(;floating_ui_utils_dom_isElement(r)&&!isLastTraversableNode(r);){let t=floating_ui_utils_dom_getComputedStyle(r),n=isContainingBlock(r);n||"fixed"!==t.position||(i=null);let u=l?!n&&!i:!n&&"static"===t.position&&!!i&&["absolute","fixed"].includes(i.position)||isOverflowElement(r)&&!n&&function hasFixedPositionAncestor(e,t){let n=getParentNode(e);return!(n===t||!floating_ui_utils_dom_isElement(n)||isLastTraversableNode(n))&&("fixed"===floating_ui_utils_dom_getComputedStyle(n).position||hasFixedPositionAncestor(n,t))}(e,r);u?o=o.filter(e=>e!==r):i=t,r=getParentNode(r)}return t.set(e,o),o}(t,this._c):[].concat(n),s=[...u,l],c=s[0],a=s.reduce((e,n)=>{let l=getClientRectFromClippingAncestor(t,n,r);return e.top=i(l.top,e.top),e.right=o(l.right,e.right),e.bottom=o(l.bottom,e.bottom),e.left=i(l.left,e.left),e},getClientRectFromClippingAncestor(t,c,r));return{width:a.right-a.left,height:a.bottom-a.top,x:a.left,y:a.top}},getOffsetParent,getElementRects,getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){return getCssDimensions(e)},getScale,isElement:floating_ui_utils_dom_isElement,isRTL:function(e){return"rtl"===floating_ui_utils_dom_getComputedStyle(e).direction}},floating_ui_dom_computePosition=(e,t,n)=>{let o=new Map,i={platform:u,...n},l={...i.platform,_c:o};return computePosition(e,t,{...i,platform:l})};var s=n(7294),c=n.t(s,2),a=n(3935),f="undefined"!=typeof document?s.useLayoutEffect:s.useEffect;function deepEqual(e,t){let n,o,i;if(e===t)return!0;if(typeof e!=typeof t)return!1;if("function"==typeof e&&e.toString()===t.toString())return!0;if(e&&t&&"object"==typeof e){if(Array.isArray(e)){if((n=e.length)!=t.length)return!1;for(o=n;0!=o--;)if(!deepEqual(e[o],t[o]))return!1;return!0}if((n=(i=Object.keys(e)).length)!==Object.keys(t).length)return!1;for(o=n;0!=o--;)if(!({}).hasOwnProperty.call(t,i[o]))return!1;for(o=n;0!=o--;){let n=i[o];if(("_owner"!==n||!e.$$typeof)&&!deepEqual(e[n],t[n]))return!1}return!0}return e!=e&&t!=t}function getDPR(e){if("undefined"==typeof window)return 1;let t=e.ownerDocument.defaultView||window;return t.devicePixelRatio||1}function roundByDPR(e,t){let n=getDPR(e);return Math.round(t*n)/n}function useLatestRef(e){let t=s.useRef(e);return f(()=>{t.current=e}),t}function floating_ui_utils_react_isMouseLikePointerType(e,t){let n=["mouse","pen"];return t||n.push("",void 0),n.includes(e)}function floating_ui_utils_react_getDocument(e){return(null==e?void 0:e.ownerDocument)||document}var d="undefined"!=typeof document?s.useLayoutEffect:s.useEffect;let _=!1,m=0,genId=()=>"floating-ui-"+m++,g=c["useId".toString()],p=g||function(){let[e,t]=s.useState(()=>_?genId():void 0);return d(()=>{null==e&&t(genId())},[]),s.useEffect(()=>{_||(_=!0)},[]),e},v=s.createContext(null),y=s.createContext(null),useFloatingParentNodeId=()=>{var e;return(null==(e=s.useContext(v))?void 0:e.id)||null},useFloatingTree=()=>s.useContext(y);function floating_ui_react_useLatestRef(e){let t=(0,s.useRef)(e);return d(()=>{t.current=e}),t}let h="data-floating-ui-safe-polygon";function getDelay(e,t,n){return n&&!floating_ui_utils_react_isMouseLikePointerType(n)?0:"number"==typeof e?e:null==e?void 0:e[t]}function useHover(e,t){void 0===t&&(t={});let{open:n,onOpenChange:o,dataRef:i,events:l,elements:{domReference:r,floating:u},refs:c}=e,{enabled:a=!0,delay:f=0,handleClose:_=null,mouseOnly:m=!1,restMs:g=0,move:p=!0}=t,v=useFloatingTree(),y=useFloatingParentNodeId(),E=floating_ui_react_useLatestRef(_),w=floating_ui_react_useLatestRef(f),C=s.useRef(),L=s.useRef(),R=s.useRef(),x=s.useRef(),b=s.useRef(!0),T=s.useRef(!1),S=s.useRef(()=>{}),N=s.useCallback(()=>{var e;let t=null==(e=i.current.openEvent)?void 0:e.type;return(null==t?void 0:t.includes("mouse"))&&"mousedown"!==t},[i]);s.useEffect(()=>{if(a)return l.on("dismiss",onDismiss),()=>{l.off("dismiss",onDismiss)};function onDismiss(){clearTimeout(L.current),clearTimeout(x.current),b.current=!0}},[a,l]),s.useEffect(()=>{if(!a||!E.current||!n)return;function onLeave(e){N()&&o(!1,e)}let e=floating_ui_utils_react_getDocument(u).documentElement;return e.addEventListener("mouseleave",onLeave),()=>{e.removeEventListener("mouseleave",onLeave)}},[u,n,o,a,E,i,N]);let P=s.useCallback(function(e,t){void 0===t&&(t=!0);let n=getDelay(w.current,"close",C.current);n&&!R.current?(clearTimeout(L.current),L.current=setTimeout(()=>o(!1,e),n)):t&&(clearTimeout(L.current),o(!1,e))},[w,o]),M=s.useCallback(()=>{S.current(),R.current=void 0},[]),k=s.useCallback(()=>{if(T.current){let e=floating_ui_utils_react_getDocument(c.floating.current).body;e.style.pointerEvents="",e.removeAttribute(h),T.current=!1}},[c]);return s.useEffect(()=>{if(a&&floating_ui_utils_dom_isElement(r))return n&&r.addEventListener("mouseleave",onScrollMouseLeave),null==u||u.addEventListener("mouseleave",onScrollMouseLeave),p&&r.addEventListener("mousemove",onMouseEnter,{once:!0}),r.addEventListener("mouseenter",onMouseEnter),r.addEventListener("mouseleave",onMouseLeave),()=>{n&&r.removeEventListener("mouseleave",onScrollMouseLeave),null==u||u.removeEventListener("mouseleave",onScrollMouseLeave),p&&r.removeEventListener("mousemove",onMouseEnter),r.removeEventListener("mouseenter",onMouseEnter),r.removeEventListener("mouseleave",onMouseLeave)};function isClickLikeOpenEvent(){return!!i.current.openEvent&&["click","mousedown"].includes(i.current.openEvent.type)}function onMouseEnter(e){if(clearTimeout(L.current),b.current=!1,m&&!floating_ui_utils_react_isMouseLikePointerType(C.current)||g>0&&0===getDelay(w.current,"open"))return;let t=getDelay(w.current,"open",C.current);t?L.current=setTimeout(()=>{o(!0,e)},t):o(!0,e)}function onMouseLeave(t){if(isClickLikeOpenEvent())return;S.current();let o=floating_ui_utils_react_getDocument(u);if(clearTimeout(x.current),E.current){n||clearTimeout(L.current),R.current=E.current({...e,tree:v,x:t.clientX,y:t.clientY,onClose(){k(),M(),P(t)}});let i=R.current;o.addEventListener("mousemove",i),S.current=()=>{o.removeEventListener("mousemove",i)};return}let i="touch"!==C.current||!function(e,t){if(!e||!t)return!1;let n=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(n&&isShadowRoot(n)){let n=t;for(;n;){if(e===n)return!0;n=n.parentNode||n.host}}return!1}(u,t.relatedTarget);i&&P(t)}function onScrollMouseLeave(t){isClickLikeOpenEvent()||null==E.current||E.current({...e,tree:v,x:t.clientX,y:t.clientY,onClose(){k(),M(),P(t)}})(t)}},[r,u,a,e,m,g,p,P,M,k,o,n,v,w,E,i]),d(()=>{var e,t,o;if(a&&n&&null!=(e=E.current)&&e.__options.blockPointerEvents&&N()){let e=floating_ui_utils_react_getDocument(u).body;if(e.setAttribute(h,""),e.style.pointerEvents="none",T.current=!0,floating_ui_utils_dom_isElement(r)&&u){let e=null==v?void 0:null==(t=v.nodesRef.current.find(e=>e.id===y))?void 0:null==(o=t.context)?void 0:o.elements.floating;return e&&(e.style.pointerEvents=""),r.style.pointerEvents="auto",u.style.pointerEvents="auto",()=>{r.style.pointerEvents="",u.style.pointerEvents=""}}}},[a,n,y,u,r,v,E,i,N]),d(()=>{n||(C.current=void 0,M(),k())},[n,M,k]),s.useEffect(()=>()=>{M(),clearTimeout(L.current),clearTimeout(x.current),k()},[a,r,M,k]),s.useMemo(()=>{if(!a)return{};function setPointerRef(e){C.current=e.pointerType}return{reference:{onPointerDown:setPointerRef,onPointerEnter:setPointerRef,onMouseMove(e){n||0===g||(clearTimeout(x.current),x.current=setTimeout(()=>{b.current||o(!0,e.nativeEvent)},g))}},floating:{onMouseEnter(){clearTimeout(L.current)},onMouseLeave(e){l.emit("dismiss",{type:"mouseLeave",data:{returnFocus:!1}}),P(e.nativeEvent,!1)}}}},[l,a,g,n,o,P])}let E=c["useInsertionEffect".toString()],w=E||(e=>e());function floating_ui_react_useFloating(e){var t;void 0===e&&(e={});let{open:n=!1,onOpenChange:o,nodeId:i}=e,[l,r]=s.useState(null),u=(null==(t=e.elements)?void 0:t.reference)||l,c=function(e){void 0===e&&(e={});let{placement:t="bottom",strategy:n="absolute",middleware:o=[],platform:i,elements:{reference:l,floating:r}={},transform:u=!0,whileElementsMounted:c,open:d}=e,[_,m]=s.useState({x:0,y:0,strategy:n,placement:t,middlewareData:{},isPositioned:!1}),[g,p]=s.useState(o);deepEqual(g,o)||p(o);let[v,y]=s.useState(null),[h,E]=s.useState(null),w=s.useCallback(e=>{e!=x.current&&(x.current=e,y(e))},[y]),C=s.useCallback(e=>{e!==b.current&&(b.current=e,E(e))},[E]),L=l||v,R=r||h,x=s.useRef(null),b=s.useRef(null),T=s.useRef(_),S=useLatestRef(c),N=useLatestRef(i),P=s.useCallback(()=>{if(!x.current||!b.current)return;let e={placement:t,strategy:n,middleware:g};N.current&&(e.platform=N.current),floating_ui_dom_computePosition(x.current,b.current,e).then(e=>{let t={...e,isPositioned:!0};M.current&&!deepEqual(T.current,t)&&(T.current=t,a.flushSync(()=>{m(t)}))})},[g,t,n,N]);f(()=>{!1===d&&T.current.isPositioned&&(T.current.isPositioned=!1,m(e=>({...e,isPositioned:!1})))},[d]);let M=s.useRef(!1);f(()=>(M.current=!0,()=>{M.current=!1}),[]),f(()=>{if(L&&(x.current=L),R&&(b.current=R),L&&R){if(S.current)return S.current(L,R,P);P()}},[L,R,P,S]);let k=s.useMemo(()=>({reference:x,floating:b,setReference:w,setFloating:C}),[w,C]),D=s.useMemo(()=>({reference:L,floating:R}),[L,R]),O=s.useMemo(()=>{let e={position:n,left:0,top:0};if(!D.floating)return e;let t=roundByDPR(D.floating,_.x),o=roundByDPR(D.floating,_.y);return u?{...e,transform:"translate("+t+"px, "+o+"px)",...getDPR(D.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:t,top:o}},[n,u,D.floating,_.x,_.y]);return s.useMemo(()=>({..._,update:P,refs:k,elements:D,floatingStyles:O}),[_,P,k,D,O])}(e),_=useFloatingTree(),m=function(e){let t=s.useRef(()=>{});return w(()=>{t.current=e}),s.useCallback(function(){for(var e=arguments.length,n=Array(e),o=0;o<e;o++)n[o]=arguments[o];return null==t.current?void 0:t.current(...n)},[])}((e,t)=>{e&&(v.current.openEvent=t),null==o||o(e,t)}),g=s.useRef(null),v=s.useRef({}),y=s.useState(()=>(function(){let e=new Map;return{emit(t,n){var o;null==(o=e.get(t))||o.forEach(e=>e(n))},on(t,n){e.set(t,[...e.get(t)||[],n])},off(t,n){var o;e.set(t,(null==(o=e.get(t))?void 0:o.filter(e=>e!==n))||[])}}})())[0],h=p(),E=s.useCallback(e=>{let t=floating_ui_utils_dom_isElement(e)?{getBoundingClientRect:()=>e.getBoundingClientRect(),contextElement:e}:e;c.refs.setReference(t)},[c.refs]),C=s.useCallback(e=>{(floating_ui_utils_dom_isElement(e)||null===e)&&(g.current=e,r(e)),(floating_ui_utils_dom_isElement(c.refs.reference.current)||null===c.refs.reference.current||null!==e&&!floating_ui_utils_dom_isElement(e))&&c.refs.setReference(e)},[c.refs]),L=s.useMemo(()=>({...c.refs,setReference:C,setPositionReference:E,domReference:g}),[c.refs,C,E]),R=s.useMemo(()=>({...c.elements,domReference:u}),[c.elements,u]),x=s.useMemo(()=>({...c,refs:L,elements:R,dataRef:v,nodeId:i,floatingId:h,events:y,open:n,onOpenChange:m}),[c,i,h,y,n,m,L,R]);return d(()=>{let e=null==_?void 0:_.nodesRef.current.find(e=>e.id===i);e&&(e.context=x)}),s.useMemo(()=>({...c,context:x,refs:L,elements:R}),[c,L,R,x])}function mergeProps(e,t,n){let o=new Map;return{..."floating"===n&&{tabIndex:-1},...e,...t.map(e=>e?e[n]:null).concat(e).reduce((e,t)=>(t&&Object.entries(t).forEach(t=>{let[n,i]=t;if(0===n.indexOf("on")){if(o.has(n)||o.set(n,[]),"function"==typeof i){var l;null==(l=o.get(n))||l.push(i),e[n]=function(){for(var e,t=arguments.length,i=Array(t),l=0;l<t;l++)i[l]=arguments[l];return null==(e=o.get(n))?void 0:e.map(e=>e(...i)).find(e=>void 0!==e)}}}else e[n]=i}),e),{})}}function useInteractions(e){void 0===e&&(e=[]);let t=e,n=s.useCallback(t=>mergeProps(t,e,"reference"),t),o=s.useCallback(t=>mergeProps(t,e,"floating"),t),i=s.useCallback(t=>mergeProps(t,e,"item"),e.map(e=>null==e?void 0:e.item));return s.useMemo(()=>({getReferenceProps:n,getFloatingProps:o,getItemProps:i}),[n,o,i])}}}]);