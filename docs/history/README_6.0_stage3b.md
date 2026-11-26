# MATHCRYPT 6.0 — Stage 3b (toward the Final Research Release)

Single file `index.html` (~630 KB), opens from disk and on Netlify Drop. UA/EN, black-burgundy palette. Built on the delivered Stage 3a (the uploaded `mathcrypt6_stage6.zip` was byte-identical to it). All earlier modules, the 170 earlier tests and user data (`mc5_archive`, IndexedDB notebook, `mc6_pub`) are untouched.

## Status against the "Final Research Release" brief (honest)
| # | Section | Status |
|---|---|---|
| 1 | Quantum Computing Lab | **Done** (tab `quantum`) |
| 2 | Post-Quantum Cryptography | **Done as educational lab** (tab `pqc`); ML-KEM/ML-DSA/SLH-DSA are *theory only* |
| 3 | Advanced Statistics | **Done** (tab `stat2`) |
| 4 | Knowledge Graph | Not implemented |
| 5 | Research Dashboard | Not implemented |
| 6 | MAN Defense Mode 2.0 | Not implemented |
| 7 | Reproducibility package (export/import/re-run) | Not implemented (experiments already show seed, version and checksum; Stage 3a has JSON/CSV/HTML export of single results and the data backup) |
| 8 | Open Science / GitHub files | Not implemented |
| 9 | Offline & PWA (Service Worker, manifest) | Not implemented; `index.html` still runs from disk offline |
| 10 | Scientific PDF | Not improved in this stage (the Stage 3a limitations stand: no pixel check of real PDF output, no splitting of huge tables) |
| 11 | Mathematical verification | **Done for the implemented parts**: 218 tests (170 + 48 new) |
| 12 | Technical audit | Only the checks listed below were performed; no formal security audit |
| 13 | Design | Existing design kept; small CSS fixes only |
| 14 | `MATHCRYPT_6.0_FINAL.zip` | **Not final**: this is the Stage 3b archive; the final archive requires sections 4–10 |

## What was added
**Advanced statistics** (own implementations, no libraries): Shapiro–Wilk (Royston 1995), Mann–Whitney U (exact for n ≤ 30 without ties, otherwise normal approximation with tie and continuity corrections), Wilcoxon signed-rank (exact for n ≤ 50 without ties), Kruskal–Wallis (tie-corrected), one-way ANOVA (+ η²), bootstrap percentile and BCa intervals (seeded), multiple linear regression (Householder QR; SE, t, p, CI, R², adjusted R², F), polynomial regression (centred and scaled variable), robust Huber regression (IRLS, MAD scale), exact power of the t-test via the non-central t distribution and sample-size search, Pearson/Spearman correlation matrices, multi-sample comparison. For every method the page shows H₀, assumptions, limitations and the decision rule; **no scientific conclusion is generated automatically**.
**Quantum lab** (classical state-vector simulator, labelled as such on the page): Bloch sphere (sliders, gate buttons, keyboard), operators I X Y Z H S S† T T† Rx Ry Rz P CNOT CZ CP SWAP CCX, circuit parser, probabilities and seeded shots, reduced single-qubit Bloch vectors and entanglement entropy, QFT (matrix, FFT and circuit, cross-checked), Shor order-finding simulation (control register really QFT-transformed, continued fractions, gcd), Grover with theory curve sin²((2k+1)θ).
**Post-quantum lab** (educational, explicitly *not* for protecting data): LWE key generation/encryption/decryption with the correctness bound m·B < q/4 and failure statistics; attack on tiny LWE by Kannan embedding + the existing LLL (link to the lattice module) and exhaustive search; Module-LWE over R_q = Z_3329[X]/(X²⁵⁶+1) with the ML-KEM NTT (verified against schoolbook multiplication) and a simplified encryption of 256 bits (not ML-KEM: no compression, no Fujisaki–Okamoto); Lamport one-time hash signature (principle of SLH-DSA); theory pages and size tables for ML-KEM, ML-DSA, SLH-DSA; RSA/ECC/PQC comparison and the quantum-impact explanation. **The size tables were written from the author's memory — verify against FIPS 203/204/205 before citing.** The pseudo-random generator is seeded and non-cryptographic.

## Verification actually performed (Chromium 153.0.8010.12, Playwright, headless, `file://`)
* Built-in tests: **218 / 218** (see `docs/TEST_REPORT.md`). New tests compare with **independent references computed in SciPy 1.18 / NumPy 2.5** (scripts and data in `refs/`): Shapiro–Wilk W/p on 5 datasets, Mann–Whitney (exact, asymptotic, ties), Wilcoxon (exact, ties), Kruskal–Wallis (ties), ANOVA, OLS (coefficients, SE, p, R², F), polynomial fit, Huber IRLS, non-central-t power values and required n, correlation matrices; a 4-qubit/12-gate circuit state and reduced Bloch vectors vs NumPy; QFT vs `scipy.linalg.dft`. Further tests use invariants: unitarity, normalisation on 40 random circuits, gate identities, Born-rule frequencies (+χ²), Grover vs closed form, Shor order vs brute force, NTT vs schoolbook, bootstrap coverage of the mean (300 simulated samples).
* No page/console errors, no duplicate DOM ids (`tests/duplicate_ids.js` → `[]`), no horizontal scroll at 390 px on the new tabs, UI click-through of the new tabs (`tests/ui_stage3b_*.js`).
* One real defect found and fixed by these tests: the regression result object overwrote the p-value array with the parameter count.

## Browsers actually tested
**Chromium only.** Firefox and WebKit are not installed in the build environment and were not tested; Safari/Edge/Opera/real phones were not tested.

## Known limitations
* Sections 4–10 of the brief are not implemented (table above).
* Simulator limits: ≤ 10 qubits in circuits, ≤ 12 for Grover, N ≤ 255 for Shor. Everything is a classical simulation without quantum speed-up.
* The LWE attack is feasible only for toy sizes (n ≤ 6, m ≤ 16); success is not guaranteed for every key.
* Mann–Whitney/Wilcoxon exact p-values are limited as stated; Shapiro–Wilk is Royston's approximation (matches SciPy, which uses the same algorithm — an independent implementation of a different algorithm was not used).
* Statistical conclusions are the researcher's; the page gives only the formal decision rule.
* Bibliography entries added by the "standard references" button remain unverified.

## Rebuild
`python3 src/build.py` → `index.html`. Tests: `node tests/run_builtin_tests.js /abs/path/index.html`, `node tests/duplicate_ids.js`, `node tests/mobile_overflow.js`, `node tests/ui_stage3b_*.js` (need Playwright + Chromium). References: `python3 refs/ref_stats.py`, `refs/ref_q.py` (need SciPy/NumPy).
