# Known limitations

1. **Browsers:** only Chromium was tested. Firefox/Safari are untested.
2. **Educational cryptography:** textbook RSA, toy LWE / ML-KEM components, Lamport signatures are *not* secure implementations. Standards (FIPS 203/204/205) are described, not implemented in full; size/parameter tables and the built-in bibliography were entered by the developer and **not re-checked against the original documents** — verify before citing.
3. **Quantum:** classical state-vector simulation (exponential cost; interactive limit ≈ 12 qubits for Grover, small N for Shor). Not a quantum computer.
4. **Statistics:** Shapiro–Wilk uses Royston's approximation (valid for 3 ≤ n ≤ 5000); exact Mann–Whitney/Wilcoxon only for small samples; the program never writes scientific conclusions — interpretation is left to the author.
5. **Non-linear Diophantine equations:** bounded search only; "no solutions found" ≠ proof of non-existence.
6. **Resource limits:** the main thread can still be busy for a few seconds on hard inputs (factorisation, Fibonacci up to 10⁷). Experiments run in a Worker and can be stopped; terminal/tab computations cannot.
7. **ZIP import:** only archives with stored (uncompressed) entries — i.e. those made by this program. Import `package.json` for other ZIPs.
8. **PDF:** produced through the browser's print engine ("Save as PDF"); no PDF library is bundled. Page breaks are computed by the program's own paginator (A4, 20 mm margins).
9. **PWA:** Service Worker needs https/localhost; data on `file://` and on a web origin are separate (use backup/restore to move). Cache update may need two reloads.
10. **Dashboard counters** count UI actions since the update, not arithmetic operations.
11. **Publications:** the user-editable fields of the Publications Center start empty (the “Fill from Zenodo” button fills only empty program fields with the project metadata). The project’s DOI of the scientific software is 10.5281/zenodo.24540765 (Zenodo); publication date and ORCID are not stored in the program. No publication, DOI or biography is invented. Licenses: MIT for the original code (`LICENSE`), CC BY 4.0 for the original documentation (`LICENSE-DOCS.md`); third-party components keep their own licenses (`THIRD_PARTY_NOTICES.md`).
12. **Security:** no formal audit, no CSP; user data in localStorage/IndexedDB are not encrypted.
13. Optional external resources (Google Fonts stylesheet, three.js decoration) load from CDNs when online; the app works without them.
