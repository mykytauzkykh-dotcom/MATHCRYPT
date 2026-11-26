const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../site/index.html')+'');await p.waitForTimeout(800);
const tabs=await p.$$eval('#tabs button[data-t]',e=>e.map(x=>x.dataset.t));const bad=[];
for(const t of tabs){await p.evaluate(t=>M5.openTab(t),t);await p.waitForTimeout(120);const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>0)bad.push(t+':'+o)}
console.log('tabs',tabs.length,'overflowing:',bad.join(' ')||'none','errs',errs);await b.close()})();
