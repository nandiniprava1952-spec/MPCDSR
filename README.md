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

## Facility logins (SNCU / NBSU and all facilities)
- A **district** login clicks **🏥 Facility logins** (top bar). The list has the district's SNCU/NBSUs plus every facility from the facility master (PHC, CHC, UPHC, SDH, DHH, MCH, SC, UHWC, AHWC, ...). Filter by type or search by name/code, enter or generate (🎲) a passcode per facility, then download a *logins file* + a passcode list (keep the list private).
- Each facility opens the dashboard, taps **Load facility logins file** (once per device), picks its district, then its facility, and enters its passcode.
- Facility logins work on **CDR** only: they see/add/edit the records whose *Name of facility* is their facility, and can save them to the cloud (other facilities' and blocks' records are never touched). They cannot delete cloud records.
- Facility master (`FACILITY_MASTER`, from facility.csv) is embedded in `index.html`; to refresh it, regenerate that constant.

## Passcode lists (private)
`facility_passcodes.zip` (kept OUTSIDE this repo) holds one passcode per facility. In a district login: **Facility logins > Import passcode list (CSV) > Create logins file**. Never upload the passcode CSVs to GitHub.

## Language
A **ଓଡ଼ିଆ / English** button (bottom-left) switches the whole interface; the choice is remembered on the device. Data, district/block/facility names and exported files stay as entered.
