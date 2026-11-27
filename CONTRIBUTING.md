# Contributing

1. The site is built from modules in `source/modules/` by `source/build.py` into one `index.html`. Edit modules, never the generated file.
2. Mathematical code must come with tests registered via `M5.tt(name, () => [actual, expected])` (see `source/modules/m9h.js`). Compare against independent references (SciPy/NumPy values are embedded in tests), check invariants and edge cases. Do not add duplicate tests to raise the count.
3. Never replace a computation with a simulation of its result; never auto-generate scientific conclusions, DOIs, authors or citations.
4. i18n: texts use `⟦ua|en⟧` markers (exactly one `|`) or `T(ua,en)`. Use `∣` instead of `|` inside such markers.
5. Pitfalls: never write the literal closing script tag in JS strings; avoid duplicate DOM ids (`tests/t9.js` must print `[]`); the global CSS hides `<section>` — use `<div>` for new containers.
6. Before a pull request: `python3 source/build.py`, then `node tests/run_builtin_suite.js site/index.html` (all tests pass, no console errors), `node tests/t9.js ...`, and `python3 -m pytest tests/python` (reproducible build, metadata, reference values). The same checks run in GitHub Actions (`.github/workflows/ci.yml`).
   If you change citation data, update `CITATION.cff`, `source/modules/m9j.js` and the metadata block in `source/build.py` together.
7. Security issues: see `SECURITY.md`.
