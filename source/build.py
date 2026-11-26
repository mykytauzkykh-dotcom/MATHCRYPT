import re,sys
import os
SP=os.path.dirname(os.path.abspath(__file__))+'/'
s=open(SP+'base.html',encoding='utf-8').read()
css=open(SP+'modules/m5.css',encoding='utf-8').read()
js=''.join('<script>\n'+open(SP+'modules/'+f,encoding='utf-8').read()+'\n</script>\n' for f in ['core.js','lab.js','bench.js','adv.js','crypto.js','report.js','m6.js','m7a.js','m7b.js','m7c.js','m7d.js','m8a.js','m8b.js','m8c.js','m9a.js','m9b.js','m9c.js','m9d.js','m9e.js','m9f.js','m9g.js','m9h.js','m9i.js','m9j.js'])
init='''<script>
(()=>{try{const M5=window.M5;M5.layout();
const EN=M5.EN;Object.assign(EN,{'Діофантові рівняння':'Diophantine equations','Розв’язання ax + by = c':'Solving ax + by = c','Розв’язати':'Solve','Приклад':'Example','Графік цілочисельних розв’язків':'Graph of integer solutions','RSA: ключі та текст':'RSA: keys and text','Створити ключі':'Create keys','Зашифрувати текст':'Encrypt text','Розшифрувати':'Decrypt','Текст для шифрування (будь-яка мова UTF-8)':'Text to encrypt (any UTF-8 language)','Покрокове RSA-шифрування':'Step-by-step RSA encryption','Почати':'Start','Попередній крок':'Previous step','Наступний крок':'Next step','Натисніть «Почати»':'Press “Start”','Прості числа та множники':'Primes and factors','Перевірити та розкласти':'Check and factorise','Ціле число (до 10¹²)':'Integer (up to 10¹²)','Генератор діофантових завдань':'Diophantine task generator','Рівень':'Level','Нове завдання':'New task','Перевірити':'Check','Підказка / розв’язок':'Hint / solution','Теоретичні матеріали':'Theory materials','Розділ':'Section','Практичні завдання':'Practice tasks','Відповідь':'Answer','Наступне завдання':'Next task','Історія обчислень':'Computation history','Очистити історію':'Clear history','Мої проєкти':'My projects','Експортувати проєкт':'Export project','Імпортувати проєкт':'Import project','Копіювати':'Copy','Відкрити RSA':'Open RSA','Легкий':'Easy','Середній':'Medium','Складний':'Hard','Історія математики та криптографії':'History of mathematics and cryptography','Висновок':'Conclusion','Ключі та шифрування тексту':'Keys and text encryption','Діофантові рівняння та графік':'Diophantine equations and graph','Прості числа':'Prime numbers','Перевірка та розклад':'Check and factorisation','Навчальна демонстрація. RSA тут працює без доповнення (padding) і не призначений для захисту реальних даних.':'Educational demonstration. RSA here works without padding and is not intended to protect real data.','Mathematical & Cryptographic Research Platform — From Number Theory to Modern Cryptography':'Mathematical & Cryptographic Research Platform — From Number Theory to Modern Cryptography'});
M5.setLang(M5.lang());
const h=location.hash.replace('#t-','');if(h&&M5.tabs[h]||['dio','rsa','anim','prime','gen','theory','prac','hist','math'].includes(h))M5.openTab(h,true)
else if(!h)M5.openTab('dash',true);
}catch(e){console.error('MATHCRYPT 6.0 init',e)}})();
</script>
'''
# title, header, footer
s=s.replace('<title>MATHCRYPT — математика та криптографія</title>','<title>MATHCRYPT 6.0 — Mathematical &amp; Cryptographic Research Platform</title>')
s=s.replace('<div><h1>MATHCRYPT</h1>\n<p>Діофантові рівняння, RSA-шифрування та навчальні вправи — працює прямо в браузері.</p></div>','<div><h1>MATHCRYPT 6.0</h1>\n<p>Advanced Mathematical &amp; Cryptographic Research Platform</p><p class="slogan">Explore Mathematics. Discover Patterns. Advance Science.</p></div>')
assert 'MATHCRYPT 6.0</h1>' in s
s=s.replace('</head>','<link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#450a1c"><link rel="icon" href="icon-192.png"></head>',1)
# --- scholarly / SEO metadata (single source: keep in sync with ZEN in modules/m9j.js and CITATION.cff) ---
import json as _json, html as _html
_Z={'title':'MATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography',
 'family':'Uzkykh','given':'Mykyta','version':'6.0.0','year':'2026','publisher':'Zenodo','type':'Software',
 'doi':'10.5281/zenodo.24540765','doi_url':'https://doi.org/10.5281/zenodo.24540765','platform':'https://quiet-haupia-3167e1.netlify.app'}
_desc='Browser-based educational and research platform for Diophantine equations, number theory and cryptography with reproducible experiments.'
_e=lambda v:_html.escape(v,quote=True)
_m=[('name','description',_desc),('name','author',_Z['given']+' '+_Z['family']),
 ('name','citation_title',_Z['title']),('name','citation_author',_Z['family']+', '+_Z['given']),('name','citation_publisher',_Z['publisher']),
 ('name','citation_doi',_Z['doi']),('name','citation_version',_Z['version']),
 ('name','DC.title',_Z['title']),('name','DC.creator',_Z['family']+', '+_Z['given']),('name','DC.publisher',_Z['publisher']),('name','DC.type',_Z['type']),('name','DC.identifier','doi:'+_Z['doi']),
 ('property','og:type','website'),('property','og:title',_Z['title']),('property','og:description',_desc),('property','og:url',_Z['platform']+'/')]
_ld={'@context':'https://schema.org','@type':'SoftwareApplication','name':_Z['title'],'softwareVersion':_Z['version'],
 'author':{'@type':'Person','familyName':_Z['family'],'givenName':_Z['given']},'publisher':{'@type':'Organization','name':_Z['publisher']},
 'identifier':{'@type':'PropertyValue','propertyID':'DOI','value':_Z['doi'],'url':_Z['doi_url']},'sameAs':_Z['doi_url'],'url':_Z['platform']+'/',
 'license':'https://spdx.org/licenses/MIT.html','copyrightHolder':{'@type':'Person','name':'Mykyta Uzkykh'},'copyrightYear':2026,'applicationCategory':'EducationalApplication','operatingSystem':'Web browser','description':_desc}
_head=''.join('<meta %s="%s" content="%s">'%(k,n,_e(v)) for k,n,v in _m)+'<link rel="canonical" href="%s/">'%_Z['platform']+'<link rel="license" href="https://opensource.org/license/mit">'+'<script type="application/ld+json">'+_json.dumps(_ld,ensure_ascii=False).replace('</','<\\/')+'</script>'
s=s.replace('</head>',_head+'</head>',1)

i=s.index('</style>');s=s[:i]+css+'\n'+s[i:]
s=s.replace('<footer>Навчальна демонстрація.','<footer>Навчальна демонстрація.')
j=s.rindex('</body>');s=s[:j]+js+init+s[j:]
open(SP+'../site/index.html','w',encoding='utf-8').write(s)
open(SP+'../offline/mathcrypt.html','w',encoding='utf-8').write(s)
print(len(s))
