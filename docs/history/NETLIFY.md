# Publishing on Netlify
1. Netlify Drop (https://app.netlify.com/drop) or, for an existing site, **Deploys → drag and drop** the file `index.html` (a folder containing only `index.html` also works).
2. To update the site you already published, upload the new `index.html` through the site's **Deploys** page.
3. No build step, no server code. The page is static and works over HTTPS; localStorage/IndexedDB data are per-origin, so data created on the old URL does not follow to a new Netlify URL — export a backup in the "Data & Backups" tab first and restore it on the new address.
