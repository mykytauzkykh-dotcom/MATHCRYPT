# User guide

* **Dashboard** (start page): real counters (experiments run, archive entries, notebook entries, computation launches, reports, last test run), global tool search, favourites (★), recent modules, knowledge-graph preview. "Computation launches" counts presses of primary buttons in tool tabs. Counters start at the moment of the update; running the tests does not change them.
* **Knowledge graph:** 14 concepts, 21 labelled relations. Click a node → description and relations, buttons to open the tool/theory. Mouse wheel or +/− zoom, drag or arrow keys pan, search highlights, "shortest connection" finds a path.
* **Diophantine tabs:** enter coefficients, press the solve button; results include verification by substitution. Systems accept integer matrices.
* **Statistics / Advanced statistics:** paste numbers, choose the method; read assumptions and the null hypothesis before the p-value.
* **Experiments:** choose A–F, set parameters and seed, run. Results can be saved to the archive or exported (CSV/JSON).
* **Reports (A4):** run an experiment, edit the generated text fields, optionally tick *full data set in the appendix* (up to 3000 rows; long tables are split across pages with repeated headers), then use *Print / Save as PDF* (browser printing) or download HTML.
* **Reproducibility package:** see `REPRODUCTION.md`.
* **Publications centre:** editable metadata, references, BibTeX/RIS/JSON export. Empty fields stay empty. At the top: MATHCRYPT 6.0 on Zenodo (DOI of the scientific software, badge, full title, DOI URL, online platform, *Cite this software*) and a button that copies the Zenodo data into the *empty* program fields.
* **About** (group *Basics*): description, full title, author, version 6.0.0, publisher, resource type, DOI of the scientific software, online platform, licenses, how to cite.
* **DOI badge and *Cite this software*:** in the header, on the Dashboard, in About, in the Publications centre and in the footer. The badge opens https://doi.org/10.5281/zenodo.24540765 in a new tab; the button opens a dialog with APA, IEEE and BibTeX, each with a *Copy* button, plus *Download .bib*. On `file://` the copy uses a fallback; if the browser blocks it, the text is selected for Ctrl+C.
* **Defence mode 2.0:** 7-minute timer, speaker notes (stored locally), keys `←/→/Space`, `1–8`, `F` fullscreen, `N` notes, `T` timer start/stop, `R` reset, `Esc` exit; live demos (Diophantine, Smith form, RSA, LLL, experiment B, test results). Slide texts for relevance, aim, objectives, novelty and conclusions are written by the author; the program never invents them. "Standalone copy" downloads a static HTML of the texts and notes.
* **Data and backups:** export / restore all local data. Restore asks for the mode (merge or replace).
* **Languages:** UA/EN switch in the header. Keyboard: Tab / Shift+Tab, Enter/Space on buttons, arrow keys in the graph.
