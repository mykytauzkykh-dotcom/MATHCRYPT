# Verification report — MATHCRYPT 6.0 Final (what was actually done)

Date of the final run: 2026-11-24. Raw per-test results: `tests/test_results.json`.

## Environment (honest statement)
| Browser | Tested? |
|---|---|
| **Chromium 153.0.8010.12** (headless, Playwright) | **Yes** — everything below |
| Firefox | **No** — not installed in the development environment |
| WebKit / Safari | **No** — not installed |
Consequently compatibility with Firefox and Safari is *expected* (standard APIs only: BigInt, Web Workers, IndexedDB, SVG, Service Worker) but **not verified**. Printing to PDF was verified only through Chromium's PDF engine.

## 0b. Update 2026-11-26 — final review (personal data, sources, wording)
Re-run on Chromium 158.0.8127.36 after clearing the report-generator defaults, correcting the post-quantum texts, updating the bibliography (`docs/SOURCES_VERIFICATION.md`), fixing DOI escaping in the BibTeX export and switching to the permanent wording “DOI of the scientific software”:
* Built-in suite **248 / 248**; offline **248 / 248** (`t24`). No test added; one existing test of `m9j.js` updated to the permanent wording (still 6 Zenodo tests, 248 in total).
* `t9` no duplicate ids; `t29`/`t13` no overflow at 390 px; `t26` no XSS payload executed; `t25` reproducibility OK; `pdf1` 7/19 pages, nothing clipped.
* Browser check: author/supervisor/institution fields empty and editable; no personal data in the rendered DOM; PQC tables show official SLH-DSA names and FIPS sources; BibTeX export contains `doi = {10.1007/3-540-39799-X_41}` unescaped.

## 0a. Update 2026-11-26 — licenses (MIT code, CC BY 4.0 documentation)
Re-run on Chromium 158.0.8127.36 after adding `LICENSE`, `LICENSE-DOCS.md`, `THIRD_PARTY_NOTICES.md` and the license information in About and the footer:
* Built-in suite **248 / 248** (no test added or changed in this step); offline **248 / 248** (`t24`, Service Worker).
* `t9` no duplicate ids; `t29`/`t13` no overflow at 390 px (About included); `t26` no XSS payload executed; `t25` reproducibility package OK; `pdf1` 7/19 pages, nothing clipped; `t30` full suite ≈ 6.1 s.
* The MIT text shown in About is byte-identical to `LICENSE`; citation strings, DOI 10.5281/zenodo.24540765 and version 6.0.0 unchanged.
* Archive scan for secrets (API keys, tokens, private keys, passwords, JWTs), e-mail addresses, phone numbers, local paths/user names and PDF/PNG metadata: nothing found. The only personal name in the archive is the software author, Mykyta Uzkykh (see 0b: report-generator defaults cleared).

## 0. Update 2026-11-26 — final Zenodo metadata (DOI 10.5281/zenodo.24540765)
Final run on Chromium 158.0.8127.36 (headless, Playwright) after adding `m9j.js`, the HTML metadata and the final bibliographic data (title *MATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography*, Uzkykh, Mykyta, version 6.0.0, 2026, Zenodo, Software):
* Built-in suite **248 / 248** (242 earlier tests unchanged + 6 new: exact metadata and empty ORCID/date, badge present and clickable in all 5 places, *Cite* button in all 5 places, exact APA/IEEE text, BibTeX validity, citation dialog). Raw results: `tests/test_results.json`.
* `t9` duplicate DOM ids: none. `t29`/`t13` 390 px: all 43 tabs, no horizontal overflow. `t26` XSS audit: no payload executed (the inline-script count is higher only because of the new module and the JSON-LD block). `t25` reproducibility package: re-run identical, tampered and `__proto__` packages rejected. `pdf1`: 7- and 19-page PDFs, nothing clipped. `t30`: load 0.5–0.8 s, full suite ≈ 6.3 s.
* `t24` dashboard/graph/defence/PWA: Service Worker registered, offline reload works, **248/248 offline**.
* Clipboard: APA, IEEE and BibTeX read back from the clipboard in Chromium and match the expected text exactly. Visual check of header, Dashboard, Publications Center, About, footer and dialog in UA/EN at 1400 px and 390 px.
* Publications Center: “Fill from Zenodo” checked for a new user and for stored old defaults (“MATHCRYPT”/“6.0” replaced, a user-entered URL kept).
* Building the *unchanged* sources reproduced the previous `site/index.html` byte-for-byte; differences come only from `m9j.js`, the `about` entry in the sidebar, appended CSS, the HTML metadata in `build.py` and the Publications Center defaults (full title, 6.0.0).
* **Not verified:** resolving the DOI link from the development environment; the live Netlify site was not opened from the development environment. Firefox/WebKit still untested.

The sections below describe the run of 2026-11-24 (242 tests) and remain valid for all earlier functionality.

