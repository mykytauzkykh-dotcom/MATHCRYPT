# Tests
Requires Node 18+ and Playwright with Chromium (`npm i playwright && npx playwright install chromium`).
* `node tests/t5.js site/index.html` — runs the built-in suite (`M5.runTests()`); `node tests/rep.js` — JSON report.
* `node tests/t9.js site/index.html` — duplicate DOM ids (must print `[]`).
* `node tests/t29.js` — all tabs at 390 px (no horizontal overflow). `t26.js` — XSS payload audit. `t25.js` — reproducibility package UI (writes pk.zip). `pdf1.js` — builds real PDFs (rep_short.pdf, rep_full.pdf; check with `pdftotext`).
* `t24.js` and the PWA checks need the `site/` folder served at `http://localhost:8765/` (`cd site && python3 -m http.server 8765`).
* `refs/` — scripts that generated SciPy/NumPy reference values embedded in the tests.
