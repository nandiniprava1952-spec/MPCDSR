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
- Facility logins are **built into the page** (`FACILITY_ACCESS` in `index.html`), like the block logins. There is no logins file to load.
- A facility officer opens the dashboard, picks their district, then their facility (SNCU/NBSU in the second list; PHC, CHC, SC, etc. in the Block / Facility list, shown with the facility code) and enters the facility's passcode.
- Facility logins work on **CDR** only: they see/add/edit the records whose *Name of facility* is their facility, and can save them to the cloud (other facilities' and blocks' records are never touched). They cannot delete cloud records.
- Each entry holds the district's cloud passcode encrypted under the facility's passcode (PBKDF2 + AES-GCM). No passcode or hash of it is stored in the page.
- Facility master (`FACILITY_MASTER`, from facility.csv) is embedded in `index.html`.
- **If a district passcode changes, or facilities are added/renamed,** the entries must be regenerated from the private passcode list and the new district passcodes, and `index.html` republished.

## Passcode lists (private)
`facility_passcodes.zip` (kept OUTSIDE this repo) holds one passcode per facility; give each facility only its own. Never upload the passcode CSVs to GitHub.

## Deleting records
- **📋 Records** lists the records a login can see. Block, district and state logins can delete them (facility logins cannot):
  - **One record:** **🗑 Delete** on its row, or inside **👁 View**.
  - **Several:** tick the boxes (the header box ticks every row shown), or click **☑ Select all N matching** (it follows the search filter), then **🗑 Delete selected (N)**. Changing the filter clears the selection, so nothing hidden is ever deleted.
- Deleting 10 or more records asks you to type `DELETE` as well as confirm. The confirmation lists the count per district / block.
- Scope: block login = own block only; district login = own district; state login = any district.
- Records are removed from the cloud immediately. If a cloud call fails for a district, that district is left unchanged and named in the status line; its records stay in the list so you can retry.
- The bulk **🗑 Delete cloud records** button is unchanged (district and state logins only).

## Language
A **ଓଡ଼ିଆ / English** button (bottom-left) switches the whole interface; the choice is remembered on the device. Data, district/block/facility names and exported files stay as entered.
