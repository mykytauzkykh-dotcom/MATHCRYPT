/* ===== MATHCRYPT 6.0: DOI наукового програмного забезпечення (Zenodo), DOI-бейдж, вкладка «Про програму», «Cite this software» ===== */
(()=>{'use strict';
const M5=window.M5;const{q,qa,T,esc,I}=M5;

/* Єдине джерело метаданних публікації. Щоб змінити автора/назву — правте лише цей об’єкт
   (і CITATION.cff / README у корені проєкту). */
const ZEN=Object.freeze({
 title:'MATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography',
 authors:Object.freeze([Object.freeze({family:'Uzkykh',given:'Mykyta',orcid:''})]), // ORCID — необов’язкове поле; показується лише якщо заповнене
 version:'6.0.0',
 year:'2026',
 publisher:'Zenodo',
 type:'Software',
 doi:'10.5281/zenodo.24540765',
 url:'https://doi.org/10.5281/zenodo.24540765',
 record:'24540765',
 platform:'https://quiet-haupia-3167e1.netlify.app',
 kind:'DOI наукового програмного забезпечення',
 kindEn:'DOI of the scientific software',
 date:''              // дата публікації — необов’язкове поле; показується лише якщо заповнене
});
M5.ZENODO=ZEN;
/* Ліцензії: код — MIT, оригінальна документація — CC BY 4.0; сторонні компоненти — власні ліцензії (THIRD_PARTY_NOTICES.md) */
const LIC=Object.freeze({holder:'Mykyta Uzkykh',year:'2026',code:'MIT',codeUrl:'https://opensource.org/license/mit',docs:'CC BY 4.0',docsUrl:'https://creativecommons.org/licenses/by/4.0/',
 mitText:'MIT License\n\nCopyright (c) 2026 Mykyta Uzkykh\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n'});
M5.LICENSES=LIC;

/* ---------- бібліографічні формати ---------- */
const initials=g=>String(g).split(/[\s-]+/).filter(Boolean).map(x=>x[0].toUpperCase()+'.').join(' ');
function apa(){const a=ZEN.authors.map(p=>p.family+', '+initials(p.given));
 const au=a.length<2?a.join(''):a.length===2?a.join(', & '):a.slice(0,-1).join(', ')+', & '+a[a.length-1];
 return au+' ('+ZEN.year+'). '+ZEN.title+' (Version '+ZEN.version+') [Computer software]. '+ZEN.publisher+'. '+ZEN.url}
function ieee(){const a=ZEN.authors.map(p=>initials(p.given)+' '+p.family);
 const au=a.length<3?a.join(' and '):a.slice(0,-1).join(', ')+', and '+a[a.length-1];
 return au+', “'+ZEN.title+',” version '+ZEN.version+', '+ZEN.publisher+', '+ZEN.year+'. doi: '+ZEN.doi+'.'}
const bibEsc=s=>String(s).replace(/[\\&%$#_{}]/g,c=>c==='\\'?'\\textbackslash{}':'\\'+c);
function bibtex(){const key=(ZEN.authors[0].family.toLowerCase().replace(/[^a-z]/g,'')||'mathcrypt')+'_'+ZEN.year+'_'+ZEN.record;
 return'@software{'+key+',\n'+
 '  author    = {'+ZEN.authors.map(p=>bibEsc(p.family)+', '+bibEsc(p.given)).join(' and ')+'},\n'+
 '  title     = {{'+bibEsc(ZEN.title)+'}},\n'+
 '  year      = {'+ZEN.year+'},\n'+
 '  publisher = {'+ZEN.publisher+'},\n'+
 '  version   = {'+ZEN.version+'},\n'+
 '  doi       = {'+ZEN.doi+'},\n'+
 '  url       = {'+ZEN.url+'}\n}\n'}
M5.cite={apa,ieee,bibtex};
const FMT=[['apa','APA (7th ed.)',apa],['ieee','IEEE',ieee],['bibtex','BibTeX',bibtex]];

/* ---------- копіювання з запасним варіантом для file:// та старих браузерів ---------- */
function fallbackCopy(text){const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;top:0;left:0;opacity:0;pointer-events:none';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}ta.remove();return ok}
async function copyText(text){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true}}catch(e){}return fallbackCopy(text)}
M5.copyText=copyText;

/* ---------- бейдж і кнопка ---------- */
const badge=()=>'<a class="doibadge" href="'+ZEN.url+'" target="_blank" rel="noopener noreferrer" title="'+esc(T(ZEN.kind+' (Zenodo)',ZEN.kindEn+' (Zenodo)'))+'" aria-label="DOI '+ZEN.doi+'"><span class="dbl">DOI</span><span class="dbr">'+ZEN.doi+'</span></a>';
const citeBtn=()=>'<button class="b m citebtn" type="button" data-cite="1" aria-haspopup="dialog">Cite this software</button>';
M5.doiBadge=badge;

/* ---------- діалог цитування ---------- */
function openCite(){let d=q('#citedlg');
 if(!d){d=document.createElement('div');d.id='citedlg';
  d.innerHTML=I('<div class="dlg" role="dialog" aria-modal="true" aria-labelledby="cdt"><h2 id="cdt">Cite this software</h2>'+
  '<p class="mut">⟦Бібліографічне посилання на MATHCRYPT 6.0 (Zenodo). Оберіть формат і натисніть «Копіювати».|Bibliographic reference to MATHCRYPT 6.0 (Zenodo). Choose a format and press “Copy”.⟧</p>'+
  '<div class="cdbadge"></div>'+
  FMT.map(f=>'<div class="cfmt"><div class="cfh"><b>'+f[1]+'</b><button class="b sm m" type="button" data-cc="'+f[0]+'">⟦Копіювати|Copy⟧</button></div><pre class="cpre" id="cp_'+f[0]+'" tabindex="0"></pre></div>').join('')+
  '<div class="row"><button class="b" type="button" id="cdbib">⟦Завантажити .bib|Download .bib⟧</button><a class="b" id="cdopen" target="_blank" rel="noopener noreferrer">⟦Відкрити на Zenodo|Open on Zenodo⟧</a><button class="b" type="button" id="cdx">⟦Закрити|Close⟧</button></div>'+
  '<div class="err" id="cderr" role="status"></div></div>');
  document.body.appendChild(d);
  d.addEventListener('click',async e=>{if(e.target===d){closeCite();return}const b=e.target.closest('[data-cc]');if(!b)return;const f=FMT.find(x=>x[0]===b.dataset.cc);const ok=await copyText(f[2]());
   const m=ok?T('Скопійовано: ','Copied: ')+f[1]:T('Не вдалося скопіювати автоматично — виділіть текст і натисніть Ctrl+C.','Could not copy automatically — select the text and press Ctrl+C.');q('#cderr').textContent=m;if(ok)M5.toast(m);else{const r=document.createRange();r.selectNodeContents(q('#cp_'+f[0]));const s=getSelection();s.removeAllRanges();s.addRange(r)}});
  q('#cdx').onclick=closeCite;q('#cdbib').onclick=()=>M5.dl('mathcrypt_zenodo_'+ZEN.record+'.bib',bibtex(),'application/x-bibtex;charset=utf-8');
  d.addEventListener('keydown',e=>{if(e.key==='Escape')closeCite();if(e.key==='Tab'){const f=[...d.querySelectorAll('button,a[href],pre[tabindex]')];if(!f.length)return;const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}})}
 FMT.forEach(f=>{q('#cp_'+f[0]).textContent=f[2]()});d.querySelector('.cdbadge').innerHTML=badge();q('#cdopen').href=ZEN.url;q('#cderr').textContent='';
 M5.walk(d);d._ret=document.activeElement;d.classList.add('on');d.querySelector('[data-cc]').focus()}
function closeCite(){const d=q('#citedlg');if(!d)return;d.classList.remove('on');const r=d._ret;if(r&&r.focus&&document.contains(r))r.focus()}
M5.openCite=openCite;M5.closeCite=closeCite;
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-cite]');if(b){e.preventDefault();openCite()}});

/* ---------- блок публікації (повторно використовується) ---------- */
const pubBlock=(id,heading)=>'<div class="zpub" id="'+id+'">'+(heading?'<h3>⟦MATHCRYPT 6.0 на Zenodo|MATHCRYPT 6.0 on Zenodo⟧</h3>':'')+
 '<div class="zrow">'+badge()+citeBtn()+'</div>'+
 '<p class="ztitle">'+esc(ZEN.title)+'</p>'+'<p class="zmeta"><span>⟦DOI наукового програмного забезпечення|DOI of the scientific software⟧</span>: <a href="'+ZEN.url+'" target="_blank" rel="noopener noreferrer">'+ZEN.doi+'</a><br><span>⟦Адреса DOI|DOI URL⟧</span>: <a href="'+ZEN.url+'" target="_blank" rel="noopener noreferrer">'+ZEN.url+'</a><br><span>⟦Онлайн-платформа|Online platform⟧</span>: <a href="'+ZEN.platform+'" target="_blank" rel="noopener noreferrer">'+ZEN.platform+'</a></p>'+'</div>';

/* 1) головна сторінка: шапка (видно на всіх вкладках) */
{const h=q('header');if(h){const r=document.createElement('div');r.className='zhead';r.innerHTML=badge()+citeBtn();h.appendChild(r)}}

/* 2) панель (стартова вкладка) — додаємо після завершення ініціалізації всіх модулів */
{const s=q('#t-dash');if(s){const w=document.createElement('div');w.innerHTML=I(pubBlock('zdash',true));const h2=s.querySelector('h2');(h2&&h2.nextElementSibling?h2.nextElementSibling:h2).after(w.firstChild)}}

/* 3) Центр публікацій */
{const s=q('#t-pub');if(s){const w=document.createElement('div');w.innerHTML=I('<div class="zpub" id="zpubc"><h2>⟦MATHCRYPT 6.0 на Zenodo|MATHCRYPT 6.0 on Zenodo⟧</h2>'+
 '<div class="zrow">'+badge()+citeBtn()+'<button class="b" type="button" id="zfill">⟦Заповнити поля програми даними Zenodo|Fill the program fields from Zenodo⟧</button></div>'+
 '<p class="ztitle">'+esc(ZEN.title)+'</p>'+'<p class="zmeta"><span>⟦DOI наукового програмного забезпечення|DOI of the scientific software⟧</span>: <a href="'+ZEN.url+'" target="_blank" rel="noopener noreferrer">'+ZEN.doi+'</a><br><span>⟦Адреса DOI|DOI URL⟧</span>: <a href="'+ZEN.url+'" target="_blank" rel="noopener noreferrer">'+ZEN.url+'</a><br><span>⟦Онлайн-платформа|Online platform⟧</span>: <a href="'+ZEN.platform+'" target="_blank" rel="noopener noreferrer">'+ZEN.platform+'</a></p>'+
 '<p class="mut">⟦Кнопка заповнює порожні поля розділу «Програма MATHCRYPT (для цитування)» і замінює колишні типові значення («MATHCRYPT», «6.0») на повну назву та версію 6.0.0; інші введені вами дані не змінюються.|The button fills empty fields of “The MATHCRYPT program (for citation)” and replaces the former defaults (“MATHCRYPT”, “6.0”) with the full title and version 6.0.0; other data you entered is not changed.⟧</p></div>');
 const lead=s.querySelector('.lead');(lead||s.querySelector('h2')).after(w.firstChild);
 q('#zfill').onclick=()=>{const v={title:ZEN.title,version:ZEN.version,authors:ZEN.authors.map(p=>p.family+', '+p.given).join('; '),year:ZEN.year,url:ZEN.url,doi:ZEN.doi};let n=0;
  const OLD={title:'MATHCRYPT',version:'6.0'}; /* колишні значення за замовчуванням — замінюються; введене користувачем — ні */
  qa('#pbsw [data-ps]').forEach(e=>{const k=e.dataset.ps,cur=e.value.trim();if(v[k]&&cur!==v[k]&&(!cur||cur===OLD[k])){e.value=v[k];e.dispatchEvent(new Event('input',{bubbles:true}));n++}});
  M5.toast(T('Заповнено полів: ','Fields filled: ')+n)}}}

/* 4) вкладка «Про програму» */
const AH=`<h2>⟦Про програму|About⟧</h2>
<p class="lead">⟦MATHCRYPT 6.0 — браузерна навчально-дослідницька платформа з теорії чисел, діофантових рівнянь і криптографії: від алгоритму Евкліда та RSA до ґраток, статистики, квантових і постквантових алгоритмів, з відтворюваними експериментами та науковими звітами. Працює без сервера: усі обчислення й дані — лише у вашому браузері.|MATHCRYPT 6.0 is a browser-based educational and research platform for number theory, Diophantine equations and cryptography: from the Euclidean algorithm and RSA to lattices, statistics, quantum and post-quantum algorithms, with reproducible experiments and scientific reports. It runs without a server: all computations and data stay in your browser.⟧</p>
<div id="zabout"></div>
<h3>⟦Відомості|Details⟧</h3><div id="zinfo"></div>
<h3>⟦Ліцензії|Licenses⟧</h3><div id="zlic"></div>
<details class="zmit"><summary>⟦Повний текст ліцензії MIT|Full text of the MIT License⟧</summary><pre id="zmittext"></pre></details>
<p class="mut">⟦Сторонні компоненти (three.js — MIT; шрифт Anton — SIL OFL 1.1) завантажуються з CDN лише за наявності інтернету, зберігають власні ліцензії й авторство та не є частиною цього коду. Повний перелік — у файлі THIRD_PARTY_NOTICES.md.|Third-party components (three.js — MIT; the Anton font — SIL OFL 1.1) are loaded from a CDN only when online, keep their own licenses and authorship and are not part of this code. Full list: THIRD_PARTY_NOTICES.md.⟧</p>
<h3>⟦Як цитувати|How to cite⟧</h3>
<p class="mut">⟦Якщо ви використовуєте MATHCRYPT у навчальній чи науковій роботі, використовуйте таке посилання:|If you use MATHCRYPT in educational or research work, please use this reference:⟧</p>
<div class="note" id="zapa"></div>
<div class="row"><button class="b m" type="button" data-cite="1" aria-haspopup="dialog">Cite this software</button><button class="b" type="button" id="zcopyapa">⟦Копіювати APA|Copy APA⟧</button></div>`;
M5.addTab('about','Про програму','About',AH,s=>{
 q('#zabout').innerHTML=I(pubBlock('zab',true));
 const info=()=>{const n=qa('#tabs button[data-t]').length||Object.keys(M5.tabs).length;q('#zinfo').innerHTML=M5.table([T('Параметр','Item'),T('Значення','Value')],[[T('Повна назва','Full title'),ZEN.title],[T('Автор','Author'),ZEN.authors.map(p=>p.family+', '+p.given).join('; ')],[T('Версія','Version'),ZEN.version],[T('Рік','Year'),ZEN.year],[T('Видавець','Publisher'),ZEN.publisher],[T('Тип ресурсу','Resource type'),ZEN.type],[T(ZEN.kind,ZEN.kindEn),ZEN.doi],[T('Онлайн-платформа','Online platform'),ZEN.platform],[T('Вкладок-інструментів','Tool tabs'),String(n)]].concat(ZEN.date?[[T('Дата публікації','Publication date'),ZEN.date]]:[],ZEN.authors[0].orcid?[['ORCID',ZEN.authors[0].orcid]]:[]));
  q('#zinfo').querySelectorAll('td').forEach(td=>{const t=td.textContent,u=t===ZEN.doi?ZEN.url:t===ZEN.platform?ZEN.platform:'';if(u){td.innerHTML='<a class="zlink" href="'+u+'" target="_blank" rel="noopener noreferrer">'+esc(t)+'</a>'}});q('#zapa').textContent=apa()};
 const lic=()=>{q('#zlic').innerHTML=M5.table([T('Матеріали','Material'),T('Ліцензія','License'),T('Правовласник','Copyright holder')],[[T('Оригінальний програмний код MATHCRYPT','Original MATHCRYPT program code'),'MIT',LIC.holder+', '+LIC.year],[T('Оригінальна наукова документація та посібник користувача','Original scientific documentation and user guide'),'CC BY 4.0',LIC.holder+', '+LIC.year],[T('Сторонні бібліотеки та шрифти','Third-party libraries and fonts'),T('власні ліцензії (див. THIRD_PARTY_NOTICES.md)','their own licenses (see THIRD_PARTY_NOTICES.md)'),T('їхні автори','their authors')]]);
  q('#zlic').querySelectorAll('td').forEach(td=>{const u=td.textContent==='MIT'?LIC.codeUrl:td.textContent==='CC BY 4.0'?LIC.docsUrl:'';if(u)td.innerHTML='<a class="zlink" href="'+u+'" target="_blank" rel="license noopener noreferrer">'+td.textContent+'</a>'})};
 q('#zmittext').textContent=LIC.mitText;lic();document.addEventListener('mc5:lang',lic);
 info();q('#zcopyapa').onclick=async()=>{const ok=await copyText(apa());M5.toast(ok?T('Скопійовано: APA','Copied: APA'):T('Не вдалося скопіювати — виділіть текст вручну.','Could not copy — select the text manually.'))};
 document.addEventListener('mc5:lang',info);document.addEventListener('mc5:tab',e=>{if(e.detail==='about')info()})});

/* 5) нижня частина сайту */
{const f=q('footer');if(f){const w=document.createElement('div');w.className='zfoot';w.innerHTML=I('<span>MATHCRYPT 6.0 ·</span> <span>⟦DOI наукового програмного забезпечення|DOI of the scientific software⟧</span><span>:</span> '+badge()+' <button class="b sm citebtn" type="button" data-cite="1" aria-haspopup="dialog">Cite this software</button> <a href="#t-about" data-zabout="1">⟦Про програму|About⟧</a>');f.appendChild(w);
 const lw=document.createElement('div');lw.className='zfoot zlicf';lw.innerHTML=I('<span>© '+LIC.year+' '+LIC.holder+'</span> · <span>⟦Код|Code⟧</span><span>:</span> <a rel="license noopener noreferrer" target="_blank" href="'+LIC.codeUrl+'">MIT</a> · <span>⟦Документація|Documentation⟧</span><span>:</span> <a rel="license noopener noreferrer" target="_blank" href="'+LIC.docsUrl+'">CC BY 4.0</a> · <span>⟦Сторонні компоненти — власні ліцензії|Third-party components — their own licenses⟧</span>');f.appendChild(lw);
 w.querySelector('[data-zabout]').onclick=e=>{e.preventDefault();M5.openTab('about');scrollTo({top:0,behavior:'smooth'})}}}

/* ---------- автотести ---------- */
const tt=M5.tt;
tt('Zenodo: точні метадані (повна назва, автор, версія 6.0.0, рік, видавець, тип, DOI, платформа), постійне формулювання «DOI наукового програмного забезпечення», ORCID і дата порожні, об’єкт заморожений',()=>{try{ZEN.doi='x'}catch(e){}const a=ZEN.authors[0];return[[ZEN.title,a.family,a.given,ZEN.version,ZEN.year,ZEN.publisher,ZEN.type,ZEN.doi,ZEN.url,ZEN.platform,ZEN.kind,ZEN.kindEn,a.orcid===''&&ZEN.date===''].join('|'),'MATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography|Uzkykh|Mykyta|6.0.0|2026|Zenodo|Software|10.5281/zenodo.24540765|https://doi.org/10.5281/zenodo.24540765|https://quiet-haupia-3167e1.netlify.app|DOI наукового програмного забезпечення|DOI of the scientific software|true']});
tt('DOI-бейдж: клікабельний, веде на doi.org, відкривається в новій вкладці (rel=noopener), є в шапці, на панелі, у Центрі публікацій, у «Про програму» та в нижній частині',()=>{const where=['header','#t-dash','#t-pub','#t-about','footer'].map(s=>{const a=q(s+' a.doibadge');return!!a&&a.getAttribute('href')===ZEN.url&&a.target==='_blank'&&/noopener/.test(a.rel)});return[where.join(),'true,true,true,true,true']});
tt('Кнопка «Cite this software» є в шапці, на панелі, у Центрі публікацій, у «Про програму» та в нижній частині',()=>[['header','#t-dash','#t-pub','#t-about','footer'].map(s=>!!q(s+' [data-cite]')).join(),'true,true,true,true,true']);
tt('Цитування APA / IEEE: точний текст із повною назвою, версією 6.0.0 і DOI',()=>[[apa(),ieee()].join('\n'),'Uzkykh, M. (2026). MATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography (Version 6.0.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.24540765\nM. Uzkykh, \u201CMATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography,\u201D version 6.0.0, Zenodo, 2026. doi: 10.5281/zenodo.24540765.']);
tt('BibTeX: @software, ключ, збалансовані дужки, повна назва в подвійних дужках, поля author/year/publisher/version/doi/url; екранування спецсимволів',()=>{const b=bibtex();const bal=(b.match(/\{/g)||[]).length===(b.match(/\}/g)||[]).length;return[[/^@software\{uzkykh_2026_24540765,\n/.test(b),bal,b.includes('title     = {{'+ZEN.title+'}}'),/author\s*=\s*\{Uzkykh, Mykyta\}/.test(b),/year\s*=\s*\{2026\}/.test(b),/publisher\s*=\s*\{Zenodo\}/.test(b),/version\s*=\s*\{6\.0\.0\}/.test(b),/doi\s*=\s*\{10\.5281\/zenodo\.24540765\}/.test(b),/url\s*=\s*\{https:\/\/doi\.org\/10\.5281\/zenodo\.24540765\}/.test(b),bibEsc('A & B_1')].join(),'true,true,true,true,true,true,true,true,true,A \\& B\\_1']});
tt('Діалог цитування: відкривається, показує 3 формати з кнопками копіювання, текст збігається з генераторами, Escape закриває',()=>{openCite();const d=q('#citedlg');const on=d.classList.contains('on'),n=d.querySelectorAll('[data-cc]').length,same=q('#cp_apa').textContent===apa()&&q('#cp_ieee').textContent===ieee()&&q('#cp_bibtex').textContent===bibtex();d.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return[[on,n,same,d.classList.contains('on')].join(),'true,3,true,false']});
})();
