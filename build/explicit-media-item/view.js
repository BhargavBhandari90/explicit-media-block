import*as e from"@wordpress/interactivity";var t={d:(e,o)=>{for(var n in o)t.o(o,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:o[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};const o=(r={getContext:()=>e.getContext,store:()=>e.store},i={},t.d(i,r),i),{state:n}=(0,o.store)("buntywp/explicit-media",{state:{get isMediaLiked(){return(0,o.getContext)().liked},get likeCount(){return(e=(0,o.getContext)().likeCount)<1e3?e.toString():e<1e6?(e/1e3).toFixed(1)+"K":(e/1e6).toFixed(1)+"M";var e}},actions:{toggleLike:()=>{const e=(0,o.getContext)();e.liked=!e.liked,e.likeCount=e.liked?Number(e.likeCount+1):Number(e.likeCount-1),function(e){console.log(e),fetch(n.ajaxUrl,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({action:"save_media_likes",nonce:n.nonce,context:JSON.stringify(e)})}).then((e=>e.json())).then((e=>{console.log("Like saved:",e)})).catch((e=>{console.error("Error saving Like:",e)}))}(e)}},callbacks:{}});var r,i;