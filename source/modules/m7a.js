/* ===== MATHCRYPT 6.0 / Stage 2 (a): статистика, графіки, лабораторія складності ===== */
(()=>{'use strict';
const M5=window.M5;const{q,qa,T,esc,put,say,html,I}=M5;
/* ================= математичне ядро статистики ================= */
const S={};M5.S=S;
const sum=a=>{let s=0;for(const v of a)s+=v;return s};
S.mean=a=>sum(a)/a.length;
S.variance=a=>{const n=a.length;if(n<2)return NaN;const m=S.mean(a);let s=0;for(const v of a)s+=(v-m)*(v-m);return s/(n-1)};
S.sd=a=>Math.sqrt(S.variance(a));
S.quantile=(s,p)=>{const h=(s.length-1)*p,i=Math.floor(h);return i+1<s.length?s[i]+(h-i)*(s[i+1]-s[i]):s[i]};/* метод 7 (R type 7 / Excel QUARTILE.INC) */
function lgam(x){const c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5];let y=x,t=x+5.5;t-=(x+.5)*Math.log(t);let s=1.000000000190015;for(const k of c)s+=k/++y;return -t+Math.log(2.5066282746310005*s/x)}
function betacf(a,b,x){const FP=1e-300;const qab=a+b,qap=a+1,qam=a-1;let c=1,d=1-qab*x/qap;if(Math.abs(d)<FP)d=FP;d=1/d;let h=d;
 for(let m=1;m<=500;m++){const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<FP)d=FP;c=1+aa/c;if(Math.abs(c)<FP)c=FP;d=1/d;h*=d*c;
  aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<FP)d=FP;c=1+aa/c;if(Math.abs(c)<FP)c=FP;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<3e-15)break}return h}
function ibeta(x,a,b){if(x<=0)return 0;if(x>=1)return 1;const bt=Math.exp(lgam(a+b)-lgam(a)-lgam(b)+a*Math.log(x)+b*Math.log(1-x));return x<(a+1)/(a+b+2)?bt*betacf(a,b,x)/a:1-bt*betacf(b,a,1-x)/b}
S._ibeta=ibeta;S._lgam=lgam;S.tcdf=(t,df)=>{const p=.5*ibeta(df/(df+t*t),df/2,.5);return t>0?1-p:p};
S.tinv=(p,df)=>{if(p===.5)return 0;if(p<.5)return -S.tinv(1-p,df);let lo=0,hi=1;while(S.tcdf(hi,df)<p&&hi<1e12)hi*=2;for(let i=0;i<200;i++){const mid=(lo+hi)/2;if(S.tcdf(mid,df)<p)lo=mid;else hi=mid}return(lo+hi)/2};
function erfc(x){const z=Math.abs(x);let r;if(z<2.5){let s=z,t=z;for(let n=1;n<200;n++){t*=-z*z/n;const ad=t/(2*n+1);s+=ad;if(Math.abs(ad)<1e-17)break}r=1-2/Math.sqrt(Math.PI)*s}else{let f=0;for(let k=80;k>=1;k--)f=k/2/(z+f);r=Math.exp(-z*z)/Math.sqrt(Math.PI)/(z+f)}return x>=0?r:2-r}
S.erfc=erfc;S.ncdf=x=>.5*erfc(-x/Math.SQRT2);
S.ninv=p=>{if(p<=0)return -Infinity;if(p>=1)return Infinity;let lo=-40,hi=40;for(let i=0;i<120;i++){const m=(lo+hi)/2;if(S.ncdf(m)<p)lo=m;else hi=m}return(lo+hi)/2};
/* p-значення χ² (регуляризована неповна гамма) */
function gammaP(a,x){if(x<=0)return 0;if(x<a+1){let ap=a,del=1/a,s=del;for(let n=0;n<1000;n++){ap++;del*=x/ap;s+=del;if(Math.abs(del)<Math.abs(s)*1e-15)break}return s*Math.exp(-x+a*Math.log(x)-lgam(a))}
 let b=x+1-a,c=1e300,d=1/b,h=d;for(let i=1;i<1000;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-300)d=1e-300;c=b+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-15)break}return 1-Math.exp(-x+a*Math.log(x)-lgam(a))*h}
S.chi2sf=(x,df)=>1-gammaP(df/2,x/2);
S.rank=a=>{const idx=a.map((v,i)=>[v,i]).sort((x,y)=>x[0]-y[0]),r=new Array(a.length);let i=0;while(i<idx.length){let j=i;while(j+1<idx.length&&idx[j+1][0]===idx[i][0])j++;const rk=(i+j)/2+1;for(let k=i;k<=j;k++)r[idx[k][1]]=rk;i=j+1}return r};
S.summary=(a,conf=.95)=>{const n=a.length;if(!n)throw Error(T('Немає даних','No data'));const s=[...a].sort((x,y)=>x-y),m=S.mean(a),v=n>1?S.variance(a):NaN,sd=Math.sqrt(v),se=sd/Math.sqrt(n);
 const q1=S.quantile(s,.25),med=S.quantile(s,.5),q3=S.quantile(s,.75),iqr=q3-q1,lo=q1-1.5*iqr,hi=q3+1.5*iqr;
 let m3=0,m4=0;for(const x of a){const d=x-m;m3+=d*d*d;m4+=d*d*d*d}const pv=(n-1)/n*v;/* зсунені (популяційні) моменти */
 const skew=n>2&&pv>0?(m3/n)/Math.pow(pv,1.5):NaN,kurt=n>3&&pv>0?(m4/n)/(pv*pv)-3:NaN;
 const tc=n>1?S.tinv(1-(1-conf)/2,n-1):NaN,hw=tc*se;const dev=s.map(x=>Math.abs(x-med)).sort((x,y)=>x-y);
 const out=a.filter(x=>x<lo||x>hi),z3=sd>0?a.filter(x=>Math.abs(x-m)/sd>3):[];
 const inside=s.filter(x=>x>=lo&&x<=hi);
 return{n,mean:m,median:med,variance:v,sd,popVariance:pv,popSd:Math.sqrt(pv),se,min:s[0],max:s[n-1],range:s[n-1]-s[0],q1,q3,iqr,skew,kurt,cv:m!==0?sd/Math.abs(m):NaN,mad:S.quantile(dev,.5),conf,tcrit:tc,ciLo:m-hw,ciHi:m+hw,relErrPct:m!==0?100*se/Math.abs(m):NaN,fenceLo:lo,fenceHi:hi,outliers:out,zOutliers:z3,whiskLo:inside.length?inside[0]:s[0],whiskHi:inside.length?inside[inside.length-1]:s[n-1],sorted:s}};
