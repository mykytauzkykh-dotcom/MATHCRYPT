/* ===== Research Lab: ax + by = c ===== */
(()=>{'use strict';
const M5=window.M5;const {q,qa,T,esc,isI,put,say,html,big,dio,countSol,gcd,abs,xgcd}=M5;
const LAB={cur:null,v:{cx:0,cy:0,u:.05},pts:[],series:null};M5.LAB=LAB;
const HTML=`
<h2>⟦Дослідницька лабораторія: ax + by = c|Research Lab: ax + by = c⟧</h2>
<p class="lead">⟦Ввід коефіцієнтів, перевірка розв’язності, розширений алгоритм Евкліда, загальна формула, інтерактивний графік, підрахунок у діапазоні, серії рівнянь та власні експерименти.|Enter coefficients, check solvability, run the extended Euclidean algorithm, get the general formula, explore the interactive graph, count in a range, run series and custom experiments.⟧</p>
<div class="row"><label>a<input class="s" id="la" inputmode="numeric" value="35"></label><label>b<input class="s" id="lb" inputmode="numeric" value="22"></label><label>c<input class="s" id="lc" inputmode="numeric" value="1"></label>
<button class="b m" id="lgo">⟦Аналізувати|Analyse⟧</button><button class="b" id="lrnd">⟦Випадкові a, b, c|Random a, b, c⟧</button></div>
<div class="row"><label>⟦Змінити a (крок)|Adjust a (step)⟧<span class="stp"><button class="b" id="lam" aria-label="a−1">−</button><button class="b" id="lap" aria-label="a+1">+</button></span></label>
<label>⟦Змінити b (крок)|Adjust b (step)⟧<span class="stp"><button class="b" id="lbm" aria-label="b−1">−</button><button class="b" id="lbp" aria-label="b+1">+</button></span></label>
<label>⟦Змінити c (крок)|Adjust c (step)⟧<span class="stp"><button class="b" id="lcm" aria-label="c−1">−</button><button class="b" id="lcp" aria-label="c+1">+</button></span></label></div>
<div class="err" id="lerr"></div>
<div class="grid2"><div><h2>⟦Хід розв’язання|Solution steps⟧</h2><pre id="lout"></pre></div><div><h2>⟦Вплив коефіцієнтів|Influence of coefficients⟧</h2><div id="linf"></div></div></div>
<h2>⟦Інтерактивний графік цілих розв’язків|Interactive graph of integer solutions⟧</h2>
<div class="row"><button class="b" id="lzi">⟦Збільшити|Zoom in⟧ +</button><button class="b" id="lzo">⟦Зменшити|Zoom out⟧ −</button><button class="b" id="lzr">⟦Скинути вид|Reset view⟧</button><button class="b" id="lfs">⟦На весь екран|Fullscreen⟧</button><button class="b" id="lpng">⟦Графік PNG|Graph PNG⟧</button><button class="b" id="lsvg">⟦Графік SVG|Graph SVG⟧</button></div>
<div class="gbox" id="lgbox"><div id="lg" tabindex="0" aria-label="graph" role="img"></div></div>
<div class="note" id="lhov" aria-live="polite">⟦Наведіть курсор на точку. Колесо — масштаб, перетягування — зсув, стрілки та +/− на клавіатурі.|Hover over a point. Wheel zooms, drag pans, arrow keys and +/− work on the keyboard.⟧</div>
<h2>⟦Підрахунок розв’язків у діапазоні|Count solutions in a range⟧</h2>
<div class="row"><label>x min<input class="s" id="lx1" value="-100"></label><label>x max<input class="s" id="lx2" value="100"></label><label>y min<input class="s" id="ly1" value="-100"></label><label>y max<input class="s" id="ly2" value="100"></label>
<label class="chk"><input type="checkbox" id="lnn">⟦тільки x, y ≥ 0|only x, y ≥ 0⟧</label><button class="b m" id="lcnt">⟦Порахувати|Count⟧</button></div>
<pre id="lcout"></pre>
<h2>⟦Серія рівнянь|Equation series⟧</h2>
<p class="lead">⟦Задайте діапазони коефіцієнтів. Режим «повний перебір» перебирає всі трійки; «випадкова вибірка» — N рівнянь із фіксованим seed (відтворювано).|Set coefficient ranges. “Full enumeration” goes through every triple; “random sample” draws N equations with a fixed seed (reproducible).⟧</p>
<div class="row"><label>a ∈<span class="rg"><input class="s" id="sa1" value="1"><input class="s" id="sa2" value="20"></span></label><label>b ∈<span class="rg"><input class="s" id="sb1" value="1"><input class="s" id="sb2" value="20"></span></label><label>c ∈<span class="rg"><input class="s" id="sc1" value="1"><input class="s" id="sc2" value="20"></span></label></div>
<div class="row"><label>⟦Режим|Mode⟧<select id="smode"><option value="full">⟦повний перебір|full enumeration⟧</option><option value="rand">⟦випадкова вибірка|random sample⟧</option></select></label><label>N<input class="s" id="sn" value="5000"></label><label>seed<input class="s" id="sseed" value="2024"></label><label>⟦Вікно (макс. модуль)|Window (max abs)⟧<input class="s" id="sw" value="10"></label>
<button class="b m" id="sgo">⟦Запустити серію|Run series⟧</button><button class="b" id="scsv">CSV</button><button class="b" id="sjson">JSON</button></div>
<div class="err" id="serr"></div><div id="ssum"></div><pre id="sconc"></pre><div id="stab"></div>
<h2>⟦Власний експеримент|Custom experiment⟧</h2>
<div class="grid2"><label>⟦Назва|Title⟧<input class="w" id="xt" value=""></label><label>⟦Мета|Goal⟧<input class="w" id="xg"></label></div>
<label>⟦Гіпотеза|Hypothesis⟧<textarea class="w" id="xh" rows="2"></textarea></label>
<label>⟦Висновки (за замовчуванням — автоматичні, математично перевірені)|Conclusions (automatic, mathematically verified, by default)⟧<textarea class="w" id="xc" rows="4"></textarea></label>
<div class="row"><button class="b" id="xauto">⟦Підставити автовисновки|Insert auto conclusions⟧</button><button class="b m" id="xsave">⟦Зберегти експеримент в архів|Save experiment to archive⟧</button></div>`;
const NUMMAX=9e15;
function readABC(){return[big('la','a'),big('lb','b'),big('lc','c')]}
/* ---------- аналіз ---------- */
function analyse(){
 let a,b,c;try{[a,b,c]=readABC()}catch(e){say('lerr',e.message);return}
 say('lerr','');LAB.big=false;const D=dio(a,b,c);const L=[];
 L.push(T('Рівняння: ','Equation: ')+a+'·x + ('+b+')·y = '+c);
 if(D.all){L.push(T('a = b = 0 і c = 0: розв’язком є будь-яка пара цілих (x, y).','a = b = 0 and c = 0: every integer pair (x, y) is a solution.'));LAB.cur={a,b,c,ok:true,all:true};
 }else if(a===0n&&b===0n){L.push(T('a = b = 0, c ≠ 0: розв’язків немає (0 ≠ c).','a = b = 0, c ≠ 0: no solutions (0 ≠ c).'));LAB.cur={a,b,c,ok:false};}
 else{
  L.push('');L.push(T('1) НСД(a, b) за розширеним алгоритмом Евкліда:','1) gcd(a, b) via the extended Euclidean algorithm:'));
  D.steps.forEach((s,i)=>L.push('   '+(i+1)+') '+s.a+' = '+s.q+'·'+s.b+' + '+s.r));
  L.push('   НСД(|a|,|b|) = '+D.g);
  L.push(T('2) Коефіцієнти Безу: ','2) Bézout coefficients: ')+a+'·('+D.x+') + ('+b+')·('+D.y+') = '+D.g+'  ✓ '+(a*D.x+b*D.y===D.g));
  L.push(T('3) Умова розв’язності: НСД | c → ','3) Solvability condition: gcd | c → ')+D.g+' | '+c+' : '+(D.ok?T('так','yes'):T('ні','no')));
  if(D.ok){L.push(T('4) Частковий розв’язок: ','4) Particular solution: ')+'x₀ = '+D.x0+', y₀ = '+D.y0+'   ('+T('перевірка: ','check: ')+(a*D.x0+b*D.y0)+' = '+c+' ✓)');
   L.push(T('5) Загальна формула (t ∈ ℤ):','5) General formula (t ∈ ℤ):'));
   L.push('   x = '+D.x0+' + ('+D.sx+')·t');L.push('   y = '+D.y0+' + ('+D.sy+')·t');
   const nn=countSol(D,[0n,null],[0n,null]);
   L.push(T('6) Невід’ємні розв’язки (x ≥ 0, y ≥ 0): ','6) Non-negative solutions (x ≥ 0, y ≥ 0): ')+(nn.inf?T('нескінченно багато','infinitely many'):nn.n+(nn.n>0n?' ('+T('t від ','t from ')+nn.lo+T(' до ',' to ')+nn.hi+')':'')));
  }else L.push(T('Висновок: цілих розв’язків немає.','Conclusion: there are no integer solutions.'));
  LAB.cur=Object.assign({a,b,c},D)}
 put('lout',L.join('\n'));influence();LAB.v={cx:0,cy:0,u:.05};autoView();draw();
 if(!q('#xt').value||q('#xt').dataset.auto==='1'){q('#xt').value=T('Рівняння ','Equation ')+a+'x + ('+b+')y = '+c;q('#xt').dataset.auto='1'}
 return D}
function influence(){const C=LAB.cur;if(!C||C.all||(C.a===0n&&C.b===0n)){html('linf','');return}
 const{a,b,c}=C,g=gcd(a,b),sx=b/g,sy=-a/g,dist=Math.hypot(Number(sx),Number(sy)),len=Math.hypot(Number(a),Number(b));
 let h='<p>'+T('Крок вздовж прямої між сусідніми цілими точками: ','Step between neighbouring lattice points: ')+'(Δx, Δy) = ('+sx+', '+sy+'), '+T('довжина ','length ')+dist.toPrecision(5)+'. '+T('Чим більший НСД, тим рідше точки; чим більші |a|,|b| при НСД=1, тим далі точки одна від одної.','The larger the gcd, the sparser the points; with gcd = 1, larger |a|, |b| push points further apart.')+'</p>';
 h+='<p>'+T('Щільність цілих точок на прямій: ','Density of lattice points on the line: ')+'НСД/√(a²+b²) = '+g+'/'+len.toPrecision(5)+' = '+(Number(g)/len).toPrecision(4)+' '+T('на одиницю довжини','per unit length')+'.</p>';
 const rows=[];for(let k=1n;k<=6n;k++){const gg=g*k;rows.push(['k = '+k,(k*a)+'x + ('+(k*b)+')y = '+c,gg,c%gg===0n?T('так','yes'):T('ні','no')])}
 h+='<b>'+T('Масштабування (k·a, k·b): розв’язність','Scaling (k·a, k·b): solvability')+'</b>'+M5.table(['k',T('рівняння','equation'),T('НСД','gcd'),T('розв’язне','solvable')],rows);
 const r2=[];for(let d=-5n;d<=5n;d++){const D2=dio(a,b,c+d);r2.push([c+d,D2.ok?T('так','yes'):T('ні','no'),D2.ok?(D2.all?'—':D2.x0+'; '+D2.y0):'—'])}
 h+='<b>'+T('Зсув c: частка розв’язних c = 1/НСД','Shift of c: solvable fraction = 1/gcd')+'</b>'+M5.table(['c',T('розв’язне','solvable'),'(x₀; y₀)'],r2);
 html('linf',h)}
/* ---------- графік ---------- */
function autoView(){const C=LAB.cur;if(!C||!C.ok||C.all){LAB.v={cx:0,cy:0,u:.05};return}
 const f=v=>Number(v);if(![C.x0,C.y0,C.sx,C.sy].every(v=>abs(v)<BigInt(NUMMAX))){LAB.big=true;return}LAB.big=false;
 /* центр у частковому розв'язку, наближеному до початку координат */
 let t=0;if(C.sx!==0n||C.sy!==0n){const sx=f(C.sx),sy=f(C.sy),x0=f(C.x0),y0=f(C.y0);t=-(x0*sx+y0*sy)/(sx*sx+sy*sy)}t=Math.round(t);
 const px=f(C.x0)+f(C.sx)*t,py=f(C.y0)+f(C.sy)*t,span=Math.max(10,Math.abs(px)*1.4+6,Math.abs(py)*1.4+6,Math.hypot(f(C.sx),f(C.sy))*3);
 LAB.v={cx:0,cy:0,u:span*2/760};if(Math.abs(px)<span*.9&&Math.abs(py)<span*.9)LAB.v.cx=0;else{LAB.v.cx=px;LAB.v.cy=py}}
const GW=760,GH=440;
function draw(){const C=LAB.cur,el=q('#lg');LAB.pts=[];
 if(!C){el.innerHTML='';return}
 let s='<svg xmlns="http://www.w3.org/2000/svg" class="ch" id="lsvgel" viewBox="0 0 '+GW+' '+GH+'" width="'+GW+'" height="'+GH+'" font-family="Segoe UI,Arial,sans-serif" style="background:#0a0a0c;touch-action:none;cursor:grab"><defs><clipPath id="lclip"><rect x="0" y="0" width="'+GW+'" height="'+GH+'"/></clipPath></defs><g clip-path="url(#lclip)">';
 const{cx,cy,u}=LAB.v,X=x=>GW/2+(x-cx)/u,Y=y=>GH/2-(y-cy)/u,x1=cx-GW/2*u,x2=cx+GW/2*u,y1=cy-GH/2*u,y2=cy+GH/2*u;
 M5.nice(x1,x2,10).forEach(v=>{s+='<line x1="'+X(v)+'" x2="'+X(v)+'" y1="0" y2="'+GH+'" stroke="'+(v===0?'#666':'#222')+'"/><text x="'+(X(v)+3)+'" y="'+Math.min(GH-4,Math.max(12,Y(0)+13))+'" fill="#999" font-size="10">'+v+'</text>'});
 M5.nice(y1,y2,7).forEach(v=>{s+='<line y1="'+Y(v)+'" y2="'+Y(v)+'" x1="0" x2="'+GW+'" stroke="'+(v===0?'#666':'#222')+'"/><text y="'+(Y(v)-3)+'" x="'+Math.min(GW-30,Math.max(3,X(0)+4))+'" fill="#999" font-size="10">'+v+'</text>'});
 if(C.ok&&!C.all&&!LAB.big){
  const a=Number(C.a),b=Number(C.b),c=Number(C.c);
  if(b!==0)s+='<line x1="0" y1="'+Y((c-a*x1)/b)+'" x2="'+GW+'" y2="'+Y((c-a*x2)/b)+'" stroke="#c4122f" stroke-width="2"/>';else if(a!==0)s+='<line x1="'+X(c/a)+'" x2="'+X(c/a)+'" y1="0" y2="'+GH+'" stroke="#c4122f" stroke-width="2"/>';
  const x0=Number(C.x0),y0=Number(C.y0),sx=Number(C.sx),sy=Number(C.sy);let lo=-Infinity,hi=Infinity;
  const lim=(v0,st,l,h)=>{if(st===0){if(v0<l||v0>h){lo=1;hi=0}return}let t1=(l-v0)/st,t2=(h-v0)/st;if(t1>t2)[t1,t2]=[t2,t1];lo=Math.max(lo,t1);hi=Math.min(hi,t2)};
  lim(x0,sx,x1,x2);lim(y0,sy,y1,y2);
  if(lo<=hi&&isFinite(lo)&&isFinite(hi)){const t0=Math.ceil(lo),t1=Math.floor(hi),n=t1-t0+1,stp=n>1500?Math.ceil(n/1500):1;
   for(let t=t0;t<=t1;t+=stp){const x=x0+sx*t,y=y0+sy*t;LAB.pts.push([x,y,X(x),Y(y)]);s+='<circle cx="'+X(x).toFixed(1)+'" cy="'+Y(y).toFixed(1)+'" r="'+(u<.2?4.5:3)+'" fill="#ff4d5e" stroke="#fff" stroke-width=".6"/>'}
   if(stp>1)LAB.thin=stp;else LAB.thin=0}}
 s+='</g><g id="lhg"></g><text x="12" y="20" fill="#fff" font-size="13">'+esc(C.a+'x + ('+C.b+')y = '+C.c)+'</text>';
 if(!C.ok)s+='<text x="'+GW/2+'" y="'+GH/2+'" fill="#ff4d5e" font-size="16" text-anchor="middle">'+esc(T('Цілих розв’язків немає','No integer solutions'))+'</text>';
 if(LAB.big)s+='<text x="'+GW/2+'" y="'+(GH/2+24)+'" fill="#ddd" font-size="13" text-anchor="middle">'+esc(T('Числа завеликі для графіка (> 9·10¹⁵) — дивіться формулу','Numbers too large to plot (> 9·10¹⁵) — see the formula'))+'</text>';
 el.innerHTML=s+'</svg>';bind()}
function bind(){const svg=q('#lsvgel');if(!svg)return;
 const pos=e=>{const r=svg.getBoundingClientRect();return[(e.clientX-r.left)*GW/r.width,(e.clientY-r.top)*GH/r.height]};
 let drag=null;
 svg.onpointerdown=e=>{drag={p:pos(e),v:{...LAB.v}};svg.setPointerCapture&&svg.setPointerCapture(e.pointerId);svg.style.cursor='grabbing'};
 svg.onpointerup=()=>{drag=null;svg.style.cursor='grab'};
 svg.onpointermove=e=>{const p=pos(e);
  if(drag){LAB.v.cx=drag.v.cx-(p[0]-drag.p[0])*drag.v.u;LAB.v.cy=drag.v.cy+(p[1]-drag.p[1])*drag.v.u;if(!svg._raf)svg._raf=requestAnimationFrame(()=>{svg._raf=0;draw()});return}
  let best=null,bd=14;LAB.pts.forEach(pt=>{const d=Math.hypot(pt[2]-p[0],pt[3]-p[1]);if(d<bd){bd=d;best=pt}});
  const g=q('#lhg');const{cx,cy,u}=LAB.v,wx=cx+(p[0]-GW/2)*u,wy=cy-(p[1]-GH/2)*u;
  if(best){g.innerHTML='<circle cx="'+best[2]+'" cy="'+best[3]+'" r="8" fill="none" stroke="#fff" stroke-width="2"/><rect x="'+Math.min(best[2]+10,GW-120)+'" y="'+Math.max(4,best[3]-30)+'" width="110" height="22" fill="#000" stroke="#ff4d5e"/><text x="'+(Math.min(best[2]+10,GW-120)+6)+'" y="'+(Math.max(4,best[3]-30)+15)+'" fill="#fff" font-size="12">('+best[0]+'; '+best[1]+')</text>';
   q('#lhov').textContent=T('Розв’язок: ','Solution: ')+'x = '+best[0]+', y = '+best[1]+'  ('+T('перевірка: ','check: ')+(Number(LAB.cur.a)*best[0]+Number(LAB.cur.b)*best[1])+')'}
  else{g.innerHTML='';q('#lhov').textContent=T('Курсор: ','Cursor: ')+'x ≈ '+wx.toFixed(2)+', y ≈ '+wy.toFixed(2)+(LAB.thin?'  ('+T('показано кожну ','showing every ')+LAB.thin+T('-ту точку',' point')+')':'')}};
 svg.onpointerleave=()=>{const g=q('#lhg');if(g)g.innerHTML=''};
 svg.onwheel=e=>{e.preventDefault();zoom(e.deltaY<0?.8:1.25)};}
function zoom(f){LAB.v.u=Math.min(1e7,Math.max(1e-4,LAB.v.u*f));draw()}
function kbd(e){const s=LAB.v.u*60;if(e.key==='+'||e.key==='=')zoom(.8);else if(e.key==='-')zoom(1.25);else if(e.key==='ArrowLeft')LAB.v.cx-=s;else if(e.key==='ArrowRight')LAB.v.cx+=s;else if(e.key==='ArrowUp')LAB.v.cy+=s;else if(e.key==='ArrowDown')LAB.v.cy-=s;else return;e.preventDefault();draw()}
/* ---------- підрахунок у діапазоні ---------- */
function count(){const C=LAB.cur;if(!C){analyse();if(!LAB.cur)return}const D=LAB.cur;
 try{const nn=q('#lnn').checked;let xr=[big('lx1','x min'),big('lx2','x max')],yr=[big('ly1','y min'),big('ly2','y max')];
  if(nn){xr=[xr[0]<0n?0n:xr[0],xr[1]];yr=[yr[0]<0n?0n:yr[0],yr[1]]}
  if(D.all){put('lcout',T('Будь-яка пара: у прямокутнику ','Any pair: in the rectangle ')+((xr[1]-xr[0]+1n)*(yr[1]-yr[0]+1n))+T(' цілих точок.',' lattice points.'));return}
  if(!D.ok){put('lcout',T('Розв’язків немає: 0.','No solutions: 0.'));return}
  const r=countSol(D,xr,yr),L=[T('Прямокутник: x ∈ [','Rectangle: x ∈ [')+xr[0]+', '+xr[1]+'], y ∈ ['+yr[0]+', '+yr[1]+']',T('Кількість розв’язків: ','Number of solutions: ')+(r.inf?'∞':r.n)];
  if(!r.inf&&r.n>0n){L.push('t ∈ ['+r.lo+', '+r.hi+']');const show=[];for(let t=r.lo;t<=r.hi&&show.length<10;t++)show.push('('+(D.x0+D.sx*t)+'; '+(D.y0+D.sy*t)+')');L.push(T('Перші розв’язки: ','First solutions: ')+show.join(' ')+(r.n>10n?' …':''))}
  put('lcout',L.join('\n'));LAB.lastCount={xr:xr.map(String),yr:yr.map(String),n:r.inf?'inf':String(r.n)}}catch(e){put('lcout',e.message)}}
/* ---------- серії ---------- */
function runSeries(){say('serr','');
 try{const a1=big('sa1'),a2=big('sa2'),b1=big('sb1'),b2=big('sb2'),c1=big('sc1'),c2=big('sc2'),W=big('sw'),mode=q('#smode').value,N=Number(big('sn')),seed=Number(big('sseed'));
  if(a1>a2||b1>b2||c1>c2)throw Error(T('Нижня межа більша за верхню.','Lower bound exceeds upper bound.'));
  const na=a2-a1+1n,nb=b2-b1+1n,nc=c2-c1+1n,tot=na*nb*nc;let triples=[];
  if(mode==='full'){if(tot>150000n)throw Error(T('Забагато трійок ('+tot+'). Максимум 150 000: зменште діапазони або оберіть випадкову вибірку.','Too many triples ('+tot+'). Maximum is 150,000: shrink ranges or use random sample.'));
   for(let a=a1;a<=a2;a++)for(let b=b1;b<=b2;b++)for(let c=c1;c<=c2;c++)triples.push([a,b,c])}
  else{if(!(N>0&&N<=150000))throw Error(T('N має бути від 1 до 150 000.','N must be 1…150,000.'));const r=M5.rng(seed),pick=(lo,n)=>lo+BigInt(Math.floor(r()*Number(n)));for(let i=0;i<N;i++)triples.push([pick(a1,na),pick(b1,nb),pick(c1,nc)])}
  const rows=[],byG=new Map();let solv=0,verified=0,bad=0,coprimeAll=true,coprimePairs=new Set(),coprimeTotal=0,unsolvNonDiv=0;
  for(const[a,b,c]of triples){const D=dio(a,b,c);const g=D.g;let cnt=0n,x0='',y0='';
   if(D.ok){solv++;if(!D.all){if(a*D.x0+b*D.y0===c)verified++;else bad++;x0=D.x0;y0=D.y0;const r=countSol(D,[-W,W],[-W,W]);cnt=r.inf?-1n:r.n}else{verified++}}
   else if(g!==0n&&c%g!==0n)unsolvNonDiv++;
   if(g===1n){coprimeTotal++;if(!D.ok)coprimeAll=false}
   const e=byG.get(String(g))||{n:0,s:0};e.n++;if(D.ok)e.s++;byG.set(String(g),e);
   rows.push([a,b,c,g,D.ok?1:0,x0,y0,cnt])}
  const sum={total:triples.length,solvable:solv,verified,bad,coprimeTotal,coprimeAll,unsolvNonDiv,W:String(W),mode,seed:mode==='rand'?seed:null,ranges:{a:[String(a1),String(a2)],b:[String(b1),String(b2)],c:[String(c1),String(c2)]},byG:[...byG.entries()].sort((x,y)=>+x[0]-+y[0]).map(([g,e])=>({g,n:e.n,s:e.s}))};
  LAB.series={sum,rows};showSeries()}catch(e){say('serr',e.message)}}
function concl(S){const s=S.sum,L=[];const pc=(x,y)=>y?(100*x/y).toFixed(2)+'%':'—';
 L.push(T('1. Розв’язних рівнянь: ','1. Solvable equations: ')+s.solvable+' / '+s.total+' ('+pc(s.solvable,s.total)+').');
 L.push(T('2. Усі знайдені розв’язки перевірено підстановкою: ','2. Every found solution was verified by substitution: ')+s.verified+T(' успішно, ',' passed, ')+s.bad+T(' помилок.',' failures.'));
 L.push(T('3. Для трійок із НСД(a, b) = 1 (їх ','3. For triples with gcd(a, b) = 1 (there are ')+s.coprimeTotal+T('): розв’язні всі — ','): all are solvable — ')+(s.coprimeAll?T('так','yes'):T('ні','no'))+'.');
 const g1=s.byG.filter(r=>r.g!=='0'&&r.g!=='1');if(g1.length){L.push(T('4. Частка розв’язних за значенням НСД (теорія: ≈ 1/НСД для рівномірних c):','4. Solvable share by gcd value (theory: ≈ 1/gcd for uniform c):'));
  g1.slice(0,8).forEach(r=>L.push('   НСД = '+r.g+': '+r.s+'/'+r.n+' = '+pc(r.s,r.n)+'  (1/НСД = '+(100/+r.g).toFixed(2)+'%)'))}
 L.push(T('5. Усі нерозв’язні рівняння мають c, що не ділиться на НСД(a, b): ','5. Every unsolvable equation has c not divisible by gcd(a, b): ')+(s.total-s.solvable===s.unsolvNonDiv?T('так','yes'):T('так (враховано випадок a=b=0)','yes (a=b=0 case aside)'))+'.');
 L.push(T('Ці твердження — результат цього обчислення; вони узгоджуються з теоремою про розв’язність: ax + by = c має цілі розв’язки ⇔ НСД(a, b) | c.','These statements are the result of this computation; they agree with the solvability theorem: ax + by = c has integer solutions ⇔ gcd(a, b) | c.'));
 return L.join('\n')}
function showSeries(){const S=LAB.series;if(!S)return;const s=S.sum;
 html('ssum','<div class="kpis"><div class="kpi"><b>'+s.total+'</b>'+T('рівнянь','equations')+'</div><div class="kpi"><b>'+s.solvable+'</b>'+T('розв’язних','solvable')+'</div><div class="kpi"><b>'+(s.total-s.solvable)+'</b>'+T('нерозв’язних','unsolvable')+'</div><div class="kpi"><b>'+s.verified+'</b>'+T('перевірено','verified')+'</div></div>');
 put('sconc',concl(S));
 html('stab',M5.table(['a','b','c',T('НСД','gcd'),T('розв’язне','solvable'),'x₀','y₀',T('к-сть у вікні','count in window')],S.rows.slice(0,150).map(r=>[r[0],r[1],r[2],r[3],r[4]?'✓':'✗',r[5],r[6],r[7]<0n?'∞':(r[4]?r[7]:'')]))+'<p class="mut">'+T('Показано перші 150 рядків; експорт містить усі.','Showing the first 150 rows; the export contains all.')+'</p>')}
function expCsv(){const S=LAB.series;if(!S){say('serr',T('Спочатку запустіть серію.','Run a series first.'));return}M5.dl('mathcrypt_series.csv',M5.csv([['a','b','c','gcd','solvable','x0','y0','count_in_window']].concat(S.rows.map(r=>r.map(String)))),'text/csv;charset=utf-8')}
function expJson(){const S=LAB.series;if(!S){say('serr',T('Спочатку запустіть серію.','Run a series first.'));return}M5.dl('mathcrypt_series.json',JSON.stringify({program:'MATHCRYPT '+M5.ver,summary:S.sum,rows:S.rows.map(r=>({a:String(r[0]),b:String(r[1]),c:String(r[2]),gcd:String(r[3]),solvable:!!r[4],x0:String(r[5]),y0:String(r[6]),countInWindow:String(r[7])}))},null,1),'application/json')}
/* ---------- експеримент ---------- */
function autoConcl(){const C=LAB.cur;const parts=[];if(C){if(C.all)parts.push(T('a = b = 0, c = 0: усі пари цілих чисел.','a = b = 0, c = 0: all integer pairs.'));else if(!C.ok)parts.push(T('Для ','For ')+C.a+'x + ('+C.b+')y = '+C.c+T(': НСД = ',': gcd = ')+C.g+T(' не ділить c, отже цілих розв’язків немає.',' does not divide c, so there are no integer solutions.'));else parts.push(T('Для ','For ')+C.a+'x + ('+C.b+')y = '+C.c+T(': НСД = ',': gcd = ')+C.g+T(' ділить c; загальний розв’язок x = ','divides c; general solution x = ')+C.x0+' + ('+C.sx+')t, y = '+C.y0+' + ('+C.sy+')t.')}
 if(LAB.series)parts.push(concl(LAB.series));return parts.join('\n\n')}
function saveExp(){if(!LAB.cur){analyse();if(!LAB.cur)return}
 const C=LAB.cur,title=q('#xt').value.trim()||('MATHCRYPT '+new Date().toLocaleString()),concl=q('#xc').value.trim()||autoConcl();
 const params={a:String(C.a),b:String(C.b),c:String(C.c)};if(LAB.series)params.series=LAB.series.sum.ranges,params.seriesMode=LAB.series.sum.mode,params.seriesSeed=LAB.series.sum.seed,params.window=LAB.series.sum.W;
 const res={analysis:q('#lout').textContent,solvable:!!C.ok,gcd:String(C.g||0),count:LAB.lastCount||null};
 if(LAB.series){res.seriesSummary=LAB.series.sum;res.rows=[['a','b','c','gcd','solvable','x0','y0','count'],...LAB.series.rows.slice(0,40).map(r=>r.map(String))]}
 const e=M5.arch.add({type:LAB.series?'series':'lab',title,goal:q('#xg').value.trim(),hypothesis:q('#xh').value.trim(),params,results:res,conclusion:concl,comment:'',settings:{window:LAB.series?String(LAB.series.sum.W):null},chart:q('#lsvgel')?q('#lsvgel').outerHTML:''});
 if(e)M5.toast(T('Експеримент збережено в архів','Experiment saved to archive'))}
/* ---------- ініціалізація ---------- */
M5.addTab('lab','Дослідницька лабораторія','Research Lab',HTML,()=>{
 const step=(id,d)=>()=>{try{const v=big(id)+BigInt(d);q('#'+id).value=v;analyse()}catch(e){say('lerr',e.message)}};
 q('#lgo').onclick=analyse;['la','lb','lc'].forEach(k=>q('#'+k).addEventListener('keydown',e=>{if(e.key==='Enter')analyse()}));
 q('#lam').onclick=step('la',-1);q('#lap').onclick=step('la',1);q('#lbm').onclick=step('lb',-1);q('#lbp').onclick=step('lb',1);q('#lcm').onclick=step('lc',-1);q('#lcp').onclick=step('lc',1);
 q('#lrnd').onclick=()=>{const r=n=>Math.floor(Math.random()*n)-Math.floor(n/3);q('#la').value=r(60)||7;q('#lb').value=r(60)||9;q('#lc').value=r(100);analyse()};
 q('#lzi').onclick=()=>zoom(.7);q('#lzo').onclick=()=>zoom(1.4);q('#lzr').onclick=()=>{autoView();draw()};
 q('#lfs').onclick=()=>{const b=q('#lgbox');if(document.fullscreenElement){document.exitFullscreen()}else if(b.requestFullscreen)b.requestFullscreen().catch(()=>M5.toast(T('Повноекранний режим недоступний','Fullscreen unavailable')));else M5.toast(T('Повноекранний режим недоступний','Fullscreen unavailable'))};
 q('#lg').addEventListener('keydown',kbd);
 q('#lpng').onclick=()=>{const s=q('#lsvgel');if(s)M5.svgToPng(s.outerHTML.replace(/touch-action:none;cursor:grab/,''),'mathcrypt_graph.png')};
 q('#lsvg').onclick=()=>{const s=q('#lsvgel');if(s)M5.dl('mathcrypt_graph.svg',s.outerHTML,'image/svg+xml')};
 q('#lcnt').onclick=count;q('#sgo').onclick=runSeries;q('#scsv').onclick=expCsv;q('#sjson').onclick=expJson;
 q('#xauto').onclick=()=>{if(!LAB.cur)analyse();q('#xc').value=autoConcl()};q('#xsave').onclick=saveExp;q('#xt').addEventListener('input',e=>e.target.dataset.auto='0');
 analyse();
 document.addEventListener('mc5:lang',()=>{if(LAB.cur)analyse();if(LAB.series)showSeries()});
 M5.rerun.lab=M5.rerun.series=e=>{M5.openTab('lab');const p=e.params;q('#la').value=p.a;q('#lb').value=p.b;q('#lc').value=p.c;q('#xt').value=e.title;q('#xt').dataset.auto='0';q('#xg').value=e.goal||'';q('#xh').value=e.hypothesis||'';analyse();
  if(p.series){q('#sa1').value=p.series.a[0];q('#sa2').value=p.series.a[1];q('#sb1').value=p.series.b[0];q('#sb2').value=p.series.b[1];q('#sc1').value=p.series.c[0];q('#sc2').value=p.series.c[1];q('#smode').value=p.seriesMode||'full';if(p.seriesSeed!=null)q('#sseed').value=p.seriesSeed;if(p.window)q('#sw').value=p.window;runSeries()}
  q('#xc').value=e.conclusion||''};
});
})();
