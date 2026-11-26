const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext()).newPage();await p.goto('file://'+require('path').resolve(__dirname,'../site/index.html')+'');await p.waitForTimeout(1200);
const r=await p.evaluate(()=>M5.runTests());console.log(JSON.stringify({browser:'Chromium '+b.version(),date:new Date().toISOString(),v:await p.evaluate(()=>M5.ver),r:r.map(x=>[x.n,x.ok,+x.ms.toFixed(1)])}));await b.close()})();