S.pearson=(x,y)=>{const n=x.length,mx=S.mean(x),my=S.mean(y);let sxy=0,sxx=0,syy=0;for(let i=0;i<n;i++){sxy+=(x[i]-mx)*(y[i]-my);sxx+=(x[i]-mx)**2;syy+=(y[i]-my)**2}return sxx>0&&syy>0?sxy/Math.sqrt(sxx*syy):NaN};
S.linreg=(x,y,conf=.95)=>{const n=x.length;if(n<3)throw Error(T('Для регресії потрібно щонайменше 3 точки','Regression needs at least 3 points'));const mx=S.mean(x),my=S.mean(y);let sxx=0,sxy=0,syy=0;for(let i=0;i<n;i++){sxx+=(x[i]-mx)**2;sxy+=(x[i]-mx)*(y[i]-my);syy+=(y[i]-my)**2}
 if(sxx===0)throw Error(T('Усі x однакові: нахил не визначений','All x are equal: slope undefined'));const b=sxy/sxx,a=my-b*mx;let sse=0;const res=[];for(let i=0;i<n;i++){const e=y[i]-(a+b*x[i]);res.push(e);sse+=e*e}
 const r2=syy>0?1-sse/syy:NaN,s2=sse/(n-2),s=Math.sqrt(s2),seB=s/Math.sqrt(sxx),seA=s*Math.sqrt(1/n+mx*mx/sxx),tc=S.tinv(1-(1-conf)/2,n-2);
 const r=S.pearson(x,y),tt=r*Math.sqrt((n-2)/(1-r*r)),p=isFinite(tt)?2*(1-S.tcdf(Math.abs(tt),n-2)):0;
 return{n,slope:b,intercept:a,r,r2,adjR2:1-(1-r2)*(n-1)/(n-2),sse,rmse:Math.sqrt(sse/n),s,seSlope:seB,seInt:seA,tcrit:tc,slopeLo:b-tc*seB,slopeHi:b+tc*seB,intLo:a-tc*seA,intHi:a+tc*seA,pValue:p,residuals:res,mx,sxx,conf,spearman:S.pearson(S.rank(x),S.rank(y))}};
S.band=(rg,x)=>{const h=rg.tcrit*rg.s*Math.sqrt(1/rg.n+(x-rg.mx)**2/rg.sxx),yh=rg.intercept+rg.slope*x;return[x,yh-h,yh+h]};
S.ttest1=(a,mu)=>{const n=a.length,m=S.mean(a),se=S.sd(a)/Math.sqrt(n),t=(m-mu)/se;return{t,df:n-1,p:2*(1-S.tcdf(Math.abs(t),n-1))}};
S.wilson=(k,n,conf=.95)=>{const z=S.ninv(1-(1-conf)/2),p=k/n,d=1+z*z/n,c=(p+z*z/(2*n))/d,h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;return[c-h,c+h]};
/* розподіл Стьюдента: перевірено на таблицях; нормальний за еталонними значеннями */
/* ================= SVG-графіки ================= */
const BG='#0a0a0c',FG='#cfcfd4',GR='#2a2a30',COLS=M5.COL;
const so=(w,h)=>'<svg xmlns="http://www.w3.org/2000/svg" class="ch" viewBox="0 0 '+w+' '+h+'" width="'+w+'" height="'+h+'" font-family="Segoe UI,Arial,sans-serif" style="background:'+BG+';max-width:100%;height:auto">';
const fm=v=>{if(!isFinite(v))return'';const a=Math.abs(v);if(a!==0&&(a>=1e6||a<1e-3))return v.toExponential(1);return String(+v.toPrecision(4))};
function rangeOf(vals,pad){let lo=Infinity,hi=-Infinity;for(const v of vals){if(v<lo)lo=v;if(v>hi)hi=v}if(!isFinite(lo)){lo=0;hi=1}if(lo===hi){lo-=1;hi+=1}const p=(hi-lo)*(pad??.05);return[lo-p,hi+p]}
function axes(W,H,l,r,t,b,x0,x1,y0,y1,o){let s='';const lg=(v,on)=>on?Math.pow(10,v):v;
 const tk=(lo,hi,on)=>{if(on){const a=[];for(let e=Math.ceil(lo);e<=Math.floor(hi);e++)a.push(e);return a.length>=2?a:M5.nice(lo,hi,5)}return M5.nice(lo,hi,6)};
 const X=v=>l+(v-x0)/(x1-x0)*(W-l-r),Y=v=>H-b-(v-y0)/(y1-y0)*(H-b-t);
 if(!o.noy)tk(y0,y1,o.logy).forEach(v=>{const yy=Y(v);s+='<line x1="'+l+'" x2="'+(W-r)+'" y1="'+yy+'" y2="'+yy+'" stroke="'+GR+'" stroke-dasharray="2 4"/><text x="'+(l-6)+'" y="'+(yy+4)+'" fill="'+FG+'" font-size="11" text-anchor="end">'+(o.logy?'10^'+fm(v):fm(v))+'</text>'});
 tk(x0,x1,o.logx).forEach(v=>{const xx=X(v);s+='<line y1="'+t+'" y2="'+(H-b)+'" x1="'+xx+'" x2="'+xx+'" stroke="'+GR+'" stroke-dasharray="2 4"/><text x="'+xx+'" y="'+(H-b+16)+'" fill="'+FG+'" font-size="11" text-anchor="middle">'+(o.logx?'10^'+fm(v):fm(v))+'</text>'});
 s+='<line x1="'+l+'" x2="'+(W-r)+'" y1="'+(H-b)+'" y2="'+(H-b)+'" stroke="#888"/><line x1="'+l+'" x2="'+l+'" y1="'+t+'" y2="'+(H-b)+'" stroke="#888"/>';
 if(o.title)s+='<text x="'+W/2+'" y="22" fill="#fff" text-anchor="middle" font-size="15" font-weight="600">'+esc(o.title)+'</text>';
 if(o.xlab)s+='<text x="'+(l+(W-l-r)/2)+'" y="'+(H-10)+'" fill="'+FG+'" font-size="12" text-anchor="middle">'+esc(o.xlab)+'</text>';
 if(o.ylab)s+='<text transform="translate(15 '+(t+(H-b-t)/2)+') rotate(-90)" fill="'+FG+'" font-size="12" text-anchor="middle">'+esc(o.ylab)+'</text>';
 return{s,X,Y}}
function scat(o){const W=o.W||760,H=o.H||400,l=70,r=20,t=o.title?38:18,b=o.xlab?56:40;const fx=v=>o.logx?Math.log10(v):v,fy=v=>o.logy?Math.log10(v):v,ok=p=>isFinite(p[0])&&isFinite(p[1])&&(!o.logx||p[0]>0)&&(!o.logy||p[1]>0);
 const xs=[],ys=[];o.series.forEach(s=>{(s.pts||[]).forEach(p=>{if(ok(p)){xs.push(fx(p[0]));ys.push(fy(p[1]))}});(s.band||[]).forEach(p=>{if(!o.logy||p[1]>0){xs.push(fx(p[0]));ys.push(fy(p[1]),fy(p[2]))}})});
 if(!xs.length)return so(W,H)+'<text x="'+W/2+'" y="'+H/2+'" fill="'+FG+'" text-anchor="middle">'+esc(T('Немає даних','No data'))+'</text></svg>';
 const[x0,x1]=rangeOf(xs),[y0,y1]=rangeOf(ys);const A=axes(W,H,l,r,t,b,x0,x1,y0,y1,o);let s=so(W,H)+A.s;
 o.series.forEach((z,k)=>{const c=z.color||COLS[k%COLS.length];
  if(z.band&&z.band.length>1){const up=z.band.map(p=>A.X(fx(p[0])).toFixed(1)+','+A.Y(fy(p[2])).toFixed(1)),dn=z.band.slice().reverse().map(p=>A.X(fx(p[0])).toFixed(1)+','+A.Y(fy(p[1])).toFixed(1));s+='<polygon points="'+up.concat(dn).join(' ')+'" fill="rgba(251,113,133,.16)" stroke="none"/>'}
  const pts=(z.pts||[]).filter(ok);if(z.line&&pts.length>1){const srt=z.sort===false?pts:pts.slice().sort((p,q2)=>p[0]-q2[0]);s+='<path d="'+srt.map((p,i)=>(i?'L':'M')+A.X(fx(p[0])).toFixed(1)+' '+A.Y(fy(p[1])).toFixed(1)).join('')+'" fill="none" stroke="'+c+'" stroke-width="2"'+(z.dash?' stroke-dasharray="6 4"':'')+'/>'}
  if(z.dots!==false){const step=Math.max(1,Math.ceil(pts.length/3000));pts.forEach((p,i)=>{if(i%step===0)s+='<circle cx="'+A.X(fx(p[0])).toFixed(1)+'" cy="'+A.Y(fy(p[1])).toFixed(1)+'" r="'+(z.r||3)+'" fill="'+c+'" fill-opacity=".85"/>'})}});
 let lx=l+8;o.series.forEach((z,k)=>{if(!z.name)return;const c=z.color||COLS[k%COLS.length];s+='<rect x="'+lx+'" y="'+(t+2)+'" width="12" height="3" fill="'+c+'"/><text x="'+(lx+16)+'" y="'+(t+8)+'" fill="'+FG+'" font-size="11">'+esc(z.name)+'</text>';lx+=26+String(z.name).length*6.4});
 return s+'</svg>'}
