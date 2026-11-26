# Third-party notices

MATHCRYPT 6.0.0 — original code © 2026 Mykyta Uzkykh (MIT, see `LICENSE`); original documentation © 2026 Mykyta Uzkykh (CC BY 4.0, see `LICENSE-DOCS.md`).

The components below are **not** authored by Mykyta Uzkykh. They keep their own licenses and copyright holders; nothing in `LICENSE` or `LICENSE-DOCS.md` relicenses them.

## 1. Loaded at run time from a CDN (not included in this archive)

Both are optional: they are requested only when the browser is online, and the program works without them (offline copy, Service Worker cache and all tests do not need them).

| Component | Version | Used for | Source | License | Copyright |
|---|---|---|---|---|---|
| three.js | 0.150.1 (r150), `build/three.min.js` | decorative animated background | https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.min.js — project: https://github.com/mrdoob/three.js | MIT | © three.js authors (see the license header of the file and https://github.com/mrdoob/three.js/blob/dev/LICENSE) |
| Anton (font) | as served by Google Fonts | display headline typeface | https://fonts.googleapis.com/css2?family=Anton — project: https://github.com/googlefonts/AntonFont | SIL Open Font License 1.1 (`OFL-1.1`) | © 2020 The Anton Project Authors; designer Vernon Adams |

Using jsDelivr and Google Fonts is subject to those services' own terms; when online, the browser contacts them directly.

## 2. Fonts referenced by name only (not distributed)

The style sheets name system fonts as fallbacks (e.g. Georgia, Times New Roman, Consolas, Menlo, SF Mono, DejaVu, Liberation Mono, Segoe UI, Roboto, Verdana, Impact). No font files are included; the browser uses whatever is installed on the user's device.

## 3. Development and test tools (not distributed)

Used only to build and test the program; none of their code is contained in `site/` or `offline/`.

| Tool | Purpose | License |
|---|---|---|
| Playwright (Microsoft) | runs the browser tests in `tests/*.js` | Apache-2.0 |
| Chromium | headless browser for the tests and the sample PDF | BSD-3-Clause and other open-source licenses |
| Node.js | runs the test scripts | MIT (with bundled third-party licenses) |
| Python | `source/build.py`, `tests/refs/*.py` | PSF License |
| SciPy, NumPy | `tests/refs/*.py` computed reference values; only the resulting numbers are embedded in the tests | BSD-3-Clause |

## 4. External services and links

* **Zenodo / DataCite / doi.org** — DOI of the scientific software: 10.5281/zenodo.24540765. The DOI badge image in the README files is served by zenodo.org; the badges inside the program are drawn locally.
* **Netlify** — hosting of the online platform https://quiet-haupia-3167e1.netlify.app.

## 5. Algorithms, standards and cited works

The program implements published mathematical algorithms and standards from their descriptions (for example the Euclidean algorithm, LLL, the Shapiro–Wilk test following Royston (1995, AS R94), SHA-256/512 per FIPS 180-4, ML-KEM parameters per FIPS 203). Credit for these algorithms and standards belongs to their authors and publishers. The bibliographic entries offered in the Publications Center are citations of third-party works, not copies of them.

## 6. How this list was compiled

By reviewing the archive for external URLs, bundled files, license headers and copyright notices (November 2026). No third-party source code, font files or images were found inside the archive. If you add a dependency, add it here.
