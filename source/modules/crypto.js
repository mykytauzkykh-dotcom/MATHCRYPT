/* ===== Cryptography Lab: RSA, Diffie–Hellman, ECC, Hash, classical ciphers ===== */
(()=>{'use strict';
const M5=window.M5;const{q,qa,T,esc,put,say,html,big,isI,abs,gcd,xgcd,modinv,mod,modpow,isPrime,genPrime,factor}=M5;
const WARN='<div class="warn" role="note">⟦Навчальна реалізація: не призначена для захисту реальних конфіденційних даних.|Educational implementation: not intended to protect real confidential data.⟧</div>';
/* ================= RSA (пошагово) ================= */
const RSA=`<h2>⟦RSA: покрокова генерація ключів|RSA: step-by-step key generation⟧</h2>${WARN}
<div class="row"><label>p<input class="s" id="r5p" value="61"></label><label>q<input class="s" id="r5q" value="53"></label><label>e<input class="s" id="r5e" value="17"></label><label>⟦повідомлення m (число)|message m (number)⟧<input class="s" id="r5m" value="65"></label>
<button class="b m" id="r5go">⟦Обчислити|Compute⟧</button></div>
<div class="row"><label>⟦біт у простих|bits per prime⟧<select id="r5b"><option>16</option><option>24</option><option>32</option><option>48</option><option>64</option></select></label><button class="b" id="r5gen">⟦Згенерувати p, q, e|Generate p, q, e⟧</button><button class="b" id="r5dio">⟦Відкрити e·d + φ·k = 1 у лабораторії|Open e·d + φ·k = 1 in the Lab⟧</button><button class="b" id="r5sv">⟦Зберегти в архів|Save to archive⟧</button></div>
<div class="err" id="r5err"></div><pre id="r5out"></pre>
<p class="mut">⟦Для шифрування тексту (UTF-8) використовуйте вкладку «RSA: текст і ключі».|For text (UTF-8) encryption use the “RSA: text and keys” tab.⟧</p>`;
let R5=null;
function rsaRun(){try{const p=big('r5p','p'),qq=big('r5q','q'),e=big('r5e','e'),m=big('r5m','m'),L=[];say('r5err','');
  L.push(T('1) Перевірка простоти: ','1) Primality check: ')+'p = '+p+' → '+(isPrime(p)?T('просте','prime'):T('СКЛАДЕНЕ','COMPOSITE'))+';  q = '+qq+' → '+(isPrime(qq)?T('просте','prime'):T('СКЛАДЕНЕ','COMPOSITE')));
  if(!isPrime(p)||!isPrime(qq))throw Error(T('p і q мають бути простими.','p and q must be prime.'));if(p===qq)throw Error(T('p ≠ q.','p ≠ q.'));
  const n=p*qq,phi=(p-1n)*(qq-1n);L.push('2) n = p·q = '+n+'  ('+n.toString(2).length+T(' біт)',' bits)'));
  L.push('3) '+T('Функція Ейлера: ','Euler’s function: ')+'φ(n) = (p − 1)(q − 1) = '+(p-1n)+'·'+(qq-1n)+' = '+phi);
  if(!(e>1n&&e<phi))throw Error(T('Потрібно 1 < e < φ(n).','Need 1 < e < φ(n).'));const g=gcd(e,phi);L.push('4) '+T('НСД(e, φ) = ','gcd(e, φ) = ')+g+(g===1n?' ✓':' ✗'));if(g!==1n)throw Error(T('e і φ(n) мають бути взаємно простими.','e and φ(n) must be coprime.'));
  const r=xgcd(e,phi);L.push('5) '+T('Закритий показник d з e·d ≡ 1 (mod φ) — діофантове рівняння ','Private exponent d from e·d ≡ 1 (mod φ) — the Diophantine equation ')+'e·d + φ·k = 1:');
  r.steps.forEach((s,i)=>L.push('     '+s.a+' = '+s.q+'·'+s.b+' + '+s.r));
  L.push('     '+T('Безу: ','Bézout: ')+e+'·('+r.x+') + '+phi+'·('+r.y+') = '+r.g);
  const d=mod(r.x,phi);L.push('     '+T('Загальний розв’язок: d = ','General solution: d = ')+r.x+' + '+phi+'·t;  '+T('найменше додатне d = ','smallest positive d = ')+d+';  k = '+(1n-e*d)/phi);
  L.push('     '+T('Перевірка: ','Check: ')+'e·d mod φ = '+(e*d%phi)+(e*d%phi===1n?' ✓':' ✗'));
  L.push('6) '+T('Відкритий ключ: (n, e) = (','Public key: (n, e) = (')+n+', '+e+');  '+T('закритий: (n, d) = (','private: (n, d) = (')+n+', '+d+')');
  if(m<0n||m>=n)throw Error('0 ≤ m < n = '+n);
  const c=modpow(m,e,n),back=modpow(c,d,n);L.push('7) '+T('Шифрування: c = mᵉ mod n = ','Encryption: c = mᵉ mod n = ')+m+'^'+e+' mod '+n+' = '+c);
  L.push('8) '+T('Розшифрування: m′ = cᵈ mod n = ','Decryption: m′ = cᵈ mod n = ')+back+(back===m?'  ✓':'  ✗'));
  const cop=gcd(m,n)===1n;if(cop)L.push('9) '+T('Теорема Ейлера: m^φ(n) mod n = ','Euler’s theorem: m^φ(n) mod n = ')+modpow(m,phi,n)+(modpow(m,phi,n)===1n?' ✓':' ✗'));
  const lam=phi/gcd(p-1n,qq-1n);L.push('10) '+T('Функція Кармайкла λ(n) = ','Carmichael λ(n) = ')+lam+T(';  d за λ: ',';  d via λ: ')+modinv(e,lam)+' ('+T('теж працює','also works')+')');
  R5={p,q:qq,e,m,n,phi,d,c,ok:back===m};put('r5out',L.join('\n'))}catch(e){say('r5err',e.message)}}
function rsaGen(){try{const bits=Number(q('#r5b').value);let p,qq,phi,e=65537n;for(let i=0;i<50;i++){p=genPrime(bits);qq=genPrime(bits);if(p===qq)continue;phi=(p-1n)*(qq-1n);if(gcd(e,phi)===1n)break;e=3n+2n*BigInt(i)}
  q('#r5p').value=p;q('#r5q').value=qq;q('#r5e').value=e;q('#r5m').value=String((p*qq)/3n+12345n);rsaRun()}catch(e){say('r5err',e.message)}}
M5.addTab('rsa5','RSA: покрокова лабораторія','RSA: step-by-step lab',RSA,()=>{q('#r5go').onclick=rsaRun;q('#r5gen').onclick=rsaGen;
 q('#r5dio').onclick=()=>{if(!R5)rsaRun();if(!R5)return;M5.openTab('lab');q('#la').value=R5.e;q('#lb').value=R5.phi;q('#lc').value=1;q('#lgo').click()};
 q('#r5sv').onclick=()=>{if(!R5)rsaRun();if(!R5)return;M5.saveEntry('rsa5','RSA n = '+R5.n,{p:String(R5.p),q:String(R5.q),e:String(R5.e),m:String(R5.m)},{n:String(R5.n),phi:String(R5.phi),d:String(R5.d),c:String(R5.c),decryptedEqualsM:R5.ok,steps:q('#r5out').textContent},{conclusion:T('Розшифрування відновило повідомлення: ','Decryption recovered the message: ')+(R5.ok?T('так','yes'):T('ні','no'))+'.'})};
 M5.rerun.rsa5=e=>{M5.openTab('rsa5');['p','q','e','m'].forEach(k=>q('#r5'+k).value=e.params[k]);rsaRun()};rsaRun();document.addEventListener('mc5:lang',rsaRun)});
/* ================= Diffie–Hellman ================= */
const DH=`<h2>⟦Обмін ключами Діффі — Геллмана|Diffie–Hellman key exchange⟧</h2>${WARN}
<div class="row"><label>⟦p (просте)|p (prime)⟧<input class="s" id="dhp" value="23"></label><label>g<input class="s" id="dhg" value="5"></label><label>⟦a — таємниця Аліси|a — Alice’s secret⟧<input class="s" id="dha" value="6"></label><label>⟦b — таємниця Боба|b — Bob’s secret⟧<input class="s" id="dhb" value="15"></label></div>
<div class="row"><label>⟦біт у p|bits of p⟧<select id="dhbits"><option>16</option><option>24</option><option>32</option><option>64</option><option>128</option></select></label><button class="b" id="dhgen">⟦Згенерувати|Generate⟧</button><button class="b m" id="dhgo">⟦Обчислити обмін|Run exchange⟧</button><button class="b" id="dheve">⟦Атака Єви (перебір)|Eve’s brute force⟧</button><button class="b" id="dhsv">⟦Зберегти в архів|Save to archive⟧</button></div>
<div class="err" id="dherr"></div><div class="dhcards" id="dhcards"></div><pre id="dhout"></pre><pre id="dheveo"></pre>`;
let DHS=null;
function dhRun(){try{const p=big('dhp','p'),g=big('dhg','g'),a=big('dha','a'),b=big('dhb','b'),L=[];say('dherr','');
  if(!isPrime(p))throw Error(T('p має бути простим.','p must be prime.'));if(!(g>=2n&&g<=p-2n))throw Error('2 ≤ g ≤ p − 2');if(!(a>=1n&&a<p-1n&&b>=1n&&b<p-1n))throw Error('1 ≤ a, b ≤ p − 2');
  const A=modpow(g,a,p),B=modpow(g,b,p),sa=modpow(B,a,p),sb=modpow(A,b,p);
  L.push(T('Публічні параметри: p = ','Public parameters: p = ')+p+', g = '+g);
  if(p.toString(2).length<=40){const f=[...new Set(factor(p-1n))];const prim=f.every(r=>modpow(g,(p-1n)/r,p)!==1n);L.push(T('g — первісний корінь за модулем p: ','g is a primitive root mod p: ')+(prim?T('так','yes'):T('ні (порядок g менший за p−1)','no (order of g is less than p−1)'))+'  ('+T('прості дільники p−1: ','prime divisors of p−1: ')+f.join(', ')+')')}
  else L.push(T('g — первісний корінь: не перевірялося (p велике).','g is a primitive root: not checked (p is large).'));
  L.push('','Alice: '+T('таємне a = ','secret a = ')+a+' → A = gᵃ mod p = '+g+'^'+a+' mod '+p+' = '+A);
  L.push('Bob:   '+T('таємне b = ','secret b = ')+b+' → B = gᵇ mod p = '+g+'^'+b+' mod '+p+' = '+B);
  L.push('',T('Обмін відкритими ключами: A та B передаються відкритим каналом.','Public keys A and B are sent over an open channel.'));
  L.push('Alice: s = Bᵃ mod p = '+B+'^'+a+' mod '+p+' = '+sa);L.push('Bob:   s = Aᵇ mod p = '+A+'^'+b+' mod '+p+' = '+sb);
  L.push('',T('Спільний секрет збігається: ','Shared secret matches: ')+(sa===sb?'✓ s = '+sa:'✗'));
  DHS={p,g,a,b,A,B,s:sa,ok:sa===sb};put('dhout',L.join('\n'));put('dheveo','');
  html('dhcards','<div class="kpis"><div class="kpi"><b>A = '+A+'</b>Alice → Bob</div><div class="kpi"><b>B = '+B+'</b>Bob → Alice</div><div class="kpi"><b>s = '+sa+'</b>'+T('спільний секрет','shared secret')+'</div></div>')}catch(e){say('dherr',e.message)}}
function dhGen(){try{const bits=Number(q('#dhbits').value),p=genPrime(bits);let g=2n;if(bits<=40){const f=[...new Set(factor(p-1n))];for(let c=2n;c<p;c++){if(f.every(r=>modpow(c,(p-1n)/r,p)!==1n)){g=c;break}}}
  q('#dhp').value=p;q('#dhg').value=g;q('#dha').value=M5.randBits(Math.max(8,bits-2))%(p-3n)+2n;q('#dhb').value=M5.randBits(Math.max(8,bits-2))%(p-3n)+2n;dhRun()}catch(e){say('dherr',e.message)}}
function dhEve(){if(!DHS){dhRun();if(!DHS)return}const{p,g,A,B,s}=DHS,LIM=3000000;let x=1n,k=0;const t0=performance.now();
 for(let i=1;i<=LIM;i++){x=x*g%p;if(x===A){k=i;break}}
 const ms=performance.now()-t0;
 if(k){const ss=modpow(B,BigInt(k),p);put('dheveo',T('Єва перебором знайшла a = ','Eve found a = ')+k+T(' за ',' in ')+M5.fmtT(ms)+T(' (кроків: ',' (steps: ')+k+'): '+T('спільний секрет s = Bᵃ = ','shared secret s = Bᵃ = ')+ss+(ss===s?' ✓':'')+'\n'+T('Для малого p атака тривіальна — безпека DH залежить від складності дискретного логарифма при великому p.','For small p the attack is trivial — DH security relies on the hardness of the discrete logarithm for large p.'))}
 else put('dheveo',T('За ','Within ')+LIM+T(' кроків перебору a не знайдено (',' brute-force steps a was not found (')+M5.fmtT(ms)+T('). Для такого p перебір непрактичний.','). Brute force is impractical for such p.'))}
M5.addTab('dh','Діффі — Геллман','Diffie–Hellman',DH,()=>{q('#dhgo').onclick=dhRun;q('#dhgen').onclick=dhGen;q('#dheve').onclick=dhEve;
 q('#dhsv').onclick=()=>{if(!DHS)dhRun();if(!DHS)return;M5.saveEntry('dh','DH p = '+DHS.p,{p:String(DHS.p),g:String(DHS.g),a:String(DHS.a),b:String(DHS.b)},{A:String(DHS.A),B:String(DHS.B),s:String(DHS.s),secretsMatch:DHS.ok,steps:q('#dhout').textContent},{conclusion:T('Обидві сторони отримали однаковий секрет: ','Both parties obtained the same secret: ')+(DHS.ok?T('так','yes'):T('ні','no'))+'.'})};
 M5.rerun.dh=e=>{M5.openTab('dh');['p','g','a','b'].forEach(k=>q('#dh'+k).value=e.params[k]);dhRun()};dhRun();document.addEventListener('mc5:lang',dhRun)});
/* ================= Elliptic curves ================= */
const ECC=`<h2>⟦Еліптичні криві|Elliptic curves⟧</h2>${WARN}
<div class="fm">y² = x³ + a·x + b,  Δ = −16(4a³ + 27b²) ≠ 0</div>
<div class="note">⟦Два режими: (1) геометрична ілюстрація над дійсними числами (ℝ) — лише для розуміння; (2) криптографічні обчислення над скінченним полем 𝔽ₚ — точна цілочисельна арифметика.|Two modes: (1) geometric illustration over the real numbers (ℝ) — for understanding only; (2) cryptographic computation over a finite field 𝔽ₚ — exact integer arithmetic.⟧</div>
<h2>⟦Режим 1: дійсні числа (геометрія)|Mode 1: real numbers (geometry)⟧</h2>
<div class="row"><label>a<input class="s" id="ea" value="-3"></label><label>b<input class="s" id="eb" value="3"></label><label>x(P)<input class="s" id="epx" value="-1.5"></label><label>y(P)<select id="eps"><option value="1">+</option><option value="-1">−</option></select></label><label>x(Q)<input class="s" id="eqx" value="0.5"></label><label>y(Q)<select id="eqs"><option value="1">+</option><option value="-1" selected>−</option></select></label><label>k<input class="s" id="ek" value="3"></label></div>
<div class="row"><button class="b m" id="eadd">P + Q</button><button class="b" id="edbl">2P</button><button class="b" id="emul">k·P</button><label>⟦масштаб|scale⟧<input type="range" id="ezoom" min="16" max="90" value="40"></label></div>
<div class="err" id="eerr"></div><pre id="eout"></pre><div class="wide" id="egr"></div>
<h2>⟦Режим 2: скінченне поле 𝔽ₚ|Mode 2: finite field 𝔽ₚ⟧</h2>
<div class="row"><label>p<input class="s" id="fp" value="97"></label><label>a<input class="s" id="fa" value="2"></label><label>b<input class="s" id="fb" value="3"></label><label>P x<input class="s" id="fpx" value="3"></label><label>P y<input class="s" id="fpy" value="6"></label><label>Q x<input class="s" id="fqx" value="80"></label><label>Q y<input class="s" id="fqy" value="10"></label><label>k<input class="s" id="fk" value="13"></label></div>
<div class="row"><button class="b m" id="fcur">⟦Крива та всі точки|Curve and all points⟧</button><button class="b" id="fadd">P + Q</button><button class="b" id="fdbl">2P</button><button class="b" id="fmul">k·P (double-and-add)</button><button class="b" id="ford">⟦Порядок P|Order of P⟧</button><button class="b" id="fsv">⟦Зберегти в архів|Save to archive⟧</button></div>
<div class="err" id="ferr"></div><pre id="fout"></pre><div class="wide" id="fgr"></div>`;
const fR=(x,a,b)=>x*x*x+a*x+b;
function eccReal(){const a=Number(q('#ea').value),b=Number(q('#eb').value);if(!isFinite(a)||!isFinite(b))throw Error(T('a, b мають бути числами.','a, b must be numbers.'));
 const disc=-16*(4*a**3+27*b*b);if(Math.abs(4*a**3+27*b*b)<1e-12)throw Error(T('Крива вироджена (4a³ + 27b² = 0).','Singular curve (4a³ + 27b² = 0).'));
 const pt=(xi,si)=>{const x=Number(q('#'+xi).value);if(!isFinite(x))throw Error(T('x має бути числом.','x must be a number.'));const f=fR(x,a,b);if(f<0)throw Error('x = '+x+': '+T('на кривій немає дійсної точки (x³ + ax + b < 0).','no real point on the curve (x³ + ax + b < 0).'));return[x,Number(q('#'+si).value)*Math.sqrt(f)]};
 return{a,b,disc,P:pt('epx','eps'),Q:pt('eqx','eqs')}}
function addR(P,Q,a){if(!P)return{R:Q};if(!Q)return{R:P};const same=Math.abs(P[0]-Q[0])<1e-9;
 if(same&&Math.abs(P[1]+Q[1])<1e-9)return{R:null,vertical:true};let lam;if(same&&Math.abs(P[1]-Q[1])<1e-9){if(Math.abs(P[1])<1e-12)return{R:null,vertical:true};lam=(3*P[0]**2+a)/(2*P[1])}else lam=(Q[1]-P[1])/(Q[0]-P[0]);
 const x3=lam*lam-P[0]-Q[0],yl=lam*(x3-P[0])+P[1];return{R:[x3,-yl],lam,third:[x3,yl],tangent:same}}
const f4=v=>(Math.abs(v)<1e-9?0:+v.toFixed(4));
function drawReal(C,ops){const W=760,H=440,s=Number(q('#ezoom').value),ox=W/2-s*1.5,oy=H/2,X=x=>ox+x*s,Y=y=>oy-y*s;
 let g='<svg xmlns="http://www.w3.org/2000/svg" class="ch" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" style="background:#0a0a0c" font-family="Segoe UI,Arial"><defs><clipPath id="ecp"><rect width="'+W+'" height="'+H+'"/></clipPath></defs><g clip-path="url(#ecp)">';
 const x1=(0-ox)/s,x2=(W-ox)/s;M5.nice(x1,x2,12).forEach(v=>g+='<line x1="'+X(v)+'" x2="'+X(v)+'" y1="0" y2="'+H+'" stroke="'+(v===0?'#666':'#202024')+'"/><text x="'+(X(v)+2)+'" y="'+(oy+12)+'" fill="#888" font-size="10">'+v+'</text>');
 M5.nice((oy-H)/s,oy/s,8).forEach(v=>g+='<line y1="'+Y(v)+'" y2="'+Y(v)+'" x1="0" x2="'+W+'" stroke="'+(v===0?'#666':'#202024')+'"/><text y="'+(Y(v)-2)+'" x="'+(X(0)+3)+'" fill="#888" font-size="10">'+v+'</text>');
 /* крива: суміжні інтервали, де f ≥ 0 */
 const N=1200,seg=[];let cur=null;for(let i=0;i<=N;i++){const x=x1+(x2-x1)*i/N,f=fR(x,C.a,C.b);if(f>=0){if(!cur){cur=[];seg.push(cur)}cur.push([x,Math.sqrt(f)])}else cur=null}
 seg.forEach(sg=>{if(sg.length<2)return;let d='M'+sg.map(p=>X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join('L')+'L'+[...sg].reverse().map(p=>X(p[0]).toFixed(1)+' '+Y(-p[1]).toFixed(1)).join('L');
  const closed=sg[0][0]>x1+1e-9&&sg[sg.length-1][0]<x2-1e-9;g+='<path d="'+d+(closed?'Z':'')+'" fill="none" stroke="#c4122f" stroke-width="2.4"/>'});
 /* ліні та точки */
 if(ops.line){const{P,Q,res}=ops;if(Math.abs(P[0]-Q[0])<1e-9&&!ops.tangent)g+='<line x1="'+X(P[0])+'" x2="'+X(P[0])+'" y1="0" y2="'+H+'" stroke="#e8e8e8" stroke-dasharray="5 4"/>';
  else{const lam=res.lam,ya=lam*(x1-P[0])+P[1],yb=lam*(x2-P[0])+P[1];g+='<line x1="0" y1="'+Y(ya)+'" x2="'+W+'" y2="'+Y(yb)+'" stroke="#e8e8e8" stroke-dasharray="5 4"/>';if(res.third)g+='<line x1="'+X(res.R[0])+'" x2="'+X(res.R[0])+'" y1="'+Y(res.third[1])+'" y2="'+Y(res.R[1])+'" stroke="#ff4d5e" stroke-dasharray="2 3"/><circle cx="'+X(res.third[0])+'" cy="'+Y(res.third[1])+'" r="5" fill="none" stroke="#e8e8e8" stroke-width="2"/>'}}
 (ops.marks||[]).forEach(m=>{if(!m.p)return;g+='<circle cx="'+X(m.p[0])+'" cy="'+Y(m.p[1])+'" r="6" fill="'+(m.c||'#ff4d5e')+'" stroke="#fff"/><text x="'+(X(m.p[0])+9)+'" y="'+(Y(m.p[1])-9)+'" fill="#fff" font-size="12">'+esc(m.l)+'</text>'});
 return g+'</g></svg>'}
function eccRealRun(mode){try{say('eerr','');const C=eccReal(),L=[];L.push('y² = x³ '+(C.a<0?'− ':'+ ')+Math.abs(C.a)+'x '+(C.b<0?'− ':'+ ')+Math.abs(C.b)+T('   (4a³ + 27b² = ','   (4a³ + 27b² = ')+(4*C.a**3+27*C.b**2).toFixed(4)+T(' ≠ 0 → невироджена)',' ≠ 0 → non-singular)'));
  L.push(T('Дискримінант Δ = ','Discriminant Δ = ')+C.disc.toFixed(3));L.push('P = ('+f4(C.P[0])+'; '+f4(C.P[1])+'),  Q = ('+f4(C.Q[0])+'; '+f4(C.Q[1])+')');
  const ops={marks:[{p:C.P,l:'P'},{p:C.Q,l:'Q',c:'#e8e8e8'}]};let sum=0;
  if(mode==='add'||mode==='dbl'){const Qp=mode==='dbl'?C.P:C.Q,r=addR(C.P,Qp,C.a);
   if(mode==='dbl'){L.push('','2P:   λ = (3x² + a)/(2y) = '+(r.R?f4(r.lam):'∞')+T(' (дотична в P)',' (tangent at P)'))}else L.push('','P + Q:   λ = (y_Q − y_P)/(x_Q − x_P) = '+(r.lam!==undefined?f4(r.lam):'∞'));
   if(!r.R){L.push(T('Пряма вертикальна → результат: точка в нескінченності O.','Vertical line → result: the point at infinity O.'))}
   else{L.push('x₃ = λ² − x_P − x_Q = '+f4(r.R[0]),T('третя точка перетину прямої з кривою: (','third intersection of the line with the curve: (')+f4(r.third[0])+'; '+f4(r.third[1])+')','R = '+(mode==='dbl'?'2P':'P + Q')+' = ('+f4(r.R[0])+'; '+f4(r.R[1])+')   '+T('(відображення відносно осі x)','(reflection in the x-axis)'));
    L.push(T('Перевірка: y² − (x³ + ax + b) = ','Check: y² − (x³ + ax + b) = ')+(r.R[1]**2-fR(r.R[0],C.a,C.b)).toExponential(2));ops.marks.push({p:r.third,l:T('−R','−R'),c:'#888'},{p:r.R,l:'R',c:'#fb7185'});ops.line=true;ops.P=C.P;ops.Q=Qp;ops.res=r;ops.tangent=mode==='dbl'}}
  else{const k=Math.round(Number(q('#ek').value));if(!(k>=1&&k<=40))throw Error('k: 1…40');L.push('',T('Скалярне множення (послідовні додавання): ','Scalar multiplication (successive additions): ')+'k·P');let R=C.P;const rows=[['1',f4(R[0])+'; '+f4(R[1])]];ops.marks=[{p:C.P,l:'P'}];
   for(let i=2;i<=k;i++){const r=addR(R,C.P,C.a);R=r.R;if(!R){rows.push([i,'O']);L.push(i+'P = O');break}rows.push([i,f4(R[0])+'; '+f4(R[1])]);if(i<=8)ops.marks.push({p:R,l:i+'P',c:'#fb7185'})}
   rows.forEach(r=>L.push('   '+r[0]+'·P = '+(r[1]==='O'?'O':'('+r[1]+')')));L.push(T('Над ℝ це лише ілюстрація: числа з плаваючою комою не є точними.','Over ℝ this is only an illustration: floating-point numbers are not exact.'))}
  put('eout',L.join('\n'));html('egr',drawReal(C,ops))}catch(e){say('eerr',e.message)}}
/* --- 𝔽ₚ --- */
function fpAdd(P,Q,a,p){if(!P)return{R:Q};if(!Q)return{R:P};let lam,kind;
 if(P[0]===Q[0]){if(mod(P[1]+Q[1],p)===0n)return{R:null,kind:'inv'};lam=mod((3n*P[0]*P[0]+a)*modinv(2n*P[1],p),p);kind='dbl'}else{lam=mod((Q[1]-P[1])*modinv(Q[0]-P[0],p),p);kind='add'}
 const x3=mod(lam*lam-P[0]-Q[0],p),y3=mod(lam*(P[0]-x3)-P[1],p);return{R:[x3,y3],lam,kind}}
function fpMul(k,P,a,p){const bits=k.toString(2),steps=[];let R=null;
 for(let i=0;i<bits.length;i++){const d=fpAdd(R,R,a,p);R=d.R;let s='bit '+bits[i]+': '+T('подвоєння → ','double → ')+pf(R);if(bits[i]==='1'){const r2=fpAdd(R,P,a,p);R=r2.R;s+=T(';  додавання P → ',';  add P → ')+pf(R)}steps.push(s)}
 return{R,steps,bits}}
const pf=P=>P?'('+P[0]+'; '+P[1]+')':'O';
function fpRead(){const p=big('fp','p'),a=big('fa','a'),b=big('fb','b');if(!isPrime(p)||p<5n)throw Error(T('p має бути простим числом ≥ 5.','p must be a prime ≥ 5.'));
 const A=mod(a,p),Bv=mod(b,p),dl=mod(4n*A**3n+27n*Bv*Bv,p);if(dl===0n)throw Error(T('Крива вироджена над 𝔽ₚ (4a³ + 27b² ≡ 0).','Singular over 𝔽ₚ (4a³ + 27b² ≡ 0).'));
 const on=(x,y)=>mod(y*y-(x*x*x+A*x+Bv),p)===0n;const rd=(xi,yi,nm)=>{const x=mod(big(xi,nm+'x'),p),y=mod(big(yi,nm+'y'),p);if(!on(x,y))throw Error(nm+' = ('+x+'; '+y+') '+T('не лежить на кривій: y² = ','is not on the curve: y² = ')+mod(y*y,p)+', x³ + ax + b = '+mod(x*x*x+A*x+Bv,p));return[x,y]};
 return{p,a:A,b:Bv,P:rd('fpx','fpy','P'),Q:()=>rd('fqx','fqy','Q')}}
function fpPoints(C){const pts=[];const p=Number(C.p),a=Number(C.a),b=Number(C.b);const sq=new Map();for(let y=0;y<p;y++){const k=y*y%p;if(!sq.has(k))sq.set(k,[]);sq.get(k).push(y)}
 for(let x=0;x<p;x++){const r=((x*x%p)*x+a*x+b)%p;(sq.get(r)||[]).forEach(y=>pts.push([x,y]))}return pts}
let FPS=null;
function fpCurve(){try{say('ferr','');const C=fpRead(),L=[];const p=Number(C.p);L.push('y² = x³ + '+C.a+'x + '+C.b+' (mod '+C.p+')');L.push(T('Δ ≠ 0 над 𝔽ₚ: невироджена ✓','Δ ≠ 0 over 𝔽ₚ: non-singular ✓'));
  if(p<=5000){const pts=fpPoints(C),N=pts.length+1;L.push(T('Кількість точок #E(𝔽ₚ) = ','Number of points #E(𝔽ₚ) = ')+N+T(' (разом із O)',' (including O)'));L.push(T('Межа Хассе: |N − (p + 1)| ≤ 2√p → ','Hasse bound: |N − (p + 1)| ≤ 2√p → ')+Math.abs(N-p-1)+' ≤ '+(2*Math.sqrt(p)).toFixed(2)+(Math.abs(N-p-1)<=2*Math.sqrt(p)?' ✓':' ✗'));FPS={C,N,pts};
   if(p<=401){const W=760,H=560,m=30,X=x=>m+x/(p-1)*(W-2*m),Y=y=>H-m-y/(p-1)*(H-2*m);let s='<svg xmlns="http://www.w3.org/2000/svg" class="ch" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" style="background:#0a0a0c" font-family="Segoe UI,Arial"><rect x="'+m+'" y="'+m+'" width="'+(W-2*m)+'" height="'+(H-2*m)+'" fill="none" stroke="#444"/><text x="'+W/2+'" y="18" fill="#fff" font-size="14" text-anchor="middle">'+esc('E(𝔽'+p+'): y² = x³ + '+C.a+'x + '+C.b+' — '+pts.length+' '+T('афінних точок','affine points'))+'</text>';
    pts.forEach(([x,y])=>s+='<circle cx="'+X(x).toFixed(1)+'" cy="'+Y(y).toFixed(1)+'" r="'+(p<=150?4:2.4)+'" fill="#ff4d5e"/>');s+='<text x="'+m+'" y="'+(H-8)+'" fill="#999" font-size="11">x: 0…'+(p-1)+'   y: 0…'+(p-1)+'</text></svg>';html('fgr',s)}else html('fgr','')}
  else{L.push(T('p завелике для повного підрахунку точок у браузері (> 5000); обчислення з точками працюють.','p is too large for full point counting in the browser (> 5000); point operations still work.'));FPS={C,N:null}}
  put('fout',L.join('\n'))}catch(e){say('ferr',e.message)}}
function fpOp(kind){try{say('ferr','');const C=fpRead(),L=[T('Крива: y² = x³ + ','Curve: y² = x³ + ')+C.a+'x + '+C.b+' (mod '+C.p+'),  P = '+pf(C.P)];FPS=FPS||{};FPS.C=C;let R;
  if(kind==='add'){const Q=C.Q();L.push('Q = '+pf(Q));const r=fpAdd(C.P,Q,C.a,C.p);R=r.R;if(r.kind==='inv')L.push(T('Q = −P → P + Q = O','Q = −P → P + Q = O'));else{L.push((r.kind==='dbl'?'λ = (3x² + a)/(2y)':'λ = (y_Q − y_P)/(x_Q − x_P)')+' mod p = '+r.lam,'x₃ = λ² − x_P − x_Q mod p = '+R[0],'y₃ = λ(x_P − x₃) − y_P mod p = '+R[1])}L.push('P + Q = '+pf(R));FPS.res={op:'P+Q',R:pf(R)}}
  else if(kind==='dbl'){const r=fpAdd(C.P,C.P,C.a,C.p);R=r.R;if(!R)L.push(T('y = 0 → 2P = O','y = 0 → 2P = O'));else L.push('λ = (3x² + a)/(2y) mod p = '+r.lam,'x₃ = λ² − 2x mod p = '+R[0],'y₃ = λ(x − x₃) − y mod p = '+R[1]);L.push('2P = '+pf(R));FPS.res={op:'2P',R:pf(R)}}
  else{const k=big('fk','k');if(k<1n)throw Error('k ≥ 1');const r=fpMul(k,C.P,C.a,C.p);L.push('k = '+k+' = ('+r.bits+')₂',T('Алгоритм double-and-add (від старшого біта):','Double-and-add (most significant bit first):'));r.steps.forEach(s=>L.push('   '+s));L.push(k+'·P = '+pf(r.R));
   let chk=null;for(let i=0n,Rr=null;i<k&&k<=2000n;i++){Rr=fpAdd(Rr,C.P,C.a,C.p).R;if(i===k-1n)chk=Rr}if(k<=2000n){L.push(T('Перевірка послідовним додаванням: ','Check by repeated addition: ')+pf(chk)+((chk&&r.R&&chk[0]===r.R[0]&&chk[1]===r.R[1])||(!chk&&!r.R)?' ✓':' ✗'))}FPS.res={op:k+'P',R:pf(r.R)}}
  put('fout',L.join('\n'))}catch(e){say('ferr',e.message)}}
function fpOrder(){try{say('ferr','');const C=fpRead();if(C.p>100000n)throw Error(T('Для p > 100000 пошук порядку не виконується.','Order search is not performed for p > 100000.'));let n=1n,R=C.P;const lim=C.p*2n+10n;while(R&&n<lim){R=fpAdd(R,C.P,C.a,C.p).R;n++}
  const L=[T('Порядок точки P = ','Order of point P = ')+n+'  (n·P = O)'];if(C.p<=5000n){const N=BigInt(fpPoints(C).length+1);L.push('#E(𝔽ₚ) = '+N+';  '+T('порядок ділить #E: ','order divides #E: ')+(N%n===0n?'✓ ('+N+' = '+n+'·'+N/n+')':'✗'))}put('fout',L.join('\n'));FPS=FPS||{};FPS.res={op:'ord',R:String(n)}}catch(e){say('ferr',e.message)}}
M5.addTab('ecc','Еліптичні криві','Elliptic curves',ECC,()=>{q('#eadd').onclick=()=>eccRealRun('add');q('#edbl').onclick=()=>eccRealRun('dbl');q('#emul').onclick=()=>eccRealRun('mul');q('#ezoom').oninput=()=>eccRealRun(q('#ezoom')._m||'add');
 ['eadd','edbl','emul'].forEach(id=>q('#'+id).addEventListener('click',()=>q('#ezoom')._m=({eadd:'add',edbl:'dbl',emul:'mul'})[id]));
 q('#fcur').onclick=fpCurve;q('#fadd').onclick=()=>fpOp('add');q('#fdbl').onclick=()=>fpOp('dbl');q('#fmul').onclick=()=>fpOp('mul');q('#ford').onclick=fpOrder;
 q('#fsv').onclick=()=>{if(!FPS||!FPS.res){fpOp('mul')}if(!FPS||!FPS.res)return;const C=FPS.C;M5.saveEntry('ecc','E(𝔽'+C.p+'): y² = x³ + '+C.a+'x + '+C.b,{p:String(C.p),a:String(C.a),b:String(C.b),Px:String(C.P[0]),Py:String(C.P[1]),k:q('#fk').value,Qx:q('#fqx').value,Qy:q('#fqy').value},{output:q('#fout').textContent,N:FPS.N},{conclusion:T('Результат операції ','Result of operation ')+FPS.res.op+' = '+FPS.res.R+'.'})};
 M5.rerun.ecc=e=>{M5.openTab('ecc');const p=e.params;['p','a','b'].forEach(k=>q('#f'+k).value=p[k]);q('#fpx').value=p.Px;q('#fpy').value=p.Py;q('#fk').value=p.k;q('#fqx').value=p.Qx;q('#fqy').value=p.Qy;fpOp('mul')};
 eccRealRun('add');fpCurve();document.addEventListener('mc5:lang',()=>{eccRealRun(q('#ezoom')._m||'add');fpCurve()})});
/* ================= Hash Laboratory ================= */
const HASH=`<h2>⟦Лабораторія хешів (Web Crypto API)|Hash laboratory (Web Crypto API)⟧</h2>${WARN}
<div class="row"><label>⟦Алгоритм|Algorithm⟧<select id="hal"><option>SHA-256</option><option>SHA-512</option></select></label></div>
<div class="grid2"><label>⟦Повідомлення A|Message A⟧<textarea class="w" id="ha" rows="3">Привіт, MATHCRYPT!</textarea></label><label>⟦Повідомлення B|Message B⟧<textarea class="w" id="hb" rows="3">Привіт, MATHCRYPT?</textarea></label></div>
<div class="row"><button class="b m" id="hgo">⟦Порівняти хеші|Compare hashes⟧</button><button class="b" id="hsv">⟦Зберегти в архів|Save to archive⟧</button></div>
<div class="err" id="herr"></div><div id="hout"></div>
<h2>⟦Лавинний ефект|Avalanche effect⟧</h2>
<div class="row"><label>⟦кількість змін по 1 біту|number of 1-bit flips⟧<input class="s" id="hn" value="128"></label><button class="b m" id="hav">⟦Дослідити (повідомлення A)|Run (message A)⟧</button><button class="b" id="havpng">PNG</button><button class="b" id="havsv">⟦Зберегти серію в архів|Save series to archive⟧</button></div>
<div id="hasum"></div><div class="wide" id="hach"></div>`;
const enc=new TextEncoder();
async function digest(alg,bytes){if(!(window.crypto&&crypto.subtle))throw Error(T('Web Crypto недоступний: потрібне безпечне з’єднання (HTTPS) або localhost.','Web Crypto is unavailable: a secure context (HTTPS) or localhost is required.'));return new Uint8Array(await crypto.subtle.digest(alg,bytes))}
M5.digest=digest;
const hex=u=>[...u].map(b=>b.toString(16).padStart(2,'0')).join('');M5.hex=hex;
const pop=n=>{let c=0;while(n){c+=n&1;n>>=1}return c};
const bitDiff=(x,y)=>{let d=0;for(let i=0;i<x.length;i++)d+=pop(x[i]^y[i]);return d};
let HS=null,HAV=null;
async function hashCmp(){try{say('herr','');const alg=q('#hal').value,A=enc.encode(q('#ha').value),B=enc.encode(q('#hb').value),ha=await digest(alg,A),hb=await digest(alg,B),bits=ha.length*8,d=bitDiff(ha,hb),A1=hex(ha),B1=hex(hb);
  let hi='';for(let i=0;i<A1.length;i++)hi+=A1[i]===B1[i]?esc(B1[i]):'<mark>'+esc(B1[i])+'</mark>';
  html('hout','<pre class="hx">'+alg+'(A) = '+A1+'\n'+alg+'(B) = '+hi+'</pre><div class="kpis"><div class="kpi"><b>'+d+' / '+bits+'</b>'+T('різних бітів','differing bits')+'</div><div class="kpi"><b>'+(100*d/bits).toFixed(2)+'%</b>'+T('змінено бітів','bits changed')+'</div><div class="kpi"><b>'+(A1===B1?T('так','yes'):T('ні','no'))+'</b>'+T('хеші однакові','hashes equal')+'</div></div><p class="mut">'+T('Ідеальна хеш-функція змінює в середньому ~50% бітів при будь-якій зміні входу.','An ideal hash function changes ~50% of the bits on average for any input change.')+'</p>');
  HS={alg,A:q('#ha').value,B:q('#hb').value,hA:A1,hB:B1,diff:d,bits}}catch(e){say('herr',e.message)}}
async function avalanche(){try{say('herr','');const alg=q('#hal').value,msg=enc.encode(q('#ha').value),nb=msg.length*8;if(!nb)throw Error(T('Повідомлення A порожнє.','Message A is empty.'));let N=Number(big('hn'));if(!(N>=1&&N<=2048))throw Error('N: 1…2048');N=Math.min(N,nb);
  const base=await digest(alg,msg),bits=base.length*8,pc=[],step=nb/N;
  for(let i=0;i<N;i++){const k=Math.floor(i*step),m=new Uint8Array(msg);m[k>>3]^=1<<(7-(k&7));const h=await digest(alg,m);pc.push(100*bitDiff(base,h)/bits)}
  const s=M5.stats(pc);HAV={alg,N,msg:q('#ha').value,stats:s,pc};
  html('hasum','<div class="kpis"><div class="kpi"><b>'+s.mean.toFixed(2)+'%</b>'+T('середнє','mean')+'</div><div class="kpi"><b>'+s.median.toFixed(2)+'%</b>'+T('медіана','median')+'</div><div class="kpi"><b>'+s.sd.toFixed(2)+'</b>'+T('ст. відхилення','std dev')+'</div><div class="kpi"><b>'+s.min.toFixed(1)+' … '+s.max.toFixed(1)+'%</b>min … max</div></div>');
  HAV.svg=M5.lineChart({title:alg+' — '+T('частка змінених бітів хешу при зміні 1 біту входу','share of changed hash bits for a 1-bit input change'),x:pc.map((_,i)=>i+1),series:[{name:T('змінено, %','changed, %'),y:pc},{name:'50%',y:pc.map(()=>50),color:'#888'}],xlab:T('номер експерименту','experiment index'),ylab:'%',zero:false});html('hach',HAV.svg)}catch(e){say('herr',e.message)}}
M5.addTab('hash','Хеш-лабораторія','Hash Lab',HASH,()=>{q('#hgo').onclick=hashCmp;q('#hav').onclick=avalanche;q('#havpng').onclick=()=>HAV&&M5.svgToPng(HAV.svg,'avalanche.png');
 q('#hsv').onclick=async()=>{if(!HS)await hashCmp();if(!HS)return;M5.saveEntry('hash',HS.alg+T(': порівняння хешів',': hash comparison'),{alg:HS.alg,A:HS.A,B:HS.B},{hashA:HS.hA,hashB:HS.hB,differingBits:HS.diff,totalBits:HS.bits,percent:+(100*HS.diff/HS.bits).toFixed(3)},{conclusion:T('Змінено ','Changed ')+HS.diff+' / '+HS.bits+T(' бітів (',' bits (')+(100*HS.diff/HS.bits).toFixed(2)+'%).'})};
 q('#havsv').onclick=async()=>{if(!HAV)await avalanche();if(!HAV)return;M5.saveEntry('hash',HAV.alg+T(': лавинний ефект',': avalanche effect'),{alg:HAV.alg,A:HAV.msg,N:HAV.N,series:true},{mean:HAV.stats.mean,median:HAV.stats.median,sd:HAV.stats.sd,min:HAV.stats.min,max:HAV.stats.max,rows:[['i','percent'],...HAV.pc.slice(0,40).map((v,i)=>[i+1,+v.toFixed(3)])]},{chart:HAV.svg,conclusion:T('Середня частка змінених бітів: ','Mean share of changed bits: ')+HAV.stats.mean.toFixed(2)+'% (N = '+HAV.N+').'})};
 M5.rerun.hash=e=>{M5.openTab('hash');q('#hal').value=e.params.alg;q('#ha').value=e.params.A;if(e.params.B!=null)q('#hb').value=e.params.B;if(e.params.series){q('#hn').value=e.params.N;avalanche()}else hashCmp()};
 hashCmp();document.addEventListener('mc5:lang',()=>{hashCmp()})});
/* ================= Класичні шифри ================= */
const CL=`<h2>⟦Класичні шифри|Classical ciphers⟧</h2>${WARN}
<div class="row"><label>⟦Шифр|Cipher⟧<select id="cc"><option value="caesar">⟦Цезаря|Caesar⟧</option><option value="vig">⟦Віженера|Vigenère⟧</option><option value="atb">⟦Атбаш|Atbash⟧</option><option value="aff">⟦Афінний|Affine⟧</option></select></label>
<label>⟦Алфавіт|Alphabet⟧<select id="cal"><option value="uk">⟦українська (33)|Ukrainian (33)⟧</option><option value="en">English (26)</option></select></label>
<label id="ccs">⟦зсув s|shift s⟧<input class="s" id="ccsv" value="3"></label><label id="cck" hidden>⟦ключ|key⟧<input id="cckv" value="ЛИМОН"></label><label id="cca" hidden>a<input class="s" id="ccav" value="5"></label><label id="ccb" hidden>b<input class="s" id="ccbv" value="8"></label></div>
<label>⟦Текст|Text⟧<textarea class="w" id="cct" rows="3">Слава Україні</textarea></label>
<div class="row"><button class="b m" id="cenc">⟦Зашифрувати|Encrypt⟧</button><button class="b" id="cdec">⟦Розшифрувати|Decrypt⟧</button><button class="b" id="cex">⟦Приклад|Example⟧</button><button class="b" id="csv2">⟦Зберегти в архів|Save to archive⟧</button></div>
<div class="err" id="cerr2"></div><pre id="ccout"></pre><div id="ccmath" class="note"></div><div id="cctab"></div>`;
const ALPH={uk:'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ',en:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'};
function cipherCore(type,dec,text,al,P){const A=ALPH[al],m=A.length;let ki=0;const rows=[];let out='';
 let inv=null;if(type==='aff'){if(gcd(BigInt(P.a),BigInt(m))!==1n)throw Error(T('НСД(a, '+m+') має дорівнювати 1.','gcd(a, '+m+') must equal 1.'));inv=Number(modinv(BigInt(P.a),BigInt(m)))}
 let K=null;if(type==='vig'){K=[...P.key.toUpperCase()].map(c=>A.indexOf(c)).filter(i=>i>=0);if(!K.length)throw Error(T('Ключ має містити літери вибраного алфавіту.','The key must contain letters of the chosen alphabet.'))}
 for(const ch of text){const up=ch.toUpperCase(),i=A.indexOf(up);if(i<0){out+=ch;continue}let j,f;
  if(type==='caesar'){const s=dec?-P.s:P.s;j=mod(BigInt(i+s),BigInt(m));j=Number(j);f=dec?'('+i+' − '+P.s+') mod '+m:'('+i+' + '+P.s+') mod '+m}
  else if(type==='atb'){j=m-1-i;f=(m-1)+' − '+i}
  else if(type==='vig'){const k=K[ki++%K.length];j=Number(mod(BigInt(dec?i-k:i+k),BigInt(m)));f=dec?'('+i+' − '+k+') mod '+m:'('+i+' + '+k+') mod '+m}
  else{j=dec?Number(mod(BigInt(inv*(i-P.b)),BigInt(m))):(P.a*i+P.b)%m;f=dec?inv+'·('+i+' − '+P.b+') mod '+m:'('+P.a+'·'+i+' + '+P.b+') mod '+m}
  const o=A[j];const isLow=ch!==up;out+=isLow?o.toLowerCase():o;if(rows.length<10)rows.push([ch,i,f,j,isLow?o.toLowerCase():o])}
 return{out,rows,inv}}
function clParams(){const t=q('#cc').value;if(t==='caesar'||t==='aff'){const s=big('ccsv');}return null}
function clRun(dec){try{say('cerr2','');const type=q('#cc').value,al=q('#cal').value,text=q('#cct').value;const P={};
  if(type==='caesar')P.s=Number(big('ccsv','s'));if(type==='vig')P.key=q('#cckv').value;if(type==='aff'){P.a=Number(big('ccav','a'));P.b=Number(big('ccbv','b'))}
  const r=cipherCore(type,dec,text,al,P);put('ccout',r.out);CLS={type,al,dec,text,P,out:r.out};
  html('cctab',M5.table([T('літера','letter'),T('індекс','index'),T('формула','formula'),T('новий індекс','new index'),T('результат','result')],r.rows)+'<p class="mut">'+T('Показано перші літери; нелітерні символи не змінюються.','First letters shown; non-letter characters are unchanged.')+'</p>');
  const m=ALPH[al].length;const D={caesar:T('Цезар: E(i) = (i + s) mod '+m+', D(i) = (i − s) mod '+m+'. Ключів: '+m+' — розкривається повним перебором.','Caesar: E(i) = (i + s) mod '+m+', D(i) = (i − s) mod '+m+'. Only '+m+' keys — broken by exhaustive search.'),
   vig:T('Віженер: E(iₖ) = (i + kⱼ) mod '+m+', де kⱼ — літери ключа по колу. Стійкий до простого частотного аналізу, але вразливий до аналізу Казіскі.','Vigenère: E(i) = (i + kⱼ) mod '+m+' with key letters repeated cyclically. Resists simple frequency analysis but is vulnerable to Kasiski examination.'),
   atb:T('Атбаш: E(i) = ('+(m-1)+' − i); шифр інволютивний: D = E.','Atbash: E(i) = ('+(m-1)+' − i); the cipher is an involution: D = E.'),
   aff:T('Афінний: E(i) = (a·i + b) mod '+m+', D(i) = a⁻¹(i − b) mod '+m+', де НСД(a, '+m+') = 1; a⁻¹ знаходять розширеним алгоритмом Евкліда (діофантове рівняння a·x + '+m+'·y = 1).','Affine: E(i) = (a·i + b) mod '+m+', D(i) = a⁻¹(i − b) mod '+m+', gcd(a, '+m+') = 1; a⁻¹ comes from the extended Euclidean algorithm (Diophantine equation a·x + '+m+'·y = 1).')}[type];
  q('#ccmath').textContent=D+(type==='aff'&&r.inv!=null?'  a⁻¹ = '+r.inv:'')}catch(e){say('cerr2',e.message)}}
let CLS=null;
function clShow(){const t=q('#cc').value;q('#ccs').hidden=t!=='caesar';q('#cck').hidden=t!=='vig';q('#cca').hidden=t!=='aff';q('#ccb').hidden=t!=='aff'}
M5.addTab('classic','Класичні шифри','Classical ciphers',CL,()=>{clShow();q('#cc').onchange=()=>{clShow();clRun(false)};q('#cal').onchange=()=>{const uk=q('#cal').value==='uk';q('#cct').value=uk?'Слава Україні':'Hello World';q('#cckv').value=uk?'ЛИМОН':'LEMON';clRun(false)};
 q('#cenc').onclick=()=>clRun(false);q('#cdec').onclick=()=>clRun(true);
 q('#cex').onclick=()=>{const t=q('#cc').value,uk=q('#cal').value==='uk';if(t==='aff'){q('#cal').value='en';q('#cct').value='AFFINE CIPHER';q('#ccav').value=5;q('#ccbv').value=8}else if(t==='vig'){q('#cal').value='en';q('#cct').value='ATTACKATDAWN';q('#cckv').value='LEMON'}else if(t==='caesar'){q('#cal').value='en';q('#cct').value='ABC XYZ';q('#ccsv').value=3}else{q('#cal').value='en';q('#cct').value='ABC'}clRun(false)};
 q('#csv2').onclick=()=>{if(!CLS)clRun(false);if(!CLS)return;M5.saveEntry('classic',T('Шифр: ','Cipher: ')+CLS.type,{type:CLS.type,al:CLS.al,text:CLS.text,P:CLS.P,dec:CLS.dec},{output:CLS.out},{conclusion:''})};
 M5.rerun.classic=e=>{M5.openTab('classic');const p=e.params;q('#cc').value=p.type;clShow();q('#cal').value=p.al;q('#cct').value=p.text;if(p.P.s!=null)q('#ccsv').value=p.P.s;if(p.P.key)q('#cckv').value=p.P.key;if(p.P.a!=null){q('#ccav').value=p.P.a;q('#ccbv').value=p.P.b}clRun(!!p.dec)};
 clRun(false);document.addEventListener('mc5:lang',()=>clRun(false))});
M5.cipherCore=cipherCore;M5.rsaRunM=rsaRun;M5.fpAdd=fpAdd;M5.fpMul=fpMul;M5.pellNote=1;
})();
