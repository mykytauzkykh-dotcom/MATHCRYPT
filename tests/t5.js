const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1400,height:900},reducedMotion:'reduce'});const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/three|jsdelivr|fonts\.g|ERR_|Failed to load resource/.test(m.text()))errs.push('CONSOLE '+m.text())});
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
console.log('tabs',await p.evaluate(()=>document.querySelectorAll('#tabs button[data-t]').length),'counter',await p.evaluate(()=>document.querySelector('.counter').textContent));
const r=await p.evaluate(()=>M5.runTests());const bad=r.filter(x=>!x.ok);console.log('tests',r.length-bad.length+'/'+r.length);bad.forEach(x=>console.log('FAIL',x.n,'|',x.a,'|',x.b));
console.log('ERRS',errs);await b.close()})();
