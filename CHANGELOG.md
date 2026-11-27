# Changelog

All notable changes to this project are documented here. Versions follow the Zenodo releases.

## Unreleased — repository infrastructure (2026-11-27)
Documentation and tooling only. **No change to the application:** `source/`, `site/` and `offline/` are
unchanged and `site/index.html` is still byte-identical to the file deposited on Zenodo.
* README rewritten as a structured research-software description (abstract, background, objectives,
  mathematical foundations, architecture diagrams, algorithms, validation, limitations, citation).
* `CITATION.cff` completed from the published Zenodo/DataCite record: `date-released: 2026-11-25`, author
  ORCID and affiliation, `repository-code`, both licences (MIT, CC-BY-4.0), version and latest-version DOIs.
* New `docs/MATHEMATICAL_FOUNDATIONS.md`, `examples/` (worked examples + independent Python reference code),
  `assets/screenshots/` (screenshots of 6.0.0).
* New tests: `tests/python/` (pytest: reproducible build, metadata consistency, reference values),
  `tests/run_builtin_suite.js` (CI runner for the 248 built-in tests), `tests/check_syntax.js`.
* GitHub Actions: `ci.yml` (Python tests and lint, built-in suite in Chromium, CFF validation, link check),
  `release-checksums.yml` (release asset + SHA-256 sums).
* `requirements.txt`, `package.json` (development tooling only), `.gitignore`.
* `SECURITY.md`: reporting channel set to GitHub private vulnerability reporting.
## 6.0.0 — final review (2026-11-26)
* Report generator: the author, supervisor and institution fields are now empty and editable (no pre-filled personal data); the defence slide lists only the software author, Mykyta Uzkykh.
* Post-quantum tables checked against NIST FIPS 203 (Tables 2–3), FIPS 204 (Tables 1–2) and FIPS 205 (Table 2): all sizes correct. SLH-DSA rows now use the official parameter-set names (SHA2/SHAKE); ML-KEM columns use the FIPS 203 terms (encapsulation/decapsulation key); the “from memory” note is replaced by the sources with DOIs.
* Corrected: the comparison table called the best lattice attacks “sub-exponential” — they are exponential in the dimension (sieving ≈ 2^0.292·d classical, ≈ 2^0.265·d quantum).
* Bibliography checked against primary sources (see `docs/SOURCES_VERIFICATION.md`): DOIs added where confirmed (LLL, Apostol, Webster–Tavares, FIPS 180-4); revisers of Hardy & Wright 6th ed., series of Micciancio–Goldwasser and Apostol, editor of CRYPTO ’85 added. No entry removed; nothing unconfirmed added.
* Permanent wording “DOI of the scientific software” instead of temporary status texts.
* Fixed (export bug): BibTeX export escaped `_` inside `doi`/`url` fields (e.g. `10.1007/3-540-39799-X\_41`); these fields are now written verbatim. Other fields are escaped as before.
* No algorithm changed; tests 248/248.

## 6.0.0 — licenses (2026-11-26)
* `LICENSE`: MIT License for the original program code, © 2026 Mykyta Uzkykh.
* `LICENSE-DOCS.md`: CC BY 4.0 for the original scientific documentation and user guide, © 2026 Mykyta Uzkykh.
* `THIRD_PARTY_NOTICES.md`: three.js (MIT), Anton font (SIL OFL 1.1), development tools; their licenses and authorship are unchanged.
* `CITATION.cff`: `license: MIT`. README (EN/UK): license table. About tab: license table and full MIT text (available offline). Footer: copyright and license line. HTML: `rel="license"` and `license` in JSON-LD.
* `LICENSE_SUGGESTION.md` removed (the decision has been made).
* Bibliographic data, DOI 10.5281/zenodo.24540765 and version 6.0.0 unchanged; algorithms, functions and design unchanged.

## 6.0.0 — Zenodo metadata (2026-11-26)
* Final bibliographic metadata: *MATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography*; author Uzkykh, Mykyta; version 6.0.0; 2026; Zenodo; resource type Software.
* DOI of the scientific software (Zenodo): [10.5281/zenodo.24540765](https://doi.org/10.5281/zenodo.24540765). Online platform: https://quiet-haupia-3167e1.netlify.app.
* Clickable DOI badge in the header (main page), on the Dashboard, in the new **About** tab, in the Scientific Publications Center and in the footer.
* **Cite this software** button and dialog: APA, IEEE and BibTeX with the full title, copy buttons, `.bib` download; works on `file://` too (clipboard fallback).
* Publications Center: “Fill the program fields from Zenodo” (fills only empty fields). About: full metadata table.
* HTML metadata: description, canonical URL, Open Graph, `citation_*` (Highwire), Dublin Core and schema.org JSON-LD (`SoftwareApplication`) — no publication date and no ORCID.
* `CITATION.cff`, README (EN/UK) updated. New module `source/modules/m9j.js`; mathematical algorithms, existing functions and design unchanged. Service-worker cache renamed so installed copies update.
* Tests 242 → 248.
## 6.0 Final
* Reproducibility packages (ZIP: data, CSV/JSON, parameters, seed, version, methodology, charts, SHA-256 sums, instructions); import, validation and re-run.
* Reports: large tables are split across A4 pages (header repeated), optional full data set in the appendix (≤ 3000 rows), verified with a real PDF.
* Security: whitelist SVG sanitiser (import + render), sanitised dashboard counters; resource limits for Pell, binomial, Fibonacci, LLL.
* Open-science documents (README EN/UK, CITATION.cff template, CONTRIBUTING, SECURITY, ARCHITECTURE, algorithms, user guide, reproduction guide, license suggestion).
* Tests 170 → 242.
## 6.0 Stage 3c
Dashboard, knowledge graph, defence mode 2.0, PWA.
## 6.0 Stage 3b
Advanced statistics, quantum lab, post-quantum lab.
## 6.0 Stage 3a
Advanced Diophantine laboratory, A4 report generator, publications centre, backups.
## 6.0 Stages 1–2 / 5.0
See `docs/history/`.