function histo(a,bins,o){o=o||{};const sm=S.summary(a),n=a.length;const k=bins||Math.max(5,Math.min(60,Math.ceil(Math.log2(n)+1)));let lo=sm.min,hi=sm.max;if(lo===hi){lo-=.5;hi+=.5}const w=(hi-lo)/k,cnt=new Array(k).fill(0);for(const v of a){let i=Math.floor((v-lo)/w);if(i>=k)i=k-1;cnt[i]++}
 const W=760,H=380,l=70,r=20,t=38,b=56,ymax=Math.max(...cnt)*1.12;const A=axes(W,H,l,r,t,b,lo,hi,0,ymax,{title:o.title||T('Гістограма','Histogram'),xlab:o.xlab||'x',ylab:T('частота','frequency')});let s=so(W,H)+A.s;
 cnt.forEach((c,i)=>{const x=A.X(lo+i*w),x2=A.X(lo+(i+1)*w);s+='<rect x="'+(x+.5).toFixed(1)+'" y="'+A.Y(c).toFixed(1)+'" width="'+Math.max(1,x2-x-1).toFixed(1)+'" height="'+(A.Y(0)-A.Y(c)).toFixed(1)+'" fill="#c4122f" fill-opacity=".8" stroke="#fb7185" stroke-width=".6"><title>'+fm(lo+i*w)+' … '+fm(lo+(i+1)*w)+': '+c+'</title></rect>'});
 if(o.normal&&sm.sd>0){let d='';for(let i=0;i<=120;i++){const x=lo+(hi-lo)*i/120,y=n*w*Math.exp(-.5*((x-sm.mean)/sm.sd)**2)/(sm.sd*Math.sqrt(2*Math.PI));d+=(i?'L':'M')+A.X(x).toFixed(1)+' '+A.Y(Math.min(y,ymax)).toFixed(1)}s+='<path d="'+d+'" fill="none" stroke="#fff" stroke-width="1.8" stroke-dasharray="5 3"/><text x="'+(W-r-4)+'" y="'+(t+14)+'" fill="#fff" font-size="11" text-anchor="end">'+esc(T('нормальна густина (за вибіркою)','normal density (sample mean, sd)'))+'</text>'}
 return{svg:s+'</svg>',counts:cnt,lo,hi,w}}
function boxplot(items,o){o=o||{};const W=760,rowH=64,t=o.title?38:14,b=40,H=t+items.length*rowH+b,l=130,r=24;const all=[];items.forEach(it=>{all.push(it.sum.min,it.sum.max)});const[x0,x1]=rangeOf(all);
 const A=axes(W,H,l,r,t,b,x0,x1,0,1,{title:o.title||T('Діаграма розмаху (Box plot)','Box plot'),xlab:o.xlab||'x',noy:true});let s=so(W,H)+A.s;
 items.forEach((it,i)=>{const m=it.sum,cy=t+i*rowH+rowH/2,h=18,X=A.X;
  s+='<text x="'+(l-8)+'" y="'+(cy+4)+'" fill="'+FG+'" font-size="12" text-anchor="end">'+esc(it.name||'x')+'</text>';
  s+='<line x1="'+X(m.whiskLo)+'" x2="'+X(m.q1)+'" y1="'+cy+'" y2="'+cy+'" stroke="#fb7185" stroke-width="1.6"/><line x1="'+X(m.q3)+'" x2="'+X(m.whiskHi)+'" y1="'+cy+'" y2="'+cy+'" stroke="#fb7185" stroke-width="1.6"/>';
  s+='<line x1="'+X(m.whiskLo)+'" x2="'+X(m.whiskLo)+'" y1="'+(cy-h/2)+'" y2="'+(cy+h/2)+'" stroke="#fb7185"/><line x1="'+X(m.whiskHi)+'" x2="'+X(m.whiskHi)+'" y1="'+(cy-h/2)+'" y2="'+(cy+h/2)+'" stroke="#fb7185"/>';
  s+='<rect x="'+X(m.q1)+'" y="'+(cy-h)+'" width="'+Math.max(1,X(m.q3)-X(m.q1))+'" height="'+2*h+'" fill="#450a1c" stroke="#fb7185" stroke-width="1.6"/><line x1="'+X(m.median)+'" x2="'+X(m.median)+'" y1="'+(cy-h)+'" y2="'+(cy+h)+'" stroke="#fff" stroke-width="2.4"/>';
  s+='<circle cx="'+X(m.mean)+'" cy="'+cy+'" r="4" fill="#fff" stroke="#c4122f"/>';
  m.outliers.slice(0,400).forEach(v=>{s+='<circle cx="'+X(v)+'" cy="'+cy+'" r="3.2" fill="none" stroke="#ff4d5e" stroke-width="1.5"/>'})});
 s+='<text x="'+(W-r)+'" y="'+(H-b+30)+'" fill="'+FG+'" font-size="11" text-anchor="end">'+esc(T('біла лінія — медіана; ● — середнє; ○ — спостереження за межами 1,5·IQR (позначені, не видалені)','white line = median; ● = mean; ○ = points beyond 1.5·IQR (flagged, not removed)'))+'</text>';return s+'</svg>'}
function qqplot(a,o){const s=[...a].sort((x,y)=>x-y),n=s.length;const th=s.map((_,i)=>S.ninv((i+1-.375)/(n+.25)));/* Блом */const pts=s.map((v,i)=>[th[i],v]);
 const q1=S.quantile(s,.25),q3=S.quantile(s,.75),z1=S.ninv(.25),z3=S.ninv(.75),sl=(q3-q1)/(z3-z1),ic=q1-sl*z1;const xs=[th[0],th[n-1]];
 return{svg:scat({title:(o&&o.title)||T('Q–Q діаграма (нормальний розподіл)','Normal Q–Q plot'),xlab:T('теоретичні квантилі N(0,1)','theoretical N(0,1) quantiles'),ylab:T('впорядкована вибірка','ordered sample'),series:[{pts:xs.map(x=>[x,ic+sl*x]),line:true,dots:false,color:'#fff',dash:true,name:T('еталонна пряма (через Q1, Q3)','reference line (through Q1, Q3)')},{pts,color:'#ff4d5e',name:T('вибірка','sample')}]}),r:S.pearson(th,s)}}
