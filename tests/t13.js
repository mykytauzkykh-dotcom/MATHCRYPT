const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:800},reducedMotion:'reduce'})).newPage();await p.goto('file://'+require('path').resolve(__dirname,'../site/index.html')+'');await p.waitForTimeout(1000);
for(const t of ['stat','cx','proofs','viz','exp']){await p.evaluate(t=>M5.openTab(t),t);await p.waitForTimeout(300);
console.log(t,await p.evaluate(()=>{const W=innerWidth,o=[];document.querySelectorAll('main section.on *').forEach(e=>{const r=e.getBoundingClientRect();if(r.width>0&&r.right>W+1){let a=e,anc=false;while(a=a.parentElement){if(a.closest&&(getComputedStyle(a).overflowX==='auto'||getComputedStyle(a).overflowX==='scroll')&&a.tagName!=='MAIN'&&a.id!=='')anc=true}if(!anc)o.push(e.tagName+'#'+e.id+'.'+e.className+' '+Math.round(r.right))}});return o.slice(0,6).join(' ; ')}))}
await b.close()})();
