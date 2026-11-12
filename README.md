# MPCDSR Dashboard (PWA)

Installable, mobile-friendly web app. Hosted free on GitHub Pages.

## Files (upload all of them, keep the folder structure)
- `index.html` - the dashboard
- `manifest.webmanifest` - app name, colours, icons
- `sw.js` - service worker (offline app shell)
- `icons/` - app icons
- `.nojekyll` - optional

## Publish
1. New **Public** repository on github.com (e.g. `mpcdsr-dashboard`).
2. **Add file > Upload files**, drag in everything above (include the `icons` folder), **Commit**.
3. **Settings > Pages > Source: Deploy from a branch**, branch `main`, folder `/ (root)`, Save.
4. Open `https://<your-username>.github.io/mpcdsr-dashboard/` after a minute or two.

## Install on a phone
- **Android (Chrome):** tap **Install app** (or menu > Install app / Add to Home screen).
- **iPhone/iPad (Safari):** Share button > **Add to Home Screen**.
- **Desktop Chrome/Edge:** install icon in the address bar.

## Updating
Replace `index.html` and commit. Installed apps pick up the new version the next time they open online. If you change `sw.js` or the icons, bump `VERSION` in `sw.js` (e.g. `mpcdsr-v2`).

## Notes
- PWAs need HTTPS; GitHub Pages provides it. Opening the file directly from disk will not install.
- Cloud records and login still call your Google Apps Script (deploy it with access "Anyone"). These calls are never cached, so records need a connection; the app shell itself opens offline.