M5.plot={scat,histo,boxplot,qqplot,so,axes};
/* експорт SVG/PNG для контейнера графіка */
const chartBar=(id,name)=>'<span class="cbar"><button type="button" class="b sm" data-svg="'+id+'" data-n="'+name+'">SVG</button><button type="button" class="b sm" data-png="'+id+'" data-n="'+name+'">PNG</button></span>';
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-svg],[data-png]');if(!b)return;const id=b.dataset.svg||b.dataset.png,el=document.getElementById(id),sv=el&&el.querySelector('svg');if(!sv){M5.toast(T('Немає графіка','No chart'));return}const txt=sv.outerHTML;if(b.dataset.svg)M5.dl(b.dataset.n+'.svg',txt,'image/svg+xml');else M5.svgToPng(txt,b.dataset.n+'.png')});
M5.chartBar=chartBar;
/* ================= вкладка: Центр статистичних досліджень ================= */
const HT=`<h2>⟦Центр статистичних досліджень|Statistical Research Center⟧</h2>
<p class="lead">⟦Описова статистика, довірчі інтервали (t-розподіл), кореляція, лінійна регресія, аналіз похибок і викидів. Дані можна вставити вручну або взяти з Дослідницької лабораторії та Порівняльного аналізу. Викиди лише позначаються й ніколи не видаляються автоматично.|Descriptive statistics, confidence intervals (Student t), correlation, linear regression, error and outlier analysis. Enter data manually or take it from the Research Lab and the Algorithm Benchmark. Outliers are only flagged and never removed automatically.⟧</p>
<div class="row"><label>⟦Режим|Mode⟧<select id="stmode"><option value="1">⟦Одна змінна x|One variable x⟧</option><option value="2">⟦Дві змінні (x y в рядку)|Two variables (x y per line)⟧</option></select></label><label>⟦Рівень довіри|Confidence level⟧<select id="sconf"><option value=".9">90%</option><option value=".95" selected>95%</option><option value=".99">99%</option></select></label><label>⟦Стовпчиків|Bins⟧<input class="s" id="sbins" value="" placeholder="auto"></label><label>⟦Еталонне значення μ₀ (необов’язково)|Reference value μ₀ (optional)⟧<input class="s" id="sref" value=""></label></div>
<textarea class="w" id="sdat" rows="6" placeholder="12.1, 11.8, 12.4 …"></textarea>
<div class="row"><label>⟦Джерело даних|Data source⟧<select id="ssrc"></select></label><button class="b" id="sload">⟦Завантажити джерело|Load source⟧</button><button class="b" id="sdemo">⟦Демо-дані (синтетичні, seed)|Demo data (synthetic, seed)⟧</button><label>seed<input class="s" id="stseed" value="2024" style="width:90px"></label><label class="chk"><input type="checkbox" id="sexcl"> ⟦виключити позначені викиди (вручну)|exclude flagged outliers (manual)⟧</label></div>
<div class="row"><button class="b m" id="sgo2">⟦Проаналізувати|Analyze⟧</button><button class="b" id="sjs">JSON</button><button class="b" id="scs">CSV</button><button class="b" id="ssv">⟦Зберегти в архів|Save to archive⟧</button></div>
<div class="err" id="sterr"></div><div id="stsum"></div><pre id="sttxt"></pre>
<div class="wide" id="stc1"></div><div class="wide" id="stc2"></div><div class="wide" id="stc3"></div><div class="wide" id="stc4"></div>
<div class="note">⟦Квартилі — метод 7 (лінійна інтерполяція, як QUARTILE.INC). Дисперсія та σ — вибіркові (n−1); популяційні наведено окремо. Довірчий інтервал середнього: x̄ ± t·s/√n, припускає приблизну нормальність; перевірте Q–Q діаграму. Кореляція не доводить причинності.|Quartiles use method 7 (linear interpolation, as QUARTILE.INC). Variance and σ are sample (n−1); population values are listed separately. CI for the mean: x̄ ± t·s/√n assumes approximate normality — check the Q–Q plot. Correlation does not prove causation.⟧</div>`;
let SD=null;
function parseData(){const txt=q('#sdat').value.trim();if(!txt)throw Error(T('Введіть дані.','Enter data.'));const mode=q('#stmode').value;
 if(mode==='1'){const v=txt.split(/[\s,;]+/).filter(Boolean).map(Number);if(v.some(x=>!isFinite(x)))throw Error(T('Знайдено нечислове значення.','A non-numeric value was found.'));return{x:v}}
 const x=[],y=[];txt.split(/\n+/).forEach((ln,i)=>{const p=ln.trim().split(/[\s,;]+/).filter(Boolean);if(!p.length)return;if(p.length!==2||p.some(s=>!isFinite(Number(s))))throw Error(T('Рядок '+(i+1)+': потрібні два числа.','Line '+(i+1)+': two numbers required.'));x.push(Number(p[0]));y.push(Number(p[1]))});return{x,y}}
