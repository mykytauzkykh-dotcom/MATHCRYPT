# Architecture

* **Build:** `source/build.py` concatenates `source/base.html`, `source/modules/m5.css` and the JS modules (in the order listed in the script) into one self-contained `index.html`. `site/` adds `manifest.webmanifest`, `sw.js` and icons.
* **Global namespace:** `window.M5` (helpers `q`, `qa`, `T`, `esc`, `put`, `say`, `html`, tab API `addTab/openTab`, tests `tt`, `runTests`).
* **Modules:** `core` (layout, tabs, archive, i18n), `lab/bench/adv/crypto/report` (5.0 tools and defence 5.0), `m6` (terminal, lattices, tests 6.0), `m7a–d` (statistics, number theory, experiments, notebook), `m8a–c` (advanced Diophantine, publications/reports/backups), `m9a–f` (advanced statistics, quantum, PQC + tests), `m9g` (dashboard, knowledge graph, defence 2.0, PWA), `m9h` (tests for them), `m9i` (reproducibility packages), `m9j` (Zenodo publication metadata `M5.ZENODO`, DOI badge, About tab, *Cite this software* dialog with APA/IEEE/BibTeX — the single place to edit citation data in the app).
* **Concurrency:** experiments run in a Web Worker built from a Blob (falls back to the main thread). The stop button posts a message; the worker polls a flag.
* **Storage:** `localStorage` keys `mc5_archive`, `mc6_pub`, `mc6_stats`, `mc6_tests`, `mc6_def`, language; IndexedDB for the notebook. Keys all start with `mc`; the backup tool handles them.
* **i18n:** `⟦ua|en⟧` markers resolved by `M5.I`; dynamic strings via `T(ua,en)`.
* **PWA:** `sw.js` — cache-first for the app shell (same-origin GET only); registered only on https and localhost; `file://` cannot use Service Workers (browser restriction) and the page works as a plain file.
