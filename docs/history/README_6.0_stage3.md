# MATHCRYPT 6.0 — Stage 3a: Advanced Diophantine Lab, Scientific Reports, Publications, Backups

Single file `index.html` (~510 KB). Opens from disk (double-click) and works on Netlify Drop (upload `index.html`). UA/EN interface, black-burgundy palette. Everything from 5.0 and Stage 1–2 is kept; user data (`mc5_archive`, notebook in IndexedDB) is untouched.

## Scope of this delivery (honest)
The Stage 3 brief allows staging ("first finish the advanced Diophantine laboratory, scientific reports and mathematical verification"). This delivery is **Stage 3a**:

| Brief section | Status |
|---|---|
| 4. Advanced Diophantine lab | **Done** (tab `dioadv`) |
| 7. Scientific report generator A4 | **Done** (tab `sci`) |
| 6. Publications Center (BibTeX/RIS/JSON) | **Done** (tab `pub`) |
| 10. Export/restore of all user data | **Done** (tab `data`); PWA/Service Worker **not implemented** |
| 11. Verification 3.0 | **Partly**: 31 new tests for the implemented parts (170 total); no tests for quantum/PQC/etc. because those modules do not exist yet |
| 1. Quantum lab, 2. Post-quantum lab, 3. Advanced statistics (Shapiro–Wilk, Mann–Whitney, Wilcoxon, Kruskal–Wallis, ANOVA, bootstrap, multiple/polynomial/robust regression, power, correlation matrix), 5. Knowledge graph, 8. Research dashboard, 9. MAN Defense Mode 2.0, 10. PWA | **Not implemented** — planned for Stage 3b/3c |
| 12. Design system | Existing palette/localization/keyboard use kept; no new global redesign |
| 13. Final check | Chromium only (see below) |

## What was added
### Advanced Diophantine laboratory
1. Linear systems A·x = b over ℤ with any number of equations/unknowns (3+ variables): solved through the **Smith normal form** U·A·V = D (BigInt, tracked unimodular U, V). Output: solvability criterion, particular solution x₀, kernel basis, general solution x₀ + Σ tₖkₖ, **verification by substitution** (A·x₀ = b and A·kₖ = 0), reason of failure (divisibility dᵢ ∤ cᵢ or inconsistent row).
2. Integer matrix tools: Smith and **Hermite** (row HNF, H = U·A) forms with transformation matrices and invariant checks.
3. Multivariable linear congruences A·x ≡ b (mod μ).
4. Integer optimisation (min/max of c·x) and the **minimal non-negative solution** (minimum Σxᵢ) inside bounds; exhaustive box enumeration (limit 4·10⁶ points), automatic complete bounds when A ≥ 0, b ≥ 0.
5. Geometric interpretation and **3D visualisation** of integer solutions (rotatable SVG, sliders/keys, PNG export; 2D plot for two unknowns).
6. Non-linear polynomial equations (variables x, y, z, w; + − * ^ ( ), safe parser, no `eval`): **bounded search is labelled "not a proof"**; the only proof offered is a **modular obstruction** (a modulus m ≤ 60 for which an exhaustive residue check shows no solution mod m ⇒ rigorously no integer solutions). Failure to find an obstruction is explicitly *not* evidence of solvability.

### Scientific reports A4
Built from a real run of experiment A–F (Web Worker): title page, table of contents **with real page numbers** (own paginator, two-pass), page numbers, numbered formulas/tables/figures, theory (per-experiment template with formulas), methodology, reproduction parameters (seed, version, FNV-1a checksum, mode), numeric results, statistical description, charts (print-friendly colours), discussion and conclusions (**left as placeholders — never generated automatically**), references (standard sources + your Publications list), Appendix A (data excerpt), Appendix B (environment, test status). All text fields are editable before export; rebuild re-paginates. Ukrainian text and sub/superscript notation render with system fonts.
**PDF method (honest):** there is no built-in PDF library. "Print / save as PDF" opens the browser print dialog (named page `@page sr`, A4, margin 0); choose *Save as PDF*. "Download HTML" gives a self-contained file that prints in any browser. Page numbers in the contents match the preview; the print result was **not** compared to preview pixel-by-pixel and was only verified to the extent that headless Chromium could be checked (preview layout).

### Publications Center
All fields empty by default and editable: title, annotation, abstract, keywords, relevance, aims, object, subject, novelty, methodology, practical significance, results, author/supervisor info, DOI, Zenodo, GitHub, ORCID; bibliography editor; software citation built from your fields; MATHCRYPT version history (facts only; only the dates of the Stage 1–3a build are recorded; 5.0 has no recorded date). Export BibTeX / RIS / JSON, import JSON. The "add standard references" button inserts 9 well-known textbooks/papers (Knuth TAOCP 2, Cohen GTM 138, Hardy–Wright, NIST FIPS 180-4, Lenstra–Lenstra–Lovász 1982, H. W. Lenstra "Solving the Pell equation", Apostol, Micciancio–Goldwasser, Webster–Tavares). **They were entered from the author's knowledge, not fetched from a catalogue: verify editions/years/pages before citing.** No DOIs are generated.

### Data and backups
Exports all `mc*` localStorage keys plus the IndexedDB notebook to one JSON; restores in *merge* (no duplicates on repeat) or *replace* mode; validates format, keys and strips unsafe SVG.

## Offline operation
All code is inside `index.html`; opened from disk it works without internet (tests were run exactly this way, `file://`). Two optional externals exist: a Google Fonts stylesheet (fallback fonts are used) and a decorative three.js script from a CDN (all tools work without it). **Service Worker/PWA/installation is not implemented** (Service Workers cannot register under `file://` and this stage did not add them for hosted use).

## Tests
`Автотести / Automatic tests` tab: **170/170 passed in Chromium** (139 earlier + 31 new, see `docs/TEST_REPORT.md`). Checks include Smith/Hermite invariants on random matrices, solved examples, substitution verification, congruence counts against brute force, box search against brute force, obstruction proofs (x²+y²=3, x²+y²+z²=7, x²=2), parser safety, BibTeX/RIS/JSON structure and round trip, report pagination/TOC/numbering/placeholders for all six templates, reproducibility checksum, backup round trip and rejection of bad files, absence of external scripts besides the optional decoration.

## Browsers actually tested
**Chromium 153.0.8010.12 (Playwright, Linux, headless) only.** Firefox and WebKit are not installed in the build environment, so they were **not** tested. Not tested: Safari, Edge, Opera, real mobile devices (a 390 px viewport was emulated in Chromium: no horizontal scroll on the new tabs).

## Known limitations
* Only Chromium tested (above). Print-to-PDF output not verified beyond preview.
* Box enumeration ≤ 4·10⁶ points; non-linear bounded search limited by point count; obstruction search m ≤ 60 and ≤ 3·10⁶ residue tuples. A missing obstruction proves nothing.
* Report paginator is own implementation: very long unbreakable blocks (huge tables) are not split across pages; appendix A shows ≤ 25 rows.
* Report discussion/conclusions/novelty are intentionally empty placeholders.
* Bibliography entries added by the button are unverified (see above).
* Not implemented: everything in the "Not implemented" row of the table.

## Rebuild
`python3 src/build.py` (writes `index.html`). Tests: `node tests/run_builtin_tests.js index.html` (absolute path), `node tests/duplicate_ids.js`, `node tests/mobile_overflow.js`, `node tests/ui_stage3a.js` (need Playwright + Chromium).
