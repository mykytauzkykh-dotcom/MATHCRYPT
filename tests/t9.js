const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+require('path').resolve(__dirname,'../site/index.html')+'');await p.waitForTimeout(800);
console.log(await p.evaluate(()=>{const m={};document.querySelectorAll('[id]').forEach(e=>m[e.id]=(m[e.id]||0)+1);return JSON.stringify(Object.entries(m).filter(([k,v])=>v>1))}));await b.close()})();