function stRun(){try{say('sterr','');const conf=+q('#sconf').value,d=parseData(),mode=q('#stmode').value,excl=q('#sexcl').checked;let x=d.x,y=d.y;
 if(mode==='1'){if(x.length<2)throw Error(T('Потрібно щонайменше 2 значення.','At least 2 values are required.'));let base=S.summary(x,conf);if(excl&&base.outliers.length){const set=new Set(base.outliers);x=x.filter(v=>!set.has(v));if(x.length<2)throw Error(T('Після виключення замало даних.','Too little data after exclusion.'))}
  const sm=S.summary(x,conf),L=[];const nb=parseInt(q('#sbins').value)||0;
  L.push(T('n = ','n = ')+sm.n+(excl&&base.outliers.length?T('  (виключено вручну ','  (manually excluded ')+base.outliers.length+T(' позначених викидів)',' flagged outliers)'):''));
  L.push(T('Середнє x̄ = ','Mean x̄ = ')+fm(sm.mean)+'   '+T('Медіана = ','Median = ')+fm(sm.median));
  L.push(T('Вибіркова дисперсія s² = ','Sample variance s² = ')+fm(sm.variance)+'   s = '+fm(sm.sd)+'   '+T('(популяційні: σ² = ','(population: σ² = ')+fm(sm.popVariance)+', σ = '+fm(sm.popSd)+')');
  L.push('Q1 = '+fm(sm.q1)+'   Q3 = '+fm(sm.q3)+'   IQR = '+fm(sm.iqr)+'   min = '+fm(sm.min)+'   max = '+fm(sm.max)+'   '+T('розмах = ','range = ')+fm(sm.range));
  L.push(T('Стандартна похибка середнього SE = s/√n = ','Standard error of the mean SE = s/√n = ')+fm(sm.se)+'   '+T('відносна похибка = ','relative error = ')+fm(sm.relErrPct)+'%');
  L.push(Math.round(conf*100)+T('% довірчий інтервал для μ: [','% confidence interval for μ: [')+fm(sm.ciLo)+', '+fm(sm.ciHi)+']   (t* = '+fm(sm.tcrit)+', df = '+(sm.n-1)+')');
  L.push(T('Асиметрія = ','Skewness = ')+fm(sm.skew)+'   '+T('надлишковий ексцес = ','excess kurtosis = ')+fm(sm.kurt)+'   MAD = '+fm(sm.mad)+'   CV = '+fm(sm.cv));
  L.push(T('Межі Тьюкі (1,5·IQR): [','Tukey fences (1.5·IQR): [')+fm(sm.fenceLo)+', '+fm(sm.fenceHi)+']');
  L.push(T('Позначені викиди (за Тьюкі): ','Flagged outliers (Tukey): ')+(sm.outliers.length?sm.outliers.slice(0,20).map(fm).join(', ')+(sm.outliers.length>20?' …':''):T('немає','none'))+'   |z|>3: '+sm.zOutliers.length);
  const ref=q('#sref').value.trim();if(ref!==''&&isFinite(Number(ref))){const mu=Number(ref),tt=S.ttest1(x,mu);L.push('',T('Порівняння з μ₀ = ','Comparison with μ₀ = ')+mu+': '+T('абсолютна похибка = ','absolute error = ')+fm(sm.mean-mu)+', '+T('відносна = ','relative = ')+(mu!==0?fm(100*(sm.mean-mu)/Math.abs(mu))+'%':'—')+', t = '+fm(tt.t)+', df = '+tt.df+', p = '+(tt.p<1e-4?tt.p.toExponential(2):tt.p.toFixed(4))+T(' (двосторонній t-тест; p — не доказ причини)',' (two-sided t-test)'))}
  html('stsum','<div class="kpis"><div class="kpi"><b>'+fm(sm.mean)+'</b>x̄</div><div class="kpi"><b>'+fm(sm.median)+'</b>'+T('медіана','median')+'</div><div class="kpi"><b>'+fm(sm.sd)+'</b>s</div><div class="kpi"><b>['+fm(sm.ciLo)+'; '+fm(sm.ciHi)+']</b>'+Math.round(conf*100)+'% CI</div><div class="kpi"><b>'+sm.outliers.length+'</b>'+T('викидів (позначено)','flagged outliers')+'</div></div>');
  put('sttxt',L.join('\n'));const h=histo(x,nb,{normal:true}),qq=qqplot(x);
  html('stc1',chartBar('stc1','histogram')+h.svg);html('stc2',chartBar('stc2','boxplot')+boxplot([{name:'x',sum:sm}]));html('stc3',chartBar('stc3','qq')+qq.svg);html('stc4','<p class="mut">'+T('Кореляція точок Q–Q (близько 1 — дані схожі на нормальні): r = ','Q–Q correlation (close to 1 suggests approximate normality): r = ')+fm(qq.r)+'</p>');
  SD={mode:1,conf,x,summary:strip(sm),text:L.join('\n')}}
 else{if(x.length<3)throw Error(T('Потрібно щонайменше 3 точки.','At least 3 points are required.'));const rg=S.linreg(x,y,conf),L=[];
  L.push('n = '+rg.n);L.push(T('Модель: y = a + b·x','Model: y = a + b·x')+'   b = '+fm(rg.slope)+' ± '+fm(rg.seSlope)+'   a = '+fm(rg.intercept)+' ± '+fm(rg.seInt));
  L.push(Math.round(conf*100)+T('% ДІ нахилу: [','% CI of slope: [')+fm(rg.slopeLo)+', '+fm(rg.slopeHi)+']   '+T('ДІ перетину: [','CI of intercept: [')+fm(rg.intLo)+', '+fm(rg.intHi)+']');
  L.push('R² = '+fm(rg.r2)+'   '+T('скоригований R² = ','adjusted R² = ')+fm(rg.adjR2)+'   RMSE = '+fm(rg.rmse)+'   s(залишків) = '+fm(rg.s));
  L.push(T('Кореляція Пірсона r = ','Pearson r = ')+fm(rg.r)+T(', p = ',', p = ')+(rg.pValue<1e-4?rg.pValue.toExponential(2):rg.pValue.toFixed(4))+'   '+T('Спірмен ρ = ','Spearman ρ = ')+fm(rg.spearman));
  L.push('',T('Зауваження: кореляція та регресія описують зв’язок у даних, але не доводять причинності; лінійна модель може бути неадекватною (дивіться залишки).','Note: correlation and regression describe association in the data; they do not prove causation, and a linear model may be inadequate (see the residuals).'));
  html('stsum','<div class="kpis"><div class="kpi"><b>'+fm(rg.slope)+'</b>b</div><div class="kpi"><b>'+fm(rg.intercept)+'</b>a</div><div class="kpi"><b>'+fm(rg.r2)+'</b>R²</div><div class="kpi"><b>'+fm(rg.r)+'</b>r</div></div>');put('sttxt',L.join('\n'));
  const xs=x.slice().sort((p,q2)=>p-q2),x0=xs[0],x1=xs[xs.length-1],grid=[];for(let i=0;i<=40;i++)grid.push(x0+(x1-x0)*i/40);
  html('stc1',chartBar('stc1','scatter')+scat({title:T('Діаграма розсіювання','Scatter plot'),xlab:'x',ylab:'y',series:[{pts:x.map((v,i)=>[v,y[i]]),name:T('дані','data')}]}));
  html('stc2',chartBar('stc2','regression')+scat({title:T('Регресія та ',  'Regression with ')+Math.round(conf*100)+T('% ДІ середнього відгуку',' % CI of the mean response'),xlab:'x',ylab:'y',series:[{band:grid.map(g=>S.band(rg,g)),pts:[]},{pts:grid.map(g=>[g,rg.intercept+rg.slope*g]),line:true,dots:false,color:'#fff',name:'ŷ = '+fm(rg.intercept)+' + '+fm(rg.slope)+'x'},{pts:x.map((v,i)=>[v,y[i]]),name:T('дані','data')}]}));
  html('stc3',chartBar('stc3','residuals')+scat({title:T('Залишки проти x','Residuals vs x'),xlab:'x',ylab:T('залишок','residual'),series:[{pts:[[x0,0],[x1,0]],line:true,dots:false,color:'#888',dash:true},{pts:x.map((v,i)=>[v,rg.residuals[i]])}]}));
  html('stc4',chartBar('stc4','qq_residuals')+qqplot(rg.residuals,{title:T('Q–Q діаграма залишків','Q–Q plot of residuals')}).svg);
  SD={mode:2,conf,x,y,regression:{n:rg.n,slope:rg.slope,intercept:rg.intercept,r:rg.r,r2:rg.r2,seSlope:rg.seSlope,seInt:rg.seInt,pValue:rg.pValue,spearman:rg.spearman},text:L.join('\n')}}
 }catch(e){say('sterr',e.message)}}
const strip=sm=>{const o={};for(const k in sm)if(k!=='sorted')o[k]=sm[k];return o};
function srcOpts(){const o=['<option value="lab:count">'+esc(T('Дослідницька лабораторія: кількість розв’язків у вікні (розв’язні трійки)','Research Lab: number of solutions in window (solvable triples)'))+'</option>','<option value="lab:gcd">'+esc(T('Дослідницька лабораторія: НСД(a, b) усіх трійок','Research Lab: gcd(a, b) of all triples'))+'</option>'];
 const rows=(M5.B&&M5.B.rows||[]).filter(c=>!c.skipped&&c.samples);const algs=[...new Set(rows.map(c=>c.algo))];
 algs.forEach(a=>{if(rows.filter(c=>c.algo===a).length>=3)o.push('<option value="bxy:'+a+'">'+esc(T('Benchmark: час (мс) проти розміру в бітах — ','Benchmark: time (ms) vs size in bits — ')+a)+'</option>')});
 rows.forEach((c,i)=>o.push('<option value="bc:'+i+'">'+esc('Benchmark: '+c.algo+', '+c.bits+' bit — '+T('вибірки часу (мс)','time samples (ms)'))+'</option>'));return o.join('')}
