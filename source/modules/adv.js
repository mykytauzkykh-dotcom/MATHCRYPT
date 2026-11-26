/* ===== Advanced mathematics: Pell, CRT, continued fractions ===== */
(()=>{'use strict';
const M5=window.M5;const{q,qa,T,esc,put,say,html,big,isI,abs,gcd,xgcd,modinv,mod,isqrt,log10Big,fdiv}=M5;
/* ---------- Пелль ---------- */
function pellSolve(D,maxIter,budgetMs){const t0=performance.now(),bud=budgetMs||4000;const a0=isqrt(D);if(a0*a0===D)return{square:true,a0};
 let m=0n,d=1n,a=a0,h1=1n,h0=a0,k1=0n,k0=1n;const steps=[],period=[];let i=0;
 steps.push({i:0,a:a0,h:h0,k:k0,v:h0*h0-D*k0*k0});
 while(h0*h0-D*k0*k0!==1n){if(i>=maxIter||((i&31)===0&&performance.now()-t0>bud))return{error:'iter'};
  m=d*a-m;d=(D-m*m)/d;a=(a0+m)/d;period.push(a);[h1,h0]=[h0,a*h0+h1];[k1,k0]=[k0,a*k0+k1];i++;steps.push({i,a,h:h0,k:k0,v:h0*h0-D*k0*k0})}
 /* повна довжина періоду √D */
 let pl=0;{let m2=0n,d2=1n,a2=a0;do{m2=d2*a2-m2;d2=(D-m2*m2)/d2;a2=(a0+m2)/d2;pl++}while(a2!==2n*a0&&pl<maxIter)}
 return{D,a0,x:h0,y:k0,steps,periodLen:pl}}
M5.pellSolve=pellSolve;
function pellNext(x1,y1,D,n){const out=[[x1,y1]];let x=x1,y=y1;for(let i=1;i<n;i++){[x,y]=[x1*x+D*y1*y,x1*y+y1*x];out.push([x,y])}return out}
M5.pellNext=pellNext;
const PELL=`
<h2>⟦Рівняння Пелля x² − D·y² = 1|Pell’s equation x² − D·y² = 1⟧</h2>
<div class="row"><label>D<input class="s" id="pld" value="61" inputmode="numeric"></label><label>⟦Скільки розв’язків|How many solutions⟧<input class="s" id="pln" value="8"></label><button class="b m" id="plgo">⟦Знайти|Solve⟧</button><button class="b" id="plsv">⟦Зберегти в архів|Save to archive⟧</button></div>
<div class="err" id="plerr"></div><div id="plsum"></div>
<h2>⟦Покрокове пояснення (метод цепних дробів)|Step-by-step (continued-fraction method)⟧</h2><pre id="plst"></pre>
<h2>⟦Таблиця розв’язків із перевіркою підстановкою|Solution table with substitution check⟧</h2><div id="pltb"></div>
<h2>⟦Графічна візуалізація|Visualisation⟧</h2><div class="wide" id="plch"></div>
<h2>⟦Теорія та історія|Theory and history⟧</h2>
<div class="fm">x² − D·y² = 1,  (xₙ + yₙ√D) = (x₁ + y₁√D)ⁿ</div>
<p>⟦Для D, що не є повним квадратом, рівняння має нескінченно багато цілих розв’язків (теорема Лагранжа, 1768). Фундаментальний розв’язок (x₁, y₁) — найменший додатний; усі інші додатні розв’язки дають степені (x₁ + y₁√D)ⁿ. Фундаментальний розв’язок завжди є підхідним дробом розкладу √D у ланцюговий дріб: x₁/y₁ = hₖ/kₖ, де k — індекс кінця першого періоду (або другого, якщо період непарний).|For D that is not a perfect square the equation has infinitely many integer solutions (Lagrange, 1768). The fundamental solution (x₁, y₁) is the smallest positive one; all other positive solutions are the powers (x₁ + y₁√D)ⁿ. It is always a convergent hₖ/kₖ of the continued fraction of √D, taken at the end of the first period (or the second if the period length is odd).⟧</p>
<p>⟦Історично: індійські математики (Брахмагупта, VII ст.; Бхаскара II, XII ст.) розв’язували такі рівняння методом «чакравала»; 1657 р. Ферма запропонував задачу для D = 61 та D = 109; у Європі розв’язки описали Броункер і Валліс, а Ейлер помилково пов’язав рівняння з іменем Пелля.|Historically: Indian mathematicians (Brahmagupta, 7th c.; Bhāskara II, 12th c.) solved such equations by the “chakravala” method; in 1657 Fermat posed the cases D = 61 and D = 109; Brouncker and Wallis described solutions in Europe, and Euler mistakenly attached Pell’s name to the equation.⟧</p>`;
let PL=null;
function pellRun(){try{const D=big('pld','D'),N=Number(big('pln'));if(D<=0n)throw Error(T('D має бути додатним.','D must be positive.'));if(D>10n**12n)throw Error(T('Обмеження обчислювальних ресурсів: D ≤ 10¹².','Resource limit: D ≤ 10¹².'));if(!(N>=1&&N<=60))throw Error(T('Кількість розв’язків: 1…60.','Number of solutions: 1…60.'));
  say('plerr','');const r=pellSolve(D,300000);
  if(r.square){PL=null;html('plsum','<div class="warn">'+T('D = '+D+' — повний квадрат ('+r.a0+'²): рівняння (x − '+r.a0+'y)(x + '+r.a0+'y) = 1 має лише тривіальні розв’язки (±1, 0).','D = '+D+' is a perfect square ('+r.a0+'²): (x − '+r.a0+'y)(x + '+r.a0+'y) = 1 has only trivial solutions (±1, 0).')+'</div>');put('plst','');html('pltb','');html('plch','');return}
  if(r.error){throw Error(T('Занадто багато ітерацій (період завеликий).','Too many iterations (period too long).'))}
  const sols=pellNext(r.x,r.y,D,N),chk=sols.map(([x,y])=>x*x-D*y*y===1n);PL={D,r,sols,ok:chk.every(Boolean),N};
  html('plsum','<div class="kpis"><div class="kpi"><b>'+r.x+'</b>x₁</div><div class="kpi"><b>'+r.y+'</b>y₁</div><div class="kpi"><b>'+r.periodLen+'</b>'+T('довжина періоду √D','period length of √D')+'</div><div class="kpi"><b>'+(chk.every(Boolean)?'✓':'✗')+'</b>'+T('перевірка підстановкою','substitution check')+'</div></div>');
  const L=[T('√'+D+' = ['+r.a0+'; '+r.steps.slice(1,Math.min(r.steps.length,r.periodLen+1)).map(s=>s.a).join(', ')+(r.periodLen<=r.steps.length-1?'':'…')+']',
    '√'+D+' = ['+r.a0+'; '+r.steps.slice(1,Math.min(r.steps.length,r.periodLen+1)).map(s=>s.a).join(', ')+(r.periodLen<=r.steps.length-1?'':'…')+']'),'',
   T('Підхідні дроби hᵢ/kᵢ і значення hᵢ² − D·kᵢ²:','Convergents hᵢ/kᵢ and the value of hᵢ² − D·kᵢ²:')];
  const shown=r.steps.length>60?r.steps.slice(0,30).concat([null],r.steps.slice(-29)):r.steps;
  shown.forEach(s=>L.push(s?('i = '+s.i+':  a = '+s.a+',  h/k = '+s.h+'/'+s.k+',  h² − D·k² = '+s.v+(s.v===1n?'   ← '+T('розв’язок','solution'):'')):'   …'));
  L.push('',T('Перший підхідний дріб із h² − D·k² = 1 — фундаментальний розв’язок:','The first convergent with h² − D·k² = 1 is the fundamental solution:'),'x₁ = '+r.x+', y₁ = '+r.y,T('Наступні: xₙ₊₁ = x₁·xₙ + D·y₁·yₙ, yₙ₊₁ = x₁·yₙ + y₁·xₙ.','Next: xₙ₊₁ = x₁·xₙ + D·y₁·yₙ, yₙ₊₁ = x₁·yₙ + y₁·xₙ.'));
  put('plst',L.join('\n'));
  html('pltb',M5.table(['n','xₙ','yₙ','xₙ² − D·yₙ²',T('перевірка','check')],sols.map(([x,y],i)=>[i+1,x,y,x*x-D*y*y,chk[i]?'✓':'✗'])));
  const lx=sols.map(([x])=>log10Big(x)),ly=sols.map(([,y])=>y>0n?log10Big(y):null);
  html('plch',M5.lineChart({title:T('Зростання розв’язків: log₁₀ xₙ та log₁₀ yₙ','Growth of solutions: log₁₀ xₙ and log₁₀ yₙ'),x:sols.map((_,i)=>i+1),series:[{name:'log₁₀ x',y:lx},{name:'log₁₀ y',y:ly}],xlab:'n',ylab:'log₁₀',zero:true}))
 }catch(e){say('plerr',e.message)}}
/* ---------- Китайська теорема про лишки ---------- */
function crtSolve(eqs){/* eqs: [{r,m}] -> {ok, x, M, steps, ...} */
 const L=[];let x=0n,M=1n,first=true;
 const cp=[];for(let i=0;i<eqs.length;i++)for(let j=i+1;j<eqs.length;j++){const g=gcd(eqs[i].m,eqs[j].m);if(g!==1n)cp.push([i,j,g])}
 for(let i=0;i<eqs.length;i++){const{r,m}=eqs[i],ri=mod(r,m);
  if(first){x=ri;M=m;first=false;L.push((i+1)+') x ≡ '+ri+' (mod '+m+')');continue}
  const g=gcd(M,m),diff=ri-x;
  if(diff%g!==0n){L.push((i+1)+') '+T('НЕСУМІСНО: x ≡ ','INCONSISTENT: x ≡ ')+x+' (mod '+M+') '+T('та','and')+' x ≡ '+ri+' (mod '+m+'): '+T('НСД(','gcd(')+M+', '+m+') = '+g+T(' не ділить ',' does not divide ')+diff);return{ok:false,steps:L,coprime:cp.length===0,cp,bad:[i,g,diff]}}
  const m2=m/g,inv=modinv(M/g,m2),u=m2===1n?0n:mod((diff/g)*inv,m2),nx=x+M*u,nM=M/g*m;
  L.push((i+1)+') '+T('об’єднуємо з x ≡ ','merge with x ≡ ')+x+' (mod '+M+'): '+T('НСД = ','gcd = ')+g+', '+T('обернений до ','inverse of ')+(M/g)+' (mod '+m2+') = '+inv+', '+T('u = ','u = ')+u+' → x ≡ '+mod(nx,nM)+' (mod '+nM+')');
  x=mod(nx,nM);M=nM}
 return{ok:true,x,M,steps:L,coprime:cp.length===0,cp}}
M5.crtSolve=crtSolve;
const CRT=`
<h2>⟦Китайська теорема про лишки|Chinese Remainder Theorem⟧</h2>
<p class="lead">⟦Система x ≡ aᵢ (mod mᵢ). Додавайте довільну кількість порівнянь; для модулів, що не є взаємно простими, працює узагальнений метод (об’єднання попарно).|System x ≡ aᵢ (mod mᵢ). Add any number of congruences; for moduli that are not pairwise coprime the generalised (pairwise merge) method is used.⟧</p>
<div id="crows"></div>
<div class="row"><button class="b" id="cadd">⟦+ Додати порівняння|+ Add congruence⟧</button><button class="b m" id="cgo">⟦Розв’язати|Solve⟧</button><button class="b" id="cex1">⟦Приклад Сунь-цзи|Sunzi example⟧</button><button class="b" id="cex2">⟦Не взаємно прості|Non-coprime⟧</button><button class="b" id="cex3">⟦Несумісна система|Inconsistent system⟧</button><button class="b" id="csv">⟦Зберегти в архів|Save to archive⟧</button></div>
<div class="err" id="cerr"></div><pre id="cout"></pre>
<h2>⟦Приклад застосування: RSA-CRT (прискорене розшифрування)|Application: RSA-CRT (faster decryption)⟧</h2>
<div class="row"><label>p<input class="s" id="crp" value="61"></label><label>q<input class="s" id="crq" value="53"></label><label>e<input class="s" id="cre" value="17"></label><label>⟦повідомлення m (число)|message m (number)⟧<input class="s" id="crm" value="65"></label><button class="b m" id="crgo">⟦Порівняти|Compare⟧</button></div>
<pre id="crout"></pre>
<p class="mut">⟦У криптографії КТО застосовують для прискорення розшифрування RSA (обчислення за модулями p і q окремо, потім з’єднання за алгоритмом Гарнера), у схемах розподілу секрету (Міньотта, Асмута—Блума) та в системах залишкових класів.|In cryptography CRT speeds up RSA decryption (computing mod p and mod q separately and recombining via Garner’s algorithm), and is used in secret-sharing schemes (Mignotte, Asmuth–Bloom) and residue number systems.⟧</p>`;
let CR=null;
function crowAdd(r,m){const d=document.createElement('div');d.className='row crow';d.innerHTML='<label>x ≡<input class="s cr" inputmode="numeric" value="'+(r??'')+'"></label><label>(mod)<input class="s cm" inputmode="numeric" value="'+(m??'')+'"></label><button class="b cdel" aria-label="delete">✕</button>';
 d.querySelector('.cdel').onclick=()=>{if(qa('.crow').length>1)d.remove()};q('#crows').appendChild(d)}
function crowSet(a){q('#crows').textContent='';a.forEach(([r,m])=>crowAdd(r,m))}
function crtRun(){try{const eqs=qa('.crow').map((d,i)=>{const r=d.querySelector('.cr').value,m=d.querySelector('.cm').value;if(!isI(r)||!isI(m))throw Error(T('Рядок ','Row ')+(i+1)+': '+T('введіть цілі числа.','enter integers.'));const mm=BigInt(m);if(mm<=0n)throw Error(T('Рядок ','Row ')+(i+1)+': '+T('модуль має бути додатним.','modulus must be positive.'));return{r:BigInt(r),m:mm}});
  say('cerr','');const res=crtSolve(eqs),L=[];
  L.push(T('Система:','System:'));eqs.forEach(e=>L.push('   x ≡ '+e.r+' (mod '+e.m+')'));L.push('');
  L.push(T('Перевірка модулів: усі додатні ✓','Moduli check: all positive ✓'));
  if(res.coprime)L.push(T('Попарна взаємна простота: так (НСД(mᵢ, mⱼ) = 1 для всіх пар)','Pairwise coprime: yes (gcd(mᵢ, mⱼ) = 1 for all pairs)'));
  else L.push(T('Попарна взаємна простота: НІ — ','Pairwise coprime: NO — ')+res.cp.map(([i,j,g])=>'НСД(m'+(i+1)+', m'+(j+1)+') = '+g).join('; '));
  if(res.coprime&&eqs.length>1){const M=eqs.reduce((p,e)=>p*e.m,1n);L.push('',T('Класичний метод: M = ∏mᵢ = ','Classical method: M = ∏mᵢ = ')+M);let sum=0n;
   eqs.forEach((e,i)=>{const Mi=M/e.m,yi=modinv(Mi,e.m);L.push('   M'+(i+1)+' = '+Mi+', '+T('обернений y','inverse y')+(i+1)+' = M'+(i+1)+'⁻¹ mod '+e.m+' = '+yi);sum+=e.r*Mi*yi});
   L.push('   x ≡ Σ aᵢ·Mᵢ·yᵢ = '+sum+' ≡ '+mod(sum,M)+' (mod '+M+')')}
  L.push('',T('Покрокове об’єднання:','Step-by-step merging:'));res.steps.forEach(s=>L.push(s));
  if(!res.ok){L.push('',T('Висновок: система несумісна — розв’язків немає.','Conclusion: the system is inconsistent — no solutions.'));CR={eqs,ok:false,res};put('cout',L.join('\n'));return}
  L.push('',T('Загальна формула: x = ','General formula: x = ')+res.x+' + '+res.M+'·k,  k ∈ ℤ');
  const chk=eqs.every(e=>mod(res.x,e.m)===mod(e.r,e.m));L.push(T('Перевірка підстановкою x = ','Substitution check x = ')+res.x+': '+eqs.map(e=>res.x+' mod '+e.m+' = '+mod(res.x,e.m)).join('; ')+'  '+(chk?'✓':'✗'));
  CR={eqs,ok:true,res,chk};put('cout',L.join('\n'))}catch(e){say('cerr',e.message)}}
function crtRsa(){try{const p=big('crp'),qq=big('crq'),e=big('cre'),m=big('crm');if(!M5.isPrime(p)||!M5.isPrime(qq)||p===qq)throw Error(T('p і q мають бути різними простими.','p and q must be distinct primes.'));
  const n=p*qq,phi=(p-1n)*(qq-1n),d=modinv(e,phi);if(d===null)throw Error(T('НСД(e, φ) ≠ 1.','gcd(e, φ) ≠ 1.'));if(m<0n||m>=n)throw Error('0 ≤ m < n = '+n);
  const c=M5.modpow(m,e,n),dp=d%(p-1n),dq=d%(qq-1n),mp=M5.modpow(c,dp,p),mq=M5.modpow(c,dq,qq),qinv=modinv(qq,p),h=mod(qinv*(mp-mq),p),mr=mq+h*qq,mf=M5.modpow(c,d,n);
  put('crout',['n = '+n+', φ = '+phi+', d = '+d,T('Шифртекст c = mᵉ mod n = ','Ciphertext c = mᵉ mod n = ')+c,'',T('Звичайне розшифрування: cᵈ mod n = ','Plain decryption: cᵈ mod n = ')+mf,'',T('RSA-CRT (Гарнер):','RSA-CRT (Garner):'),'   dₚ = d mod (p−1) = '+dp+',  d_q = d mod (q−1) = '+dq,'   mₚ = c^dₚ mod p = '+mp+',  m_q = c^d_q mod q = '+mq,'   q⁻¹ mod p = '+qinv+',  h = q⁻¹(mₚ − m_q) mod p = '+h,'   m = m_q + h·q = '+mr,'',T('Результати збігаються: ','Results match: ')+(mr===mf&&mr===m?'✓ (m = '+m+')':'✗'),T('Експоненти в CRT-варіанті приблизно вдвічі коротші, а модулі — вдвічі менші, що дає приблизно чотириразове прискорення.','CRT exponents are about half as long and moduli half as large, giving roughly a 4× speed-up.')].join('\n'))}catch(e){put('crout',e.message)}}
/* ---------- Ланцюгові дроби ---------- */
function cfRational(p,qq){const a=[],st=[];let x=p,y=qq;while(y!==0n){const d=fdiv(x,y);st.push({x,y,q:d,r:x-d*y});a.push(d);[x,y]=[y,x-d*y]}return{a,st}}
function cfQuad(P,D,Q,maxLen){/* x=(P+√D)/Q, Q>0, D не квадрат */
 if(Q<0n)throw Error('Q>0');if(Q===0n)throw Error('Q=0');
 if((D-P*P)%Q!==0n){P=P*Q;D=D*Q*Q;Q=Q*Q}
 const s=isqrt(D),a=[],seen=new Map();let p=P,qq=Q,per=-1,start=-1;
 for(let i=0;i<maxLen;i++){const key=p+','+qq;if(seen.has(key)){if(per<0){start=seen.get(key);per=i-start}}else seen.set(key,i);const d=fdiv(p+s,qq);a.push(d);p=d*qq-p;qq=(D-p*p)/qq}
 return{a,start,per,P,D,Q}}
function convergents(a){const h=[],k=[];let h1=1n,h0=a[0],k1=0n,k0=1n;h.push(h0);k.push(k0);for(let i=1;i<a.length;i++){[h1,h0]=[h0,a[i]*h0+h1];[k1,k0]=[k0,a[i]*k0+k1];h.push(h0);k.push(k0)}return{h,k}}
M5.cfRational=cfRational;M5.cfQuad=cfQuad;M5.convergents=convergents;
const CF=`
<h2>⟦Ланцюгові дроби|Continued fractions⟧</h2>
<div class="row"><label>⟦Тип|Type⟧<select id="cft"><option value="rat">⟦раціональне p/q або десяткове|rational p/q or decimal⟧</option><option value="sqrt">√D</option><option value="quad">(P + √D)/Q</option></select></label>
<label id="cfl1">p/q<input class="w" id="cf1" value="415/93" style="min-width:150px"></label><label id="cfl2" hidden>D<input class="s" id="cf2" value="2"></label><label id="cfl3" hidden>Q<input class="s" id="cf3" value="2"></label>
<label>⟦кількість членів|number of terms⟧<input class="s" id="cfn" value="12"></label><button class="b m" id="cfgo">⟦Розкласти|Expand⟧</button><button class="b" id="cfsv">⟦Зберегти в архів|Save to archive⟧</button></div>
<div class="err" id="cferr"></div><div id="cfsum"></div><pre id="cfst"></pre><div id="cftb"></div>
<h2>⟦Візуалізація наближень|Visualising the approximations⟧</h2><div class="wide" id="cfch"></div><div class="wide" id="cfnl"></div>
<h2>⟦Зв’язок з алгоритмом Евкліда та рівнянням Пелля|Link with the Euclidean algorithm and Pell’s equation⟧</h2>
<p>⟦Для p/q послідовні частки алгоритму Евкліда p = a₀q + r₁, q = a₁r₁ + r₂, … і є членами ланцюгового дробу [a₀; a₁, a₂, …]. Підхідні дроби hₖ/kₖ — найкращі раціональні наближення, а hₖ·kₖ₋₁ − hₖ₋₁·kₖ = (−1)ᵏ⁻¹ — це діофантове рівняння з НСД = 1, яке розв’язується тим самим розширеним алгоритмом Евкліда. Для √D періодичний ланцюговий дріб дає розв’язки рівняння Пелля: hₖ² − D·kₖ² = ±1.|For p/q the successive quotients of the Euclidean algorithm p = a₀q + r₁, q = a₁r₁ + r₂, … are exactly the terms of [a₀; a₁, a₂, …]. The convergents hₖ/kₖ are the best rational approximations, and hₖ·kₖ₋₁ − hₖ₋₁·kₖ = (−1)ᵏ⁻¹ is a Diophantine equation with gcd 1, solved by the same extended Euclidean algorithm. For √D the periodic continued fraction yields Pell solutions: hₖ² − D·kₖ² = ±1.⟧</p>`;
let CFS=null;
function parseRational(s){s=s.trim().replace(',','.');let m;
 if((m=/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/.exec(s))){let p=BigInt(m[1]),qq=BigInt(m[2]);if(qq===0n)throw Error(T('Знаменник = 0.','Denominator = 0.'));if(qq<0n){p=-p;qq=-qq}return[p,qq]}
 if((m=/^([+-]?)(\d*)\.(\d+)$/.exec(s))){const neg=m[1]==='-',ip=m[2]||'0',fr=m[3];let p=BigInt(ip+fr),qq=10n**BigInt(fr.length);return[neg?-p:p,qq]}
 if(/^[+-]?\d+$/.test(s))return[BigInt(s),1n];throw Error(T('Формат: p/q, ціле або десятковий дріб.','Format: p/q, integer or decimal fraction.'))}
function cfRun(){try{const type=q('#cft').value,N=Number(big('cfn'));if(!(N>=1&&N<=200))throw Error(T('Кількість членів: 1…200.','Number of terms: 1…200.'));say('cferr','');
  const S=10n**40n;let a,exactScaled,L=[],per=null,title,D=null;
  if(type==='rat'){const[p,qq]=parseRational(q('#cf1').value);const r=cfRational(p,qq);a=r.a;exactScaled=p*S/qq;title=p+'/'+qq;
   L.push(T('Алгоритм Евкліда для ','Euclid’s algorithm for ')+p+'/'+qq+':');r.st.forEach((s,i)=>L.push('   '+s.x+' = '+s.q+'·'+s.y+' + '+s.r+'      → a'+i+' = '+s.q));L.push('',title+' = ['+a[0]+(a.length>1?'; '+a.slice(1).join(', '):'')+']',T('Частки Евкліда збігаються з членами ланцюгового дробу.','The Euclid quotients coincide with the continued-fraction terms.'));
   if(a.length>N)a=a.slice(0,N)}
  else{let P=0n,Q=1n;D=big('cf2','D');if(type==='quad'){P=big('cf1','P');Q=big('cf3','Q')}else{}
   if(D<=0n)throw Error('D>0');if(isqrt(D)**2n===D)throw Error(T('D — повний квадрат: число раціональне (використайте режим p/q).','D is a perfect square: the number is rational (use p/q mode).'));
   if(Q<=0n)throw Error(T('Підтримується Q > 0.','Only Q > 0 is supported.'));
   const r=cfQuad(P,D,Q,Math.max(N,400));a=r.a;per=r;const sq=isqrt(D*S*S);exactScaled=(P*S+sq)/Q;
   title=type==='sqrt'?'√'+D:'('+P+' + √'+D+')/'+Q;
   L.push(title+' = ['+a[0]+'; '+a.slice(1,Math.min(a.length,N)).join(', ')+(a.length>N?', …':'')+']');
   if(r.per>0)L.push(T('Період: довжина ','Period: length ')+r.per+(r.start>0?T(' (передперіод ',' (preperiod ')+r.start+')':'')+' → ['+a.slice(r.start,r.start+r.per).join(', ')+']');
   a=a.slice(0,N)}
  const{h,k}=convergents(a);CFS={a,h,k,title,type};const rows=[],errs=[];
  for(let i=0;i<a.length;i++){const val=h[i]*S/k[i],err=abs(exactScaled-val),pe=D!==null?h[i]*h[i]-D*k[i]*k[i]:null;
   const dec=(Number(h[i])/Number(k[i]));errs.push(err>0n?log10Big(err)-40:null);
   rows.push([i,a[i],h[i]+'/'+k[i],isFinite(dec)?dec.toPrecision(12):'—',(err<=2n?'< 1e-39':(Number(err)/1e40).toExponential(2)),D!==null?pe:'']);}
  html('cfsum','<div class="kpis"><div class="kpi"><b>'+title+'</b>'+T('число','number')+'</div><div class="kpi"><b>'+a.length+'</b>'+T('членів','terms')+'</div>'+(per&&per.per>0?'<div class="kpi"><b>'+per.per+'</b>'+T('довжина періоду','period length')+'</div>':'')+'</div>');
  put('cfst',L.join('\n'));
  /* точні помилки: |x − h/k| у масштабі 1e40 */
  const hdr=['i','aᵢ','hᵢ/kᵢ',T('значення','value'),T('похибка','error')];if(D!==null)hdr.push('hᵢ² − D·kᵢ²');
  html('cftb',M5.table(hdr,rows)+(D!==null?'<p class="mut">'+T('Значення hᵢ² − D·kᵢ² = ±1 означає розв’язок рівняння Пелля (x² − Dy² = 1) або «від’ємного» Пелля (= −1).','A value hᵢ² − D·kᵢ² = ±1 means a solution of Pell’s equation (= 1) or the negative Pell equation (= −1).')+'</p>':''));
  html('cfch',M5.lineChart({title:T('Збіжність: log₁₀|x − hᵢ/kᵢ|','Convergence: log₁₀|x − hᵢ/kᵢ|'),x:a.map((_,i)=>i),series:[{name:T('похибка','error'),y:errs.map(v=>v===null?null:v)}],xlab:'i',ylab:'log₁₀(error)',zero:false}));
  /* числова пряма */
  const vals=h.map((x,i)=>Number(x)/Number(k[i])),tv=Number(exactScaled)/1e40,mn=Math.min(...vals,tv),mx=Math.max(...vals,tv),W=760,H=110,X=v=>30+(v-mn)/(mx-mn||1)*(W-60);
  let s='<svg xmlns="http://www.w3.org/2000/svg" class="ch" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" style="background:#0a0a0c" font-family="Segoe UI,Arial"><line x1="20" x2="'+(W-20)+'" y1="60" y2="60" stroke="#666"/><line x1="'+X(tv)+'" x2="'+X(tv)+'" y1="28" y2="92" stroke="#ff4d5e" stroke-width="2"/><text x="'+X(tv)+'" y="20" fill="#ff4d5e" font-size="11" text-anchor="middle">x</text>';
  vals.slice(0,10).forEach((v,i)=>{const yy=i%2?78:44;s+='<circle cx="'+X(v)+'" cy="60" r="4" fill="#fff"/><text x="'+X(v)+'" y="'+yy+'" fill="#ddd" font-size="10" text-anchor="middle">'+i+'</text>'});
  html('cfnl','<p class="mut">'+T('Числова пряма: перші підхідні дроби (номери) наближаються до x з обох боків по черзі.','Number line: the first convergents (indices) approach x alternately from both sides.')+'</p>'+s+'</svg>')
 }catch(e){say('cferr',e.message)}}
/* ---------- ініціалізація ---------- */
M5.addTab('pell','Рівняння Пелля','Pell’s equation',PELL,()=>{q('#plgo').onclick=pellRun;q('#pld').addEventListener('keydown',e=>{if(e.key==='Enter')pellRun()});
 q('#plsv').onclick=()=>{if(!PL){say('plerr',T('Спочатку знайдіть розв’язки.','Solve first.'));return}M5.saveEntry('pell',T('Пелль: x² − ','Pell: x² − ')+PL.D+'y² = 1',{D:String(PL.D),count:PL.N},{x1:String(PL.r.x),y1:String(PL.r.y),periodLength:PL.r.periodLen,allVerified:PL.ok,rows:[['n','x','y','x^2-D*y^2'],...PL.sols.slice(0,12).map(([x,y],i)=>[i+1,String(x),String(y),String(x*x-PL.D*y*y)])]},{chart:q('#plch').innerHTML,conclusion:T('Фундаментальний розв’язок (x₁, y₁) = ('+PL.r.x+', '+PL.r.y+'); усі '+PL.N+' обчислених розв’язків перевірено підстановкою: '+(PL.ok?'так':'ні')+'.','Fundamental solution (x₁, y₁) = ('+PL.r.x+', '+PL.r.y+'); all '+PL.N+' computed solutions verified by substitution: '+(PL.ok?'yes':'no')+'.')})};
 M5.rerun.pell=e=>{M5.openTab('pell');q('#pld').value=e.params.D;q('#pln').value=e.params.count;pellRun()};pellRun();
 document.addEventListener('mc5:lang',pellRun)});
M5.addTab('crt','Китайська теорема про лишки','Chinese Remainder Theorem',CRT,()=>{crowSet([[2,3],[3,5],[2,7]]);
 q('#cadd').onclick=()=>crowAdd('','');q('#cgo').onclick=crtRun;q('#crgo').onclick=crtRsa;
 q('#cex1').onclick=()=>{crowSet([[2,3],[3,5],[2,7]]);crtRun()};q('#cex2').onclick=()=>{crowSet([[2,6],[6,10],[1,5]]);crtRun()};q('#cex3').onclick=()=>{crowSet([[1,4],[2,6]]);crtRun()};
 q('#csv').onclick=()=>{if(!CR){crtRun()}if(!CR)return;M5.saveEntry('crt',T('КТО: ','CRT: ')+CR.eqs.map(e=>e.r+' mod '+e.m).join(', '),{eqs:CR.eqs.map(e=>[String(e.r),String(e.m)])},{consistent:CR.ok,x:CR.ok?String(CR.res.x):null,M:CR.ok?String(CR.res.M):null,steps:CR.res.steps.join('\n'),verified:CR.chk||false},{conclusion:CR.ok?T('Розв’язок: x ≡ ','Solution: x ≡ ')+CR.res.x+' (mod '+CR.res.M+').':T('Система несумісна.','The system is inconsistent.')})};
 M5.rerun.crt=e=>{M5.openTab('crt');crowSet(e.params.eqs);crtRun()};crtRun();crtRsa();
 document.addEventListener('mc5:lang',()=>{crtRun();crtRsa()})});
M5.addTab('cf','Ланцюгові дроби','Continued fractions',CF,()=>{const upd=()=>{const t=q('#cft').value;q('#cfl2').hidden=t==='rat';q('#cfl3').hidden=t!=='quad';q('#cfl1').firstChild.nodeValue=t==='quad'?'P':t==='sqrt'?'—':'p/q';q('#cfl1').hidden=t==='sqrt';if(t==='rat'&&!/[\/.]|^\d+$/.test(q('#cf1').value))q('#cf1').value='415/93';if(t==='quad'){q('#cf1').value='1';q('#cf2').value='5';q('#cf3').value='2'}if(t==='sqrt'){q('#cf2').value='2'}if(t==='rat'){q('#cf1').value='415/93'}};
 q('#cft').onchange=upd;q('#cfgo').onclick=cfRun;
 q('#cfsv').onclick=()=>{if(!CFS){cfRun()}if(!CFS)return;M5.saveEntry('cf',T('Ланцюговий дріб: ','Continued fraction: ')+CFS.title,{type:q('#cft').value,v1:q('#cf1').value,v2:q('#cf2').value,v3:q('#cf3').value,terms:CFS.a.length},{terms:CFS.a.map(String),convergents:CFS.h.map((h,i)=>h+'/'+CFS.k[i])},{chart:q('#cfch').innerHTML,conclusion:T('Ланцюговий дріб числа ','Continued fraction of ')+CFS.title+' = ['+CFS.a[0]+'; '+CFS.a.slice(1).join(', ')+'].'})};
 M5.rerun.cf=e=>{M5.openTab('cf');q('#cft').value=e.params.type;upd();q('#cf1').value=e.params.v1;q('#cf2').value=e.params.v2;q('#cf3').value=e.params.v3;q('#cfn').value=e.params.terms;cfRun()};cfRun();
 document.addEventListener('mc5:lang',cfRun)});
})();
