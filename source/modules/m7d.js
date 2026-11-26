/* ===== MATHCRYPT 6.0 / Stage 2 (d): математична верифікація нових функцій ===== */
(()=>{'use strict';
const M5=window.M5,S=M5.S,tt=M5.tt,str=x=>String(x),near=(a,b,e)=>Math.abs(a-b)<=e;
/* --- статистика --- */
tt('Стат: t₀.₉₇₅(df=9) = 2.262157',()=>[str(near(S.tinv(.975,9),2.262157,1e-5)),'true']);
tt('Стат: t₀.₉₇₅(df=1) = 12.7062',()=>[str(near(S.tinv(.975,1),12.7062,1e-3)),'true']);
tt('Стат: t₀.₉₇₅(df=30) = 2.042272',()=>[str(near(S.tinv(.975,30),2.042272,1e-5)),'true']);
tt('Стат: CDF Стьюдента симетрична, F(0)=0.5',()=>[str(near(S.tcdf(0,5),.5,1e-12)&&near(S.tcdf(1.3,7)+S.tcdf(-1.3,7),1,1e-12)),'true']);
tt('Стат: Φ⁻¹(0.975) = 1.959964',()=>[str(near(S.ninv(.975),1.959964,1e-5)),'true']);
tt('Стат: Φ(1) = 0.841345; erfc(1) = 0.157299',()=>[str(near(S.ncdf(1),.841345,1e-6)&&near(S.erfc(1),.157299,1e-6)),'true']);
tt('Стат: χ²: P(χ²₃ > 7.815) ≈ 0.05; P(χ²₁ > 3.841) ≈ 0.05',()=>[str(near(S.chi2sf(7.815,3),.05,5e-4)&&near(S.chi2sf(3.841,1),.05,5e-4)),'true']);
const DS=[2,4,4,4,5,5,7,9];
tt('Стат: середнє, медіана, s², s для {2,4,4,4,5,5,7,9}',()=>{const s=S.summary(DS);return[[s.mean,s.median,s.variance.toFixed(6),s.sd.toFixed(6),s.popVariance].join(','),'5,4.5,4.571429,2.138090,4']});
tt('Стат: квартили (метод 7) Q1=4, Q3=5.5, IQR=1.5',()=>{const s=S.summary(DS);return[[s.q1,s.q3,s.iqr].join(','),'4,5.5,1.5']});
tt('Стат: 95% ДІ середнього = (3.2125, 6.7875)',()=>{const s=S.summary(DS,.95);return[[s.ciLo.toFixed(4),s.ciHi.toFixed(4)].join(','),'3.2125,6.7875']});
tt('Стат: викиди Тьюкі позначаються, але не видаляються',()=>{const a=[10,11,12,12,13,14,15,100],s=S.summary(a);return[[s.outliers.join(','),s.n].join('|'),'100|8']});
tt('Стат: регресія y=2.2+0.6x, R²=0.6 (x=1..5, y=2,4,5,4,5)',()=>{const r=S.linreg([1,2,3,4,5],[2,4,5,4,5]);return[[r.slope.toFixed(6),r.intercept.toFixed(6),r.r2.toFixed(6),r.r.toFixed(6)].join(','),'0.600000,2.200000,0.600000,0.774597']});
tt('Стат: регресія — точна пряма дає R²=1 і нульові залишки',()=>{const x=[1,2,3,4,5,6],y=x.map(v=>3*v-2),r=S.linreg(x,y);return[str(near(r.r2,1,1e-12)&&near(r.slope,3,1e-12)&&near(r.intercept,-2,1e-12)&&r.residuals.every(e=>Math.abs(e)<1e-12)),'true']});
tt('Стат: SE нахилу та ДІ для (1..5; 2,4,5,4,5)',()=>{const r=S.linreg([1,2,3,4,5],[2,4,5,4,5]);return[[r.seSlope.toFixed(5),r.slopeLo.toFixed(4),r.slopeHi.toFixed(4)].join(','),'0.28284,-0.3001,1.5001']});
tt('Стат: Спірмен з однаковими значеннями (ранги)',()=>[S.rank([10,20,20,30]).join(','),'1,2.5,2.5,4']);
tt('Стат: Пірсон r(x, −x) = −1',()=>[str(near(S.pearson([1,2,3,4],[-1,-2,-3,-4]),-1,1e-12)),'true']);
tt('Стат: інтервал Вілсона 50/100 = (0.4038, 0.5962)',()=>{const c=S.wilson(50,100,.95);return[c[0].toFixed(4)+','+c[1].toFixed(4),'0.4038,0.5962']});
tt('Стат: t-тест для середнього проти μ₀=5 (t=0, p=1)',()=>{const r=S.ttest1(DS,5);return[str(near(r.t,0,1e-12)&&near(r.p,1,1e-9)),'true']});
tt('Стат: Q–Q квантилі симетричні відносно 0',()=>{const q=M5.plot.qqplot([1,2,3,4,5,6,7,8,9,10]);return[str(near(q.r,1,.03)),'true']});
tt('Стат: гістограма зберігає загальну кількість значень',()=>{const a=Array.from({length:137},(_,i)=>Math.sin(i)*10),h=M5.plot.histo(a,12);return[str(h.counts.reduce((x,y)=>x+y,0)),'137']});
/* --- складність --- */
tt('Склад: підгонка точного 3n² → модель n², c=3, показник 2',()=>{const ns=[8,16,32,64,128,256],f=M5.fitModels(ns,ns.map(n=>3*n*n));return[[f.models[0].name,f.models[0].c.toFixed(4),f.power.exp.toFixed(4)].join(','),'n²,3.0000,2.0000']});
tt('Склад: підгонка точного 5·n·log₂n → n·log₂n',()=>{const ns=[8,16,32,64,128,256,512],f=M5.fitModels(ns,ns.map(n=>5*n*Math.log2(n)));return[f.models[0].name+','+f.models[0].c.toFixed(3),'n·log₂n,5.000']});
tt('Склад: підгонка 2^(n/2) → експоненційна модель',()=>{const ns=[16,20,24,28,32,36],f=M5.fitModels(ns,ns.map(n=>Math.pow(2,n/2)/2));return[f.models[0].name,'2^(n/2)']});
tt('Склад: Евклід НСД(252,105)=21 за 3 кроки',()=>{const r=M5.cxCore.CXA.euclid.run([252n,105n]);return[r.v+','+r.ops,'21,3']});
tt('Склад: бінарний НСД(252,105)=21',()=>[str(M5.cxCore.CXA.binary.run([252n,105n]).v),'21']);
tt('Склад: модульний степінь 7^560 mod 561 = 1, 13 множень (10 квадратів + 3 одиниці)',()=>{const r=M5.cxCore.CXA.modpow.run([7n,560n,561n]);return[r.v+','+r.ops,'1,13']});
tt('Склад: пробні ділення 97 → просте за 4 кроки',()=>{const r=M5.cxCore.CXA.trial.run(97);return[r.v+','+r.ops,'true,4']});
/* --- доведення (числові перевірки справжніх обчислень) --- */
M5.PF.forEach((p,i)=>tt('Доведення: '+p.id+' — числова ілюстрація проходить перевірку',()=>{const r=M5.pfRun(i);return[str(r.ok),'true']}));
tt('Доведення: усі теореми мають ≥ 6 кроків і твердження',()=>[str(M5.PF.every(p=>p.steps.length>=6&&p.stmt.ua.length>20&&p.stmt.en.length>20)),'true']);
tt('Доведення: Ферма для складеного p=15, a=2 показує порушення (2¹⁴ mod 15 ≠ 1)',()=>[str(M5.modpow(2n,14n,15n)),'4']);
tt('Доведення: РСА — вичерпна перевірка n=3233 (p=61, q=53, e=17)',()=>{const n=3233n,d=M5.modinv(17n,3120n);let bad=0;for(let m=0n;m<n;m++)if(M5.modpow(M5.modpow(m,17n,n),d,n)!==m)bad++;return[str(bad),'0']});
/* --- візуалізатор --- */
const vz=(k,f)=>M5.ALGS[k].build(f);
tt('Візуалізатор: Евклід 252,105 → 21, кадрів > 10, перевірка ✓',()=>{const r=vz('euclid',{a:'252',b:'105'});return[[r.result,r.check,r.fr.length>10].join(','),'21,true,true']});
tt('Візуалізатор: розширений Евклід 240,46 → 2 = 240·(−9) + 46·47',()=>{const r=vz('egcd',{a:'240',b:'46'});return[[r.result,r.check].join('|'),'240·(-9) + 46·(47) = 2|true']});
tt('Візуалізатор: 7^560 mod 561 → 1',()=>{const r=vz('modpow',{b:'7',e:'560',m:'561'});return[r.result+','+r.check,'7^560 mod 561 = 1,true']});
tt('Візуалізатор: решето до 60 → 17 простих',()=>{const r=vz('sieve',{n:'60'});return[r.result.split(', ').length+','+r.check,'17,true']});
tt('Візуалізатор: Міллер — Рабін n=561, a=2 узгоджується з повним тестом',()=>[str(vz('mr',{n:'561',a:'2'}).check),'true']);
tt('Візуалізатор: Міллер — Рабін n=97, a=5 → ймовірно просте',()=>[str(/ймовірно|probably/.test(vz('mr',{n:'97',a:'5'}).result)),'true']);
/* --- SHA власна реалізація --- */
tt('SHA-256 (власна) "abc" = еталон',()=>[M5.sha.hex(M5.sha.sha256(M5.sha.enc('abc'))),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad']);
tt('SHA-256 (власна) порожній рядок',()=>[M5.sha.hex(M5.sha.sha256(M5.sha.enc(''))),'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855']);
tt('SHA-256 (власна) = Web Crypto для 200 випадкових повідомлень різної довжини',async()=>{const R=M5.rng(5);let bad=0;for(let i=0;i<200;i++){const u=new Uint8Array(Math.floor(R()*200));for(let k=0;k<u.length;k++)u[k]=Math.floor(R()*256);const a=M5.sha.hex(M5.sha.sha256(u)),b=M5.hex(await M5.digest('SHA-256',u));if(a!==b)bad++}return[str(bad),'0']});
tt('SHA-512 (власна) = Web Crypto для 40 випадкових повідомлень',async()=>{const R=M5.rng(8);let bad=0;for(let i=0;i<40;i++){const u=new Uint8Array(Math.floor(R()*300));for(let k=0;k<u.length;k++)u[k]=Math.floor(R()*256);const a=M5.sha.hex(M5.sha.sha512(u)),b=M5.hex(await M5.digest('SHA-512',u));if(a!==b)bad++}return[str(bad),'0']});
/* --- експерименти --- */
const RX=(id,p)=>M5.runExperiment(id,p);
tt('Експ A: однаковий seed → однакова контрольна сума; інший seed → інша',async()=>{const a=await RX('A',{trials:200,bits:64,seed:1}),b=await RX('A',{trials:200,bits:64,seed:1}),c=await RX('A',{trials:200,bits:64,seed:2});return[str(M5.digestOf(a)===M5.digestOf(b)&&M5.digestOf(a)!==M5.digestOf(c)),'true']});
tt('Експ A: НСД Евкліда й бінарного збігаються (300 випробувань, 256 біт), середнє кроків ≈ 0.584·n (±10%)',async()=>{const r=await RX('A',{trials:300,bits:256,seed:11}),m=S.mean(r.data.eu);return[str(r.data.mismatches===0&&near(m,0.584*256,0.1*0.584*256)),'true']});
tt('Експ B: частка розв’язних ≈ 6ζ(3)/π² = 0.7308 (±0.03), усі розв’язки перевірені',async()=>{const r=await RX('B',{trials:6000,R:1000000,seed:3}),d=r.data;return[str(near(d.solvable/d.n,0.7308,0.03)&&d.bad===0&&d.verified===d.solvable),'true']});
tt('Експ C: лавина SHA-256, середнє ≈ 128 (|z| < 3.5), σ ≈ 8',async()=>{const r=await RX('C',{trials:400,algo:256,seed:9}),s=S.summary(r.data.counts),z=(s.mean-128)/(8/Math.sqrt(s.n));return[str(Math.abs(z)<3.5&&near(s.sd,8,1.5)&&s.n===400),'true']});
tt('Експ C: лавина SHA-512, середнє ≈ 256 (|z| < 3.5), σ ≈ 11.3',async()=>{const r=await RX('C',{trials:100,algo:512,seed:4}),s=S.summary(r.data.counts),z=(s.mean-256)/(11.3137/Math.sqrt(s.n));return[str(Math.abs(z)<3.5&&near(s.sd,11.3,3)),'true']});
tt('Експ D: π(10ᵏ) збігається з відомими значеннями, χ² (mod 10) не відкидає рівномірність',async()=>{const r=await RX('D',{N:1000000}),d=r.data,tot=d.res.reduce((a,b)=>a+b,0),chi=d.res.reduce((s,o)=>s+(o-tot/4)**2/(tot/4),0);return[str(d.known.length===6&&d.known.every(k=>k[1]===k[2])&&S.chi2sf(chi,3)>0.01&&d.total===78498),'true']});
tt('Експ D: Li(x) ближче до π(x), ніж x/ln x (x = 10⁶)',async()=>{const d=(await RX('D',{N:1000000})).data,i=d.xs.length-1;return[str(Math.abs(d.li[i]-d.pi[i])<Math.abs(d.xlnx[i]-d.pi[i])),'true']});
tt('Експ E: Пелль D≤200 без помилок; D=61 → x має 10 цифр, D=13 → період 5',async()=>{const d=(await RX('E',{Dmax:200})).data,r61=d.rows.find(x=>x[0]===61),r13=d.rows.find(x=>x[0]===13);return[str(d.bad===0&&r61[1]===10&&r13[2]===5&&d.rows.length===200-1-13),'true']});
tt('Експ F: Гаусс — 0 порушень (det, редукованість, межа Ерміта) на 1500 базисах',async()=>{const d=(await RX('F',{trials:1500,R:1000,seed:5})).data;return[str(d.badDet+d.badLag+d.badHerm),'0']});
tt('Експ F: |b₁ред|/√|det| ≤ √(2/√3) ≈ 1.0746',async()=>{const d=(await RX('F',{trials:800,R:500,seed:6})).data;return[str(Math.max(...d.lenRed)<=Math.sqrt(2/Math.sqrt(3))+1e-9),'true']});
tt('Експ: зупинка — вже виконані випробування зберігаються (stop-прапор)',async()=>{let n=0;const ref={stop:false};const r=await M5.expCore().run('A',{trials:50000,bits:512,seed:1},{post:()=>{},stopped:()=>{n++;return n>3}});return[str(r.stopped&&r.done<50000&&r.data.eu.length===r.done),'true']});
tt('Експ: Web Worker виконує той самий результат, що й основний потік',async()=>{const p={trials:50,bits:64,seed:77},a=await M5.runExperiment('A',p),b=await M5.expCore().run('A',p,{post:()=>{},stopped:()=>false});return[a.mode+','+(M5.digestOf(a)===M5.digestOf(b)),'worker,true']});
/* --- журнал IndexedDB --- */
tt('Журнал: IndexedDB — запис, читання, оновлення, видалення',async()=>{const id=await M5.nb.add({title:'__test__',tags:'t',hypothesis:'h',methodology:'m',params:'{}',results:'r',charts:[{name:'c',svg:'<svg></svg>'}],conclusion:'c',experiment:null});const e=await M5.nb.get(id);e.conclusion='c2';await M5.nb.put(e);const e2=await M5.nb.get(id);await M5.nb.del(id);const e3=await M5.nb.get(id);return[[e.title,e2.conclusion,e2.charts.length,e3===undefined].join(','),'__test__,c2,1,true']});
tt('Журнал: відтворення експерименту — збіг контрольної суми',async()=>{const p={trials:80,bits:64,seed:5},r=await M5.runExperiment('A',p),x={id:'A',params:p,checksum:M5.digestOf(r)};const rep=await M5.expReproduce(x);return[str(rep.match),'true']});
})();
