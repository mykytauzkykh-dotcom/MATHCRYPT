# Security policy

**Scope.** MATHCRYPT is an educational platform. Its cryptography (textbook RSA without padding, toy LWE, Lamport signatures, simplified ML-KEM building blocks, classical ciphers) is **not** suitable for protecting confidential data.

**Threat model of the web app.** It is a static, client-only page. User data stay in the browser (localStorage / IndexedDB). Imported files (JSON, ZIP, CSV-like) are parsed as data only, never executed.

**Implemented protections (see `docs/TEST_REPORT.md` for what was actually verified):** HTML escaping of user text in dynamic views; no `eval` of user input; schema, range and checksum validation of imported reproducibility packages; rejection of `__proto__`/`constructor`/`prototype` keys; size limits (30 MB) and safe ZIP parsing (stored entries only, CRC check, no path traversal); sanitising of stored dashboard counters; Web Worker with stop button for long experiments; Service Worker restricted to same-origin GET.

**Known limitations:** see `docs/KNOWN_LIMITATIONS.md`. No formal third-party security audit has been performed.

**Reporting.** Contact the maintainer (add your contact here: FILL_IN) with a description and reproduction steps. Please do not publish details before a fix is available.
