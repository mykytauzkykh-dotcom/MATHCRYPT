/* ===== MATHCRYPT 5.0 — ядро: i18n, BigInt-математика, графіки, архів, вкладки ===== */
(()=>{'use strict';
const M5=window.M5={ver:'6.0',mods:{},rerun:{}};
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
M5.q=q;M5.qa=qa;
/* ---------- i18n ---------- */
let LANG='uk';try{LANG=localStorage.getItem('mc5_lang')||'uk'}catch(e){}
const EN=Object.create(null);M5.EN=EN;
const T=(u,e)=>LANG==='en'?e:u;M5.T=T;M5.lang=()=>LANG;
const I=s=>s.replace(/⟦([^|⟧]*)\|([^⟧]*)⟧/g,(m,u,e)=>{EN[u.trim()]=e.trim();return u});M5.I=I;
const orig=new WeakMap();
function walk(root){root=root||document.body;
 const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentNode;return p&&!/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)?1:2}});
 const ns=[];while(tw.nextNode())ns.push(tw.currentNode);
 ns.forEach(n=>{let o=orig.get(n);const cur=n.nodeValue;
  if(o===undefined){const k=cur.trim();if(!k||!(k in EN))return;o={k,pre:cur.match(/^\s*/)[0],post:cur.match(/\s*$/)[0]};orig.set(n,o)}
  const v=o.pre+(LANG==='en'?EN[o.k]:o.k)+o.post;if(n.nodeValue!==v)n.nodeValue=v});
 root.querySelectorAll&&root.querySelectorAll('[data-ph]').forEach(e=>{const u=e.dataset.ph,en=e.dataset.phen;e.placeholder=LANG==='en'&&en?en:u});}
M5.walk=walk;
function setLang(l){LANG=l;try{localStorage.setItem('mc5_lang',l)}catch(e){}document.documentElement.lang=l==='en'?'en':'uk';walk(document.body);
 const b=q('#langbtn');if(b)b.textContent=l==='en'?'UA':'EN';document.dispatchEvent(new CustomEvent('mc5:lang'))}
