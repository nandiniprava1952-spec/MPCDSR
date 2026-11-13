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

## SNCU / NBSU logins
- A **district** login clicks **🏥 SNCU/NBSU logins** (top bar), generates a passcode per SNCU/NBSU of that district and downloads a *logins file* + a passcode list (keep the list private).
- Each facility opens the dashboard, taps **Load SNCU/NBSU logins file** (once per device), picks its district, then its facility, and enters its passcode.
- Facility logins work on **CDR** only: they see/add/edit the records whose *Name of facility* is their facility, and can save them to the cloud (other facilities' and blocks' records are never touched). They cannot delete cloud records.