function loadSrc(){try{const v=q('#ssrc').value||'';const [k,id]=v.split(':');
 if(k==='lab'){const S0=M5.LAB&&M5.LAB.series;if(!S0)throw Error(T('Спершу запустіть серію у Дослідницькій лабораторії.','Run a series in the Research Lab first.'));q('#stmode').value='1';
  const vals=k==='lab'&&id==='count'?S0.rows.filter(r=>r[4]===1&&Number(r[7])>=0).map(r=>Number(r[7])):S0.rows.map(r=>Number(r[3]));if(vals.length<2)throw Error(T('Замало даних.','Too little data.'));q('#sdat').value=vals.slice(0,50000).join('\n')}
 else if(k==='bxy'){const rows=M5.B.rows.filter(c=>!c.skipped&&c.samples&&c.algo===id);q('#stmode').value='2';q('#sdat').value=rows.map(c=>c.bits+' '+M5.stats(c.samples).median).join('\n')}
 else if(k==='bc'){const c=M5.B.rows.filter(c=>!c.skipped&&c.samples)[+id];q('#stmode').value='1';q('#sdat').value=c.samples.join('\n')}
 else throw Error(T('Оберіть джерело.','Choose a source.'));stRun()}catch(e){say('sterr',e.message)}}
function demo(){const n=200,R=M5.rng(parseInt(q('#stseed').value)||1);q('#stmode').value='1';const v=[];for(let i=0;i<n;i++){const u=R(),w=R();v.push(+(50+10*Math.sqrt(-2*Math.log(u||1e-12))*Math.cos(2*Math.PI*w)).toFixed(3))}q('#sdat').value=v.join('\n');stRun()}
M5.addTab('stat','Центр статистичних досліджень','Statistical Research Center',HT,()=>{
 const refresh=()=>{const cur=q('#ssrc').value;q('#ssrc').innerHTML=srcOpts();if(cur&&[...q('#ssrc').options].some(o=>o.value===cur))q('#ssrc').value=cur};refresh();
 document.addEventListener('mc5:tab',e=>{if(e.detail==='stat')refresh()});document.addEventListener('mc5:lang',()=>{refresh();if(SD)stRun()});
 q('#sgo2').onclick=stRun;q('#sload').onclick=loadSrc;q('#sdemo').onclick=demo;q('#stmode').onchange=()=>{};
 q('#sjs').onclick=()=>{if(!SD)stRun();if(!SD)return;M5.dl('mathcrypt_statistics.json',JSON.stringify({program:'MATHCRYPT '+M5.ver,kind:'statistics',data:{x:SD.x,y:SD.y},confidence:SD.conf,results:SD.summary||SD.regression},(k,v)=>typeof v==='number'&&!isFinite(v)?null:v,2),'application/json')};
 q('#scs').onclick=()=>{if(!SD)stRun();if(!SD)return;M5.dl('mathcrypt_statistics.csv',M5.csv(SD.mode===1?[['x']].concat(SD.x.map(v=>[v])):[['x','y']].concat(SD.x.map((v,i)=>[v,SD.y[i]]))),'text/csv;charset=utf-8')};
 q('#ssv').onclick=()=>{if(!SD)stRun();if(!SD)return;M5.saveEntry('stat',T('Статистичний аналіз','Statistical analysis'),{mode:SD.mode,conf:SD.conf,n:SD.x.length},{text:SD.text})};
 /* інтеграція: кнопки у Дослідницькій лабораторії та Порівняльному аналізі */
 const bt=(tab,val,ua,en)=>{const s=q('#t-'+tab);if(!s)return;const b=document.createElement('button');b.type='button';b.className='b';b.innerHTML=I('⟦'+ua+'|'+en+'⟧');b.onclick=()=>{refresh();const o=[...q('#ssrc').options].find(o=>o.value===val||o.value.startsWith(val));M5.openTab('stat');if(!o){say('sterr',T('Немає даних: спершу виконайте Порівняльний аналіз щонайменше для 3 розмірів входів.','No data: run the Algorithm Benchmark first (at least 3 input sizes).'));return}q('#ssrc').value=o.value;loadSrc()};const row=document.createElement('div');row.className='row';row.appendChild(b);s.appendChild(row)};
 bt('lab','lab:count','→ Статистика: розв’язки у вікні','→ Statistics: solutions in window');bt('bench','bxy:','→ Статистика: час проти розміру','→ Statistics: time vs size')});
