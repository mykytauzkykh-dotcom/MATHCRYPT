const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1300,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>{errs.push('DIALOG '+d.message());d.dismiss()});
await p.goto('file://'+require('path').resolve(__dirname,'../site/index.html')+'');await p.waitForTimeout(800);
const bad=await p.evaluate(()=>{window.__dl={};M5.dl=(n,t)=>{window.__dl[n]=String(t)};return 0});
const PL=['"><img src=x onerror=window.__x=1>','<svg onload=window.__x=1>','</script><script>window.__x=1</script>','\'-window.__x=1-\''];
const chk=async(label)=>{await p.waitForTimeout(250);const r=await p.evaluate(()=>({x:window.__x||0,att:document.querySelectorAll('[onerror],[onload],script:not([src])').length}));return label+': x='+r.x+' dom-handlers='+r.att};
const base=await p.evaluate(()=>document.querySelectorAll('[onerror],[onload],script:not([src])').length);console.log('baseline scripts/handlers',base);
await p.evaluate(P=>{const t=P.join(' ');M5.arch.add({type:t,title:t,params:{a:t},results:{b:t}});M5.pub.save(Object.assign(M5.pub.empty(),{meta:Object.fromEntries(['title','annotation','abstract','keywords','relevance','aims','object','subject','novelty','methodology','practical','results','author','supervisor','org','doi','zenodo','github','orcid'].map(k=>[k,t])),refs:[{type:'article',authors:t,title:t,journal:t,year:t,doi:t,url:t}]}));localStorage.setItem('mc6_def',JSON.stringify({text:{relevance:t,aim:t,tasks:t,novelty:t,concl:t},notes:{aim:t,results:t}}));localStorage.setItem('mc6_stats',JSON.stringify({exp:t,calc:t,reports:t,tabs:{},recent:[{id:t,t:t}],fav:[t,'dio']}))},PL);
await p.evaluate(()=>M5.nb.add({title:'<img src=x onerror=window.__x=1>',text:'<svg onload=window.__x=1>',tags:'"><img src=x onerror=window.__x=1>'}));
await p.reload();await p.waitForTimeout(1000);await p.evaluate(()=>{window.__dl={};M5.dl=(n,t)=>{window.__dl[n]=String(t)}});console.log(await chk('after reload with hostile storage'));
const tabs=await p.$$eval('#tabs button[data-t]',e=>e.map(x=>x.dataset.t));
for(const t of tabs){await p.evaluate(t=>M5.openTab(t),t);await p.waitForTimeout(150)}console.log(await chk('all '+tabs.length+' tabs opened'));
await p.evaluate(()=>M5.openTab('dash'));console.log(await chk('dashboard'));
await p.evaluate(()=>M5.openTab('pub'));console.log(await chk('publications'));
await p.evaluate(()=>M5.openTab('archive'));console.log(await chk('archive'));
await p.evaluate(()=>M5.openTab('nb'));await p.waitForTimeout(600);console.log(await chk('notebook'));
await p.click('#defbtn');for(let i=0;i<8;i++){await p.keyboard.press('ArrowRight')}console.log(await chk('defense 2.0 slides'));
const ex=await p.evaluate(()=>M5.def2.exportHtml());console.log('defense export has raw <img/<svg:',/<img src=x|<svg onload/.test(ex));await p.keyboard.press('Escape');
// pub exports
const ex2=await p.evaluate(()=>[M5.pub.bibtex(M5.pub.load()),M5.pub.ris(M5.pub.load()),M5.pub.json(M5.pub.load())].join('\n').length);console.log('pub exports ok',ex2>0);
// report html export
await p.evaluate(()=>M5.openTab('sci'));await p.selectOption('#srsel','F');await p.fill('[data-sf=title]','<img src=x onerror=window.__x=1>');await p.fill('[data-sf=author]','<svg onload=window.__x=1>');await p.click('#srrun');await p.waitForFunction(()=>document.querySelector('.sheet'),null,{timeout:60000});await p.click('#srhtml').catch(()=>{});await p.waitForTimeout(500);console.log(await chk('report preview'));
const h=await p.evaluate(()=>Object.entries(window.__dl).map(([k,v])=>[k,/<img src=x|<svg onload/.test(v)]));console.log('report/html exports raw payload:',JSON.stringify(h));
// terminal & dio inputs
await p.evaluate(()=>M5.openTab('terminal'));await p.fill('#tin','<img src=x onerror=window.__x=1>').catch(()=>{});await p.keyboard.press('Enter');console.log(await chk('terminal'));
// backup restore hostile
await p.evaluate(()=>M5.openTab('data'));console.log(await chk('data tab'));
console.log('errs',errs);await b.close()})();