M5.setLang=setLang;
/* ---------- утиліти ---------- */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));M5.esc=esc;
const isI=v=>/^[+-]?\d+$/.test(String(v).trim());M5.isI=isI;
M5.big=(id,name)=>{const v=q('#'+id).value;if(!isI(v))throw Error(T('Введіть ціле число: ','Enter an integer: ')+(name||id));return BigInt(v.trim())};
M5.val=id=>q('#'+id).value.trim();
M5.say=(id,t,ok)=>{const e=q('#'+id);if(!e)return;e.textContent=t||'';e.className='err'+(ok?' ok':'')};
M5.put=(id,t)=>{q('#'+id).textContent=t};
M5.html=(id,h)=>{q('#'+id).innerHTML=h;walk(q('#'+id))};
M5.dl=(name,text,mime)=>{const b=new Blob([text],{type:mime||'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)};
M5.csv=rows=>'﻿'+rows.map(r=>r.map(c=>{c=String(c);return /[",;\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(',')).join('\r\n');
M5.toast=m=>{let t=q('#toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),2600)};
M5.table=(head,rows,cls)=>'<div class="tbw"><table class="tb '+(cls||'')+'"><thead><tr>'+head.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(c=>'<td>'+esc(c)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
/* ---------- BigInt-математика ---------- */
const abs=a=>a<0n?-a:a;
const fdiv=(a,b)=>{let d=a/b;if(a%b!==0n&&((a<0n)!==(b<0n)))d-=1n;return d};
const cdiv=(a,b)=>-fdiv(-a,b);
const mod=(a,m)=>((a%m)+m)%m;
const gcd=(a,b)=>{a=abs(a);b=abs(b);while(b){[a,b]=[b,a%b]}return a};
function xgcd(a,b){let or=a,r=b,os=1n,s=0n,ot=0n,t=1n;const st=[];
 while(r!==0n){const d=or/r;st.push({a:or,b:r,q:d,r:or-d*r});[or,r]=[r,or-d*r];[os,s]=[s,os-d*s];[ot,t]=[t,ot-d*t]}
 return or<0n?{g:-or,x:-os,y:-ot,steps:st}:{g:or,x:os,y:ot,steps:st}}
function modinv(a,m){if(m===1n)return 0n;const r=xgcd(mod(a,m),m);return r.g===1n?mod(r.x,m):null}
function modpow(b,e,m){if(m===1n)return 0n;let r=1n;b=mod(b,m);while(e>0n){if(e&1n)r=r*b%m;b=b*b%m;e>>=1n}return r}
function isqrt(n){if(n<0n)throw Error('isqrt<0');if(n<2n)return n;let x=BigInt(Math.floor(Math.sqrt(Number(n))));if(x<1n)x=1n;
 for(let i=0;i<200;i++){const y=(x+n/x)>>1n;if(y===x||y===x+1n&&y*y>n)break;x=y}while(x*x>n)x--;while((x+1n)*(x+1n)<=n)x++;return x}
const SP=[2n,3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n];
function isPrime(n){if(n<2n)return false;for(const p of SP){if(n===p)return true;if(n%p===0n)return false}
 let d=n-1n,s=0;while(!(d&1n)){d>>=1n;s++}
 for(const a of SP){let x=modpow(a,d,n);if(x===1n||x===n-1n)continue;let c=false;for(let i=1;i<s;i++){x=x*x%n;if(x===n-1n){c=true;break}}if(!c)return false}return true}
function randBits(bits){const nb=Math.ceil(bits/8),u=new Uint8Array(nb);crypto.getRandomValues(u);let x=0n;for(const v of u)x=(x<<8n)|BigInt(v);x&=(1n<<BigInt(bits))-1n;return x|(1n<<BigInt(bits-1))|1n}
function genPrime(bits){for(let i=0;i<100000;i++){const c=randBits(bits);if(isPrime(c))return c}throw Error('prime')}
function factor(n){const f=[];let d=2n;while(d*d<=n&&d<10000000n){while(n%d===0n){f.push(d);n/=d}d+=d===2n?1n:2n}if(n>1n)f.push(n);return f}
function log10Big(x){const s=abs(x).toString(),L=s.length,m=Math.min(L,15);return Math.log10(Number(s.slice(0,m)))+L-m}
Object.assign(M5,{abs,fdiv,cdiv,mod,gcd,xgcd,modinv,modpow,isqrt,isPrime,randBits,genPrime,factor,log10Big});
/* розв'язок ax+by=c (BigInt): {ok,g,x0,y0,sx,sy,...} */
function dio(a,b,c){
 if(a===0n&&b===0n)return c===0n?{ok:true,all:true,g:0n}:{ok:false,g:0n};
 const r=xgcd(a,b),g=r.g;if(c%g!==0n)return{ok:false,g,steps:r.steps,x:r.x,y:r.y};
 const k=c/g;return{ok:true,g,x:r.x,y:r.y,k,x0:r.x*k,y0:r.y*k,sx:b/g,sy:-a/g,steps:r.steps}}
M5.dio=dio;
/* кількість розв'язків: x∈[xl,xh], y∈[yl,yh]; межі можуть бути null (немає обмеження) */
function countSol(F,xr,yr){const cons=[[F.x0,F.sx,xr[0],xr[1]],[F.y0,F.sy,yr[0],yr[1]]];let lo=null,hi=null;
 const up=v=>{if(hi===null||v<hi)hi=v},dn=v=>{if(lo===null||v>lo)lo=v};
 for(const[v0,s,l,h]of cons){if(s===0n){if((l!==null&&v0<l)||(h!==null&&v0>h))return{n:0n,lo:0n,hi:-1n};continue}
  if(s>0n){if(l!==null)dn(cdiv(l-v0,s));if(h!==null)up(fdiv(h-v0,s))}else{if(h!==null)dn(cdiv(h-v0,s));if(l!==null)up(fdiv(l-v0,s))}}
 if(lo===null||hi===null)return{inf:true};return{n:hi>=lo?hi-lo+1n:0n,lo,hi}}
M5.countSol=countSol;
/* ---------- статистика / ГПВЧ ---------- */
M5.stats=a=>{const n=a.length;if(!n)return{n:0,mean:NaN,median:NaN,min:NaN,max:NaN,sd:NaN};const s=[...a].sort((x,y)=>x-y),m=a.reduce((x,y)=>x+y,0)/n;
 return{n,mean:m,median:n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2,min:s[0],max:s[n-1],sd:n>1?Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/(n-1)):0}};
M5.rng=seed=>{let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}};
M5.fmtT=ms=>{if(!isFinite(ms))return'—';const a=Math.abs(ms);if(a===0)return'0';if(a<1e-3)return(ms*1e6).toPrecision(3)+' ns';if(a<1)return(ms*1e3).toPrecision(3)+' µs';if(a<1000)return ms.toPrecision(3)+' ms';return(ms/1000).toPrecision(3)+' s'};
M5.sci=x=>{if(x===0)return'0';return x.toExponential(2)};
/* ---------- SVG-графіки (кольори явні — для експорту у PNG/SVG) ---------- */
const COL=['#ff4d5e','#e8e8e8','#c4122f','#fb7185','#9a9a9a','#ffb3bb','#7a0f1f','#d94a68'];M5.COL=COL;
const BG='#0a0a0c',FG='#ddd',GR='#2f2f33';
const nice=(lo,hi,n)=>{const span=(hi-lo)||1,raw=span/n,p=Math.pow(10,Math.floor(Math.log10(raw))),f=raw/p,st=(f<1.5?1:f<3?2:f<7?5:10)*p,t=[];for(let v=Math.ceil(lo/st)*st;v<=hi+st*1e-9;v+=st)t.push(+v.toPrecision(12));return t};
M5.nice=nice;
const svgOpen=(w,h)=>'<svg xmlns="http://www.w3.org/2000/svg" class="ch" viewBox="0 0 '+w+' '+h+'" width="'+w+'" height="'+h+'" font-family="Segoe UI,Arial,sans-serif" style="background:'+BG+'">';
M5.lineChart=o=>{const W=o.w||760,H=o.h||380,l=64,r=18,t=o.title?36:16,b=o.xlab?58:44;let s=svgOpen(W,H);
 const all=o.series.flatMap(z=>z.y.filter(v=>v!=null&&isFinite(v)&&(!o.log||v>0)));
 if(!all.length)return s+'<text x="'+W/2+'" y="'+H/2+'" fill="'+FG+'" text-anchor="middle" font-size="14">'+esc(T('Немає даних','No data'))+'</text></svg>';
 const tf=v=>o.log?Math.log10(v):v;let lo=Math.min(...all.map(tf)),hi=Math.max(...all.map(tf));if(lo===hi){lo-=1;hi+=1}if(!o.log&&o.zero!==false&&lo>0)lo=0;
 const n=o.x.length,X=i=>l+(n>1?i/(n-1):.5)*(W-l-r),Y=v=>H-b-(tf(v)-lo)/(hi-lo)*(H-b-t);
 if(o.title)s+='<text x="'+W/2+'" y="22" fill="#fff" text-anchor="middle" font-size="15" font-weight="600">'+esc(o.title)+'</text>';
 const ticks=o.log?(()=>{const a=[];for(let e=Math.ceil(lo);e<=Math.floor(hi);e++)a.push(e);return a.length?a:[Math.round(lo),Math.round(hi)]})():nice(lo,hi,5);
 ticks.forEach(v=>{const yy=H-b-(v-lo)/(hi-lo)*(H-b-t);s+='<line x1="'+l+'" x2="'+(W-r)+'" y1="'+yy+'" y2="'+yy+'" stroke="'+GR+'" stroke-dasharray="2 4"/><text x="'+(l-6)+'" y="'+(yy+4)+'" fill="'+FG+'" font-size="11" text-anchor="end">'+(o.log?'10^'+v:(Math.abs(v)>=1e5||(v!==0&&Math.abs(v)<1e-3)?v.toExponential(1):v))+'</text>'});
 const step=Math.max(1,Math.ceil(n/12));o.x.forEach((v,i)=>{if(i%step===0)s+='<text x="'+X(i)+'" y="'+(H-b+16)+'" fill="'+FG+'" font-size="11" text-anchor="middle">'+esc(v)+'</text>'});
 s+='<line x1="'+l+'" x2="'+(W-r)+'" y1="'+(H-b)+'" y2="'+(H-b)+'" stroke="#888"/><line x1="'+l+'" x2="'+l+'" y1="'+t+'" y2="'+(H-b)+'" stroke="#888"/>';
 if(o.xlab)s+='<text x="'+(l+(W-l-r)/2)+'" y="'+(H-b+36)+'" fill="'+FG+'" font-size="12" text-anchor="middle">'+esc(o.xlab)+'</text>';
 if(o.ylab)s+='<text transform="translate(14 '+(t+(H-b-t)/2)+') rotate(-90)" fill="'+FG+'" font-size="12" text-anchor="middle">'+esc(o.ylab)+'</text>';
 o.series.forEach((z,k)=>{const c=z.color||COL[k%COL.length];let d='',pen=false,dots='';z.y.forEach((v,i)=>{if(v==null||!isFinite(v)||(o.log&&v<=0)){pen=false;return}d+=(pen?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1);pen=true;dots+='<circle cx="'+X(i).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="3.5" fill="'+c+'"/>'});
  s+='<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="2.2"/>'+dots});
 if(o.series.length>1||o.series[0].name){let lx=l+8;o.series.forEach((z,k)=>{const c=z.color||COL[k%COL.length];s+='<rect x="'+lx+'" y="'+(t+2)+'" width="12" height="3" fill="'+c+'"/><text x="'+(lx+16)+'" y="'+(t+8)+'" fill="'+FG+'" font-size="11">'+esc(z.name||'')+'</text>';lx+=26+String(z.name||'').length*6.4})}
 return s+'</svg>'};
M5.barChart=o=>{const W=o.w||760,rowH=30,t=o.title?38:14,H=t+o.items.length*rowH+34,l=o.left||190,r=84;let s=svgOpen(W,H);
 const vs=o.items.map(i=>i.v).filter(v=>v!=null&&isFinite(v)&&(!o.log||v>0));
 if(o.title)s+='<text x="'+W/2+'" y="23" fill="#fff" text-anchor="middle" font-size="15" font-weight="600">'+esc(o.title)+'</text>';
 if(!vs.length)return s+'<text x="'+W/2+'" y="'+H/2+'" fill="'+FG+'" text-anchor="middle">'+esc(T('Немає даних','No data'))+'</text></svg>';
 const mx=Math.max(...vs),mn=Math.min(...vs),lo=o.log?Math.floor(Math.log10(mn))-1:0,hi=o.log?Math.log10(mx):mx;
 const len=v=>o.log?(Math.log10(v)-lo)/(hi-lo||1)*(W-l-r):v/(mx||1)*(W-l-r);
 o.items.forEach((it,i)=>{const y=t+i*rowH,c=it.color||COL[i%COL.length];s+='<text x="'+(l-8)+'" y="'+(y+18)+'" fill="'+FG+'" font-size="12" text-anchor="end">'+esc(it.name)+'</text>';
  if(it.v==null||!isFinite(it.v)||(o.log&&it.v<=0))s+='<text x="'+(l+4)+'" y="'+(y+18)+'" fill="#777" font-size="11">'+esc(it.note||'—')+'</text>';
  else{const w=Math.max(2,len(it.v));s+='<rect x="'+l+'" y="'+(y+4)+'" width="'+w.toFixed(1)+'" height="20" fill="'+c+'" rx="2"/><text x="'+(l+w+6)+'" y="'+(y+18)+'" fill="#fff" font-size="12">'+esc(o.fmt?o.fmt(it.v):it.v)+'</text>'}});
 s+='<line x1="'+l+'" x2="'+l+'" y1="'+t+'" y2="'+(H-30)+'" stroke="#888"/>';
 if(o.log)s+='<text x="'+(W-r)+'" y="'+(H-10)+'" fill="#999" font-size="11" text-anchor="end">'+esc(T('логарифмічна шкала довжини стовпців','logarithmic bar-length scale'))+'</text>';
 return s+'</svg>'};
M5.svgToPng=(svg,name)=>{const im=new Image(),u='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);im.onload=()=>{const c=document.createElement('canvas');c.width=im.width*2;c.height=im.height*2;const g=c.getContext('2d');g.scale(2,2);g.drawImage(im,0,0);c.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)})};im.onerror=()=>M5.toast(T('Не вдалося створити PNG','PNG export failed'));im.src=u};
/* ---------- архів досліджень (localStorage) ---------- */
const AK='mc5_archive';
M5.arch={list(){try{const v=JSON.parse(localStorage.getItem(AK)||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}},
 write(l){localStorage.setItem(AK,JSON.stringify(l))},
 add(e){const l=this.list();e.id=e.id||('r'+Date.now().toString(36)+Math.random().toString(36).slice(2,6));e.date=e.date||new Date().toISOString();e.version=M5.ver;l.unshift(e);
  try{this.write(l)}catch(x){l.shift();M5.toast(T('Не вдалося зберегти: сховище переповнене','Save failed: storage is full'));return null}document.dispatchEvent(new CustomEvent('mc5:arch'));return e},
 del(id){this.write(this.list().filter(e=>e.id!==id));document.dispatchEvent(new CustomEvent('mc5:arch'))},
 get(id){return this.list().find(e=>e.id===id)},
 upd(id,patch){const l=this.list(),e=l.find(x=>x.id===id);if(e){Object.assign(e,patch);this.write(l)}}};
/* модальне вікно «зберегти в архів» */
M5.askSave=(defTitle,cb)=>{let d=q('#savedlg');if(!d){d=document.createElement('div');d.id='savedlg';d.innerHTML=I('<div class="dlg" role="dialog" aria-modal="true" aria-labelledby="sdt"><h2 id="sdt">⟦Зберегти в архів досліджень|Save to research archive⟧</h2><label>⟦Назва|Title⟧<input class="w" id="sdn"></label><label>⟦Коментар дослідника|Researcher comment⟧<textarea class="w" id="sdc" rows="3"></textarea></label><div class="row"><button class="b m" id="sdok">⟦Зберегти|Save⟧</button><button class="b" id="sdx">⟦Скасувати|Cancel⟧</button></div></div>');document.body.appendChild(d)}
 walk(d);q('#sdn').value=defTitle;q('#sdc').value='';d.classList.add('on');q('#sdn').focus();
 const close=()=>d.classList.remove('on');q('#sdx').onclick=close;
 q('#sdok').onclick=()=>{const t=q('#sdn').value.trim()||defTitle,c=q('#sdc').value.trim();close();cb(t,c)};
 d.onkeydown=e=>{if(e.key==='Escape')close();if(e.key==='Enter'&&e.target.tagName==='INPUT')q('#sdok').click()}};
M5.saveEntry=(type,title,params,results,extra)=>M5.askSave(title,(t,c)=>{const e=M5.arch.add(Object.assign({type,title:t,params,results,comment:c,settings:{}},extra||{}));if(e)M5.toast(T('Збережено в архів: ','Saved to archive: ')+t)});
/* ---------- вкладки та бічна панель ---------- */
const GROUPS=[['Основне','Basics',['dash','dio','rsa','anim','prime','gen','about']],['Дослідження','Research',['lab','bench','stat','stat2','cx','exp','nb','terminal','archive','report','sci','pub','data','repro']],['Розширена математика','Advanced mathematics',['graph','nt','obs','lattice','quantum','dioadv','pell','crt','cf']],['Криптографічна лабораторія','Cryptography lab',['rsa5','dh','ecc','hash','classic','pqc']],['Навчання та історія','Learning and history',['proofs','viz','theory','prac','hist','math']],['Сервіс','Service',['tests']]];
const TABEN={dio:'Diophantine equations',rsa:'RSA: text and keys',anim:'RSA animation',prime:'Prime numbers',gen:'Task generator',theory:'Theory',prac:'Practice',hist:'History and projects',math:'History of mathematics'};
M5.tabs={};
function openTab(id,noHash){qa('#tabs button[data-t]').forEach(x=>x.setAttribute('aria-selected',String(x.dataset.t===id)));qa('main section').forEach(s=>s.classList.toggle('on',s.id==='t-'+id));
 if(!noHash)try{history.replaceState(null,'','#t-'+id)}catch(e){}document.dispatchEvent(new CustomEvent('mc5:tab',{detail:id}))}
M5.openTab=openTab;
M5.addTab=(id,ua,en,html,init)=>{EN[ua]=en;const s=document.createElement('section');s.id='t-'+id;s.innerHTML=I(html);q('main').appendChild(s);
 const b=document.createElement('button');b.textContent=ua;b.setAttribute('role','tab');b.dataset.t=id;b.setAttribute('aria-selected','false');b.onclick=()=>openTab(id);q('#tabs').appendChild(b);M5.tabs[id]=s;if(init)init(s)};
M5.layout=()=>{const nav=q('#tabs'),by={};qa('#tabs button[data-t]').forEach(b=>by[b.dataset.t]=b);
 Object.keys(TABEN).forEach(k=>{if(by[k])EN[by[k].textContent.trim()]=TABEN[k]});
 nav.textContent='';GROUPS.forEach(([u,e,ids])=>{EN[u]=e;const g=document.createElement('span');g.className='grp';g.textContent=u;nav.appendChild(g);ids.forEach(i=>by[i]&&nav.appendChild(by[i]))});
 const g=document.createElement('span');g.className='grp';g.textContent='Захист роботи';EN['Захист роботи']='Defense';nav.appendChild(g);
 const d=document.createElement('button');d.id='defbtn';d.type='button';d.textContent='Захист наукової роботи';EN['Захист наукової роботи']='Science defense mode';d.onclick=()=>M5.openDefense&&M5.openDefense();nav.appendChild(d);
 const g2=document.createElement('span');g2.className='grp';g2.textContent='Налаштування';EN['Налаштування']='Settings';nav.appendChild(g2);
 const lb=document.createElement('button');lb.id='langbtn';lb.type='button';lb.title='UA / EN';lb.textContent=LANG==='en'?'UA':'EN';lb.onclick=()=>setLang(LANG==='en'?'uk':'en');nav.appendChild(lb);
 const rb=document.createElement('button');rb.id='rmbtn';rb.type='button';rb.textContent='Зменшена анімація';EN['Зменшена анімація']='Reduced motion';rb.setAttribute('aria-pressed','false');
 const setRM=on=>{document.documentElement.classList.toggle('reduce',on);rb.setAttribute('aria-pressed',String(on));try{localStorage.setItem('mc5_rm',on?'1':'0')}catch(e){}};
 rb.onclick=()=>setRM(!document.documentElement.classList.contains('reduce'));nav.appendChild(rb);
 let rm=false;try{const v=localStorage.getItem('mc5_rm');rm=v===null?matchMedia('(prefers-reduced-motion:reduce)').matches:v==='1'}catch(e){}setRM(rm);
 /* обгортка: бічна панель + вміст */
 if(!q('.shell')){const sh=document.createElement('div');sh.className='shell';const col=document.createElement('div');col.className='col';nav.parentNode.insertBefore(sh,nav);sh.appendChild(nav);sh.appendChild(col);col.appendChild(q('main'));const f=q('footer');if(f)col.appendChild(f)}
 nav.setAttribute('aria-label','MATHCRYPT');nav.onkeydown=e=>{if(e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;const bs=[...nav.querySelectorAll('button')],i=bs.indexOf(document.activeElement);if(i<0)return;e.preventDefault();bs[(i+(e.key==='ArrowDown'?1:bs.length-1))%bs.length].focus()};
 const cnt=q('.counter');if(cnt)cnt.textContent=String(qa('#tabs button[data-t]').length)};
})();
/* ===== безпечний SVG: білий список елементів і атрибутів (імпортовані файли — недовірені дані) ===== */
(()=>{const OKT=new Set(['svg','g','defs','path','line','rect','circle','ellipse','polygon','polyline','text','tspan','title','desc','lineargradient','radialgradient','stop','clippath','marker','style_']);
const BADV=/javascript:|data:|vbscript:|&#|expression\(|@import/i;
function clean(src,dst,doc){for(const a of Array.from(src.attributes)){const n=a.name,v=a.value;if(!/^[a-zA-Z_][-a-zA-Z0-9_:.]*$/.test(n)||/^on/i.test(n))continue;if(/^(xlink:)?href$/i.test(n)){if(!/^#[-\w.]+$/.test(v))continue}else if(BADV.test(v))continue;if(/url\(/i.test(v)&&!/^[^()]*url\(#[-\w.]+\)[^()]*$/i.test(v))continue;if(/^xmlns/i.test(n)&&n!=='xmlns')continue;try{dst.setAttribute(n,v)}catch(e){}}
 for(const c of Array.from(src.childNodes)){if(c.nodeType===3){dst.appendChild(doc.createTextNode(c.nodeValue))}else if(c.nodeType===1){const ln=c.localName.toLowerCase();if(ln==='a'){clean(c,dst,doc);continue}if(!OKT.has(ln))continue;const e=doc.createElementNS('http://www.w3.org/2000/svg',c.localName);clean(c,e,doc);dst.appendChild(e)}}}
M5.safeSvg=s=>{try{if(typeof s!=='string'||s.length>3e6||!/^\s*<svg[\s>]/.test(s))return'';const d=new DOMParser().parseFromString(s,'image/svg+xml');const r=d.documentElement;if(!r||r.localName!=='svg'||d.getElementsByTagName('parsererror').length)return'';const out=document.implementation.createDocument('http://www.w3.org/2000/svg','svg',null),root=out.documentElement;clean(r,root,out);return new XMLSerializer().serializeToString(root)}catch(e){return''}};
})();
