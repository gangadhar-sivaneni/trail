"use strict";const getCurrentScript=()=>{if(typeof document=="undefined")return console.error("document is not defined"),null;const{currentScript:e}=document;if(e instanceof HTMLScriptElement)return e;const t=document.getElementsByTagName("script");return t.length?t[t.length-1]:null},getEnvironment=e=>{if(e==="production"||e==="development"||e==="staging")return e},scriptEl=getCurrentScript(),DEFAULT_WIDGET_ASSET_BASE=(()=>{var e;return!((e=scriptEl==null?void 0:scriptEl.src)===null||e===void 0)&&e.includes("@dev"),"https://cdn.jsdelivr.net/npm/@eka-care/medassist-widget@0.1.118/dist/"})();var FeedbackTypeEnum;(function(e){e.DEFAULT="default",e.NPS="nps"})(FeedbackTypeEnum||(FeedbackTypeEnum={}));function mapAgentConfigThemeToWidgetTheme(e){if(!e)return;const t=e.mode==="dark"?"white":e.mode==="light"?"black":void 0;return{...e.background_img&&{backgroundImage:e.background_img},...e.accent&&{primary:e.accent},...t&&{textColor:t},...e.mode&&{mode:e.mode},...e.header_tinted!==void 0&&{headerTinted:e.header_tinted},...e.title_img&&{titleImg:e.title_img},...e.tagline&&{tagline:e.tagline},...e.hide_watermark&&{hideWatermark:e.hide_watermark},...e.explicit_disclaimer&&{explicitDisclaimer:e.explicit_disclaimer}}}function preloadImage(e){if(!(!e||typeof document=="undefined"))try{const t=document.createElement("link");t.rel="preload",t.as="image",t.href=e,document.head.appendChild(t)}catch{const t=new Image;t.src=e}}async function fetchAgentConfig(e,t){const n=`${e.replace(/\/$/,"")}/med-assist/agent-config/${t}`,i=await fetch(n,{headers:{"ngrok-skip-browser-warning":"69420"}});if(!i.ok)return;const o=await i.json();if(o!=null&&o.success&&(o!=null&&o.data))return o.data}const NUDGE_STORAGE_KEY="eka-medassist-nudges",AGENT_CONFIG_CACHE_KEY="eka-medassist-agent-config";function readAgentConfigCache(e){try{const t=localStorage.getItem(AGENT_CONFIG_CACHE_KEY);return(t?JSON.parse(t):{})[e]}catch{return}}function writeAgentConfigCache(e,t){try{const n=localStorage.getItem(AGENT_CONFIG_CACHE_KEY),i=n?JSON.parse(n):{};i[e]={...i[e]||{},...t},localStorage.setItem(AGENT_CONFIG_CACHE_KEY,JSON.stringify(i))}catch{}}function getNudgeStore(){try{const e=localStorage.getItem(NUDGE_STORAGE_KEY);return e?JSON.parse(e):{}}catch{return{}}}function setNudgeStore(e){try{localStorage.setItem(NUDGE_STORAGE_KEY,JSON.stringify(e))}catch{}}function normalizePath(e){let t=e.replace(/\/+$/,"");return t.startsWith("/")||(t="/"+t),t||"/"}function getNudgePathCandidates(e){const t=e.split("/").filter(Boolean),n=[];for(let i=t.length;i>=0;i--)n.push(i===0?"/":"/"+t.slice(0,i).join("/"));return n}function findCachedNudgeForCandidates(e,t,n){const o=getNudgeStore()[e];if(!o)return null;const s=t.host,r=o[s];if(!r)return null;for(const d of n){if(r[d]!==void 0)return{domain:s,path:d,data:r[d]};const a=d==="/"?"/*":d+"/*";if(r[a]!==void 0)return{domain:s,path:a,data:r[a]}}return null}function findFreshCachedNudge(e,t,n){const i=findCachedNudgeForCandidates(e,t,n);if(!i)return null;const o=Math.floor(Date.now()/1e3);return i.data.expiry<=o?(clearNudgeForPath(e,i.domain,i.path),null):i}function clearNudgeForPath(e,t,n){const i=getNudgeStore(),o=i[e];!o||!o[t]||(delete o[t][n],setNudgeStore(i))}function storeNudgeResponse(e,t){var n,i,o,s;const r=(n=t==null?void 0:t.url_pattern)===null||n===void 0?void 0:n.domain,d=(i=t==null?void 0:t.url_pattern)===null||i===void 0?void 0:i.path;if(!(!((o=t.nudges)===null||o===void 0)&&o.length)||!t.expiry||!r||!d)return;const a=getNudgeStore();a[e]||(a[e]={}),a[e][r]||(a[e][r]={}),a[e][r][d]={nudges:t.nudges,expiry:t.expiry,delay:(s=t.delay)!==null&&s!==void 0?s:5},setNudgeStore(a)}const NUDGE_COOKIE_PREFIX="eka-nudge";function setNudgeCookie(e,t){const n=new Date(Date.now()+864e5).toUTCString();document.cookie=`${NUDGE_COOKIE_PREFIX}-${e}=${t}; expires=${n}; path=/; SameSite=Lax`}function getNudgeCookie(e){const t=document.cookie.split(";").map(i=>i.trim()).find(i=>i.startsWith(`${NUDGE_COOKIE_PREFIX}-${e}=`));if(!t)return null;const n=t.split("=")[1];return n==="open"||n==="closed"?n:null}async function fetchNudgeData(e,t){const n=`${t}/med-assist/user-nudge`,i=[];typeof document!="undefined"&&document.querySelectorAll("meta").forEach(o=>{var s,r,d;const a=(s=o.getAttribute("name"))!==null&&s!==void 0?s:void 0,g=(r=o.getAttribute("property"))!==null&&r!==void 0?r:void 0,c=(d=o.getAttribute("content"))!==null&&d!==void 0?d:void 0;(a||g)&&i.push({name:a,property:g,content:c})});try{const o=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json","x-agent-id":e,referer:typeof window!="undefined"?window.location.href:""},body:JSON.stringify({meta_tags:i,url:typeof window!="undefined"?window.location.href:""})});return o.ok?await o.json():void 0}catch{return}}const globalMedAssistConfig={},getWidgetElement=()=>typeof document=="undefined"?null:document.querySelector("eka-medassist-widget");if(typeof window!="undefined"){const e=window;e.__ekaMedAssistConfig__=globalMedAssistConfig,e.EkaMedAssist={init(t){var n,i,o;Object.assign(globalMedAssistConfig,t);const s=getWidgetElement();if(s){if(t.agentId&&s.setAttribute("agent-id",t.agentId),t.authToken&&s.setAttribute("auth-token",t.authToken),t.title&&s.setAttribute("title",t.title),t.iconUrl&&s.setAttribute("icon-url",t.iconUrl),t.baseUrl&&s.setAttribute("base-url",t.baseUrl),t.resize!==void 0&&s.setAttribute("resize",String(t.resize)),(t.displayMode==="full"||t.displayMode==="widget")&&s.setAttribute("display-mode",t.displayMode),t.context)try{s.setAttribute("context",JSON.stringify(t.context))}catch{console.warn("Failed to stringify context passed to init")}typeof t.customLauncherStyles=="string"&&s.setAttribute("custom-launcher-styles",t.customLauncherStyles),t.redirectUrl&&s.setAttribute("redirect-url",t.redirectUrl),!((n=t.theme)===null||n===void 0)&&n.backgroundImage&&preloadImage(t.theme.backgroundImage),(o=(i=s).openFromBridge)===null||o===void 0||o.call(i)}}}}const scriptBaseUrl=(()=>{if(!scriptEl)return"";try{return new URL(".",scriptEl.src||window.location.href).href}catch{return""}})(),widgetAssetBaseUrl=(()=>{if(!scriptEl)return DEFAULT_WIDGET_ASSET_BASE;const e=scriptEl.dataset.widgetAssets;if(e==="local")return`${scriptBaseUrl}src/`;if(e&&e.length>0)try{return new URL(e,scriptBaseUrl).href}catch{return e.endsWith("/")?e:`${e}/`}return DEFAULT_WIDGET_ASSET_BASE})(),WIDGET_JS_URL=`${widgetAssetBaseUrl}medassist-widget.js`,WIDGET_CSS_URL=`${widgetAssetBaseUrl}medassist-widget.css`;let widgetModulePromise=null,widgetCssTextPromise=null;function getWidgetCssTextPromise(){return widgetCssTextPromise||(widgetCssTextPromise=fetch(WIDGET_CSS_URL).then(e=>{if(!e.ok)throw new Error(`Unable to fetch widget styles from ${WIDGET_CSS_URL}`);return e.text()})),widgetCssTextPromise}class MedAssistWidgetLoader extends HTMLElement{getAgentConfig(){if(!this.agentConfigPromise){const t=(typeof window!="undefined"?window.__ekaMedAssistConfig__:void 0)||{},n=t.baseUrl||this.getAttribute("base-url")||"https://matrix.eka.care/reloaded",i=t.agentId||this.getAttribute("agent-id")||"";if(!i)return Promise.resolve(void 0);this.agentConfigPromise=fetchAgentConfig(n,i).catch(()=>{})}return this.agentConfigPromise}constructor(){super(),this.reactRoot=null,this.agentConfigPromise=null,this.authPrefetchStarted=!1,this.attachShadow({mode:"open"}),this.defaultIconUrl="https://cdn.eka.care/bot-icon.svg",this.widgetLoaded=!1,this.displayMode=this.getAttribute("display-mode")==="full"?"full":"widget",this.setupAuthExpirationListener()}static get observedAttributes(){return["icon-url","display-mode","custom-launcher-styles","redirect-url"]}connectedCallback(){this.displayMode==="full"?(this.initializeFullMode(),this.loadAndRender().catch(t=>{console.error("Failed to load MedAssist widget in full mode",t)})):(this.renderButton(),this.scheduleIdle(()=>{this.preloadWidgetAssets(),this.prefetchAuthTokens(),this.initNudge()}))}scheduleIdle(t){if(typeof window=="undefined"){t();return}const n=window.requestIdleCallback;typeof n=="function"?n(t,{timeout:3e3}):setTimeout(t,200)}attributeChangedCallback(t){if(t==="icon-url"&&this.displayMode==="widget"&&this.renderButton(),t==="display-mode"){const n=this.getAttribute("display-mode")==="full"?"full":"widget";n!==this.displayMode&&(this.displayMode=n,n==="full"?this.initializeFullMode():this.renderButton())}t==="custom-launcher-styles"&&this.applyCustomLauncherStyles()}preloadWidgetAssets(){getWidgetCssTextPromise(),this.loadWidgetModule(),this.preloadBackgroundImage()}prefetchAuthTokens(){var t;if(this.authPrefetchStarted)return;const n=(typeof window!="undefined"?window.__ekaMedAssistConfig__:void 0)||{},i=n.agentId||this.getAttribute("agent-id")||"";if(!i)return;this.authPrefetchStarted=!0;const o=n.authToken||this.getAttribute("auth-token")||void 0,s=n.baseUrl||this.getAttribute("base-url")||"https://matrix.eka.care/reloaded",r=(t=getEnvironment(this.getAttribute("environment")))!==null&&t!==void 0?t:"production";this.loadWidgetModule().then(d=>{var a;return(a=d.prefetchAuth)===null||a===void 0?void 0:a.call(d,{agentId:i,authToken:o,serverUrl:s,environment:r})}).catch(()=>{this.authPrefetchStarted=!1})}preloadBackgroundImage(){var t;const n=typeof window!="undefined"?window.__ekaMedAssistConfig__:void 0,i=this.getAttribute("theme")?(()=>{try{return JSON.parse(this.getAttribute("theme")||"{}")}catch{return}})():void 0,o=(t=n==null?void 0:n.theme)===null||t===void 0?void 0:t.backgroundImage,s=i==null?void 0:i.backgroundImage;o&&preloadImage(o),s&&s!==o&&preloadImage(s),this.getAgentConfig().then(r=>{var d;const a=(d=r==null?void 0:r.theme)===null||d===void 0?void 0:d.background_img;a&&preloadImage(a)}).catch(()=>{})}setupAuthExpirationListener(){if(typeof window=="undefined")return;const t=n=>{var i;((i=n.data)===null||i===void 0?void 0:i.type)==="AUTH_EXPIRED"&&window.parent!==window&&window.parent.postMessage({type:"AUTH_EXPIRED",message:"Authentication expired"},"*")};window.addEventListener("message",t)}openFromBridge(){this.displayMode=this.getAttribute("display-mode")==="full"?"full":"widget",this.displayMode==="full"?this.initializeFullMode():this.renderButton(),this.loadAndRender().catch(t=>{console.error("Failed to open MedAssist widget from bridge",t)})}async initNudge(){var t,n,i,o;const s=typeof window!="undefined"?window.__ekaMedAssistConfig__:void 0,r=(s==null?void 0:s.agentId)||this.getAttribute("agent-id")||"";if(!r)return;const d=await this.getAgentConfig();if(!(d!=null&&d.nudge))return;const a=(n=(t=d==null?void 0:d.theme)===null||t===void 0?void 0:t.nudge_color)!==null&&n!==void 0?n:"#ffffff",g=typeof window!="undefined"?window.location.href:"";let c;try{c=new URL(g)}catch{return}const f=getNudgePathCandidates(c.pathname),m=f.slice(0,1),v=f.slice(1);let h=findFreshCachedNudge(r,c,m);if(!h){const b=(s==null?void 0:s.baseUrl)||this.getAttribute("base-url")||"https://matrix.eka.care/reloaded",u=await fetchNudgeData(r,b).catch(()=>{});!((i=u==null?void 0:u.nudges)===null||i===void 0)&&i.length&&(storeNudgeResponse(r,u),h=findFreshCachedNudge(r,c,f))}if(h||(h=findFreshCachedNudge(r,c,v)),!h)return;const x=h.data.nudges[Math.floor(Math.random()*h.data.nudges.length)],w=(o=h.data.delay)!==null&&o!==void 0?o:5;setTimeout(()=>{this.showNudgePopup(x,a)},w*1e3)}showNudgePopup(t,n){var i,o;const s=this.shadowRoot;if(!s||!(!((i=s.getElementById("medassist-widget-root"))===null||i===void 0)&&i.classList.contains("hidden")))return;const d=((typeof window!="undefined"?window.__ekaMedAssistConfig__:void 0)||{}).agentId||this.getAttribute("agent-id")||"";if(d&&getNudgeCookie(d)!==null||s.getElementById("medassist-nudge-popup"))return;const g=s.getElementById("medassist-open-btn"),c=g==null?void 0:g.getBoundingClientRect(),f=272,m=12,v=8,h=16,x=16;let w=window.innerWidth-f-m,b=76,u=f-h-v*2;if(c&&c.width>0){const A=c.left+c.width/2,p=A-f/2,_=window.innerWidth-f-m;w=Math.max(m,Math.min(p,_)),b=window.innerHeight-c.top+x,u=Math.max(h,Math.min(A-w-v,f-h-v*2))}const y=document.createElement("div");y.id="medassist-nudge-popup",y.innerHTML=`
      <style>
        @keyframes nudge-slide-up {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        #medassist-nudge-popup {
          position: fixed;
          bottom: ${b}px;
          left: ${w}px;
          width: ${f}px;
          background: ${n};
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08);
          padding: 16px 16px 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 200001;
          animation: nudge-slide-up 0.28s cubic-bezier(0.34,1.56,0.64,1);
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
        }
        /* Speech bubble tail pointing down toward the FAB */
        #medassist-nudge-popup::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: ${u}px;
          width: 16px;
          height: 10px;
          background: ${n};
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
        #medassist-nudge-popup {
          cursor: pointer;
        }
        #medassist-nudge-popup:hover {
          box-shadow: 0 10px 36px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1);
        }
        #medassist-nudge-popup .nudge-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        #medassist-nudge-popup .nudge-text {
          font-size: 13.5px;
          line-height: 1.5;
          color: #1a1a1a;
          margin: 0;
          flex: 1;
          font-weight: 400;
          letter-spacing: -0.01em;
        }
        #medassist-nudge-popup .nudge-close {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.06);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 13px;
          line-height: 1;
          color: #555;
          padding: 0;
          margin-top: -1px;
          transition: background 0.15s;
        }
        #medassist-nudge-popup .nudge-close:hover {
          background: rgba(0,0,0,0.18);
        }
      </style>
      <div class="nudge-header">
        <p class="nudge-text">${t.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</p>
        <button class="nudge-close" aria-label="Dismiss">&#x2715;</button>
      </div>
    `,(o=y.querySelector(".nudge-close"))===null||o===void 0||o.addEventListener("click",A=>{A.stopPropagation(),d&&setNudgeCookie(d,"closed"),this.dismissNudgePopup()}),y.addEventListener("click",()=>{d&&setNudgeCookie(d,"closed"),this.dismissNudgePopup(),this.loadAndRender()}),s.appendChild(y)}dismissNudgePopup(){var t;const n=(t=this.shadowRoot)===null||t===void 0?void 0:t.getElementById("medassist-nudge-popup");n==null||n.remove()}applyCustomLauncherStyles(){var t;const n=this.shadowRoot;if(!n||this.displayMode!=="widget")return;const i=n.querySelector('style[data-medassist-custom-launcher="true"]'),o=(t=this.getAttribute("custom-launcher-styles"))!==null&&t!==void 0?t:"";if(!o){i==null||i.remove();return}if(i){i.textContent=o;return}const s=document.createElement("style");s.setAttribute("data-medassist-custom-launcher","true"),s.textContent=o,n.appendChild(s)}renderButton(){var t;const n=this.getAttribute("icon-url")||this.defaultIconUrl,i=this.shadowRoot;if(!i){console.error("Shadow root was not created");return}if(!i.querySelector("button"))i.innerHTML=`
        <style>
          #medassist-open-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            background-color:rgb(255, 255, 255);
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          }
          #medassist-open-btn img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
          }
          :host {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 200000;
          }
          #medassist-open-btn:hover {
            background-color:rgb(239, 237, 245);
          }
          .hidden {
            display: none !important;
          }
          #medassist-open-btn.hidden {
            display: none !important;
          }
        </style>

        <button id="medassist-open-btn">
          <img src="${n}" alt="MedAssist Icon">
        </button>
        <div id="medassist-widget-root" class="hidden"></div>
      `,(t=i.getElementById("medassist-open-btn"))===null||t===void 0||t.addEventListener("click",()=>{const s=((typeof window!="undefined"?window.__ekaMedAssistConfig__:void 0)||{}).agentId||this.getAttribute("agent-id")||"";s&&setNudgeCookie(s,"closed"),this.dismissNudgePopup(),this.loadAndRender()});else{const o=i.querySelector("#medassist-open-btn img");o&&(o.src=n)}this.applyCustomLauncherStyles()}initializeFullMode(){const t=this.shadowRoot;if(!t){console.error("Shadow root is not available");return}t.getElementById("medassist-widget-root")||(t.innerHTML=`
        <style>
         :host {
         display: block;
         width: 100%;
         height: 100%;
         position: fixed;
         top: 0;
         left: 0;
         z-index: 200000;
         }
           #medassist-widget-root {
            width: 100%;
            height: 100%;
          }
        </style>
        <div id="medassist-widget-root"></div>
      `)}async loadAndRender(){var t,n;const i=this.shadowRoot;if(!i){console.error("Shadow root is not available");return}this.prefetchAuthTokens(),this.style.display="";const o=i.getElementById("medassist-open-btn"),s=i.getElementById("medassist-widget-root"),r=this.getAttribute("agent-id");let d=this.getAttribute("icon-url")||this.defaultIconUrl;const a=(t=getEnvironment(this.getAttribute("environment")))!==null&&t!==void 0?t:"production",g=this.getAttribute("connectivity"),c=g==="http_stream"||g==="socket"?g:void 0;let f=this.getAttribute("title")||"Medi Clinic";const m=this.getAttribute("base-url")||"https://matrix.eka.care/reloaded",h=this.getAttribute("display-mode")==="full"?"full":"widget",x=this.getAttribute("context")?JSON.parse(this.getAttribute("context")||"{}"):void 0,w=this.getAttribute("theme")?(()=>{try{return JSON.parse(this.getAttribute("theme")||"{}")}catch{return}})():void 0,b=this.getAttribute("feedback")?(()=>{try{return JSON.parse(this.getAttribute("feedback")||"{}")}catch{return}})():void 0,u=(typeof window!="undefined"?window.__ekaMedAssistConfig__:void 0)||{},y={...x||{},...u.context||{}},A=u.authToken||this.getAttribute("auth-token")||void 0,p=u.agentId||r,_=u.baseUrl||m,k=typeof window!="undefined"?(n=window.EkaMedAssist)===null||n===void 0?void 0:n.onClose:void 0,z=this.getAttribute("redirect-url")||void 0,C=u.redirectUrl||z,F=!!C||u.showCloseButton===!0;if(!p){console.error("Agent ID is required");return}if(!s){console.error("Widget root element is missing");return}o&&o.classList.add("hidden"),s.classList.remove("hidden");let U,L,N,R=!1,P,B=!1,M;const T=l=>{var S,E,I;f=l.name||f,d=((S=l.theme)===null||S===void 0?void 0:S.icon_img)||d,U=mapAgentConfigThemeToWidgetTheme(l.theme||void 0),L=l.allowed,N=l.connectivity,R=l.resize||(u==null?void 0:u.resize)||!1,P=l.initial_message,B=(I=(E=l.theme)===null||E===void 0?void 0:E.hide_watermark)!==null&&I!==void 0?I:!1,M=l.feedback},W=readAgentConfigCache(p);if(W)T(W),this.getAgentConfig().then(l=>{l&&writeAgentConfigCache(p,l)}).catch(()=>{});else try{const l=await this.getAgentConfig();l&&(writeAgentConfigCache(p,l),T(l))}catch{}const O=c||N||"socket",$={title:u.title||f,iconUrl:d||u.iconUrl,showCloseButton:F,allowed:L,environment:a,connectionType:O,onClose:()=>{var l;if((l=this.reactRoot)===null||l===void 0||l.unmount(),this.reactRoot=null,k&&typeof k=="function"&&k(),C){window.location.href=C;return}h==="full"?this.style.display="none":(o&&o.classList.remove("hidden"),s.classList.add("hidden"))},baseUrl:_,context:y,displayMode:h,resize:R||this.getAttribute("resize")==="true",authToken:A,initialMessage:P,hideWatermark:B,...(b||M)&&{feedback:b||M},theme:{...U||{},...w||{},...u.theme||{}}},D=window;if(this.widgetLoaded){this.reactRoot=D.renderMedAssist(s,p,$);return}try{const[,l]=await Promise.all([this.loadWidgetCss(),this.loadWidgetModule()]);this.reactRoot=l.renderMedAssist(s,p,$),this.widgetLoaded=!0}catch(l){console.error("Failed to load MedAssist widget",l),o&&o.classList.remove("hidden"),s.classList.add("hidden")}}async loadWidgetCss(){const t=this.shadowRoot;if(!t)throw new Error("Shadow root is not available");if(t.querySelector("[data-medassist-style='true']"))return;const n=await getWidgetCssTextPromise(),i=document.createElement("style");i.setAttribute("data-medassist-style","true"),i.textContent=n,t.appendChild(i)}loadWidgetModule(){return widgetModulePromise||(widgetModulePromise=import(WIDGET_JS_URL)),widgetModulePromise}}customElements.define("eka-medassist-widget",MedAssistWidgetLoader);
