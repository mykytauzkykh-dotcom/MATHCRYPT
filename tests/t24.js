const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
const mk=async(vp,u)=>{const ctx=await b.newContext({viewport:vp,reducedMotion:'reduce',acceptDownloads:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/three|jsdelivr|fonts\.g|ERR_|Failed to load resource/.test(m.text()))errs.push('CE '+m.text())});await p.goto(u);await p.waitForTimeout(1200);return[ctx,p]};
let [c1,p]=await mk({width:1400,height:900},'file://'+process.argv[2]);
console.log('start tab',await p.evaluate(()=>document.querySelector('main section.on')?.id));
console.log('kpis',await p.$$eval('#dkpi .kpi',e=>e.map(x=>x.textContent)));
// graph
await p.evaluate(()=>M5.openTab('graph'));await p.waitForTimeout(300);
await p.click('#gsvg .gn[data-id=rsa]');console.log('info',(await p.textContent('#ginfo h3')));
await p.fill('#gsr','евк');console.log('hl',await p.evaluate(()=>M5.graph.search('евк')));
await p.selectOption('#gpa','euclid');await p.selectOption('#gpb','rsa');await p.click('#gpg');console.log('path',await p.textContent('#ginfo p'));
await p.click('#gzi');await p.focus('#gsvg');await p.keyboard.press('ArrowLeft');await p.click('#gzr');
await p.click('#gsvg .gn[data-id=cf]');await p.click('#gtool');console.log('opened',await p.evaluate(()=>document.querySelector('main section.on')?.id));
// dash counters
await p.evaluate(()=>M5.openTab('dash'));await p.waitForTimeout(300);
console.log('recent',await p.$$eval('#drec li',e=>e.length));await p.click('#dtools [data-f=pell]');console.log('fav',await p.$$eval('#dfav button',e=>e.map(x=>x.textContent)));
await p.fill('#dsr','pell');console.log('search tools',await p.$$eval('#dtools [data-o]',e=>e.length));
// defense 2.0
await p.click('#defbtn');await p.waitForTimeout(300);console.log('def title',await p.textContent('#d2title'));
await p.keyboard.press('ArrowRight');await p.keyboard.press('ArrowRight');await p.keyboard.press('ArrowRight');console.log('slide',await p.textContent('#d2n'));
await p.click('#d2go');console.log('dio demo',(await p.textContent('#d2o')).split('\n')[0]);await p.click('#d2sm');console.log('smith',(await p.textContent('#d2so')).split('\n')[0]);
await p.keyboard.press('ArrowRight');await p.click('#d2rs');console.log('rsa',(await p.textContent('#d2ro')).split('\n').pop());await p.click('#d2ll');console.log('lll',(await p.textContent('#d2lo')).split('\n').slice(-1)[0]);
await p.keyboard.press('ArrowRight');await p.click('#d2exp');await p.waitForTimeout(2500);console.log('exp',(await p.textContent('#d2ro2')).split('\n').slice(-1)[0]);
await p.keyboard.press('t');await p.waitForTimeout(1200);console.log('timer',await p.textContent('#d2t'));await p.keyboard.press('t');
await p.keyboard.press('n');await p.fill('#d2notes','моя нотатка');await p.keyboard.press('ArrowLeft').catch(()=>{});
console.log('notes saved',await p.evaluate(()=>JSON.parse(localStorage.mc6_def).notes.results));
const [dl]=await Promise.all([p.waitForEvent('download'),p.click('#d2ex')]);console.log('download',dl.suggestedFilename());
await p.click('#d2old');console.log('classic opened',await p.evaluate(()=>!!document.querySelector('#def.on')));await p.keyboard.press('Escape');
console.log('stats',await p.evaluate(()=>JSON.stringify(M5.stat3.main.get()).slice(0,200)));
await c1.close();
// mobile
let [c2,m]=await mk({width:390,height:800},'file://'+process.argv[2]);
for(const t of['dash','graph']){await m.evaluate(t=>M5.openTab(t),t);await m.waitForTimeout(300);console.log('mobile',t,'overflow',await m.evaluate(()=>document.documentElement.scrollWidth-innerWidth))}
await c2.close();
// PWA over http
let [c3,h]=await mk({width:1200,height:800},'http://localhost:8765/index.html');
await h.waitForTimeout(1500);console.log('pwa status',await h.evaluate(()=>M5.pwa.status));
await h.evaluate(async()=>{await navigator.serviceWorker.ready});await h.reload();await h.waitForTimeout(800);
console.log('controlled',await h.evaluate(()=>!!navigator.serviceWorker.controller));
await c3.setOffline(true);await h.reload();await h.waitForTimeout(1500);
console.log('offline title',await h.title());console.log('offline calc',await h.evaluate(()=>{M5.openTab('dio');return String(M5.dioMat.solveSystem([[6n,10n]],[14n]).ok)}));
console.log('offline tests',await h.evaluate(async()=>{const r=await M5.runTests();return r.filter(x=>x.ok).length+'/'+r.length}));
console.log('manifest',await h.evaluate(async()=>{const r=await fetch('manifest.webmanifest');return (await r.json()).name}));
await c3.close();console.log('ERRS',errs);await b.close()})();
