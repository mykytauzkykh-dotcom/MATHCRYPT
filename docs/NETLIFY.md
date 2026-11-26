# Publishing on Netlify

1. Netlify → *Sites* → *Add new site* → *Deploy manually* (Netlify Drop) → drag the **whole `site/` folder**.
2. To update: *Deploys* → drag the folder again. Uploading only `index.html` also works, but without the PWA files the app cannot be installed and does not use the Service Worker.
3. First visit online registers the Service Worker; afterwards the site opens offline. Installation (Chrome/Edge): install icon in the address bar or the *Install as an app* button in the "Data and backups" tab.
4. After an update the Service Worker may serve the previous version once; reload twice (or bump `V` in `sw.js`).
5. Netlify serves over HTTPS, which Service Workers require.
