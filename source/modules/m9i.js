/* ===== MATHCRYPT 6.0 / Stage 3d: пакет відтворюваності (експорт, імпорт, повторний запуск) ===== */
(()=>{'use strict';
const M5=window.M5,{q,qa,T,esc,put,say,html}=M5;
const Ls=o=>M5.lang()==='en'?o.en:o.ua;
const enc=s=>new TextEncoder().encode(s),dec=b=>new TextDecoder('utf-8',{fatal:false}).decode(b);
const sha=x=>M5.sha.hex(M5.sha.sha256(typeof x==='string'?enc(x):x));
const MAXB=30*1024*1024,MAXFILES=200;
/* ---- CRC-32 і ZIP (метод 0 — без стиснення) ---- */
const CT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc32=b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CT[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
const safeName=n=>typeof n==='string'&&n.length>0&&n.length<200&&!/^[\/\\]|\.\.|[\\:\0]/.test(n);
const zip={
 build(files){const parts=[],cd=[];let off=0;const now=new Date(),dt=((now.getFullYear()-1980)<<9|(now.getMonth()+1)<<5|now.getDate())&0xFFFF,tm=(now.getHours()<<11|now.getMinutes()<<5|(now.getSeconds()>>1))&0xFFFF;
  for(const f of files){if(!safeName(f.name))throw Error('bad name '+f.name);const nm=enc(f.name),d=f.data,crc=crc32(d);
   const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint16(10,tm,true);h.setUint16(12,dt,true);h.setUint32(14,crc,true);h.setUint32(18,d.length,true);h.setUint32(22,d.length,true);h.setUint16(26,nm.length,true);h.setUint16(28,0,true);
   parts.push(new Uint8Array(h.buffer),nm,d);
   const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(10,0,true);c.setUint16(12,tm,true);c.setUint16(14,dt,true);c.setUint32(16,crc,true);c.setUint32(20,d.length,true);c.setUint32(24,d.length,true);c.setUint16(28,nm.length,true);c.setUint32(42,off,true);
   cd.push(new Uint8Array(c.buffer),nm);off+=30+nm.length+d.length}
  const cdl=cd.reduce((s,x)=>s+x.length,0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cdl,true);e.setUint32(16,off,true);
  const all=parts.concat(cd,[new Uint8Array(e.buffer)]),tot=all.reduce((s,x)=>s+x.length,0),out=new Uint8Array(tot);let p=0;all.forEach(x=>{out.set(x,p);p+=x.length});return out},
 parse(b){if(!(b instanceof Uint8Array)||b.length<22)throw Error('zip: too short');if(b.length>MAXB)throw Error('zip: too large');const dv=new DataView(b.buffer,b.byteOffset,b.length);
  let e=-1;for(let i=b.length-22;i>=Math.max(0,b.length-22-65535);i--)if(dv.getUint32(i,true)===0x06054b50){e=i;break}if(e<0)throw Error('zip: no end record');
  const n=dv.getUint16(e+10,true),cdo=dv.getUint32(e+16,true);if(n>MAXFILES)throw Error('zip: too many entries');const out=[];let p=cdo,total=0;
  for(let i=0;i<n;i++){if(p+46>b.length||dv.getUint32(p,true)!==0x02014b50)throw Error('zip: bad central directory');const meth=dv.getUint16(p+10,true),crc=dv.getUint32(p+16,true),cs=dv.getUint32(p+20,true),us=dv.getUint32(p+24,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true);
   if(p+46+nl>b.length)throw Error('zip: truncated');const name=dec(b.subarray(p+46,p+46+nl));if(!safeName(name))throw Error('zip: unsafe file name');if(meth!==0)throw Error('zip: only uncompressed (stored) archives are supported — import package.json instead');if(cs!==us)throw Error('zip: size mismatch');
   if(lo+30>b.length||dv.getUint32(lo,true)!==0x04034b50)throw Error('zip: bad local header');const ds=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true);if(ds+us>b.length)throw Error('zip: truncated data');total+=us;if(total>MAXB)throw Error('zip: too large');
   const data=b.slice(ds,ds+us);if(crc32(data)!==crc)throw Error('zip: CRC mismatch in '+name);out.push({name,data});p+=46+nl+xl+cl}return out}};
/* ---- побудова пакета ---- */
const canon=d=>JSON.stringify(d,(k,v)=>typeof v==='number'&&!isFinite(v)?null:v);
const REPRO_TXT=(m)=>`# How to reproduce / Як відтворити

Program / Програма: MATHCRYPT ${m.version}
Experiment / Експеримент: ${m.experiment} — ${m.title}
Parameters / Параметри: ${Object.entries(m.params).map(([k,v])=>k+' = '+v).join(', ')}
Seed: ${m.params.seed===undefined?'(none)':m.params.seed}
Data checksum / Контрольна сума даних (FNV-1a over JSON): ${m.dataFnv}
SHA-256 of data.json canonical text: ${m.dataSha256}

EN
1. Open MATHCRYPT (index.html) → tab "Reproducibility package" → "Import package" → choose package.json (or this ZIP).
2. The program checks the schema, parameter ranges and both checksums of the stored data.
3. Press "Re-run experiment from the package". The experiment is run again with the same parameters and seed; the new checksum must equal ${m.dataFnv}.
4. Results are expected to be identical for the same MATHCRYPT version because every random source is a seeded deterministic generator (mulberry32). A different program version may legitimately give different numbers; the package records the version for that reason.
5. Independent check: checksums.sha256 lists SHA-256 of every file (sha256sum -c checksums.sha256).

UA
1. Відкрийте MATHCRYPT (index.html) → вкладка «Пакет відтворюваності» → «Імпорт пакета» → оберіть package.json (або цей ZIP).
2. Програма перевіряє схему, межі параметрів і обидві контрольні суми збережених даних.
3. Натисніть «Повторно виконати експеримент із пакета»: той самий експеримент запускається з тими самими параметрами та seed; нова контрольна сума має дорівнювати ${m.dataFnv}.
4. Для тієї самої версії програми результати мають збігатися, бо всі випадкові величини — детермінований генератор із seed (mulberry32). Інша версія може давати інші числа; тому версію записано в пакет.
5. Незалежна перевірка: checksums.sha256 містить SHA-256 кожного файла (sha256sum -c checksums.sha256).
`;
function build(res,params,conf,pr,extra){const E=M5.EXPS[res.id];if(!E)throw Error('unknown experiment');if(res.stopped)throw Error(T('Експеримент було зупинено — пакет повного дослідження не створюється.','The experiment was stopped — a complete package is not created.'));
 const dataText=canon(res.data),ver=M5.ver;
 const man={kind:'mathcrypt-repro-package',schema:1,program:'MATHCRYPT',version:ver,created:new Date().toISOString(),experiment:res.id,title:Ls(E.name),params:Object.assign({},params),confidence:conf,seed:params.seed===undefined?null:params.seed,completed:res.done,elapsedMs:res.ms,executedIn:res.mode,dataFnv:M5.digestOf(res),dataSha256:sha(dataText),summary:pr.summary===undefined?null:pr.summary,methodology:Ls(E.meth),statistics:pr.text,notes:extra||''};
 const csv=M5.csv(pr.csv);const files={'package.json':JSON.stringify(Object.assign({},man,{data:res.data}),(k,v)=>typeof v==='number'&&!isFinite(v)?null:v,1),'data.json':dataText,'data.csv':csv,'results.txt':pr.text,'methodology.md':'# '+man.title+'\n\n'+man.methodology+'\n\nMATHCRYPT '+ver+'\n','REPRODUCE.md':REPRO_TXT(man)};
 (pr.charts||[]).forEach((c,i)=>{if(c&&/^\s*<svg/.test(c))files['charts/chart'+(i+1)+'.svg']=c});
 files['checksums.sha256']=Object.keys(files).sort().map(n=>sha(files[n])+'  '+n).join('\n')+'\n';
 return{manifest:man,files}}
/* ---- перевірка імпорту ---- */
const BADKEY=/^(__proto__|constructor|prototype)$/;
function scan(o,d){if(d>12)return false;if(Array.isArray(o)){for(let i=0;i<o.length;i++)if(o[i]&&typeof o[i]==='object'&&!scan(o[i],d+1))return false;return true}if(o&&typeof o==='object'){for(const k of Object.keys(o)){if(BADKEY.test(k))return false;if(o[k]&&typeof o[k]==='object'&&!scan(o[k],d+1))return false}}return true}
function validate(o){const err=[];if(!o||typeof o!=='object'||Array.isArray(o))return{ok:false,errors:['not an object']};if(!scan(o,0))return{ok:false,errors:['forbidden key (__proto__/constructor/prototype) or nesting too deep']};
 if(o.kind!=='mathcrypt-repro-package')err.push('kind');if(o.schema!==1)err.push('schema');const E=typeof o.experiment==='string'&&Object.prototype.hasOwnProperty.call(M5.EXPS,o.experiment)?M5.EXPS[o.experiment]:null;if(!E)err.push('experiment');
 if(!o.params||typeof o.params!=='object'||Array.isArray(o.params))err.push('params');else if(E){const keys=E.params.map(p=>p[0]),own=Object.keys(o.params);if(own.length!==keys.length||own.some(k=>!keys.includes(k)))err.push('params: keys');E.params.forEach(p=>{const v=o.params[p[0]];if(typeof v!=='number'||!Number.isInteger(v)||v<p[3]||v>p[4])err.push('param '+p[0]+': integer in ['+p[3]+', '+p[4]+']')})}
 if(typeof o.dataFnv!=='string'||!/^[0-9a-f]{8}$/.test(o.dataFnv))err.push('dataFnv');if(typeof o.dataSha256!=='string'||!/^[0-9a-f]{64}$/.test(o.dataSha256))err.push('dataSha256');if(typeof o.version!=='string'||o.version.length>40)err.push('version');
 if(!('data' in o)||o.data===null||typeof o.data!=='object')err.push('data');
 const checks={};if(!err.length){const txt=canon(o.data);checks.sha=sha(txt)===o.dataSha256;checks.fnv=M5.fnv(JSON.stringify(o.data))===o.dataFnv;if(!checks.sha)err.push('SHA-256 mismatch (data were modified)');if(!checks.fnv)err.push('FNV checksum mismatch')}
 return{ok:!err.length,errors:err,checks,E}}
function fromBytes(bytes,name){if(bytes.length>MAXB)throw Error(T('Файл завеликий (>30 МБ).','File too large (>30 MB).'));let json;
 if(bytes[0]===0x50&&bytes[1]===0x4b){const ents=zip.parse(bytes),pj=ents.find(e=>e.name==='package.json');if(!pj)throw Error('package.json not found in ZIP');const cs=ents.find(e=>e.name==='checksums.sha256');let sumOk=null;if(cs){const lines=dec(cs.data).split('\n').filter(Boolean);sumOk=lines.every(l=>{const m=/^([0-9a-f]{64})  (.+)$/.exec(l);if(!m)return false;const f=ents.find(e=>e.name===m[2]);return !!f&&sha(f.data)===m[1]});}
  json=dec(pj.data);const o=JSON.parse(json);return{obj:o,zipSums:sumOk}}
 json=dec(bytes);return{obj:JSON.parse(json),zipSums:null}}
M5.repro={build,validate,fromBytes,zip,crc32,sha,canon};
/* ---- інтерфейс ---- */
const RH=`<h2>⟦Пакет відтворюваності|Reproducibility package⟧</h2>
<p class="lead">⟦Експорт повного дослідницького пакета (ZIP): вихідні дані (JSON, CSV), параметри, seed, версія програми, методологія, графіки (SVG), статистичні результати, контрольні суми SHA-256 та інструкція. Пакет можна імпортувати й повторно виконати експеримент — програма порівняє контрольні суми. Для тієї самої версії результати мають збігатися; для іншої — можуть відрізнятися (це не помилка).|Export of a complete research package (ZIP): source data (JSON, CSV), parameters, seed, program version, methodology, charts (SVG), statistical results, SHA-256 checksums and instructions. The package can be imported and the experiment re-run — the program compares the checksums. For the same version results must match; another version may differ (this is not an error).⟧</p>
<h3>⟦1. Експорт|1. Export⟧</h3>
<div class="row"><label>⟦Експеримент|Experiment⟧<select id="rpsel"></select></label><span id="rppar"></span></div>
<div class="row"><button class="b m" id="rprun">⟦Виконати та сформувати пакет|Run and build the package⟧</button><button class="b" id="rplast">⟦Використати останній запуск зі вкладки «Автоматичні експерименти»|Use the last run from the “Automated Experiments” tab⟧</button><button class="b" id="rpstop" disabled>⟦Зупинити|Stop⟧</button><progress id="rpprog" value="0" max="1"></progress></div>
<div class="row"><button class="b m" id="rpzip" disabled>ZIP</button><button class="b" id="rpjson" disabled>package.json</button></div>
<div id="rzerr" class="note" role="status" aria-live="polite"></div><div id="rpout" class="wide"></div>
<h3>⟦2. Імпорт і повторний запуск|2. Import and re-run⟧</h3>
<div class="row"><button class="b" id="rpimp">⟦Імпорт пакета (.zip / .json)|Import a package (.zip / .json)⟧</button><input type="file" id="rpfile" accept=".zip,.json,application/json" hidden><button class="b m" id="rpre" disabled>⟦Повторно виконати експеримент із пакета|Re-run the experiment from the package⟧</button></div>
<div id="rzerr2" class="note" role="status" aria-live="polite"></div><div id="rpout2" class="wide"></div>
<p class="mut">⟦Безпека імпорту: файл лише читається як дані (без виконання коду); розмір ≤ 30 МБ; перевіряються схема, межі параметрів і контрольні суми; SVG із пакета не вставляється на сторінку.|Import safety: the file is read as data only (no code executed); size ≤ 30 MB; schema, parameter ranges and checksums are verified; SVG from a package is never inserted into the page.⟧</p>`;
const RS={pkg:null,imp:null,ref:null};
function rpFields(){const id=q('#rpsel').value,E=M5.EXPS[id];q('#rppar').innerHTML=E.params.map(p=>'<label>'+esc(p[1].split('|')[M5.lang()==='en'?1:0])+'<input class="s" data-k="'+p[0]+'" value="'+(p[0]==='trials'?Math.min(p[2],1000):p[2])+'" style="width:110px"></label>').join(' ')}
function rpParams(){const E=M5.EXPS[q('#rpsel').value],p={};E.params.forEach(f=>{const v=Number(q('#rppar [data-k="'+f[0]+'"]').value);if(!Number.isInteger(v)||v<f[3]||v>f[4])throw Error(f[1].split('|')[M5.lang()==='en'?1:0]+': '+f[3]+'…'+f[4]);p[f[0]]=v});return p}
function showPkg(pk){RS.pkg=pk;const m=pk.manifest;q('#rpzip').disabled=false;q('#rpjson').disabled=false;
 html('rpout','<div class="kpis"><div class="kpi"><b>'+esc(m.dataFnv)+'</b>FNV-1a</div><div class="kpi"><b>'+esc(m.dataSha256.slice(0,16))+'…</b>SHA-256</div><div class="kpi"><b>'+esc(String(m.seed))+'</b>seed</div><div class="kpi"><b>MATHCRYPT '+esc(m.version)+'</b>'+esc(T('версія','version'))+'</div></div><table class="rt"><thead><tr><th>'+esc(T('Файл','File'))+'</th><th>'+esc(T('Розмір, байт','Size, bytes'))+'</th><th>SHA-256</th></tr></thead><tbody>'+Object.keys(pk.files).sort().map(n=>'<tr><td>'+esc(n)+'</td><td>'+enc(pk.files[n]).length+'</td><td><code>'+esc(sha(pk.files[n]).slice(0,16))+'…</code></td></tr>').join('')+'</tbody></table>')}
function zipOf(pk){return zip.build(Object.keys(pk.files).sort().map(n=>({name:n,data:enc(pk.files[n])})))}
async function rpRun(){try{say('rzerr','');const id=q('#rpsel').value,params=rpParams(),E=M5.EXPS[id];q('#rprun').disabled=true;q('#rpstop').disabled=false;RS.ref={stop:false};
 const res=await M5.runExperiment(id,params,m=>{q('#rpprog').max=m.total;q('#rpprog').value=m.done},RS.ref);const pr=E.present(res,params,.95);showPkg(build(res,params,.95,pr));say('rzerr',T('Пакет сформовано.','Package built.'),true)}catch(e){say('rzerr',e.message)}q('#rprun').disabled=false;q('#rpstop').disabled=true}
function rpLast(){try{const X=M5.XS;if(!X||!X.res)throw Error(T('У вкладці «Автоматичні експерименти» ще немає результату.','There is no result in the “Automated Experiments” tab yet.'));showPkg(build(X.res,X.params,X.conf||.95,X.pr||M5.EXPS[X.res.id].present(X.res,X.params,X.conf||.95)));say('rzerr',T('Пакет сформовано з останнього запуску.','Package built from the last run.'),true)}catch(e){say('rzerr',e.message)}}
async function rpImport(f){try{say('rzerr2','');html('rpout2','');q('#rpre').disabled=true;RS.imp=null;if(!f)return;if(f.size>MAXB)throw Error(T('Файл завеликий (>30 МБ).','File too large (>30 MB).'));
 const {obj,zipSums}=fromBytes(new Uint8Array(await f.arrayBuffer()),f.name),v=validate(obj);
 const rows=[[T('Схема, експеримент, межі параметрів','Schema, experiment, parameter ranges'),v.ok||!/kind|schema|experiment|param/.test(v.errors.join())],[T('SHA-256 даних','Data SHA-256'),v.checks&&v.checks.sha===true],[T('FNV-1a даних','Data FNV-1a'),v.checks&&v.checks.fnv===true]];if(zipSums!==null)rows.push([T('checksums.sha256 для всіх файлів ZIP','checksums.sha256 for all ZIP files'),zipSums]);
 html('rpout2','<table class="rt"><tbody>'+rows.map(r=>'<tr><td>'+esc(r[0])+'</td><td>'+(r[1]?'✓':'✗')+'</td></tr>').join('')+'</tbody></table>'+(v.ok?'<pre>'+esc(JSON.stringify({experiment:obj.experiment,params:obj.params,version:obj.version,created:String(obj.created||'').slice(0,40),dataFnv:obj.dataFnv},null,1))+'</pre>':'<p>'+esc(v.errors.join('; '))+'</p>'));
 if(!v.ok)throw Error(T('Пакет не пройшов перевірку: ','The package failed validation: ')+v.errors.join('; '));RS.imp=obj;q('#rpre').disabled=false;say('rzerr2',T('Пакет коректний. Можна повторно виконати експеримент.','The package is valid. You can re-run the experiment.'),true)}catch(e){say('rzerr2',e.message)}}
async function rpRe(){try{const o=RS.imp;if(!o)return;q('#rpre').disabled=true;say('rzerr2',T('Виконується…','Running…'),true);const E=M5.EXPS[o.experiment];RS.ref={stop:false};const res=await M5.runExperiment(o.experiment,o.params,()=>{},RS.ref),dg=M5.digestOf(res),same=dg===o.dataFnv&&sha(canon(res.data))===o.dataSha256;
 const pr=E.present(res,o.params,o.confidence||.95);html('rpout2',q('#rpout2').innerHTML+'<h4>'+esc(T('Результат повторного запуску','Re-run result'))+'</h4><div class="kpis"><div class="kpi"><b>'+esc(dg)+'</b>'+esc(T('нова контрольна сума','new checksum'))+'</div><div class="kpi"><b>'+esc(o.dataFnv)+'</b>'+esc(T('у пакеті','in the package'))+'</div><div class="kpi"><b>'+(same?'✓':'✗')+'</b>'+esc(same?T('ІДЕНТИЧНО','IDENTICAL'):T('ВІДРІЗНЯЄТЬСЯ','DIFFERENT'))+'</div></div><pre>'+esc(pr.text)+'</pre>');
 say('rzerr2',same?T('Результати повністю збігаються з пакетом ✓','The results fully match the package ✓'):T('Результати відрізняються від пакета'+(o.version!==M5.ver?' (версія пакета '+o.version+', поточна '+M5.ver+' — розбіжність може бути очікуваною)':' — перевірте параметри та версію'),'The results differ from the package'+(o.version!==M5.ver?' (package version '+o.version+', current '+M5.ver+' — a difference may be expected)':' — check parameters and version')),same)}catch(e){say('rzerr2',e.message)}q('#rpre').disabled=false}
M5.addTab('repro','Пакет відтворюваності','Reproducibility package',RH,()=>{const sel=q('#rpsel');sel.innerHTML=Object.keys(M5.EXPS).map(k=>'<option value="'+k+'">'+esc(Ls(M5.EXPS[k].name))+'</option>').join('');sel.onchange=rpFields;rpFields();
 q('#rprun').onclick=rpRun;q('#rplast').onclick=rpLast;q('#rpstop').onclick=()=>{if(RS.ref){RS.ref.stop=true;if(RS.ref.sendStop)RS.ref.sendStop()}};
 q('#rpzip').onclick=()=>{if(RS.pkg)M5.dl('mathcrypt_repro_'+RS.pkg.manifest.experiment+(RS.pkg.manifest.seed===null?'':'_seed'+RS.pkg.manifest.seed)+'.zip',zipOf(RS.pkg),'application/zip')};q('#rpjson').onclick=()=>{if(RS.pkg)M5.dl('package.json',RS.pkg.files['package.json'],'application/json')};
 q('#rpimp').onclick=()=>q('#rpfile').click();q('#rpfile').onchange=e=>{rpImport(e.target.files[0]);e.target.value=''};q('#rpre').onclick=rpRe;
 document.addEventListener('mc5:lang',()=>{const c=sel.value;sel.innerHTML=Object.keys(M5.EXPS).map(k=>'<option value="'+k+'">'+esc(Ls(M5.EXPS[k].name))+'</option>').join('');sel.value=c;rpFields()})});
M5.repro.zipOf=zipOf;
/* ---- тести ---- */
const tt=M5.tt,R=M5.repro;
const small=async(seed)=>{const p={trials:300,R:1000,seed:seed===undefined?7:seed},res=await M5.runExperiment('B',p),E=M5.EXPS.B;return{p,res,pr:E.present(res,p,.95)}};
tt('Відтворюваність: CRC-32 контрольний вектор "123456789" = CBF43926; ZIP — круговий тест (UTF-8 імена, порожній і двійковий файл)',()=>{const bin=new Uint8Array(300).map((_,i)=>(i*37)&255),z=R.zip.build([{name:'а/файл.txt',data:enc('Привіт ∑')},{name:'empty',data:new Uint8Array(0)},{name:'bin.dat',data:bin}]),b=R.zip.parse(z);return[[R.crc32(enc('123456789')).toString(16),b.length,dec(b[0].data),b[1].data.length,b[2].data.every((v,i)=>v===bin[i]),b[0].name].join('|'),'cbf43926|3|Привіт ∑|0|true|а/файл.txt']});
tt('Відтворюваність: ZIP-парсер відхиляє пошкоджені архіви (CRC, шляхи ..), стиснення deflate і обрізані дані',()=>{const z=R.zip.build([{name:'a.txt',data:enc('hello world')}]);const bad=z.slice();bad[30+5+2]^=0xFF;const tr=z.slice(0,z.length-30);const defl=z.slice();new DataView(defl.buffer).setUint16(z.length-22-46+10,8,true);let r=[];for(const x of[bad,tr,defl]){try{R.zip.parse(x);r.push('ok')}catch(e){r.push('err')}}let nm='ok';try{R.zip.build([{name:'../x',data:enc('a')}])}catch(e){nm='err'}return[r.join()+'|'+nm,'err,err,err|err']});
tt('Відтворюваність: пакет (експеримент B, seed 7) проходить перевірку; checksums.sha256 збігається з вмістом файлів; обов’язкові файли присутні',async()=>{const{p,res,pr}=await small(),pk=R.build(res,p,.95,pr),v=R.validate(JSON.parse(pk.files['package.json']));const sums=pk.files['checksums.sha256'].trim().split('\n').every(l=>{const m=/^([0-9a-f]{64})  (.+)$/.exec(l);return m&&sha(pk.files[m[2]])===m[1]});const need=['package.json','data.json','data.csv','results.txt','methodology.md','REPRODUCE.md'].every(n=>n in pk.files);return[[v.ok,sums,need,pk.manifest.seed,pk.manifest.version===M5.ver].join(),'true,true,true,7,true']});
tt('Відтворюваність: повторний запуск з імпортованого пакета дає ту саму контрольну суму; інший seed — іншу',async()=>{const{p,res,pr}=await small(7),pk=R.build(res,p,.95,pr),o=JSON.parse(pk.files['package.json']),again=await M5.runExperiment(o.experiment,o.params),other=await small(8);return[[M5.digestOf(again)===o.dataFnv,sha(R.canon(again.data))===o.dataSha256,M5.digestOf(other.res)!==o.dataFnv].join(),'true,true,true']});
tt('Відтворюваність: валідатор відхиляє змінені дані, невідомий експеримент, параметри поза межами, зайві ключі, __proto__, неправильний тип',async()=>{const{p,res,pr}=await small(),pk=R.build(res,p,.95,pr),base=()=>JSON.parse(pk.files['package.json']);const m=[];const t1=base();t1.data.hist=[1,2,3];m.push(R.validate(t1).ok);const t2=base();t2.experiment='ZZ';m.push(R.validate(t2).ok);const t3=base();t3.params.trials=0;m.push(R.validate(t3).ok);const t4=base();t4.params.extra=1;m.push(R.validate(t4).ok);const t5=JSON.parse(pk.files['package.json'].replace('"params": {','"params": {"__proto__": 1,'));m.push(R.validate(t5).ok);const t6=base();t6.kind='x';m.push(R.validate(t6).ok);const t7=base();t7.params.trials=1.5;m.push(R.validate(t7).ok);m.push(R.validate([]).ok,R.validate(null).ok);return[m.join()+'|'+R.validate(base()).ok,'false,false,false,false,false,false,false,false,false|true']});
tt('Відтворюваність: імпорт ZIP — читає package.json і перевіряє checksums.sha256; змінений файл у ZIP виявляється',async()=>{const{p,res,pr}=await small(),pk=R.build(res,p,.95,pr),z=R.zipOf(pk),a=R.fromBytes(z),files=Object.keys(pk.files).sort().map(n=>({name:n,data:enc(pk.files[n])}));const idx=files.findIndex(f=>f.name==='results.txt');files[idx]={name:'results.txt',data:enc('змінено')};const b=R.fromBytes(R.zip.build(files));return[[a.zipSums,b.zipSums,R.validate(a.obj).ok].join(),'true,false,true']});

tt('Безпека: SVG-санітайзер видаляє обробники подій, скрипти, foreignObject, javascript:-посилання й зовнішні url(), зберігаючи фігури й текст',()=>{const evil='<svg xmlns="http://www.w3.org/2000/svg" onload="x()" width="10"><animate onbegin="x()" attributeName="x"/><script>x()</scr'+'ipt><foreignObject><div>h</div></foreignObject><a href="javascript:x()"><text onclick="x()" fill="url(http://e.com/a)" style="fill:red">T</text></a><rect width="5" height="5" fill="url(#g)"/><use href="http://e.com/x.svg#a"/></svg>';const o=M5.safeSvg(evil);const bad=/onload|onbegin|onclick|<script|foreignObject|javascript:|http:\/\/e\.com|<animate|<use|<div/i.test(o.replace('http://www.w3.org/2000/svg',''));return[[bad,/<rect/.test(o),/<text/.test(o),/>T</.test(o),/url\(#g\)/.test(o),M5.safeSvg('<div>x</div>'),M5.safeSvg('<svg><</svg>'),M5.safeSvg(5)].join('|'),'false|true|true|true|true|||']});
tt('Безпека: SVG-санітайзер не псує реальні графіки платформи (кількість елементів збережено)',()=>{const svg=M5.plot.histo([1,2,2,3,3,3,4,4,5,9],5,{title:'h'}).svg,o=M5.safeSvg(svg),cnt=(t,x)=>(x.match(new RegExp('<'+t+'[\\s>/]','g'))||[]).length;return[['rect','text','line'].map(t=>cnt(t,svg)>2&&cnt(t,svg)===cnt(t,o)).join(),'true,true,true']});
tt('Захист ресурсів: LLL і рівняння Пелля мають часовий бюджет і завершуються повідомленням, а не зависанням',()=>{let r='';try{M5.lll([[1n,2n,3n],[4n,5n,7n],[7n,8n,10n]],[3n,4n],-1);r='no'}catch(e){r='err'}const p=M5.pellSolve(999999999989n,1e9,-1);return[r+'|'+(p.error||'ok'),'err|iter']});
})();