/* ================= Лабораторія обчислювальної складності ================= */
const CX=`<h2>⟦Лабораторія обчислювальної складності|Computational Complexity Lab⟧</h2>
<p class="lead">⟦Підрахунок операцій і вимірювання часу залежно від бітової довжини n, підгонка моделей зростання та порівняння з теорією. Кількості операцій відтворювані (seed); час залежить від обладнання й браузера.|Operation counts and timing versus bit length n, growth-model fitting and comparison with theory. Operation counts are reproducible (seed); times depend on hardware and browser.⟧</p>
<div class="row"><label>⟦Алгоритм|Algorithm⟧<select id="cxa"><option value="euclid">⟦НСД: Евклід|gcd: Euclid⟧</option><option value="binary">⟦НСД: бінарний|gcd: binary⟧</option><option value="modpow">⟦Піднесення до степеня за модулем (квадрат і множення)|Modular exponentiation (square and multiply)⟧</option><option value="trial">⟦Перевірка простоти: пробні ділення (прості входи)|Primality: trial division (prime inputs)⟧</option></select></label>
<label>⟦Розміри n, біт|Sizes n, bits⟧<input class="w" id="cxs" style="min-width:280px"></label><label>⟦Входів на розмір|Inputs per size⟧<input class="s" id="cxn" value="30"></label><label>seed<input class="s" id="cxseed" value="7"></label></div>
<div class="row"><button class="b m" id="cxgo">⟦Запустити|Run⟧</button><button class="b" id="cxstop" disabled>⟦Зупинити|Stop⟧</button><progress id="cxp" value="0" max="1" style="width:200px"></progress><button class="b" id="cxcsv">CSV</button><button class="b" id="cxjson">JSON</button><button class="b" id="cxsave">⟦Зберегти в архів|Save to archive⟧</button></div>
<div class="err" id="cxerr"></div><div id="cxsum"></div><div id="cxtab"></div><pre id="cxfit"></pre>
<div class="wide" id="cxc1"></div><div class="wide" id="cxc2"></div><div class="note" id="cxth"></div>`;
const rngC=seed=>{let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}};
function rbitsC(r,bits){let x=1n,i=1;while(i<bits){const k=Math.min(24,bits-i);x=(x<<BigInt(k))|BigInt(Math.floor(r()*(1<<k)));i+=k}return x}
const CXA={
 euclid:{defs:'64,128,256,512,1024,2048,4096,8192',gen:(r,b)=>[rbitsC(r,b),rbitsC(r,b)],run:([a,b])=>{let n=0;while(b){const t=a%b;a=b;b=t;n++}return{v:a,ops:n}},ref:([a,b])=>M5.gcd(a,b),opName:{ua:'кроків ділення',en:'division steps'},
  th:{ua:'Евклід: середня кількість кроків ≈ (12 ln 2/π²)·ln N ≈ 0,584·n (теорема Діксона/Хейльбронна); отже ops = Θ(n). Час: Θ(n²) для шкільного ділення.',en:'Euclid: the mean number of steps ≈ (12 ln 2/π²)·ln N ≈ 0.584·n (Dixon/Heilbronn), so ops = Θ(n). Time: Θ(n²) for schoolbook division.'},expect:n=>0.584*n,expectTxt:'0.584·n'},
 binary:{defs:'64,128,256,512,1024,2048,4096,8192',gen:(r,b)=>[rbitsC(r,b),rbitsC(r,b)],run:([a,b])=>{if(a===0n)return{v:b,ops:0};if(b===0n)return{v:a,ops:0};let sh=0n,n=0;while(((a|b)&1n)===0n){a>>=1n;b>>=1n;sh++;n++}while((a&1n)===0n){a>>=1n;n++}do{while((b&1n)===0n){b>>=1n;n++}if(a>b){const t=a;a=b;b=t}b-=a;n++}while(b!==0n);return{v:a<<sh,ops:n}},ref:([a,b])=>M5.gcd(a,b),opName:{ua:'ітерацій (зсув + віднімання)',en:'iterations (shift + subtract)'},
  th:{ua:'Бінарний НСД: кожна ітерація зменшує сумарну бітову довжину, тому ops = Θ(n); кожна ітерація коштує Θ(n), отже час Θ(n²).',en:'Binary gcd: every iteration reduces the total bit length, so ops = Θ(n); each iteration costs Θ(n), hence time Θ(n²).'}},
 modpow:{defs:'64,128,256,512,1024,1536',gen:(r,b)=>{const m=rbitsC(r,b)|1n;return[rbitsC(r,b)%m,rbitsC(r,b),m]},run:([bb,e,m])=>{let r=1n,x=bb%m,n=0;while(e>0n){if(e&1n){r=r*x%m;n++}x=x*x%m;n++;e>>=1n}return{v:r,ops:n}},ref:([b,e,m])=>M5.modpow(b,e,m),opName:{ua:'модульних множень',en:'modular multiplications'},
  th:{ua:'Квадрат і множення: n квадратів + (кількість одиниць в e) множень ≈ 1,5·n модульних множень для випадкового e; ops = Θ(n); кожне множення Θ(n²) (шкільне), тож час Θ(n³). У рушіях JS множення великих чисел може бути швидшим, тому виміряний показник часу може бути нижчим за 3.',en:'Square-and-multiply: n squarings + popcount(e) multiplications ≈ 1.5·n modular multiplications for random e; ops = Θ(n); each multiplication is Θ(n²) (schoolbook), so time Θ(n³). JS engines may use faster big-number multiplication, so the measured time exponent can be below 3.'},expect:n=>1.5*n,expectTxt:'1.5·n'},
 trial:{defs:'16,20,24,28,32,36,40',gen:(r,b)=>{let c=rbitsC(r,b)|1n;while(!M5.isPrime(c))c+=2n;return Number(c)},run:x=>{let n=0;if(x<2)return{v:false,ops:0};if(x%2===0)return{v:x===2,ops:0};for(let d=3;d*d<=x;d+=2){n++;if(x%d===0)return{v:false,ops:n}}return{v:true,ops:n}},ref:x=>true,opName:{ua:'пробних ділень',en:'trial divisions'},
  th:{ua:'Пробні ділення простого числа N ≈ 2ⁿ: √N/2 ≈ 2^(n/2)/2 ділень — експоненціальна складність відносно бітової довжини n (але лінійна за самим N^½).',en:'Trial division of a prime N ≈ 2ⁿ: √N/2 ≈ 2^(n/2)/2 divisions — exponential in the bit length n (though sub-linear in N itself).'},expect:n=>Math.pow(2,n/2)/2,expectTxt:'2^(n/2)/2'}};
const MODELS=[['n',n=>n],['n·log₂n',n=>n*Math.log2(n)],['n²',n=>n*n],['n³',n=>n*n*n],['2^(n/2)',n=>Math.pow(2,n/2)]];
function fitModels(ns,ys){const ok=ns.map((n,i)=>[n,ys[i]]).filter(p=>p[1]>0&&isFinite(p[1]));const out=[];if(ok.length<3)return{models:[],power:null};
 MODELS.forEach(([name,f])=>{const lr=ok.map(([n,y])=>Math.log(y)-Math.log(f(n)));if(lr.some(v=>!isFinite(v)))return;const lc=S.mean(lr),sse=lr.reduce((s,v)=>s+(v-lc)*(v-lc),0);out.push({name,c:Math.exp(lc),sse,rmsLog:Math.sqrt(sse/ok.length)})});
 out.sort((a,b)=>a.sse-b.sse);const pw=S.linreg(ok.map(p=>Math.log(p[0])),ok.map(p=>Math.log(p[1])));return{models:out,power:{exp:pw.slope,se:pw.seSlope,r2:pw.r2,c:Math.exp(pw.intercept)}}}
M5.fitModels=fitModels;
let CXD=null,CXstop=false;
const tick=()=>new Promise(r=>setTimeout(r,0));
async function cxRun(){const id=q('#cxa').value,A=CXA[id];try{say('cxerr','');const sizes=q('#cxs').value.split(/[\s,;]+/).filter(Boolean).map(Number);if(sizes.length<3||sizes.some(x=>!(x>=8&&x<=16384&&Number.isInteger(x))))throw Error(T('Потрібно щонайменше 3 цілі розміри 8…16384.','At least 3 integer sizes 8…16384 are required.'));if(id==='trial'&&sizes.some(x=>x>44))throw Error(T('Для пробних ділень n ≤ 44 (інакше надто довго).','For trial division n ≤ 44 (otherwise too slow).'));
 const nin=parseInt(q('#cxn').value),seed=parseInt(q('#cxseed').value);if(!(nin>=3&&nin<=500))throw Error(T('Входів: 3…500.','Inputs: 3…500.'));
 CXstop=false;q('#cxgo').disabled=true;q('#cxstop').disabled=false;q('#cxp').max=sizes.length;q('#cxp').value=0;const rows=[];
 for(let si=0;si<sizes.length&&!CXstop;si++){const b=sizes[si],r=rngC((seed^Math.imul(b,2654435761))>>>0),inputs=[];for(let i=0;i<nin;i++)inputs.push(A.gen(r,b));
  const ops=[];let bad=0;inputs.forEach(x=>{const o=A.run(x),w=A.ref(x);if(o.v!==w)bad++;ops.push(o.ops)});
  let loops=1;let t0=performance.now();for(const x of inputs)A.run(x);let one=performance.now()-t0;const target=20;if(one<target)loops=Math.min(20000,Math.ceil(target/Math.max(one,1e-3)));
  const samp=[];for(let rp=0;rp<5;rp++){const a0=performance.now();for(let k=0;k<loops;k++)for(const x of inputs)A.run(x);samp.push((performance.now()-a0)/(loops*nin));await tick()}
  const os=S.summary(ops.length>1?ops:[...ops,...ops]),ts=S.summary(samp);rows.push({bits:b,n:nin,opsMean:os.mean,opsSd:os.sd,opsMin:os.min,opsMax:os.max,timeMs:ts.mean,timeSd:ts.sd,timeMedian:ts.median,loops,mismatches:bad});q('#cxp').value=si+1;await tick()}
 q('#cxgo').disabled=false;q('#cxstop').disabled=true;if(!rows.length)return;CXD=finishCx(id,rows,seed,nin,CXstop)}catch(e){q('#cxgo').disabled=false;q('#cxstop').disabled=true;say('cxerr',e.message)}}
