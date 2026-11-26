# MATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24540765.svg)](https://doi.org/10.5281/zenodo.24540765)

Автономна навчально-дослідницька платформа з **теорії чисел і криптографії** (центр — діофантові рівняння та алгоритм Евкліда). Працює повністю в браузері: без сервера й без збору даних. Інтерфейс — українською та англійською.

> **Статус:** дослідницьке/навчальне програмне забезпечення. Криптографічні демонстрації — *навчальні*; їх **не можна** використовувати для захисту реальних даних.

## DOI на Zenodo та онлайн-платформа

| | |
|---|---|
| **Назва** | MATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography |
| **Автор** | Uzkykh, Mykyta (Узких Микита) |
| **Версія** | 6.0.0 |
| **Тип ресурсу** | Software (програмне забезпечення) |
| **Видавець** | Zenodo |
| **DOI** | [10.5281/zenodo.24540765](https://doi.org/10.5281/zenodo.24540765) |
| **Адреса DOI** | https://doi.org/10.5281/zenodo.24540765 |
| **Онлайн-платформа** | https://quiet-haupia-3167e1.netlify.app |

> **DOI наукового програмного забезпечення:** [10.5281/zenodo.24540765](https://doi.org/10.5281/zenodo.24540765). Запис на Zenodo — це депонування програмного забезпечення, а не рецензована публікація.

У самій програмі клікабельний DOI-бейдж розміщено в шапці (головна сторінка), на Панелі, у вкладці **«Про програму»**, у **Центрі публікацій** та в нижній частині сайту — разом із кнопкою **Cite this software** (копіювання посилання у форматах APA, IEEE та BibTeX або завантаження файлу `.bib`).

## Можливості

* Діофантові рівняння: лінійні, ≥3 змінних, системи над ℤ (нормальні форми Сміта та Ерміта з перевіркою підстановкою), системи порівнянь, цілочисельна оптимізація в межах, рівняння Пелля, обмежений пошук для нелінійних рівнянь (чітко відокремлений від доведення відсутності розв’язків).
* Теорія чисел: Евклід, ланцюгові дроби, КТО, φ/μ/τ/σ, Міллер — Рабін, факторизація, доведення.
* Криптолабораторія: RSA, Діффі — Гелман, еліптичні криві, SHA-256/512, класичні шифри; ґратки (Гаусс, LLL).
* Квантова лабораторія (класичний симулятор), постквантова лабораторія (LWE, Module-LWE, NTT ML-KEM, Lamport).
* Статистика: Шапіро — Вілк, Манн — Вітні, Вілкоксон, Краскел — Волліс, ANOVA, bootstrap, регресії, потужність.
* Шість автоматичних експериментів із seed, наукові звіти A4 (PDF через друк браузера), пакети відтворюваності, архів, журнал, резервні копії.
* Карта дисциплін, дослідницька панель, режим захисту (7 хв), PWA.

## Запуск

* **З диска:** відкрийте `offline/mathcrypt.html` у сучасному браузері (інтернет не потрібен).
* **Онлайн:** https://quiet-haupia-3167e1.netlify.app
* **Власний хостинг:** завантажте всю папку `site/` (5 файлів) на статичний хостинг (наприклад, Netlify Drop) — `docs/NETLIFY.md`.
* **Тести:** вкладка «Автотести» або `node tests/t5.js site/index.html`.

## Чесний статус перевірки

Див. `docs/TEST_REPORT.md`. Тести пройдено лише в **Chromium**; Firefox і WebKit не перевірялися (недоступні в середовищі розробки).

## Як цитувати

Якщо ви використовуєте MATHCRYPT у своїй роботі, наведіть таке посилання. Машинозчитувані метадані — у файлі [`CITATION.cff`](CITATION.cff) (GitHub показує його як «Cite this repository»).

**APA (7-ме вид.)**

> Uzkykh, M. (2026). *MATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography* (Version 6.0.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.24540765

**IEEE**

> M. Uzkykh, “MATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography,” version 6.0.0, Zenodo, 2026. doi: 10.5281/zenodo.24540765.

**BibTeX**

```bibtex
@software{uzkykh_2026_24540765,
  author    = {Uzkykh, Mykyta},
  title     = {{MATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography}},
  year      = {2026},
  publisher = {Zenodo},
  version   = {6.0.0},
  doi       = {10.5281/zenodo.24540765},
  url       = {https://doi.org/10.5281/zenodo.24540765}
}
```

## Ліцензія

| Матеріали | Ліцензія | Правовласник |
|---|---|---|
| Оригінальний програмний код MATHCRYPT (`source/`, `site/`, `offline/`, тестові скрипти, скрипт збирання) | [MIT](LICENSE) | © 2026 Mykyta Uzkykh |
| Оригінальна наукова документація та посібник користувача (`docs/`, файли README, CHANGELOG, CONTRIBUTING, SECURITY) | [CC BY 4.0](LICENSE-DOCS.md) | © 2026 Mykyta Uzkykh |
| Сторонні компоненти (three.js, шрифт Anton, інструменти розробки) | власні ліцензії | їхні автори — див. [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) |

Ліцензія MIT поширюється лише на оригінальний код MATHCRYPT і не змінює ліцензій сторонніх компонентів, які завантажуються з CDN під час роботи й не входять до цього репозиторію.
