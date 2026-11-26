const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../site/index.html')+'');await p.waitForTimeout(800);await p.evaluate(()=>M5.openTab('sci'));
const out={};
for(const full of [false,true]){
await p.selectOption('#srsel','E');await p.waitForTimeout(100);await p.evaluate(()=>{0});
await p.evaluate(f=>{document.querySelector('#srfull').checked=f},full);
await p.fill('[data-sf=author]','Тест Автор');await p.click('#srrun');await p.waitForFunction(()=>M5.sr&&document.querySelector('.sheet'),null,{timeout:60000});await p.waitForTimeout(800);
const info=await p.evaluate(()=>{const sh=[...document.querySelectorAll('.srpv .sheet')];return{pages:sh.length,clipped:sh.filter(s=>{const i=s.querySelector('.sheet-in');return i.scrollHeight>i.clientHeight+1}).length}});
console.log('full',full,JSON.stringify(info));
await p.evaluate(()=>{const m=document.querySelector('#srprint');if(m)m.remove();const h=document.createElement('div');h.id='srprint';h.innerHTML=[...document.querySelectorAll('.srpv .sheet')].map(s=>s.outerHTML).join('');document.body.appendChild(h);document.body.classList.add('sr-printing')});
await p.emulateMedia({media:'print'});await p.pdf({path:'rep_'+(full?'full':'short')+'.pdf',preferCSSPageSize:true,printBackground:true});await p.emulateMedia({media:'screen'});
await p.evaluate(()=>{document.body.classList.remove('sr-printing');document.querySelector('#srprint').remove()});}
console.log('errs',errs);await b.close()})();