function finishCx(id,rows,seed,nin,stopped){const A=CXA[id],ns=rows.map(r=>r.bits),fo=fitModels(ns,rows.map(r=>r.opsMean)),ft=fitModels(ns,rows.map(r=>r.timeMs));
 html('cxtab',M5.table(['n ('+T('біт','bits')+')',A.opName[M5.lang()==='en'?'en':'ua']+' ('+T('середнє','mean')+')','sd',T('очікувано (теорія)','expected (theory)'),T('час/виклик','time/call'),T('sd часу','time sd'),T('збіг з еталоном','matches reference')],rows.map(r=>[r.bits,fm(r.opsMean),fm(r.opsSd),A.expect?fm(A.expect(r.bits))+' ('+A.expectTxt+')':'—',M5.fmtT(r.timeMs),M5.fmtT(r.timeSd),r.mismatches?'✗ '+r.mismatches:'✓'])));
 const L=[];const fl=(f,u)=>{if(!f.power)return T('замало точок','too few points');L.push(u+T(': показник степеня (log–log регресія) p = ',': power-law exponent (log–log regression) p = ')+fm(f.power.exp)+' ± '+fm(f.power.se)+',  R² = '+fm(f.power.r2));f.models.forEach((m,i)=>L.push('   '+(i===0?'★ ':'  ')+m.name.padEnd(9)+T('  c = ','  c = ')+fm(m.c)+T(',  СКВ відхилень ln = ',',  RMS of ln residuals = ')+fm(m.rmsLog)))};
 L.push(T('— Операції —','— Operations —'));fl(fo,T('Операції','Operations'));L.push('');L.push(T('— Час —','— Time —'));fl(ft,T('Час','Time'));L.push('');L.push(T('★ — модель з найменшим відхиленням у логарифмічній шкалі. Це описове порівняння, а не статистичний тест: за кількох точок різні моделі можуть бути майже нерозрізненними.','★ = the model with the smallest log-scale deviation. This is a descriptive comparison, not a statistical test: with few points several models may be nearly indistinguishable.'));
 if(stopped)L.push(T('Обчислення зупинено користувачем: показано лише виконані розміри.','Stopped by the user: only the completed sizes are shown.'));put('cxfit',L.join('\n'));
 const ser=[{name:T('виміряно','measured'),pts:rows.map(r=>[r.bits,r.opsMean]),line:true,color:'#ff4d5e'}];if(fo.models[0]){const m=fo.models[0],f=MODELS.find(x=>x[0]===m.name)[1];ser.push({name:T('найкраща модель ','best model ')+m.name,pts:rows.map(r=>[r.bits,m.c*f(r.bits)]),line:true,dots:false,color:'#fff',dash:true})}if(A.expect)ser.push({name:T('теорія ','theory ')+A.expectTxt,pts:rows.map(r=>[r.bits,A.expect(r.bits)]),line:true,dots:false,color:'#fb7185',dash:true});
 html('cxc1',M5.chartBar('cxc1','complexity_ops')+scat({title:T('Кількість операцій (log–log)','Operation count (log–log)'),xlab:'n, '+T('біт','bits'),ylab:A.opName[M5.lang()==='en'?'en':'ua'],logx:true,logy:true,series:ser}));
 const ser2=[{name:T('виміряно','measured'),pts:rows.map(r=>[r.bits,r.timeMs]),line:true,color:'#ff4d5e'}];if(ft.models[0]){const m=ft.models[0],f=MODELS.find(x=>x[0]===m.name)[1];ser2.push({name:T('найкраща модель ','best model ')+m.name,pts:rows.map(r=>[r.bits,m.c*f(r.bits)]),line:true,dots:false,color:'#fff',dash:true})}
 html('cxc2',M5.chartBar('cxc2','complexity_time')+scat({title:T('Час виклику (log–log)','Time per call (log–log)'),xlab:'n, '+T('біт','bits'),ylab:'ms',logx:true,logy:true,series:ser2}));
 put('cxth','');q('#cxth').textContent=T('Теорія: ','Theory: ')+A.th[M5.lang()==='en'?'en':'ua'];
 html('cxsum','<div class="kpis"><div class="kpi"><b>'+rows.reduce((s,r)=>s+r.mismatches,0)+'</b>'+T('розбіжностей з еталоном','mismatches with reference')+'</div><div class="kpi"><b>'+(fo.power?fm(fo.power.exp):'—')+'</b>'+T('показник у n (операції)','exponent in n (ops)')+'</div><div class="kpi"><b>'+(ft.power?fm(ft.power.exp):'—')+'</b>'+T('показник у n (час)','exponent in n (time)')+'</div></div>');
 return{id,seed,nin,rows,opsFit:fo,timeFit:ft,stopped}}
M5.addTab('cx','Лабораторія складності','Complexity Lab',CX,()=>{const set=()=>{q('#cxs').value=CXA[q('#cxa').value].defs};set();q('#cxa').onchange=set;q('#cxgo').onclick=cxRun;q('#cxstop').onclick=()=>{CXstop=true};
 q('#cxcsv').onclick=()=>{if(!CXD){say('cxerr',T('Спершу запустіть.','Run first.'));return}M5.dl('mathcrypt_complexity.csv',M5.csv([['algorithm','bits','n_inputs','ops_mean','ops_sd','time_ms_mean','time_ms_sd','mismatches']].concat(CXD.rows.map(r=>[CXD.id,r.bits,r.n,r.opsMean,r.opsSd,r.timeMs,r.timeSd,r.mismatches]))),'text/csv;charset=utf-8')};
 q('#cxjson').onclick=()=>{if(!CXD){say('cxerr',T('Спершу запустіть.','Run first.'));return}M5.dl('mathcrypt_complexity.json',JSON.stringify({program:'MATHCRYPT '+M5.ver,kind:'complexity',timeIsMachineDependent:true,result:CXD},null,2),'application/json')};
 q('#cxsave').onclick=()=>{if(!CXD){say('cxerr',T('Спершу запустіть.','Run first.'));return}M5.saveEntry('complexity',T('Складність: ','Complexity: ')+CXD.id,{algorithm:CXD.id,seed:CXD.seed,inputs:CXD.nin,sizes:CXD.rows.map(r=>r.bits)},{rows:CXD.rows.map(r=>({bits:r.bits,ops:r.opsMean,time_ms:r.timeMs}))})};
 document.addEventListener('mc5:lang',()=>{if(CXD&&!q('#cxgo').disabled)finishCx(CXD.id,CXD.rows,CXD.seed,CXD.nin,CXD.stopped)})});
M5.cxCore={CXA,rngC,rbitsC,MODELS};
})();
