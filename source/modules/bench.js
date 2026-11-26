/* ===== Algorithm Benchmark (Web Worker) ===== */
(()=>{'use strict';
const M5=window.M5;const{q,qa,T,esc,put,say,html}=M5;
/* ---- ядро вимірювань: працює і у Worker, і в основному потоці. Усі часи — реальні (performance.now()) ---- */
function benchCore(){
 const SP=[2n,3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n],SP2=[41n,43n,47n,53n,59n,61n,67n,71n];
 let IT=0,RES=null;
 function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
 function rbits(r,bits){let x=1n;let i=1;while(i<bits){const k=Math.min(24,bits-i);x=(x<<BigInt(k))|BigInt(Math.floor(r()*(1<<k)));i+=k}return x}
 function mpow(b,e,m){let r=1n;b%=m;while(e>0n){IT++;if(e&1n)r=r*b%m;b=b*b%m;e>>=1n}return r}
 function mpowRef(b,e,m){let r=1n;b%=m;while(e>0n){if(e&1n)r=r*b%m;b=b*b%m;e>>=1n}return r}
 function mpowSeq(b,e,m){let r=1n;b%=m;const n=Number(e);for(let i=0;i<n;i++){r=r*b%m;IT++}return r}
 function mrWith(n,bases){if(n<2n)return false;for(const p of bases){if(n===p)return true;if(n%p===0n)return false}
  let d=n-1n,s=0;while(!(d&1n)){d>>=1n;s++}
  for(const a of bases){let x=mpow(a,d,n);if(x===1n||x===n-1n)continue;let c=false;for(let i=1;i<s;i++){x=x*x%n;IT++;if(x===n-1n){c=true;break}}if(!c)return false}return true}
 function mrRef(n,bases){IT=IT;const s=IT;const v=mrWith(n,bases);IT=s;return v}
 const gEu=(a,b)=>{let n=0;while(b){const t=a%b;a=b;b=t;n++}IT+=n;return a};
 const gEx=(a,b)=>{let or=a,r=b,os=1n,s=0n,n=0;while(r){const d=or/r;[or,r]=[r,or-d*r];[os,s]=[s,os-d*s];n++}IT+=n;return or};
 const gBi=(a,b)=>{if(a===0n)return b;if(b===0n)return a;let sh=0n,n=0;while(((a|b)&1n)===0n){a>>=1n;b>>=1n;sh++;n++}
  while((a&1n)===0n){a>>=1n;n++}
  do{while((b&1n)===0n){b>>=1n;n++}if(a>b){const t=a;a=b;b=t}b-=a;n++}while(b!==0n);IT+=n;return a<<sh};
 const gBr=(a,b)=>{const x=Number(a),y=Number(b);let n=0;for(let d=Math.min(x,y);d>=1;d--){n++;if(x%d===0&&y%d===0){IT+=n;return BigInt(d)}}IT+=n;return 1n};
 const pTr=n=>{const x=Number(n);if(x<2)return false;if(x%2===0)return x===2;let it=0;for(let d=3;d*d<=x;d+=2){it++;if(x%d===0){IT+=it;return false}}IT+=it;return true};
 const pMr=n=>mrWith(n,SP);
 const ALG={
  gcd:{euclid:([a,b])=>gEu(a,b),ext:([a,b])=>gEx(a,b),binary:([a,b])=>gBi(a,b),brute:([a,b])=>gBr(a,b)},
  modpow:{fast:([b,e,m])=>mpow(b,e,m),seq:([b,e,m])=>mpowSeq(b,e,m)},
  prime:{trial:pTr,mr:pMr}};
 const CAP={gcd:{brute:20},modpow:{seq:16},prime:{trial:44}};/* максимальна кількість біт, при якій алгоритм ще виконується за розумний час */
 function nextPrime(r,bits){let c=rbits(r,bits)|1n;let g=0;while(!mrWith(c,SP)){c+=2n;if(++g>200000)break}return c}
 function gen(task,bits,batch,seed){const r=rng((seed^Math.imul(bits,2654435761))>>>0),out=[];
  for(let i=0;i<batch;i++){
   if(task==='gcd'){out.push([rbits(r,bits),rbits(r,bits)])}
   else if(task==='modpow'){const m=rbits(r,bits)|1n;out.push([rbits(r,bits)%m,rbits(r,Math.min(bits,16)),m])}
   else{const h=Math.max(4,bits>>1);out.push(i%2?nextPrime(r,bits):nextPrime(r,h)*nextPrime(r,bits-h+1))}}
  return out}
 function ref(task,inp,bits){if(task==='gcd'){let a=inp[0],b=inp[1];while(b){const t=a%b;a=b;b=t}return a}
  if(task==='modpow')return mpowRef(inp[0],inp[1],inp[2]);
  if(bits<=44){const x=Number(inp);if(x<2)return false;for(let d=2;d*d<=x;d++)if(x%d===0)return false;return true}return mrRef(inp,SP2)}
 function probe(){let best=Infinity,last=performance.now();for(let i=0;i<20000;i++){const t=performance.now();if(t>last){best=Math.min(best,t-last);last=t}}return isFinite(best)?best:0}
 function runCell(cfg,task,algo,bits){
  const cap=(CAP[task]||{})[algo];if(cap&&bits>cap)return{task,algo,bits,skipped:'bits>'+cap};
  const f=ALG[task][algo],inputs=gen(task,bits,cfg.batch,cfg.seed),n=inputs.length;let sink=0;
  for(let w=0;w<cfg.warm;w++)for(let i=0;i<n;i++){const v=f(inputs[i]);sink+=typeof v==='boolean'?+v:1}
  if(RES===null)RES=probe();
  const target=Math.max(4,RES*60);let t0=performance.now();for(let i=0;i<n;i++){const v=f(inputs[i]);sink+=typeof v==='boolean'?+v:1}
  let one=performance.now()-t0;const loops=one>=target?1:Math.min(100000,Math.ceil(target/Math.max(one,1e-4)));
  const samples=[];let iters=0;
  for(let r=0;r<cfg.reps;r++){IT=0;const a0=performance.now();for(let k=0;k<loops;k++)for(let i=0;i<n;i++){const v=f(inputs[i]);sink+=typeof v==='boolean'?+v:1}const a1=performance.now();samples.push((a1-a0)/(n*loops));iters=IT/(n*loops)}
  let bad=0;for(let i=0;i<n;i++){const v=f(inputs[i]),w=ref(task,inputs[i],bits);if(v!==w)bad++}
  return{task,algo,bits,samples,iters,bad,n,sink}}
 return{runCell,probe}}
M5.benchCore=benchCore;
const TASKS={
 gcd:{ua:'НСД двох чисел',en:'GCD of two numbers',algos:{euclid:['Класичний Евклід','Classic Euclid'],ext:['Розширений Евклід','Extended Euclid'],binary:['Бінарний Евклід','Binary Euclid'],brute:['Прямий перебір','Brute force']},sizes:'16,20,32,64,128,256,512,1024',
  note:['Усі алгоритми отримують однакові пари чисел. Прямий перебір виконується лише до 20 біт (інакше він потребує до 2²⁰ⁿ кроків) — для більших розмірів він пропускається, а не підміняється.','All algorithms get identical number pairs. Brute force runs only up to 20 bits (otherwise it needs up to 2^bits steps) — for larger sizes it is skipped, never faked.']},
 modpow:{ua:'Модульне піднесення до степеня bᵉ mod m',en:'Modular exponentiation bᵉ mod m',algos:{fast:['Швидке (квадрати)','Fast (square-and-multiply)'],seq:['Послідовне (e множень)','Sequential (e multiplications)']},sizes:'16,32,64,128,256,512,1024',
  note:['Модуль m має задану кількість біт; експонента e обмежена 16 бітами для всіх алгоритмів (послідовне піднесення виконує e множень), тож задача однакова. Послідовне — лише до 16 біт.','Modulus m has the given bit size; exponent e is limited to 16 bits for all algorithms (sequential does e multiplications), so the task is identical. Sequential runs up to 16 bits.']},
 prime:{ua:'Перевірка простоти',en:'Primality testing',algos:{trial:['Пробні ділення','Trial division'],mr:['Міллер — Рабін (12 основ)','Miller–Rabin (12 bases)']},sizes:'16,24,32,40,44,64,128,256',
  note:['Входи: половина — прості числа заданої довжини, половина — добутки двох простих (найгірший випадок для пробних ділень). Пробні ділення — до 44 біт; Міллер—Рабін детермінований для n < 3,3·10²⁴, далі — імовірнісний (перевірка іншим набором основ).','Inputs: half are primes of the given size, half are products of two primes (worst case for trial division). Trial division runs up to 44 bits; Miller–Rabin is deterministic for n < 3.3·10²⁴, probabilistic beyond (cross-checked with a different base set).']}};
const CPLX={euclid:['O(log min(a, b)) ітерацій','O(log min(a, b)) iterations'],ext:['O(log min(a, b)) ітерацій','O(log min(a, b)) iterations'],binary:['O(log a + log b) ітерацій','O(log a + log b) iterations'],brute:['O(min(a, b)) = O(2ⁿ)','O(min(a, b)) = O(2ⁿ)'],
 fast:['O(log e) множень','O(log e) multiplications'],seq:['O(e) множень = O(2ᵏ)','O(e) multiplications = O(2ᵏ)'],trial:['O(√n) = O(2^(n/2))','O(√n) = O(2^(n/2))'],mr:['O(k·log³ n), k — кількість основ','O(k·log³ n), k = number of bases']};
const B={rows:[],worker:null,run:false,cfg:null,sizes:[]};M5.B=B;
const HTML=`
<h2>⟦Порівняльний аналіз алгоритмів|Algorithm Benchmark⟧</h2>
<div class="warn" role="note">⟦Увага: результати залежать від обладнання, браузера, режиму енергозбереження та фонових процесів. Усі часи — реальні вимірювання performance.now(); жодних підставлених значень. Порівнюються лише алгоритми, що розв’язують одну й ту саму задачу.|Warning: results depend on hardware, browser, power mode and background processes. All times are real performance.now() measurements; nothing is substituted. Only algorithms solving the same problem are compared.⟧</div>
<div class="row"><label>⟦Задача|Task⟧<select id="btask"></select></label><label>⟦Розміри входів, біт (через кому)|Input sizes, bits (comma-separated)⟧<input class="w" id="bsz" style="min-width:260px"></label></div>
<div class="row" id="balg"></div>
<div class="row"><label>⟦Входів у партії|Inputs per batch⟧<input class="s" id="bbat" value="20"></label><label>⟦Повторень (вибірок)|Repetitions (samples)⟧<input class="s" id="brep" value="15"></label><label>⟦Прогрів|Warm-up passes⟧<input class="s" id="bwar" value="2"></label><label>seed<input class="s" id="bseed" value="12345"></label></div>
<div class="note" id="bnote"></div>
<div class="row"><button class="b m" id="bgo">⟦Запустити|Run⟧</button><button class="b" id="bstop" disabled>⟦Зупинити|Stop⟧</button><button class="b" id="bsave">⟦Зберегти в архів|Save to archive⟧</button><button class="b" id="bcsv">⟦Таблиця CSV|Table CSV⟧</button><button class="b" id="bjson">JSON</button></div>
<progress id="bprog" value="0" max="1" aria-label="progress"></progress><div class="err" id="berr" aria-live="polite"></div>
<div id="bres"></div>
<div class="row" id="bchrow" hidden><label>⟦Розмір для стовпчастої діаграми|Size for bar chart⟧<select id="bbarsz"></select></label><button class="b" id="bpng1">⟦Лінійний PNG|Line PNG⟧</button><button class="b" id="bsvg1">⟦Лінійний SVG|Line SVG⟧</button><button class="b" id="bpng2">⟦Стовпчастий PNG|Bar PNG⟧</button><button class="b" id="bsvg2">⟦Стовпчастий SVG|Bar SVG⟧</button></div>
<div class="wide" id="bline"></div><div class="wide" id="bbar"></div>
<h2>⟦Теоретична складність|Theoretical complexity⟧</h2><div id="bcx"></div>`;
const tname=(task,a)=>T(TASKS[task].algos[a][0],TASKS[task].algos[a][1]);
function renderAlgos(){const t=q('#btask').value;q('#bsz').value=TASKS[t].sizes;
 q('#balg').innerHTML=Object.keys(TASKS[t].algos).map(a=>'<label class="chk"><input type="checkbox" data-a="'+a+'" checked>'+esc(tname(t,a))+'</label>').join('');
 q('#bnote').textContent=T(...TASKS[t].note);
 q('#bcx').innerHTML=M5.table([T('Алгоритм','Algorithm'),T('Складність','Complexity')],Object.keys(TASKS[t].algos).map(a=>[tname(t,a),T(...CPLX[a])]))}
function cfgRead(){const t=q('#btask').value;const sizes=q('#bsz').value.split(/[,;\s]+/).filter(Boolean).map(Number);
 if(!sizes.length||sizes.some(v=>!Number.isInteger(v)||v<8||v>4096))throw Error(T('Розміри: цілі числа від 8 до 4096 біт.','Sizes: integers from 8 to 4096 bits.'));
 const algos=[...document.querySelectorAll('#balg input:checked')].map(i=>i.dataset.a);if(algos.length<1)throw Error(T('Оберіть хоча б один алгоритм.','Select at least one algorithm.'));
 const num=(id,lo,hi,nm)=>{const v=Number(q('#'+id).value);if(!Number.isInteger(v)||v<lo||v>hi)throw Error(nm+': '+lo+'…'+hi);return v};
 return{task:t,sizes,algos,batch:num('bbat',1,500,T('Входів','Inputs')),reps:num('brep',1,500,T('Повторень','Repetitions')),warm:num('bwar',0,20,T('Прогрів','Warm-up')),seed:num('bseed',0,4294967295,'seed')}}
function setRun(on){B.run=on;q('#bgo').disabled=on;q('#bstop').disabled=!on}
function collect(cell){B.rows.push(cell)}
function start(){say('berr','');let cfg;try{cfg=cfgRead()}catch(e){say('berr',e.message);return}
 B.cfg=cfg;B.rows=[];B.res=null;setRun(true);const total=cfg.sizes.length*cfg.algos.length;q('#bprog').max=total;q('#bprog').value=0;
 const cells=[];cfg.sizes.forEach(s=>cfg.algos.forEach(a=>cells.push([a,s])));
 const fin=(stopped)=>{setRun(false);if(B.worker){B.worker.terminate();B.worker=null}if(stopped)say('berr',T('Експеримент зупинено користувачем. Показано вже виміряні дані.','Experiment stopped by the user. Showing the data measured so far.'),true);else say('berr',T('Готово.','Done.'),true);show()};
 const handle=(m)=>{if(m.type==='res'){collect(m.cell);q('#bprog').value=m.done;say('berr',T('Виконується: ','Running: ')+m.done+' / '+total+' — '+tname(cfg.task,m.cell.algo)+', '+m.cell.bits+T(' біт',' bits'),true)}};
 let useWorker=true,w;
 try{const src='const core=('+benchCore.toString()+')();onmessage=function(e){const c=e.data;try{self.postMessage({type:"probe",res:core.probe()});let d=0;for(const[a,s]of c.cells){const cell=core.runCell(c.cfg,c.cfg.task,a,s);d++;self.postMessage({type:"res",cell:cell,done:d})}self.postMessage({type:"done"})}catch(err){self.postMessage({type:"err",msg:String(err&&err.message||err)})}}';
  const url=URL.createObjectURL(new Blob([src],{type:'text/javascript'}));w=new Worker(url);setTimeout(()=>URL.revokeObjectURL(url),3000);}catch(e){useWorker=false}
 if(useWorker){B.worker=w;B.mode='worker';
  w.onmessage=e=>{const m=e.data;if(m.type==='probe')B.res=m.res;else if(m.type==='res')handle(m);else if(m.type==='done')fin(false);else if(m.type==='err'){say('berr',m.msg);fin(true)}};
  w.onerror=e=>{say('berr',T('Помилка Worker: ','Worker error: ')+(e.message||''));fin(true)};
  w.postMessage({cfg,cells})}
 else{B.mode='main';B.stop=false;const core=benchCore();B.res=core.probe();let d=0;
  (async()=>{for(const[a,s]of cells){if(B.stop)break;await new Promise(r=>setTimeout(r,0));const cell=core.runCell(cfg,cfg.task,a,s);d++;handle({type:'res',cell,done:d})}fin(B.stop)})()}}
function stop(){if(!B.run)return;if(B.worker){const w=B.worker;B.worker=null;w.terminate();setRun(false);say('berr',T('Експеримент зупинено користувачем. Показано вже виміряні дані.','Experiment stopped by the user. Showing the data measured so far.'),true);show()}else B.stop=true}
function rowsOut(){return B.rows.map(c=>{if(c.skipped)return{task:c.task,algo:c.algo,bits:c.bits,skipped:c.skipped};const s=M5.stats(c.samples);return{task:c.task,algo:c.algo,bits:c.bits,n:s.n,batch:B.cfg.batch,mean_ms:s.mean,median_ms:s.median,min_ms:s.min,max_ms:s.max,sd_ms:s.sd,iterations_per_op:c.iters,correct:c.bad===0,mismatches:c.bad}})}
function show(){const cfg=B.cfg;if(!cfg)return;const R=rowsOut();
 const trs=R.map(r=>r.skipped?[tname(cfg.task,r.algo),r.bits,T('пропущено (','skipped (')+r.skipped+')','','','','','','']:[tname(cfg.task,r.algo),r.bits,M5.fmtT(r.mean_ms),M5.fmtT(r.median_ms),M5.fmtT(r.min_ms),M5.fmtT(r.max_ms),M5.fmtT(r.sd_ms),r.iterations_per_op.toFixed(1),r.correct?'✓':'✗ ('+r.mismatches+')']);
 const res=B.res;let h='<p class="mut">'+T('Одиниця вимірювання: час однієї операції = (час партії з ','Unit: time of one operation = (time of a batch of ')+cfg.batch+T(' входів)/',' inputs)/')+cfg.batch+'; '+T('для швидких операцій партія повторюється кілька разів, щоб тривалість вимірювання набагато перевищувала крок таймера; ','for fast operations the batch is repeated several times so the measured duration far exceeds the timer tick; ')+T('вибірок: ','samples: ')+cfg.reps+', seed '+cfg.seed+'. '+(res!=null?T('Роздільна здатність таймера ≈ ','Timer resolution ≈ ')+M5.fmtT(res)+'. ':'')+(B.mode==='main'?T('Worker недоступний — виконано в основному потоці. ','Worker unavailable — ran on the main thread. '):'')+'</p>';
 const tiny=R.some(r=>!r.skipped&&res&&r.mean_ms*cfg.batch<res*20);if(tiny)h+='<div class="warn">'+T('Деякі партії тривають менше ~20 кроків таймера — збільшіть кількість входів у партії для надійнішого результату.','Some batches take less than ~20 timer ticks — increase the batch size for more reliable numbers.')+'</div>';
 h+=M5.table([T('Алгоритм','Algorithm'),T('Біт','Bits'),T('Середнє','Mean'),T('Медіана','Median'),'Min','Max',T('Ст. відхил.','Std dev'),T('Ітерацій/оп.','Iterations/op'),T('Перевірка','Check')],trs);
 const bad=R.filter(r=>!r.skipped&&!r.correct);h+=bad.length?'<div class="warn">'+T('Увага: розбіжності з еталоном — ','Warning: mismatch with reference — ')+bad.length+'</div>':'<p class="ok">'+T('Усі результати алгоритмів збігаються з еталоном (перевірено поза вимірюванням часу).','All algorithm outputs match the reference (checked outside the timed section).')+'</p>';
 q('#bres').innerHTML=h;q('#bchrow').hidden=!R.some(r=>!r.skipped);
 const szs=[...new Set(R.filter(r=>!r.skipped).map(r=>r.bits))];q('#bbarsz').innerHTML=szs.map(s=>'<option>'+s+'</option>').join('');if(szs.length){const okAll=[...szs].reverse().find(s=>cfg.algos.every(a=>R.some(r=>!r.skipped&&r.algo===a&&r.bits===s)));q('#bbarsz').value=String(okAll||szs[szs.length-1])}
 charts();M5.walk(q('#t-bench'))}
function charts(){const cfg=B.cfg;if(!cfg)return;const R=rowsOut(),ok=R.filter(r=>!r.skipped);
 const szs=[...new Set(R.map(r=>r.bits))].sort((a,b)=>a-b);
 const ser=cfg.algos.map(a=>({name:tname(cfg.task,a),y:szs.map(s=>{const r=ok.find(x=>x.algo===a&&x.bits===s);return r&&r.mean_ms>0?r.mean_ms:null})}));
 B.svgLine=M5.lineChart({title:TASKS[cfg.task][T('ua','en')]+' — '+T('час однієї операції (мс, лог. шкала)','time per operation (ms, log scale)'),x:szs,series:ser,log:true,xlab:T('розмір входу, біт','input size, bits'),ylab:T('мс / операція','ms / operation')});
 q('#bline').innerHTML=B.svgLine;
 const sz=Number(q('#bbarsz').value)||szs[0];
 B.svgBar=M5.barChart({title:T('Середній час однієї операції при ','Mean time per operation at ')+sz+T(' біт',' bits'),items:cfg.algos.map((a,i)=>{const r=ok.find(x=>x.algo===a&&x.bits===sz);return{name:tname(cfg.task,a),v:r&&r.mean_ms>0?r.mean_ms:null,note:T('немає даних (пропущено)','no data (skipped)')}}),fmt:M5.fmtT,log:true,left:210});
 q('#bbar').innerHTML=B.svgBar}
function csvOut(){if(!B.rows.length){say('berr',T('Немає даних для експорту.','Nothing to export.'));return}const R=rowsOut();const keys=['task','algo','bits','n','batch','mean_ms','median_ms','min_ms','max_ms','sd_ms','iterations_per_op','correct','mismatches','skipped'];
 M5.dl('mathcrypt_benchmark.csv',M5.csv([keys].concat(R.map(r=>keys.map(k=>r[k]==null?'':r[k])))),'text/csv;charset=utf-8')}
M5.addTab('bench','Порівняльний аналіз алгоритмів','Algorithm Benchmark',HTML,()=>{
 const sel=q('#btask');Object.keys(TASKS).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=TASKS[k].ua;M5.EN[TASKS[k].ua]=TASKS[k].en;sel.appendChild(o)});
 sel.onchange=renderAlgos;renderAlgos();q('#bgo').onclick=start;q('#bstop').onclick=stop;q('#bcsv').onclick=csvOut;
 q('#bjson').onclick=()=>{if(!B.rows.length){say('berr',T('Немає даних для експорту.','Nothing to export.'));return}M5.dl('mathcrypt_benchmark.json',JSON.stringify({program:'MATHCRYPT '+M5.ver,config:B.cfg,timerResolutionMs:B.res,rows:rowsOut()},null,1),'application/json')};
 q('#bbarsz').onchange=charts;
 q('#bpng1').onclick=()=>B.svgLine&&M5.svgToPng(B.svgLine,'benchmark_line.png');q('#bsvg1').onclick=()=>B.svgLine&&M5.dl('benchmark_line.svg',B.svgLine,'image/svg+xml');
 q('#bpng2').onclick=()=>B.svgBar&&M5.svgToPng(B.svgBar,'benchmark_bar.png');q('#bsvg2').onclick=()=>B.svgBar&&M5.dl('benchmark_bar.svg',B.svgBar,'image/svg+xml');
 q('#bsave').onclick=()=>{if(!B.rows.length){say('berr',T('Спочатку виконайте експеримент.','Run an experiment first.'));return}
  const R=rowsOut();M5.saveEntry('bench',T('Бенчмарк: ','Benchmark: ')+TASKS[B.cfg.task][T('ua','en')],{task:B.cfg.task,sizes:B.cfg.sizes,algos:B.cfg.algos,batch:B.cfg.batch,reps:B.cfg.reps,warm:B.cfg.warm,seed:B.cfg.seed},{timerResolutionMs:B.res,rows:[Object.keys(R[0]),...R.map(r=>Object.keys(R[0]).map(k=>r[k]==null?'':String(typeof r[k]==='number'?+r[k].toPrecision(6):r[k])))]},{chart:B.svgLine,chart2:B.svgBar,settings:{mode:B.mode},conclusion:''})};
 document.addEventListener('mc5:lang',()=>{renderAlgos();if(B.cfg&&B.rows.length)show()});
 M5.rerun.bench=e=>{M5.openTab('bench');const p=e.params;q('#btask').value=p.task;renderAlgos();q('#bsz').value=p.sizes.join(',');qa('#balg input').forEach(i=>i.checked=p.algos.includes(i.dataset.a));q('#bbat').value=p.batch;q('#brep').value=p.reps;q('#bwar').value=p.warm;q('#bseed').value=p.seed;start()}});
})();
