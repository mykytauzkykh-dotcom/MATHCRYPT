# MATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24540765.svg)](https://doi.org/10.5281/zenodo.24540765)

A single-file, offline-capable educational and research platform for **number theory and cryptography**, centred on Diophantine equations and the Euclidean algorithm. It runs entirely in the browser (no server, no tracking). The interface is available in Ukrainian and English.

> **Status:** research / educational software. Cryptographic demonstrations are *toy implementations* and must **not** be used to protect real data.

## Zenodo DOI and online platform

| | |
|---|---|
| **Title** | MATHCRYPT 6.0: An Interactive Computational Research Platform for Diophantine Equations, Number Theory, and Modern Cryptography |
| **Author** | Uzkykh, Mykyta |
| **Version** | 6.0.0 |
| **Resource type** | Software |
| **Publisher** | Zenodo |
| **DOI** | [10.5281/zenodo.24540765](https://doi.org/10.5281/zenodo.24540765) |
| **DOI URL** | https://doi.org/10.5281/zenodo.24540765 |
| **Online platform** | https://quiet-haupia-3167e1.netlify.app |

> **DOI of the scientific software:** [10.5281/zenodo.24540765](https://doi.org/10.5281/zenodo.24540765). The Zenodo record is a software deposit, not a peer-reviewed publication.

In the program the clickable DOI badge appears in the header (main page), on the Dashboard, in the **About** tab, in the **Scientific Publications Center** and in the footer, together with the **Cite this software** button (copy the reference in APA, IEEE or BibTeX, or download a `.bib` file).

## Features

| Area | What is implemented |
|---|---|
| Diophantine equations | Linear `ax+by=c`, ≥3 variables, systems over ℤ (Smith / Hermite normal forms, verified by substitution), congruence systems, bounded integer optimisation, Pell equations, bounded search for non-linear equations (clearly distinguished from proofs of non-existence) |
| Number theory | Euclid (steps, extended), continued fractions, CRT, φ / μ / τ / σ, Miller–Rabin, factorisation, modular arithmetic, proofs centre |
| Cryptography lab | Textbook RSA, Diffie–Hellman, elliptic curves, SHA-256/512, classical ciphers |
| Lattices | Gauss reduction, LLL (exact integer/rational arithmetic) |
| Quantum lab | Classical state-vector simulator: Bloch sphere, X/Y/Z/H/S/T/CNOT, circuits, entanglement, QFT, Grover, Shor order finding |
| Post-quantum lab | LWE, Module-LWE, ML-KEM NTT (q = 3329), Lamport hash signature, size tables; theory of ML-KEM / ML-DSA / SLH-DSA |
| Statistics | Descriptive tests, Shapiro–Wilk, Mann–Whitney, Wilcoxon, Kruskal–Wallis, ANOVA, bootstrap (percentile/BCa), OLS / polynomial / Huber regression, power analysis |
| Experiments | Six automated, seeded, reproducible experiments (A–F) run in a Web Worker |
| Research tools | Notebook (IndexedDB), archive, publications centre (BibTeX / RIS / JSON), A4 scientific reports, reproducibility packages, backups |
| Knowledge graph, dashboard, 7-minute defence mode, PWA | See `docs/USER_GUIDE.md` |

## Quick start

* **From disk:** open `offline/mathcrypt.html` (or `site/index.html`) in a modern browser. No internet is needed.
* **Online:** https://quiet-haupia-3167e1.netlify.app
* **Your own hosting:** upload the whole `site/` folder (5 files) to any static host (e.g. Netlify Drop). See `docs/NETLIFY.md`.
* **Tests:** open the tab *Automatic tests* and press the run button, or run `node tests/t5.js site/index.html` (needs Playwright).

## Honest verification status

See `docs/TEST_REPORT.md`. Short version: the built-in suite passes in **Chromium only**; Firefox and WebKit were not available in the development environment and are **untested**.

## Reproducibility

Every experiment is deterministic for a given seed and program version. Export a package (ZIP with data, CSV/JSON, parameters, seed, version, SHA-256 checksums, instructions), import it later and re-run it. See `docs/REPRODUCTION.md`.

## How to cite

If you use MATHCRYPT in your work, please cite it as below. Machine-readable metadata: [`CITATION.cff`](CITATION.cff) (GitHub shows it as “Cite this repository”).

**APA (7th ed.)**

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

## License

| Material | License | Copyright |
|---|---|---|
| Original MATHCRYPT program code (`source/`, `site/`, `offline/`, test scripts, build script) | [MIT](LICENSE) | © 2026 Mykyta Uzkykh |
| Original scientific documentation and user guide (`docs/`, README files, CHANGELOG, CONTRIBUTING, SECURITY) | [CC BY 4.0](LICENSE-DOCS.md) | © 2026 Mykyta Uzkykh |
| Third-party components (three.js, the Anton font, development tools) | their own licenses | their respective authors — see [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) |

The MIT License applies only to the original MATHCRYPT code; it does not relicense third-party components, which are loaded from CDNs at run time and are not included in this repository.
