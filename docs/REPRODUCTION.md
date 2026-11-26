# Reproducing experiments

1. Tab **Reproducibility package** → choose experiment and parameters → *Run and build the package* (or use the last run from the Experiments tab). A stopped run is refused.
2. Download the ZIP: `package.json` (machine-readable: program, version, experiment, parameters, **seed**, data, FNV-1a and SHA-256 checksums, statistics text), `data.json`, `data.csv`, `results.txt`, `methodology.md`, `charts/*.svg`, `REPRODUCE.md`, `checksums.sha256`.
3. Independent integrity check outside the program: `sha256sum -c checksums.sha256`.
4. To re-run: *Import package* (ZIP or `package.json`), the program validates schema, experiment name, parameter ranges and both checksums, then *Re-run the experiment from the package* and compares the new checksum with the stored one.

**Expected outcome.** Same MATHCRYPT version + same parameters + same seed ⇒ identical data (verified in the test suite). A different program version may change generators or algorithms and therefore results; the package records the version for that reason. Experiment E (Pell) has no random seed (deterministic).

**Safety of import.** Files are parsed as JSON data only; limit 30 MB; unknown keys such as `__proto__` are rejected; SVG from a package is never inserted into the page; ZIP: stored entries only, CRC checked, no `..` paths.
