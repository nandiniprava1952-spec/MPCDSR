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
Replace `index.html` and commit. Installed apps pick up the new version the next time they open online. **Every release: bump `VERSION` in `sw.js` (e.g. `mpcdsr-v32`)** - installed apps detect a new version by a change in `sw.js`, which triggers the in-app update card below.

## Notes
- PWAs need HTTPS; GitHub Pages provides it. Opening the file directly from disk will not install.
- Cloud records and login still call your Google Apps Script (deploy it with access "Anyone"). These calls are never cached, so records need a connection; the app shell itself opens offline.

## Facility logins (SNCU / NBSU and all facilities)
- Facility logins are **built into the page** (`FACILITY_ACCESS` in `index.html`), like the block logins. There is no logins file to load.
- A facility officer opens the dashboard, picks their district, then their facility (SNCU/NBSU in the second list; only CHC, SDH, DHH and MCH in the Facility type list, shown with the facility code) and enters the facility's passcode.
- Facility logins work on **MDR and CDR**: they see/add/edit the records whose *Name of facility* is their facility, and can save them to the cloud (other facilities' and blocks' records are never touched). Every death entered is an institution death: *Place of death* is fixed to **Health Facilities** (MDR) or **Public facility** (CDR), and the facility name is fixed to the login's facility. They cannot delete cloud records.
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

## Login screen background
The login screen uses a full-screen photo (mother and child at sunset), embedded in `index.html` as the `data:` URL inside `<style id="mp-login-bg">`. To change the picture, replace that `url(data:image/jpeg;base64,...)` value (a JPEG/PNG/WebP data URL works). The photo is only visible on the login screen; it disappears after login.

## Language
A **ଓଡ଼ିଆ / English** button (bottom-left) switches the whole interface; the choice is remembered on the device. Data, district/block/facility names and exported files stay as entered.

## Install badge and Online / Offline status
- A top-left badge cluster appears on the login/cover page: a blue **Install app** badge (hidden once installed or dismissed) and a status pill with a green **Online** dot that turns into a yellow **Offline** dot when the connection drops (checked on the browser's online/offline events and every 15 s with a small request to this site, so Wi-Fi without internet is caught too).
- Chrome/Edge/Android use the native install prompt; iPhone Safari and other browsers show how to install when the badge is tapped.
- After login the same badges move to the bottom-right corner.

## In-app updates
- The app checks for a new version when it opens, when you come back to it, and every 30 minutes.
- If one exists, a card appears at the top: a progress ring with a percentage ("Downloading update..."). At 100% it becomes **Update available** with **Update** and **Later**. Later hides the card until the next check.
- **Update** shows a spinning ring ("Installing update..."), the app restarts by itself, and "✔ Updated to the latest version" appears.
- Nothing is swapped in until the person taps Update, so nobody loses work in the middle of data entry.
- A new version is only offered when `VERSION` in `sw.js` has changed (see Updating above).

## Kobo sub-centre reports (MDR + CDR)
- Submissions of the Kobo form (`mpcdsr_subcentre_report`) are pulled by the Apps Script (`MPCDSR_Code.gs`, see its header for the three Script properties and the one-time `koboSyncAll` / `installKoboTrigger` steps), stored per module and district, and merged into the MDR and CDR records after login/Load latest, together with the SNCU/NBSU-linked CDR deaths. Records already loaded are never duplicated (matched on the Kobo submission id).
- **Reported by ASHA** and **Reported by Ward member** KPI cards (CDR and MDR Overview) count these records by the form's *Reporter designation*.
- After changing `MPCDSR_Code.gs`: Deploy > Manage deployments > edit > **New version**.