## 1. Built-in mathematical test suite: **242 / 242 passed** (≈ 6.7 s)
* 139 tests from Stage 1–2, 31 from Stage 3a (Diophantine systems, Smith/Hermite forms, publications, reports, backups), 48 from Stage 3b (statistics vs SciPy, quantum vs NumPy, PQC), 14 from Stage 3c (graph integrity, BFS, search, counters, defence, PWA), 10 in the final stage (CRC-32/ZIP, reproducibility package build/validate/import/re-run, hostile-input checks, SVG sanitiser, resource limits).
* **All earlier tests were kept.** One earlier test (backup import of a chart containing `<script>`) was *rewritten* because the behaviour was strengthened: dangerous SVG content is now removed (whitelist sanitiser) instead of the whole chart being rejected; the test now checks that the dangerous parts are gone and the harmless shape remains. Another (autonomy) was updated to the PWA status.
* Independent references: SciPy 1.18.1 and NumPy 2.5.3 values are embedded in the tests (generated by `tests/refs/*.py`). Invariants checked: `U·A·V=D`, determinant preservation, substitution into `A·x=b`, unitarity / normalisation of quantum states, NTT round trips, checksums.

## 2. Reproducibility
* ZIP written by the program was read back by Python's `zipfile` (`testzip()` OK) and `checksums.sha256` verified with `hashlib` (all files match).
* Import → validation → re-run of experiment E: checksum identical. Tampered package → rejected (SHA-256 and FNV mismatch). `__proto__` package → rejected, `Object.prototype` not polluted.

## 3. Scientific PDF
Real PDF produced with Chromium (`page.pdf`, A4, `preferCSSPageSize`) from the report engine for experiment E: 7 pages (excerpt) and **19 pages** with the *full data set* (478 rows) — table split across many pages with repeated header and "(continued)" caption; no clipped sheets; `pdftotext` extracts the Ukrainian text; fonts embedded (pypdf/pdffonts). Sample: `tests/samples/sample_report_experiment_E_full_data_19pages.pdf`. **Not verified:** the interactive browser print dialog, other browsers' print engines.

## 4. Security / robustness audit (what was really executed)
| Check | Result |
|---|---|
| XSS payloads (`<img onerror>`, `<svg onload>`, `</script>` injection, quote breaking) placed in archive, notebook, publications, defence texts/notes, dashboard counters, report fields, terminal; all 42 tabs opened; defence export & report HTML export inspected | No script executed, no handlers in DOM, exports escaped (`tests/t26.js`) |
| Hostile `mc6_stats` in localStorage | **Bug found and fixed**: invalid ids broke the dashboard with a selector exception → counters are now sanitised; test added |
| Imported notebook/backup SVG | **Weakness found and fixed**: the old blacklist (`<script|onload=|onerror=`) let `onbegin`, `javascript:` links etc. pass → replaced with a whitelist sanitiser (`M5.safeSvg`) applied on import and on render; tests added |
| Reproducibility package import | schema/range/checksum validation, forbidden keys, 30 MB limit, ZIP: stored only, CRC, no `..` |
| JSON backup restore | key whitelist `^mc…`, string values only (pre-existing) |
| BigInt: huge inputs (200 000-digit gcd 11 ms; 2^1000000; 10^100000 exponent) | responsive |
| **Hangs found and fixed** in the terminal/tabs: `pell(10^18+9)` (> 45 s), `binomial(10^6,5·10^5)` (41 s), `fibonacci(10^8)` (17 s), LLL 12×12 with 17-digit entries (40 s) | Now: D ≤ 10¹² and 4 s time budget for Pell, `min(k,n−k) ≤ 20000`, `n ≤ 10⁷`, LLL time budget 8 s; each fails with a clear message. `fibonacci(10^7)` still blocks ≈1.4 s; hard factorisations (e.g. φ(2¹²⁸+1)) ≈ 5 s on the main thread (iteration-capped, result flagged incomplete if not factored) |
| Experiments | run in a Web Worker with a Stop button (the Stop button itself was not exercised in this audit) |
| Smith normal form of 20×20 with 14-digit entries | 0.3 s |
**Not done:** fuzzing, third-party penetration test, CSP headers (static hosting; a `_headers` file is not provided), review of every `innerHTML` call by hand (testing was by payload injection, not exhaustive code review).

## 5. UI / regression
* Clicked through: dashboard, graph (select, search, path, zoom, open tool), defence 2.0 (slides, demos, timer, notes, standalone export), reproducibility tab, scientific reports, EN switch.
* Duplicate DOM ids: none after fixing a clash found in this stage (`rperr`). Mobile (390 px): all 42 tabs without horizontal scroll. No console/page errors.
* Performance (Chromium, local file): load-to-ready 430–900 ms; file size ≈ 710 KB.

## 6. PWA / offline
Local HTTP server + Playwright: Service Worker registered; after `setOffline(true)` the page reloads from cache, tools work and **all 242 tests pass offline**. `file://`: works as a plain file (no Service Worker — browser restriction). Not verified: real Netlify deployment, the browser's install prompt UI (depends on the browser), update flow across versions.
