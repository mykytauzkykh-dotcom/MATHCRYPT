const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const ctx=await b.newContext({acceptDownloads:true,viewport:{width:1300,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ERR_|Failed to load/.test(m.text()))errs.push(m.text())});
await p.goto('file://'+require('path').resolve(__dirname,'../site/index.html')+'');await p.waitForTimeout(800);await p.evaluate(()=>M5.openTab('repro'));
await p.selectOption('#rpsel','E');await p.click('#rprun');await p.waitForFunction(()=>!document.querySelector('#rpzip').disabled,null,{timeout:60000});console.log(await p.textContent('#rzerr'));
const [d]=await Promise.all([p.waitForEvent('download'),p.click('#rpzip')]);await d.saveAs('pk.zip');console.log(d.suggestedFilename());
await p.setInputFiles('#rpfile','pk.zip');await p.waitForTimeout(800);console.log(await p.textContent('#rzerr2'));
await p.click('#rpre');await p.waitForFunction(()=>/збігаються|відрізняються/.test(document.querySelector('#rzerr2').textContent),null,{timeout:60000});console.log(await p.textContent('#rzerr2'));
// tampered json
const fs=require('fs');const o=JSON.parse(require('child_process').execSync("unzip -p pk.zip package.json").toString());o.params.Dmax=o.params.Dmax;o.data.rows=o.data.rows.slice(1);fs.writeFileSync('bad.json',JSON.stringify(o));
await p.setInputFiles('#rpfile','bad.json');await p.waitForTimeout(500);console.log('tampered:',await p.textContent('#rzerr2'));
// evil
fs.writeFileSync('evil.json','{"kind":"mathcrypt-repro-package","schema":1,"experiment":"__proto__","params":{},"__proto__":{"x":1}}');await p.setInputFiles('#rpfile','evil.json');await p.waitForTimeout(400);console.log('evil:',await p.textContent('#rzerr2'),'|polluted:',await p.evaluate(()=>({}).x));
console.log('errs',errs);await b.close()})();
