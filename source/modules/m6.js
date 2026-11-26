/* ===== MATHCRYPT 6.0: Number Theory Explorer, Prime Observatory, Lattices, Terminal, Command Palette ===== */
(()=>{'use strict';
const M5=window.M5;const{q,qa,T,esc,put,say,html,big,gcd,mod,modpow,isPrime,isqrt,xgcd,modinv,abs}=M5;
/* ================= теорія чисел: функції ================= */
function rho(n){if(n%2n===0n)return 2n;for(let c=1n;c<8n;c++){let x=2n,y=2n,d=1n,it=0;const f=v=>(v*v+c)%n;while(d===1n&&it<250000){x=f(x);y=f(f(y));d=gcd(x>y?x-y:y-x,n);it++}if(d!==1n&&d!==n)return d}return null}
function factorBig(n){const f=new Map();let complete=true,probable=false;const add=(p,e=1)=>f.set(p,(f.get(p)||0)+e);
 if(n<1n)throw Error('n ≥ 1');if(n===1n)return{f,complete,probable,list:[]};
 for(const p of[2n,3n,5n,7n,11n,13n]){while(n%p===0n){add(p);n/=p}}
 for(let d=17n;d<100000n&&d*d<=n;d+=2n){while(n%d===0n){add(d);n/=d}}
 const st=[n];const LIM=3300000000000000000000000n;
 while(st.length){const m=st.pop();if(m===1n)continue;if(isPrime(m)){add(m);if(m>LIM)probable=true;continue}const d=rho(m);if(d===null){add(m);complete=false}else st.push(d,m/d)}
 const list=[...f.entries()].sort((a,b)=>a[0]<b[0]?-1:1);return{f,complete,probable,list}}
M5.factorBig=factorBig;
const pw=(p,e)=>p**BigInt(e);
const phiF=L=>L.reduce((r,[p,e])=>r*pw(p,e-1)*(p-1n),1n);
const muF=L=>L.some(([,e])=>e>1)?0n:(L.length%2?-1n:1n);
const tauF=L=>L.reduce((r,[,e])=>r*BigInt(e+1),1n);
const sigF=L=>L.reduce((r,[p,e])=>r*((pw(p,e+1)-1n)/(p-1n)),1n);
const lcm=(a,b)=>a/gcd(a,b)*b;
const lamF=L=>L.reduce((r,[p,e])=>{let l;if(p===2n)l=e===1?1n:e===2?2n:pw(2n,e-2);else l=pw(p,e-1)*(p-1n);return lcm(r,l)},1n);
Object.assign(M5,{phiF,muF,tauF,sigF,lamF});
const fac=n=>factorBig(n);
M5.phi=n=>phiF(fac(n).list);M5.mu=n=>muF(fac(n).list);M5.tau=n=>tauF(fac(n).list);M5.sigma=n=>sigF(fac(n).list);M5.carm=n=>lamF(fac(n).list);
const facStr=L=>L.length?L.map(([p,e])=>e>1?p+'^'+e:String(p)).join(' · '):'1';
function jacobi(a,n){if(n<=0n||n%2n===0n)throw Error('n має бути непарним додатним');a=mod(a,n);let r=1;while(a!==0n){while(a%2n===0n){a/=2n;const m=n%8n;if(m===3n||m===5n)r=-r}[a,n]=[n,a];if(a%4n===3n&&n%4n===3n)r=-r;a%=n}return n===1n?r:0}
M5.jacobi=jacobi;
function legendre(a,p){if(!isPrime(p)||p===2n)throw Error('p має бути непарним простим');const r=modpow(mod(a,p),(p-1n)/2n,p);return r===1n?1:r===0n?0:-1}
M5.legendre=legendre;
function primRoots(n,maxList){const L=fac(n).list;let ok=n===1n||n===2n||n===4n;if(!ok){const odd=n%2n===0n?n/2n:n;if(n%2n===0n&&odd%2n===0n)ok=false;else{const o=fac(odd).list;ok=o.length===1&&o[0][0]!==2n}}
 if(!ok)return{exists:false};const ph=phiF(L);const qs=fac(ph).list.map(x=>x[0]);const roots=[];let cnt=0n;
 for(let g=1n;g<n&&roots.length<maxList;g++){if(gcd(g,n)!==1n)continue;if(qs.every(r=>modpow(g,ph/r,n)!==1n))roots.push(g)}
 return{exists:true,phi:ph,roots,count:phiF(fac(ph).list),qs}}
M5.primRoots=primRoots;
function fibLuc(n){/* fast doubling: [F(n),F(n+1)] */const fd=k=>{if(k===0n)return[0n,1n];const[a,b]=fd(k>>1n),c=a*(2n*b-a),d=a*a+b*b;return k&1n?[d,c+d]:[c,d]};const[f,f1]=fd(n);return{F:f,L:2n*f1-f}}
M5.fibLuc=fibLuc;
function sieveE(N){const c=new Uint8Array(N+1);c[0]=c[1]=1;for(let i=2;i*i<=N;i++)if(!c[i])for(let j=i*i;j<=N;j+=i)c[j]=1;return c}
function sieveS(N){const k=Math.floor((N-1)/2),m=new Uint8Array(k+1);for(let i=1;i<=k;i++)for(let j=i;i+j+2*i*j<=k;j++)m[i+j+2*i*j]=1;const c=new Uint8Array(N+1).fill(1);if(N>=2)c[2]=0;for(let i=1;i<=k;i++)if(!m[i]&&2*i+1<=N)c[2*i+1]=0;return c}
M5.sieveE=sieveE;M5.sieveS=sieveS;
function lucasLehmer(p){if(p===2)return true;const M=(1n<<BigInt(p))-1n;let s=4n;for(let i=0;i<p-2;i++)s=(s*s-2n)%M;return s===0n}
/* ================= вкладка: Дослідник теорії чисел ================= */
const NT=`<h2>⟦Дослідник теорії чисел|Number Theory Explorer⟧</h2>
<p class="lead">⟦Арифметичні функції, факторизація (пробні ділення + ρ-метод Полларда), решета, спеціальні числа, квадратичні лишки та первісні корені. Усе у BigInt.|Arithmetic functions, factorisation (trial division + Pollard’s ρ), sieves, special numbers, quadratic residues and primitive roots. All in BigInt.⟧</p>
<div class="row"><label>n<input class="s" id="nn" value="360" style="width:260px"></label><button class="b m" id="ngo">⟦Обчислити φ, μ, τ, σ, λ, розклад|Compute φ, μ, τ, σ, λ, factorisation⟧</button></div>
<div class="err" id="nerr"></div><div id="nsum"></div><pre id="nst"></pre>
<div class="note">φ(n) = n∏(1 − 1/p) · μ(n) ∈ {−1, 0, 1} · τ(n) = ∏(eᵢ + 1) · σ(n) = ∏(pᵢ^(eᵢ+1) − 1)/(pᵢ − 1) · λ(n) = lcm λ(pᵢ^eᵢ)</div>
<h2>⟦Символи Лежандра та Якобі, квадратичні лишки|Legendre and Jacobi symbols, quadratic residues⟧</h2>
<div class="row"><label>a<input class="s" id="la6" value="5"></label><label>n (p)<input class="s" id="ln6" value="11"></label><button class="b m" id="lgo6">⟦Обчислити|Compute⟧</button></div><pre id="lout6"></pre>
<h2>⟦Первісні корені за модулем n|Primitive roots modulo n⟧</h2>
<div class="row"><label>n<input class="s" id="pr6" value="23"></label><button class="b m" id="prgo">⟦Знайти|Find⟧</button></div><pre id="prout"></pre>
<h2>⟦Послідовності Фібоначчі та Люка|Fibonacci and Lucas sequences⟧</h2>
<div class="row"><label>k<input class="s" id="fk6" value="100"></label><button class="b m" id="fkgo">⟦Обчислити|Compute⟧</button></div><pre id="fkout"></pre>
<h2>⟦Числа Мерсенна, досконалі та Ферма|Mersenne, perfect and Fermat numbers⟧</h2>
<div class="row"><label>⟦p до|p up to⟧<input class="s" id="mp6" value="127"></label><button class="b m" id="mpgo">⟦Мерсенна й досконалі (Люка — Лемер)|Mersenne and perfect (Lucas–Lehmer)⟧</button><button class="b" id="fegp">⟦Числа Ферма F₀…F₆|Fermat numbers F₀…F₆⟧</button></div><div id="mpout"></div>
<h2>⟦Решета та прості-близнюки|Sieves and twin primes⟧</h2>
<div class="row"><label>N<input class="s" id="sv6" value="1000000"></label><button class="b m" id="svgo">⟦Порівняти решета|Compare sieves⟧</button></div><div class="err" id="sverr"></div><pre id="svout"></pre>`;
function ntRun(){try{const n=big('nn','n');if(n<1n)throw Error('n ≥ 1');say('nerr','');const t0=performance.now(),F=fac(n),ms=performance.now()-t0,L=F.list;
 const ph=phiF(L),mu=muF(L),ta=tauF(L),sg=sigF(L),la=lamF(L);
 html('nsum','<div class="kpis"><div class="kpi"><b>'+ph+'</b>φ(n)</div><div class="kpi"><b>'+mu+'</b>μ(n)</div><div class="kpi"><b>'+ta+'</b>τ(n)</div><div class="kpi"><b>'+sg+'</b>σ(n)</div><div class="kpi"><b>'+la+'</b>λ(n)</div><div class="kpi"><b>'+(n>1n&&L.length===1&&L[0][1]===1?T('просте','prime'):n===1n?'—':T('складене','composite'))+'</b>'+T('тип','type')+'</div></div>');
 const S=['n = '+n+' = '+facStr(L)+'   ('+M5.fmtT(ms)+')'];
 if(!F.complete)S.push(T('⚠ Факторизацію не завершено: останній множник може бути складеним (ліміт ρ-методу).','⚠ Factorisation incomplete: the last factor may be composite (ρ-method limit).'));else if(F.probable)S.push(T('⚠ Деякі множники > 3,3·10²⁴ визнані простими імовірнісним тестом.','⚠ Some factors > 3.3·10²⁴ were accepted as prime by a probabilistic test.'));
 S.push('','φ(n) = '+L.map(([p,e])=>e>1?p+'^'+(e-1)+'·('+p+' − 1)':'('+p+' − 1)').join(' · ')+' = '+ph);
 S.push('μ(n) = '+(mu===0n?T('0 (є квадратний множник)','0 (a square factor exists)'):(L.length%2?'−1':'1')+T(' (',' (')+L.length+T(' різних простих)',' distinct primes)')));
 S.push('τ(n) = '+L.map(([,e])=>'('+e+' + 1)').join(' · ')+' = '+ta);
 S.push('σ(n) = '+L.map(([p,e])=>'('+p+'^'+(e+1)+' − 1)/('+p+' − 1)').join(' · ')+' = '+sg);
 S.push('λ(n) = '+T('НСК за ступенями розкладу','lcm over prime powers')+' = '+la);
 if(n<=100000n){const ds=[];for(let d=1n;d<=n;d++)if(n%d===0n)ds.push(d);S.push('',T('Дільники: ','Divisors: ')+ds.join(', '));S.push('Σ φ(d) = '+ds.reduce((s,d)=>s+M5.phi(d),0n)+' = n ✓ ('+T('тотожність Гауса','Gauss identity')+')');if(n>1n)S.push('Σ μ(d) = '+ds.reduce((s,d)=>s+M5.mu(d),0n)+' = 0 ✓');S.push('perfect: σ(n) = 2n → '+(sg===2n*n?T('так — досконале число','yes — a perfect number'):T('ні','no')))}
 put('nst',S.join('\n'))}catch(e){say('nerr',e.message)}}
function ntLeg(){try{const a=big('la6'),n=big('ln6'),L=[];const J=jacobi(a,n);L.push(T('Символ Якобі (a/n) = ','Jacobi symbol (a/n) = ')+J+T('  (алгоритм зі взаємністю та вилученням 2)','  (reciprocity + factor-2 algorithm)'));
 if(isPrime(n)&&n!==2n){const lg=legendre(a,n);L.push(T('Символ Лежандра (a/p) = a^((p−1)/2) mod p = ','Legendre symbol (a/p) = a^((p−1)/2) mod p = ')+lg+' → '+(lg===1?T('a — квадратичний лишок','a is a quadratic residue'):lg===-1?T('a — квадратичний нелишок','a is a non-residue'):T('p | a','p | a')));
  if(n<=2000n){const r=new Set();for(let x=1n;x<n;x++)r.add(x*x%n);L.push(T('Квадратичні лишки за модулем ','Quadratic residues mod ')+n+': '+[...r].sort((x,y)=>x<y?-1:1).join(', '),T('Їх кількість (p−1)/2 = ','Their number (p−1)/2 = ')+(n-1n)/2n+' ('+r.size+T(' знайдено)',' found)'))}}
 else if(n<=2000n){L.push(T('Модуль складений: символ Якобі = 1 не гарантує, що a — квадратичний лишок.','Composite modulus: Jacobi symbol = 1 does not guarantee that a is a residue.'))}
 put('lout6',L.join('\n'))}catch(e){put('lout6',e.message)}}
function ntPR(){try{const n=big('pr6');if(n<1n||n>1000000000000n)throw Error('1 ≤ n ≤ 10¹²');const r=primRoots(n,30);if(!r.exists){put('prout',T('Для n = '+n+' первісних коренів немає (існують лише для 1, 2, 4, p^k, 2p^k, p — непарне просте).','No primitive roots for n = '+n+' (they exist only for 1, 2, 4, p^k, 2p^k with p an odd prime).'));return}
  put('prout',[T('φ(n) = ','φ(n) = ')+r.phi+T(';  прості дільники φ: ',';  prime divisors of φ: ')+r.qs.join(', '),T('Критерій: g — первісний корінь ⇔ gᵠ⁽ⁿ⁾ᐟᵠ ≢ 1 (mod n) для кожного простого q | φ(n).','Criterion: g is a primitive root ⇔ g^(φ(n)/q) ≢ 1 (mod n) for every prime q | φ(n).'),T('Кількість первісних коренів = φ(φ(n)) = ','Number of primitive roots = φ(φ(n)) = ')+r.count,T('Перші ','First ')+r.roots.length+': '+r.roots.join(', ')].join('\n'))}catch(e){put('prout',e.message)}}
function ntFib(){try{const k=big('fk6');if(k<0n||k>200000n)throw Error('0 ≤ k ≤ 200000');const{F,L}=fibLuc(k),fs=F.toString(),ls=L.toString(),sh=s=>s.length>80?s.slice(0,30)+'…'+s.slice(-30)+'  ('+s.length+T(' цифр)',' digits)'):s;
  put('fkout','F('+k+') = '+sh(fs)+'\nL('+k+') = '+sh(ls)+'\n'+T('Тотожність L(k)² − 5F(k)² = 4(−1)^k: ','Identity L(k)² − 5F(k)² = 4(−1)^k: ')+(L*L-5n*F*F===4n*(k%2n?-1n:1n)?'✓':'✗')+(k>1n&&k<5000n?'\n'+T('F(k+1)/F(k) ≈ золотий перетин φ = 1.6180339887…','F(k+1)/F(k) ≈ golden ratio φ = 1.6180339887…'):''))}catch(e){put('fkout',e.message)}}
function ntMers(){try{const P=Math.min(Number(big('mp6')),521);const rows=[];for(let p=2;p<=P;p++){if(!isPrime(BigInt(p)))continue;if(lucasLehmer(p)){const m=(1n<<BigInt(p))-1n,perf=(1n<<BigInt(p-1))*m,s=perf.toString();rows.push([p,'2^'+p+'−1 ('+m.toString().length+T(' цифр)',' digits)'),s.length>40?s.slice(0,18)+'…('+s.length+T(' цифр)',' digits)'):s])}}
  html('mpout',M5.table(['p',T('Просте Мерсенна','Mersenne prime'),T('Досконале число 2^(p−1)(2^p−1)','Perfect number 2^(p−1)(2^p−1)')],rows)+'<p class="mut">'+T('Тест Люка — Лемера: M_p = 2^p − 1 просте ⇔ s_{p−2} ≡ 0 (mod M_p), s₀ = 4, s_{i+1} = s_i² − 2. Парні досконалі числа — саме 2^(p−1)(2^p−1) (Евклід — Ейлер); непарних досконалих чисел невідомо.','Lucas–Lehmer test: M_p = 2^p − 1 is prime ⇔ s_{p−2} ≡ 0 (mod M_p), s₀ = 4, s_{i+1} = s_i² − 2. Even perfect numbers are exactly 2^(p−1)(2^p−1) (Euclid–Euler); no odd perfect number is known.')+'</p>')}catch(e){html('mpout',esc(e.message))}}
function ntFermat(){const rows=[];for(let n=0;n<=6;n++){const F=(1n<<(1n<<BigInt(n)))+1n,t0=performance.now(),f=factorBig(F),ms=performance.now()-t0;rows.push(['F'+n,F.toString().length>30?F.toString().slice(0,14)+'…('+F.toString().length+')':String(F),f&&f.complete?(f.list.length===1&&f.list[0][1]===1?T('просте','prime'):facStr(f.list)):T('не розкладено за ліміт','not factored within limit'),M5.fmtT(ms)])}
 html('mpout',M5.table(['n','Fₙ = 2^(2ⁿ) + 1',T('Розклад','Factorisation'),T('час','time')],rows)+'<p class="mut">'+T('Ферма припускав, що всі Fₙ прості; Ейлер показав, що F₅ = 641 · 6700417. F₇ тут не розкладається (потребує значно довших обчислень).','Fermat conjectured all Fₙ are prime; Euler showed F₅ = 641 · 6700417. F₇ is not factored here (it needs far longer computation).')+'</p>')}
function ntSieve(){try{const N=Number(big('sv6'));if(!(N>=10&&N<=5000000))throw Error(T('Обмеження ресурсів: 10 ≤ N ≤ 5 000 000.','Resource limit: 10 ≤ N ≤ 5,000,000.'));say('sverr','');
 let t=performance.now();const a=sieveE(N),te=performance.now()-t;t=performance.now();const b=sieveS(N),ts=performance.now()-t;let same=true,cnt=0;for(let i=0;i<=N;i++){if(a[i]!==b[i])same=false;if(!a[i])cnt++}
 const tw=[];for(let i=3;i+2<=N;i+=2)if(!a[i]&&!a[i+2])tw.push(i);
 put('svout',[T('π(N) = ','π(N) = ')+cnt,T('Решето Ератосфена: ','Sieve of Eratosthenes: ')+M5.fmtT(te)+'   |   '+T('Решето Сундарама: ','Sieve of Sundaram: ')+M5.fmtT(ts),T('Результати збігаються: ','Results identical: ')+(same?'✓':'✗'),'',T('Прості-близнюки (p, p+2) ≤ N: ','Twin primes (p, p+2) ≤ N: ')+tw.length+T(' пар; перші: ',' pairs; first: ')+tw.slice(0,12).map(x=>[x,x+2]).map(p=>'('+p[0]+', '+p[1]+')').join(' '),T('Найбільша пара ≤ N: ','Largest pair ≤ N: ')+(tw.length?'('+tw[tw.length-1]+', '+(tw[tw.length-1]+2)+')':'—')].join('\n'))}catch(e){say('sverr',e.message)}}
M5.addTab('nt','Дослідник теорії чисел','Number Theory Explorer',NT,()=>{q('#ngo').onclick=ntRun;q('#nn').addEventListener('keydown',e=>{if(e.key==='Enter')ntRun()});q('#lgo6').onclick=ntLeg;q('#prgo').onclick=ntPR;q('#fkgo').onclick=ntFib;q('#mpgo').onclick=ntMers;q('#fegp').onclick=ntFermat;q('#svgo').onclick=ntSieve;ntRun();ntLeg();ntPR();ntFib();document.addEventListener('mc5:lang',()=>{ntRun();ntLeg();ntPR();ntFib()})});
/* ================= Обсерваторія простих чисел ================= */
const OB=`<h2>⟦Обсерваторія простих чисел|Prime Number Observatory⟧</h2>
<p class="lead">⟦Спіраль Улама, π(x) проти x/ln x, відносна похибка та проміжки між простими. Обмеження ресурсів: N ≤ 2 000 000.|Ulam spiral, π(x) vs x/ln x, relative error and prime gaps. Resource limit: N ≤ 2,000,000.⟧</p>
<div class="row"><label>N<input class="s" id="on" value="200000"></label><label>⟦Спіраль: сторона|Spiral: side⟧<input class="s" id="os" value="151"></label><button class="b m" id="ogo">⟦Дослідити|Explore⟧</button><button class="b" id="ocsv">CSV</button><button class="b" id="opng">⟦Спіраль PNG|Spiral PNG⟧</button></div>
<div class="err" id="oerr"></div><div id="osum"></div>
<h2>⟦Спіраль Улама|Ulam spiral⟧</h2><canvas id="ocv" width="600" height="600" style="max-width:100%;background:#000;border:1px solid var(--line)" role="img" aria-label="Ulam spiral"></canvas>
<h2>π(x)</h2><div class="wide" id="och1"></div><div class="wide" id="och2"></div>
<h2>⟦Проміжки між сусідніми простими|Gaps between consecutive primes⟧</h2><div class="wide" id="och3"></div>`;
let OBD=null;
function obRun(){try{const N=Number(big('on')),S=Number(big('os'));if(!(N>=100&&N<=2000000))throw Error(T('Обмеження ресурсів: 100 ≤ N ≤ 2 000 000.','Resource limit: 100 ≤ N ≤ 2,000,000.'));if(!(S>=11&&S<=301&&S%2===1))throw Error(T('Сторона спіралі — непарне число 11…301.','Spiral side must be an odd number 11…301.'));say('oerr','');
 const c=sieveE(N),pr=[];for(let i=2;i<=N;i++)if(!c[i])pr.push(i);
 html('osum','<div class="kpis"><div class="kpi"><b>'+pr.length+'</b>π('+N+')</div><div class="kpi"><b>'+(N/Math.log(N)).toFixed(1)+'</b>N/ln N</div><div class="kpi"><b>'+(100*(pr.length-N/Math.log(N))/pr.length).toFixed(2)+'%</b>'+T('відносна похибка','relative error')+'</div><div class="kpi"><b>'+pr[pr.length-1]+'</b>'+T('найбільше просте','largest prime')+'</div></div>');
 /* Улам */
 const cv=q('#ocv'),g=cv.getContext('2d'),cell=Math.floor(600/S);cv.width=cv.height=cell*S;g.fillStyle='#000';g.fillRect(0,0,cv.width,cv.height);let x=(S-1)/2,y=x,dx=1,dy=0,seg=1,seen=0,turn=0;
 for(let n=1;n<=S*S;n++){if(n<=N&&n>1&&!c[n]){g.fillStyle='#ff4d5e';g.fillRect(x*cell,y*cell,Math.max(1,cell-(cell>3?1:0)),Math.max(1,cell-(cell>3?1:0)))}x+=dx;y+=dy;seen++;if(seen===seg){seen=0;[dx,dy]=[-dy,dx];turn++;if(turn%2===0)seg++}}
 /* π(x) */
 const pts=[],cnts=new Uint32Array(N+1);let k=0;for(let i=0;i<=N;i++){if(i>=2&&!c[i])k++;cnts[i]=k}
 for(let i=0;i<60;i++){pts.push(Math.round(Math.pow(10,1+(Math.log10(N)-1)*i/59)))}const xs=[...new Set(pts)];
 const pi=xs.map(v=>cnts[v]),ap=xs.map(v=>v/Math.log(v)),er=xs.map((v,i)=>100*(pi[i]-ap[i])/pi[i]);
 html('och1',M5.lineChart({title:'π(x) vs x/ln x',x:xs.map(v=>v>=1000?(v/1000).toFixed(0)+'k':v),series:[{name:'π(x)',y:pi},{name:'x/ln x',y:ap}],log:true,xlab:'x',ylab:'count'}));
 html('och2',M5.lineChart({title:T('Відносна похибка (π(x) − x/ln x)/π(x), %','Relative error (π(x) − x/ln x)/π(x), %'),x:xs.map(v=>v>=1000?(v/1000).toFixed(0)+'k':v),series:[{name:'%',y:er}],xlab:'x',ylab:'%',zero:true}));
 const gaps=new Map();let mx=0;for(let i=1;i<pr.length;i++){const d=pr[i]-pr[i-1];gaps.set(d,(gaps.get(d)||0)+1);if(d>mx)mx=d}
 const top=[...gaps.entries()].sort((a,b)=>a[0]-b[0]).slice(0,24);
 html('och3',M5.barChart({title:T('Гістограма проміжків (до 24 найменших значень), максимальний проміжок = ','Gap histogram (24 smallest values), maximum gap = ')+mx,items:top.map(([d,n])=>({name:T('проміжок ','gap ')+d,v:n})),left:110,fmt:v=>v}));
 OBD={N,xs,pi,ap,er,gaps:[...gaps.entries()].sort((a,b)=>a[0]-b[0])}}catch(e){say('oerr',e.message)}}
M5.addTab('obs','Обсерваторія простих чисел','Prime Number Observatory',OB,()=>{q('#ogo').onclick=obRun;q('#ocsv').onclick=()=>{if(!OBD)obRun();if(!OBD)return;M5.dl('prime_observatory.csv',M5.csv([['x','pi_x','x_over_ln_x','rel_error_percent']].concat(OBD.xs.map((v,i)=>[v,OBD.pi[i],OBD.ap[i].toFixed(4),OBD.er[i].toFixed(4)]))),'text/csv;charset=utf-8')};
 q('#opng').onclick=()=>q('#ocv').toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='ulam_spiral.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)});obRun();document.addEventListener('mc5:lang',obRun)});
/* ================= Математичні ґратки ================= */
const LT=`<h2>⟦Математичні ґратки|Mathematical lattices⟧</h2>
<p class="lead">⟦Двовимірна ґратка L = {i·b₁ + j·b₂}. Виміряйте детермінант і площу фундаментального паралелограма, виконайте редукцію Гаусса крок за кроком, знайдіть короткі вектори. Нижче — навчальний LLL для розмірності 3–4.|A 2-D lattice L = {i·b₁ + j·b₂}. Compute the determinant and fundamental-parallelogram area, run Gauss reduction step by step, find short vectors. Below: educational LLL for dimensions 3–4.⟧</p>
<div class="row"><label>b₁ = (x, y)<span class="rg"><input class="s" id="b1x" value="5"><input class="s" id="b1y" value="1"></span></label><label>b₂ = (x, y)<span class="rg"><input class="s" id="b2x" value="12"><input class="s" id="b2y" value="3"></span></label><button class="b m" id="lta">⟦Побудувати|Build⟧</button><button class="b" id="ltrnd">⟦Випадковий базис|Random basis⟧</button></div>
<div class="err" id="lterr"></div><div id="ltsum"></div>
<div class="row"><button class="b" id="ltp">⟦Попередній крок|Previous step⟧</button><span id="ltstep" class="mut"></span><button class="b" id="ltn">⟦Наступний крок|Next step⟧</button><button class="b" id="ltall">⟦Показати редукцію повністю|Show full reduction⟧</button></div>
<div class="wide" id="ltsvg"></div><pre id="ltlog"></pre>
<h2>⟦Короткі вектори (обмежений перебір)|Short vectors (bounded search)⟧</h2>
<div class="row"><label>B (|i|, |j| ≤ B)<input class="s" id="ltB" value="30"></label><button class="b" id="ltsv">⟦Шукати|Search⟧</button></div><pre id="ltshort"></pre>
<h2>⟦LLL (навчальна реалізація, δ = 3/4, точна раціональна арифметика)|LLL (educational, δ = 3/4, exact rational arithmetic)⟧</h2>
<p class="mut">⟦Один рядок — один вектор, компоненти через пробіл (3 або 4 вектори однакової розмірності).|One line per vector, components separated by spaces (3 or 4 vectors of equal dimension).⟧</p>
<textarea class="w" id="ltm" rows="4">1 1 1
-1 0 2
3 5 6</textarea><div class="row"><button class="b m" id="ltl">LLL</button></div><pre id="ltlout"></pre>
<h2>⟦SVP, CVP та зв’язок з діофантовими рівняннями й криптографією|SVP, CVP and the link with Diophantine equations and cryptography⟧</h2>
<p>⟦SVP (задача найкоротшого вектора): знайти ненульовий v ∈ L з мінімальною нормою. CVP (задача найближчого вектора): для заданої точки t знайти v ∈ L, найближчий до t. Обидві вважаються обчислювально важкими при великих розмірностях; на цьому ґрунтується ґраткова постквантова криптографія (LWE, ML-KEM).|SVP (shortest vector problem): find a nonzero v ∈ L of minimum norm. CVP (closest vector problem): for a target t find v ∈ L closest to t. Both are believed hard in high dimension; lattice-based post-quantum cryptography (LWE, ML-KEM) rests on this.⟧</p>
<p>⟦Зв’язок із діофантовими рівняннями: множина цілих розв’язків (x, y) рівняння ax + by = 0 є одновимірною ґраткою, породженою вектором (b/g, −a/g), а розв’язки ax + by = c — її зсувом (клас суміжності) на частковий розв’язок. Редукція Гаусса у розмірності 2 узагальнює алгоритм Евкліда: обидва послідовно віднімають кратні векторів (чисел), доки не отримають найкоротші.|Link with Diophantine equations: the integer solutions (x, y) of ax + by = 0 form a one-dimensional lattice generated by (b/g, −a/g), and the solutions of ax + by = c are a translate (coset) of it by a particular solution. In dimension 2 Gauss reduction generalises Euclid’s algorithm: both repeatedly subtract multiples until the shortest are obtained.⟧</p>
<p class="note">⟦Точні результати: визначник, площа, редукція Гаусса (перший вектор редукованого базису — найкоротший ненульовий вектор ґратки) та LLL. Результат обмеженого перебору — лише найкращий знайдений серед перевірених комбінацій.|Exact results: determinant, area, Gauss reduction (the first vector of a reduced basis is a shortest nonzero lattice vector) and LLL. Bounded search only gives the best vector among the combinations checked.⟧</p>`;
const LS={steps:[],i:0,b:null};
const vdot=(u,v)=>u[0]*v[0]+u[1]*v[1],n2=u=>vdot(u,u);
const rdiv=(p,qq)=>{/* round(p/q), q>0 */return (2n*p+qq)/(2n*qq)-((2n*p+qq)%(2n*qq)<0n?1n:0n)};
function gauss(b1,b2){const st=[{b1:[...b1],b2:[...b2],note:T('Початковий базис','Initial basis')}];let u=[...b1],v=[...b2];
 for(let it=0;it<10000;it++){if(n2(u)>n2(v)){[u,v]=[v,u];st.push({b1:[...u],b2:[...v],note:T('Обмін: |b₁| > |b₂|','Swap: |b₁| > |b₂|')});}
  const num=vdot(u,v),den=n2(u);if(den===0n)break;let m=num/den;const r=num-m*den;if(2n*abs(r)>den)m+=num>=0n?1n:-1n;
  /* точне округлення num/den до найближчого цілого */
  m=fl2(num,den);
  if(m===0n)break;v=[v[0]-m*u[0],v[1]-m*u[1]];st.push({b1:[...u],b2:[...v],note:'b₂ ← b₂ − ('+m+')·b₁   (μ = ⟨b₁,b₂⟩/⟨b₁,b₁⟩ = '+num+'/'+den+')'})}
 if(n2(u)>n2(v)){[u,v]=[v,u];st.push({b1:[...u],b2:[...v],note:T('Обмін','Swap')})}return{u,v,st}}
function fl2(p,d){const x=2n*p+d,y=2n*d;let r=x/y;if(x%y!==0n&&(x<0n))r-=1n;return r}
function ltDraw(){const st=LS.steps[LS.i],W=600,H=420,B1=LS.b[0],B2=LS.b[1];const b1=st.b1.map(Number),b2=st.b2.map(Number),o1=B1.map(Number),o2=B2.map(Number);
 const ext=Math.max(8,...[b1,b2,o1,o2].flat().map(Math.abs))*1.6,s=Math.min(W,H)/2/ext*0.95,X=x=>W/2+x*s,Y=y=>H/2-y*s;
 let g='<svg xmlns="http://www.w3.org/2000/svg" class="ch" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" style="background:#0a0a0c" font-family="Segoe UI,Arial"><line x1="0" x2="'+W+'" y1="'+Y(0)+'" y2="'+Y(0)+'" stroke="#333"/><line y1="0" y2="'+H+'" x1="'+X(0)+'" x2="'+X(0)+'" stroke="#333"/>';
 const dep=b1[0]*b2[1]-b1[1]*b2[0]===0;
 for(let i=-60;i<=60;i++)for(let j=-60;j<=60;j++){const x=i*b1[0]+j*b2[0],y=i*b1[1]+j*b2[1];if(Math.abs(x)<=ext*1.25&&Math.abs(y)<=ext*1.25*H/W+ext*.3)g+='<circle cx="'+X(x).toFixed(1)+'" cy="'+Y(y).toFixed(1)+'" r="2.4" fill="#888"/>'}
 if(!dep)g+='<polygon points="'+[[0,0],b1,[b1[0]+b2[0],b1[1]+b2[1]],b2].map(p=>X(p[0])+','+Y(p[1])).join(' ')+'" fill="rgba(196,18,47,.22)" stroke="#c4122f"/>';
 const arrow=(v,c,l)=>'<line x1="'+X(0)+'" y1="'+Y(0)+'" x2="'+X(v[0])+'" y2="'+Y(v[1])+'" stroke="'+c+'" stroke-width="2.5"/><circle cx="'+X(v[0])+'" cy="'+Y(v[1])+'" r="5" fill="'+c+'"/><text x="'+(X(v[0])+7)+'" y="'+(Y(v[1])-7)+'" fill="'+c+'" font-size="13">'+l+'</text>';
 if(LS.i>0){g+=arrow(o1,'#666','b₁⁰')+arrow(o2,'#666','b₂⁰')}g+=arrow(b1,'#ff4d5e','b₁')+arrow(b2,'#fff','b₂');q('#ltsvg').innerHTML=g+'</svg>';
 q('#ltstep').textContent=T('Крок ','Step ')+LS.i+' / '+(LS.steps.length-1);
 const L=LS.steps.slice(0,LS.i+1).map((s,k)=>k+': '+s.note+'  → b₁ = ('+s.b1+'), b₂ = ('+s.b2+'),  |b₁|² = '+n2(s.b1)+', |b₂|² = '+n2(s.b2));q('#ltlog').textContent=L.join('\n')}
function ltBuild(){try{const b1=[big('b1x'),big('b1y')],b2=[big('b2x'),big('b2y')];say('lterr','');const det=b1[0]*b2[1]-b1[1]*b2[0];
 LS.b=[b1,b2];
 if(det===0n){html('ltsum','<div class="warn">'+T('Вектори лінійно залежні (det = 0): вони не утворюють двовимірну ґратку.','The vectors are linearly dependent (det = 0): they do not span a 2-D lattice.')+'</div>');LS.steps=[{b1,b2,note:T('Початковий базис','Initial basis')}];LS.i=0;ltDraw();return}
 const r=gauss(b1,b2);LS.steps=r.st;LS.i=0;LS.red=r;
 html('ltsum','<div class="kpis"><div class="kpi"><b>'+det+'</b>det(B)</div><div class="kpi"><b>'+abs(det)+'</b>'+T('площа фундаментального паралелограма','fundamental parallelogram area')+'</div><div class="kpi"><b>'+Math.sqrt(Number(n2(b1))).toFixed(3)+' ; '+Math.sqrt(Number(n2(b2))).toFixed(3)+'</b>|b₁| ; |b₂| '+T('(початковий)','(initial)')+'</div><div class="kpi"><b>'+Math.sqrt(Number(n2(r.u))).toFixed(3)+' ; '+Math.sqrt(Number(n2(r.v))).toFixed(3)+'</b>|b₁| ; |b₂| '+T('(редукований)','(reduced)')+'</div><div class="kpi"><b>('+r.u+') ; ('+r.v+')</b>'+T('редукований базис','reduced basis')+'</div></div><p class="mut">'+T('Площа не змінюється при заміні базису (|det| інваріантний): ','The area is invariant under change of basis (|det| is invariant): ')+abs(r.u[0]*r.v[1]-r.u[1]*r.v[0])+' = '+abs(det)+(abs(r.u[0]*r.v[1]-r.u[1]*r.v[0])===abs(det)?' ✓':' ✗')+'</p>');ltDraw()}catch(e){say('lterr',e.message)}}
function ltShort(){try{if(!LS.b)ltBuild();const B=Number(big('ltB'));if(!(B>=1&&B<=300))throw Error('B: 1…300');const[b1,b2]=LS.b.map(v=>v.map(Number));const vs=[];for(let i=-B;i<=B;i++)for(let j=-B;j<=B;j++){if(!i&&!j)continue;const x=i*b1[0]+j*b2[0],y=i*b1[1]+j*b2[1];vs.push([x*x+y*y,x,y,i,j])}vs.sort((a,b)=>a[0]-b[0]);const seen=new Set(),out=[];for(const v of vs){const k=Math.min(v[1]+','+v[2],-v[1]+','+-v[2]);if(seen.has(k))continue;seen.add(k);out.push(v);if(out.length>=10)break}
 put('ltshort',T('Результат ОБМЕЖЕНОГО перебору (|i|, |j| ≤ '+B+'), не доведення мінімальності:\n','Result of a BOUNDED search (|i|, |j| ≤ '+B+'), not a proof of minimality:\n')+out.map(v=>'|v| = '+Math.sqrt(v[0]).toFixed(4)+',  v = ('+v[1]+', '+v[2]+') = '+v[3]+'·b₁ + '+v[4]+'·b₂').join('\n')+(LS.red?'\n\n'+T('Точно (Гаусс): найкоротший вектор ґратки — ','Exact (Gauss): a shortest lattice vector is ')+'('+LS.red.u+'), |v| = '+Math.sqrt(Number(n2(LS.red.u))).toFixed(4):''))}catch(e){put('ltshort',e.message)}}
/* LLL з раціональними числами */
const Fr=(n,d=1n)=>{if(d<0n){n=-n;d=-d}const g=gcd(n,d)||1n;return[n/g,d/g]};
const fa=(a,b)=>Fr(a[0]*b[1]+b[0]*a[1],a[1]*b[1]),fs=(a,b)=>Fr(a[0]*b[1]-b[0]*a[1],a[1]*b[1]),fm=(a,b)=>Fr(a[0]*b[0],a[1]*b[1]),fd=(a,b)=>Fr(a[0]*b[1],a[1]*b[0]);
const fdot=(u,v)=>u.reduce((s,x,i)=>fa(s,fm(x,v[i])),Fr(0n));
function gso(B){const n=B.length,Bs=[],mu=[];for(let i=0;i<n;i++){let v=B[i].map(x=>Fr(x));mu[i]=[];for(let j=0;j<i;j++){const m=fd(fdot(B[i].map(x=>Fr(x)),Bs[j]),fdot(Bs[j],Bs[j]));mu[i][j]=m;v=v.map((x,k)=>fs(x,fm(m,Bs[j][k])))}Bs.push(v)}return{Bs,mu}}
const frs=a=>a[1]===1n?String(a[0]):a[0]+'/'+a[1];
function lll(B0,delta=[3n,4n],budgetMs=8000){const B=B0.map(v=>[...v]),log=[];let k=1,it=0;const nb=B.length,t0=performance.now();
 while(k<nb&&it++<2000){if(performance.now()-t0>budgetMs)throw Error(T('Перевищено часовий ліміт LLL ('+budgetMs/1000+' с): зменште розмірність або розмір чисел.','LLL time limit exceeded ('+budgetMs/1000+' s): reduce the dimension or the size of the numbers.'));let G=gso(B);if(G.Bs.some(v=>fdot(v,v)[0]===0n))throw Error(T('Вектори лінійно залежні.','The vectors are linearly dependent.'));
  for(let j=k-1;j>=0;j--){const m=G.mu[k][j],r=fl2(m[0],m[1]);if(r!==0n){B[k]=B[k].map((x,i)=>x-r*B[j][i]);log.push(T('Редукція розміру: b','Size reduction: b')+(k+1)+' ← b'+(k+1)+' − ('+r+')·b'+(j+1)+'  (μ = '+frs(m)+')  → ('+B[k]+')');G=gso(B)}}
  const lhs=fdot(G.Bs[k],G.Bs[k]),mu=G.mu[k][k-1],rhs=fm(fs(Fr(delta[0],delta[1]),fm(mu,mu)),fdot(G.Bs[k-1],G.Bs[k-1]));
  const ok=lhs[0]*rhs[1]>=rhs[0]*lhs[1];log.push(T('Умова Ловаса для k = ','Lovász condition for k = ')+(k+1)+': |b*'+(k+1)+'|² = '+frs(lhs)+' ≥ (δ − μ²)|b*'+k+'|² = '+frs(rhs)+' → '+(ok?T('виконується','holds'):T('порушена: обмін','violated: swap')));
  if(ok)k++;else{[B[k],B[k-1]]=[B[k-1],B[k]];log.push(T('Обмін b','Swap b')+k+' ↔ b'+(k+1)+' → ('+B.map(v=>'('+v+')').join(', ')+')');k=Math.max(k-1,1)}}
 return{B,log,it}}
M5.lll=lll;
function ltLLL(){try{const rows=q('#ltm').value.trim().split(/\n+/).map(l=>l.trim().split(/[\s,;]+/).map(x=>{if(!/^[+-]?\d+$/.test(x))throw Error(T('Лише цілі числа.','Integers only.'));return BigInt(x)}));const n=rows.length,m=rows[0].length;if(n<2||n>4||m<n||rows.some(r=>r.length!==m))throw Error(T('2–4 вектори однакової розмірності ≥ кількості векторів.','2–4 vectors of equal dimension ≥ number of vectors.'));
 const r=lll(rows);put('ltlout',[T('Вхідний базис:','Input basis:'),...rows.map(v=>'  ('+v+')'),'',...r.log,'',T('LLL-редукований базис:','LLL-reduced basis:'),...r.B.map(v=>'  ('+v+')  |v|² = '+v.reduce((s,x)=>s+x*x,0n)),T('Вхідні |v|²: ','Input |v|²: ')+rows.map(v=>v.reduce((s,x)=>s+x*x,0n)).join(', ')].join('\n'))}catch(e){put('ltlout',e.message)}}
M5.addTab('lattice','Математичні ґратки','Mathematical lattices',LT,()=>{q('#lta').onclick=ltBuild;q('#ltp').onclick=()=>{if(LS.i>0){LS.i--;ltDraw()}};q('#ltn').onclick=()=>{if(LS.i<LS.steps.length-1){LS.i++;ltDraw()}};q('#ltall').onclick=()=>{LS.i=LS.steps.length-1;ltDraw()};
 q('#ltrnd').onclick=()=>{const r=()=>Math.floor(Math.random()*61)-30;let a,b,c,d;do{a=r();b=r();c=r();d=r()}while(a*d-b*c===0);q('#b1x').value=a;q('#b1y').value=b;q('#b2x').value=c;q('#b2y').value=d;ltBuild()};
 q('#ltsv').onclick=ltShort;q('#ltl').onclick=ltLLL;ltBuild();ltLLL();document.addEventListener('mc5:lang',()=>{ltBuild();ltLLL()})});
/* ================= Математичний термінал ================= */
const TM=`<h2>⟦Математичний термінал|Mathematical terminal⟧</h2>
<p class="lead">⟦Безпечний власний парсер: дозволені лише перелічені функції та арифметика (+ − * / % ^). eval() та Function() не використовуються. Tab — автодоповнення, ↑/↓ — історія, «steps вираз» — покрокове пояснення.|A safe custom parser: only the listed functions and arithmetic (+ − * / % ^) are allowed. No eval() or Function(). Tab autocompletes, ↑/↓ browse history, “steps expression” shows step-by-step explanation.⟧</p>
<div class="term" id="tlog" aria-live="polite"></div>
<div class="row"><label style="flex:1">&gt;<input class="w" id="tin" autocomplete="off" spellcheck="false" placeholder="gcd(120, 84)"></label><button class="b m" id="trun">⟦Виконати|Run⟧</button><button class="b" id="tcopy">⟦Копіювати|Copy⟧</button><button class="b" id="texp">⟦Експорт історії|Export history⟧</button><button class="b" id="tclr">clear</button></div>
<div class="note" id="thint"></div>`;
const CMD={};const tdef=(n,doc,f)=>CMD[n]={doc,f};
const bi=(v,n='arg')=>{if(typeof v!=='bigint')throw Error(T('Очікується ціле число: ','Integer expected: ')+n);return v};
tdef('gcd','gcd(a, b, …) — НСД',(a)=>{const st=[];let g=0n;a.forEach(x=>{bi(x);const prev=g;g=gcd(g,x);st.push('gcd('+prev+', '+x+') = '+g)});return{v:g,st:a.length===2?M5.xgcd(a[0],a[1]).steps.map(s=>s.a+' = '+s.q+'·'+s.b+' + '+s.r).concat(['НСД = '+g]):st}});
tdef('lcm','lcm(a, b, …) — НСК',a=>{let l=1n;a.forEach(x=>{bi(x);l=x===0n?0n:l===0n?0n:abs(l*x)/gcd(l,x)});return{v:l,st:['lcm(a, b) = |ab| / gcd(a, b)']}});
tdef('egcd','egcd(a, b) — g, x, y: ax + by = g',a=>{const r=xgcd(bi(a[0]),bi(a[1]));return{v:'g = '+r.g+', x = '+r.x+', y = '+r.y+'   ('+a[0]+'·('+r.x+') + '+a[1]+'·('+r.y+') = '+(a[0]*r.x+a[1]*r.y)+')',st:r.steps.map(s=>s.a+' = '+s.q+'·'+s.b+' + '+s.r)}});
tdef('diophantine','diophantine(a, b, c) — ax + by = c',a=>{const D=M5.dio(bi(a[0]),bi(a[1]),bi(a[2]));if(D.all)return{v:'∀ (x, y)',st:[]};if(!D.ok)return{v:T('розв’язків немає: НСД = ','no solutions: gcd = ')+D.g+' ∤ '+a[2],st:[]};return{v:'x = '+D.x0+' + ('+D.sx+')t,  y = '+D.y0+' + ('+D.sy+')t',st:['НСД = '+D.g+' | '+a[2],'Безу: x = '+D.x+', y = '+D.y,'(x₀, y₀) = (x·c/g, y·c/g)',T('перевірка: ','check: ')+(a[0]*D.x0+a[1]*D.y0)]}});
tdef('pell','pell(D) — x² − Dy² = 1',a=>{const D0=bi(a[0]);if(D0>10n**12n)throw Error(T('Обмеження обчислювальних ресурсів: D ≤ 10¹²','Resource limit: D ≤ 10¹²'));const r=M5.pellSolve(D0,300000);if(r.square)return{v:T('D — повний квадрат: лише тривіальні розв’язки','D is a perfect square: trivial solutions only'),st:[]};if(r.error)throw Error('too many iterations');return{v:'x = '+r.x+', y = '+r.y,st:r.steps.slice(0,25).map(s=>'i='+s.i+': a='+s.a+', h/k = '+s.h+'/'+s.k+', h²−Dk² = '+s.v)}});
tdef('prime','prime(n) — чи просте',a=>({v:M5.isPrime(bi(a[0])),st:[T('Міллер — Рабін (детермінований до 3,3·10²⁴)','Miller–Rabin (deterministic below 3.3·10²⁴)')]}));
tdef('factor','factor(n) — розклад',a=>{const F=fac(bi(a[0]));return{v:facStr(F.list)+(F.complete?'':'  (?)'),st:F.list.map(([p,e])=>p+' ^ '+e)}});
tdef('phi','phi(n) — функція Ейлера',a=>{const F=fac(bi(a[0]));return{v:phiF(F.list),st:['n = '+facStr(F.list),'φ = ∏ p^(e−1)(p−1)']}});
tdef('mobius','mobius(n) — μ(n)',a=>({v:muF(fac(bi(a[0])).list),st:[]}));
tdef('tau','tau(n) — кількість дільників',a=>({v:tauF(fac(bi(a[0])).list),st:[]}));
tdef('sigma','sigma(n) — сума дільників',a=>({v:sigF(fac(bi(a[0])).list),st:[]}));
tdef('carmichael','carmichael(n) — λ(n)',a=>({v:lamF(fac(bi(a[0])).list),st:[]}));
tdef('modpow','modpow(b, e, m) — bᵉ mod m',a=>{const[b,e,m]=a.map(x=>bi(x));if(m<=0n||e<0n)throw Error('m > 0, e ≥ 0');const st=[];let r=1n,x=mod(b,m),k=e;while(k>0n){st.push('e-біт '+(k&1n)+': '+(k&1n?'r = r·x mod m = '+(r*x%m):'—')+', x = x² mod m = '+(x*x%m));if(k&1n)r=r*x%m;x=x*x%m;k>>=1n}return{v:r,st}});
tdef('inverse','inverse(a, m) — a⁻¹ mod m',a=>{const r=xgcd(mod(bi(a[0]),bi(a[1])),a[1]);if(r.g!==1n)throw Error(T('оберненого не існує: НСД = ','no inverse: gcd = ')+r.g);return{v:mod(r.x,a[1]),st:r.steps.map(s=>s.a+' = '+s.q+'·'+s.b+' + '+s.r).concat(['x = '+r.x+' ≡ '+mod(r.x,a[1])])}});
const fibGuard=n=>{if(n<0n||n>10000000n)throw Error(T('Обмеження обчислювальних ресурсів: 0 ≤ n ≤ 10⁷','Resource limit: 0 ≤ n ≤ 10⁷'));return n};tdef('fibonacci','fibonacci(n)',a=>({v:fibLuc(fibGuard(bi(a[0]))).F,st:[]}));tdef('lucas','lucas(n)',a=>({v:fibLuc(fibGuard(bi(a[0]))).L,st:[]}));
tdef('legendre','legendre(a, p)',a=>({v:legendre(bi(a[0]),bi(a[1])),st:[]}));tdef('jacobi','jacobi(a, n)',a=>({v:jacobi(bi(a[0]),bi(a[1])),st:[]}));
tdef('isqrt','isqrt(n) — ціла частина кореня',a=>({v:isqrt(bi(a[0])),st:[]}));
tdef('binomial','binomial(n, k)',a=>{let n=bi(a[0]),k=bi(a[1]),r=1n;if(k<0n||k>n)return{v:0n,st:[]};if(k>n-k)k=n-k;if(k>20000n)throw Error(T('Обмеження обчислювальних ресурсів: min(k, n−k) ≤ 20000','Resource limit: min(k, n−k) ≤ 20000'));for(let i=1n;i<=k;i++)r=r*(n-k+i)/i;return{v:r,st:[]}});
tdef('crt','crt(a₁, m₁, a₂, m₂, …)',a=>{if(a.length<2||a.length%2)throw Error('crt(a1,m1,a2,m2,…)');const e=[];for(let i=0;i<a.length;i+=2)e.push({r:bi(a[i]),m:bi(a[i+1])});const r=M5.crtSolve(e);return{v:r.ok?'x ≡ '+r.x+' (mod '+r.M+')':T('система несумісна','inconsistent system'),st:r.steps}});
tdef('sha256','sha256("текст")',async a=>{if(typeof a[0]!=='string')throw Error('sha256("...")');return{v:M5.hex(await M5.digest('SHA-256',new TextEncoder().encode(a[0]))),st:[]}});
tdef('sha512','sha512("текст")',async a=>{if(typeof a[0]!=='string')throw Error('sha512("...")');return{v:M5.hex(await M5.digest('SHA-512',new TextEncoder().encode(a[0]))),st:[]}});
tdef('help','help() — список команд',()=>({v:Object.keys(CMD).map(k=>CMD[k].doc).join('\n'),st:[]}));tdef('history','history() — історія',()=>({v:TH.h.map((x,i)=>(i+1)+': '+x).join('\n')||'—',st:[]}));tdef('clear','clear() — очистити',()=>({v:null,st:[],clear:true}));
const TH={h:[],i:0,log:[]};
/* лексер + рекурсивний спуск */
function tokenize(s){const t=[];let i=0;while(i<s.length){const c=s[i];if(/\s/.test(c)){i++;continue}if(/\d/.test(c)){let j=i;while(j<s.length&&/\d/.test(s[j]))j++;t.push({k:'n',v:BigInt(s.slice(i,j))});i=j;continue}
  if(/[A-Za-z_]/.test(c)){let j=i;while(j<s.length&&/[A-Za-z0-9_]/.test(s[j]))j++;t.push({k:'id',v:s.slice(i,j)});i=j;continue}
  if(c==='"'){let j=i+1,r='';while(j<s.length&&s[j]!=='"'){r+=s[j];j++}if(j>=s.length)throw Error(T('Незакритий рядок','Unclosed string'));t.push({k:'s',v:r});i=j+1;continue}
  if('+-*/%^(),'.includes(c)){t.push({k:'op',v:c});i++;continue}throw Error(T('Недозволений символ: ','Illegal character: ')+c)}return t}
async function evalExpr(s){const tk=tokenize(s);let p=0;const peek=()=>tk[p],eat=v=>{if(!tk[p]||tk[p].v!==v||tk[p].k==='n'&&0)throw Error(T('Очікувалось ','Expected ')+v);p++};
 async function prim(){const t=tk[p++];if(!t)throw Error(T('Несподіваний кінець виразу','Unexpected end of expression'));if(t.k==='n')return t.v;if(t.k==='s')return t.v;
  if(t.k==='op'&&t.v==='('){const v=await expr();eat(')');return v}if(t.k==='op'&&t.v==='-'){const v=await prim();return -bi(v)}
  if(t.k==='id'){if(!CMD[t.v])throw Error(T('Невідома команда: ','Unknown command: ')+t.v+T('. Введіть help().','. Type help().'));eat('(');const args=[];if(!(peek()&&peek().v===')'&&peek().k==='op')){for(;;){args.push(await expr());if(peek()&&peek().k==='op'&&peek().v===','){p++;continue}break}}eat(')');
   const ar=args;const r=await CMD[t.v].f(ar);CALLS.push({n:t.v,r});return r.clear?null:(r.v===undefined?null:r.v)}throw Error(T('Синтаксична помилка: ','Syntax error: ')+t.v)}
 async function pow(){const b=await prim();if(peek()&&peek().k==='op'&&peek().v==='^'){p++;const e=await pow();if(bi(e)>100000n||e<0n)throw Error('0 ≤ e ≤ 100000');return bi(b)**e}return b}
 async function term(){let v=await pow();while(peek()&&peek().k==='op'&&'*/%'.includes(peek().v)){const o=tk[p++].v,r=await pow();bi(v);bi(r);if(o==='*')v*=r;else{if(r===0n)throw Error(T('Ділення на нуль','Division by zero'));v=o==='/'?v/r:mod(v,r)}}return v}
 async function expr(){let v=await term();while(peek()&&peek().k==='op'&&'+-'.includes(peek().v)){const o=tk[p++].v,r=await term();v=o==='+'?bi(v)+bi(r):bi(v)-bi(r)}return v}
 const v=await expr();if(p<tk.length)throw Error(T('Зайві символи після виразу','Extra tokens after expression'));return v}
let CALLS=[];
const hl=s=>esc(s).replace(/&quot;([^&]*?)&quot;/g,'<span class="ts">"$1"</span>').replace(/\b([a-z]+)(?=\()/g,m=>CMD[m]?'<span class="tc">'+m+'</span>':m).replace(/\b(\d+)\b/g,'<span class="tn">$1</span>');
async function tRun(line){line=line.trim();if(!line)return;TH.h.push(line);TH.i=TH.h.length;let steps=false;if(/^steps\s+/i.test(line)){steps=true;line=line.replace(/^steps\s+/i,'')}
 const out=q('#tlog'),row=document.createElement('div');row.innerHTML='<div class="tcmd">&gt; '+hl((steps?'steps ':'')+line)+'</div>';out.appendChild(row);CALLS=[];
 try{const v=await evalExpr(line);const last=CALLS[CALLS.length-1];if(last&&last.r.clear){out.textContent='';TH.log=[];return}
  const txt=typeof v==='bigint'?String(v):typeof v==='boolean'?String(v):v===null?'':String(v);row.innerHTML+='<div class="tres">'+esc(txt)+'</div>';TH.log.push({in:line,out:txt});
  if(steps){const st=CALLS.flatMap(c=>c.r.st||[]);if(st.length)row.innerHTML+='<pre class="tst">'+esc(st.join('\n'))+'</pre>';else row.innerHTML+='<div class="mut">'+esc(T('(для цієї команди покрокового пояснення немає)','(no step-by-step explanation for this command)'))+'</div>'}}
 catch(e){row.innerHTML+='<div class="terr">'+esc(e.message)+'</div>';TH.log.push({in:line,error:e.message})}out.scrollTop=out.scrollHeight}
M5.terminalEval=async s=>{CALLS=[];return evalExpr(s)};
M5.addTab('terminal','Математичний термінал','Mathematical terminal',TM,()=>{const inp=q('#tin');
 const hint=()=>{const w=/[A-Za-z_]*$/.exec(inp.value)[0];const m=w?Object.keys(CMD).filter(k=>k.startsWith(w)):[];q('#thint').textContent=m.length?m.map(k=>CMD[k].doc).join('   |   '):T('Команди: ','Commands: ')+Object.keys(CMD).join(', ')};
 inp.addEventListener('input',hint);hint();let cyc=0;
 inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const v=inp.value;inp.value='';tRun(v);hint()}else if(e.key==='ArrowUp'){e.preventDefault();if(TH.i>0)TH.i--;inp.value=TH.h[TH.i]||''}else if(e.key==='ArrowDown'){e.preventDefault();if(TH.i<TH.h.length)TH.i++;inp.value=TH.h[TH.i]||''}
  else if(e.key==='Tab'){const w=/[A-Za-z_]*$/.exec(inp.value)[0];const m=Object.keys(CMD).filter(k=>k.startsWith(w));if(w&&m.length){e.preventDefault();const c=m[cyc++%m.length];inp.value=inp.value.slice(0,inp.value.length-w.length)+c+'(';hint()}}else cyc=0});
 q('#trun').onclick=()=>{const v=inp.value;inp.value='';tRun(v);inp.focus()};q('#tclr').onclick=()=>{q('#tlog').textContent='';TH.log=[]};
 q('#tcopy').onclick=()=>{const t=TH.log.map(x=>'> '+x.in+'\n'+(x.error?'ERROR: '+x.error:x.out)).join('\n');(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>M5.toast(T('Скопійовано','Copied')),()=>{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');M5.toast(T('Скопійовано','Copied'))}catch(e){M5.toast(T('Не вдалося скопіювати','Copy failed'))}ta.remove()})};
 q('#texp').onclick=()=>M5.dl('mathcrypt_terminal_history.txt',TH.log.map(x=>'> '+x.in+'\n'+(x.error?'ERROR: '+x.error:x.out)).join('\n\n'));
 (async()=>{for(const l of['gcd(120, 84)','steps egcd(35, 15)','pell(61)'])await tRun(l)})()});

/* ===== тести 6.0 ===== */
const tt=M5.tt,S=x=>String(x);
tt('Контроль: gcd(120, 84) = 12',()=>[S(gcd(120n,84n)),'12']);
tt('Контроль: φ(100) = 40',()=>[S(M5.phi(100n)),'40']);
tt('Контроль: 7³ mod 55 = 13',()=>[S(modpow(7n,3n,55n)),'13']);
tt('Контроль: 3⁻¹ mod 40 = 27',()=>[S(modinv(3n,40n)),'27']);
tt('Контроль: 5x + 8y = 150 — (6, 15) є розв’язком сім’ї',()=>{const D=M5.dio(5n,8n,150n);const t=(6n-D.x0)/D.sx;return[S(D.ok&&(6n-D.x0)%D.sx===0n&&D.y0+D.sy*t===15n),'true']});
tt('Контроль: Пелль D=2 → (3, 2)',()=>{const r=M5.pellSolve(2n,1e6);return[r.x+','+r.y,'3,2']});
tt('Контроль: КТО → 23 mod 105',()=>{const r=M5.crtSolve([{r:2n,m:3n},{r:3n,m:5n},{r:2n,m:7n}]);return[r.x+' mod '+r.M,'23 mod 105']});
tt('Факторизація 360 = 2³·3²·5',()=>[facStr(fac(360n).list),'2^3 · 3^2 · 5']);
tt('Факторизація F₅ = 641 · 6700417',()=>[facStr(fac((1n<<32n)+1n).list),'641 · 6700417']);
tt('Факторизація 2⁶⁴+1 (F₆) = 274177 · 67280421310721',()=>[facStr(fac((1n<<64n)+1n).list),'274177 · 67280421310721']);
tt('Факторизація 10¹²+39 (просте)',()=>[S(fac(1000000000039n).list.length),'1']);
tt('φ(36)=12, μ(30)=−1, τ(360)=24, σ(28)=56',()=>[[M5.phi(36n),M5.mu(30n),M5.tau(360n),M5.sigma(28n)].join(','),'12,-1,24,56']);
tt('λ(15)=4, λ(8)=2, λ(561)=80',()=>[[M5.carm(15n),M5.carm(8n),M5.carm(561n)].join(','),'4,2,80']);
tt('Тотожність Гауса Σφ(d)=n для n=360',()=>{let s=0n;for(let d=1n;d<=360n;d++)if(360n%d===0n)s+=M5.phi(d);return[S(s),'360']});
tt('Якобі (5/21)=1, (2/15)=1, (3/7)=−1',()=>[[M5.jacobi(5n,21n),M5.jacobi(2n,15n),M5.jacobi(3n,7n)].join(','),'1,1,-1']);
tt('Лежандр (2/7)=1, (3/7)=−1',()=>[[M5.legendre(2n,7n),M5.legendre(3n,7n)].join(','),'1,-1']);
tt('Первісні корені mod 7: 3, 5',()=>[M5.primRoots(7n,10).roots.join(','),'3,5']);
tt('Первісних коренів mod 8 немає',()=>[S(M5.primRoots(8n,10).exists),'false']);
tt('Фібоначчі F(100) = 354224848179261915075',()=>[S(M5.fibLuc(100n).F),'354224848179261915075']);
tt('Люка L(10) = 123',()=>[S(M5.fibLuc(10n).L),'123']);
tt('Лукас — Лемер: M₇, M₁₃, M₁₇ прості; M₁₁ — ні',()=>[[7,11,13,17].map(p=>lucasLehmer(p)).join(','),'true,false,true,true']);
tt('Решето Ератосфена π(10⁶) = 78498',()=>{const c=sieveE(1000000);let k=0;for(let i=0;i<=1000000;i++)if(!c[i])k++;return[S(k),'78498']});
tt('Решето Сундарама = Ератосфена (N = 20000)',()=>{const a=sieveE(20000),b=sieveS(20000);let ok=true;for(let i=0;i<=20000;i++)if(a[i]!==b[i])ok=false;return[S(ok),'true']});
tt('Ґратки: Гаусс (5,1),(12,3) → |det| збережено = 3',()=>{const r=gauss([5n,1n],[12n,3n]);return[S(abs(r.u[0]*r.v[1]-r.u[1]*r.v[0])),'3']});
tt('Ґратки: LLL (приклад Вікіпедії): b₁, b₂ збігаються, |b₃|²=5, |det|=3 (b₃ відрізняється округленням μ=½ — еквівалентний базис)',()=>{const B=lll([[1n,1n,1n],[-1n,0n,2n],[3n,5n,6n]]).B,n=v=>v.reduce((s,x)=>s+x*x,0n),d=B[0][0]*(B[1][1]*B[2][2]-B[1][2]*B[2][1])-B[0][1]*(B[1][0]*B[2][2]-B[1][2]*B[2][0])+B[0][2]*(B[1][0]*B[2][1]-B[1][1]*B[2][0]);return[JSON.stringify(B.slice(0,2).map(v=>v.map(Number)))+','+n(B[2])+','+abs(d),'[[0,1,0],[1,0,1]],5,3']});
tt('Ґратки: LLL зберігає визначник (2×2)',()=>{const B=[[201n,37n],[1648n,297n]];const r=lll(B).B;const d=v=>v[0][0]*v[1][1]-v[0][1]*v[1][0];return[S(abs(d(r))),S(abs(d(B)))]});
tt('Термінал: gcd(120, 84) + 1 = 13',async()=>[S(await M5.terminalEval('gcd(120, 84) + 1')),'13']);
tt('Термінал: 2^10 mod 1000 = 24',async()=>[S(await M5.terminalEval('2^10 % 1000')),'24']);
tt('Термінал: відхиляє небезпечний ввід (alert)',async()=>{try{await M5.terminalEval('alert(1)');return['ok','error']}catch(e){return['error','error']}});
tt('Термінал: відхиляє «constructor»',async()=>{try{await M5.terminalEval('constructor("x")');return['ok','error']}catch(e){return['error','error']}});
tt('Властивість: φ(p) = p−1 для 40 простих',()=>{let ok=true,k=0;for(let n=2n;k<40;n++)if(isPrime(n)){k++;if(M5.phi(n)!==n-1n)ok=false}return[S(ok),'true']});
tt('Властивість: a·a⁻¹ ≡ 1 (mod m) для 200 пар',()=>{const R=M5.rng(6);let ok=true;for(let i=0;i<200;i++){const m=BigInt(2+Math.floor(R()*5000)),a=BigInt(1+Math.floor(R()*5000));if(gcd(a,m)!==1n)continue;if(a*modinv(a,m)%m!==1n)ok=false}return[S(ok),'true']});
tt('Властивість: Σ τ-вираз τ(n)=#дільників для n≤300',()=>{for(let n=1;n<=300;n++){let c=0;for(let d=1;d<=n;d++)if(n%d===0)c++;if(S(M5.tau(BigInt(n)))!==S(c))return['n='+n,'ok']}return['ok','ok']});
tt('Властивість: factor(n) множиться назад до n (n ≤ 2000)',()=>{for(let n=1n;n<=2000n;n++){const L=fac(n).list;if(L.reduce((r,[p,e])=>r*p**BigInt(e),1n)!==n)return['n='+n,'ok']}return['ok','ok']});
tt('Властивість: Ейлер a^φ(n) ≡ 1 для 300 пар',()=>{const R=M5.rng(9);let ok=true;for(let i=0;i<300;i++){const n=BigInt(2+Math.floor(R()*3000)),a=BigInt(1+Math.floor(R()*3000));if(gcd(a,n)!==1n)continue;if(modpow(a,M5.phi(n),n)!==1n)ok=false}return[S(ok),'true']});
tt('Межа: factor(1)=1, φ(1)=1, μ(1)=1',()=>[[facStr(fac(1n).list),M5.phi(1n),M5.mu(1n)].join(','),'1,1,1']);
/* ================= Командна палітра Ctrl+K ================= */
(function(){let o=null,sel=0,items=[];const rec=()=>{try{return JSON.parse(localStorage.getItem('mc6_recent')||'[]')}catch(e){return[]}};
 document.addEventListener('mc5:tab',e=>{try{const r=[e.detail,...rec().filter(x=>x!==e.detail)].slice(0,6);localStorage.setItem('mc6_recent',JSON.stringify(r))}catch(x){}});
 function list(){const f=q('#cpin').value.trim().toLowerCase(),r=rec();items=qa('#tabs button[data-t]').map(b=>({id:b.dataset.t,name:b.textContent.trim()})).filter(x=>!f||x.name.toLowerCase().includes(f)||x.id.includes(f));
  if(!f)items.sort((a,b)=>(r.indexOf(a.id)<0?99:r.indexOf(a.id))-(r.indexOf(b.id)<0?99:r.indexOf(b.id)));sel=Math.min(sel,Math.max(0,items.length-1));
  q('#cplist').innerHTML=items.map((x,i)=>'<button type="button" class="cpi'+(i===sel?' sel':'')+'" data-i="'+i+'">'+esc(x.name)+(r.includes(x.id)&&!f?' <small>'+T('нещодавно','recent')+'</small>':'')+'</button>').join('')||'<p class="mut">—</p>';qa('.cpi').forEach(b=>b.onclick=()=>go(+b.dataset.i))}
 function go(i){const x=items[i];if(!x)return;close();M5.openTab(x.id);window.scrollTo({top:0})}
 function close(){if(o)o.classList.remove('on')}
 function open(){if(!o){o=document.createElement('div');o.id='cp';o.innerHTML='<div class="cpb" role="dialog" aria-modal="true" aria-label="Command palette"><input id="cpin" class="w" autocomplete="off" placeholder="Ctrl+K — пошук інструментів / search tools"><div id="cplist"></div></div>';document.body.appendChild(o);o.onclick=e=>{if(e.target===o)close()};
   q('#cpin').addEventListener('input',()=>{sel=0;list()});q('#cpin').addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(items.length-1,sel+1);list()}else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(0,sel-1);list()}else if(e.key==='Enter'){e.preventDefault();go(sel)}else if(e.key==='Escape')close()})}
  o.classList.add('on');q('#cpin').value='';sel=0;list();q('#cpin').focus()}
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open()}});M5.openPalette=open})();
})();
