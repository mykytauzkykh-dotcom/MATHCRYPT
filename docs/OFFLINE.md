# Running offline

Open `offline/mathcrypt.html` (identical to `site/index.html`) by double-clicking it. All tools, charts, reports and tests work without internet. Optional resources (Google Fonts stylesheet, three.js decoration) are skipped when offline; fallbacks are built in. Service Workers do not run on `file://` (browser restriction) — they are not needed there. Data are stored per browser profile *and per origin*: data created on `file://` are not visible on the Netlify site; use *Export backup / Restore* to move them.
