# FOTITAS

Instant thermal photo camera as a single-file web app. Runs in Bluefy (iPhone) or Chrome, prints over Web Bluetooth.

- App: `index.html` (vanilla JS, no build step). Live at GitHub Pages (HTTPS, needed for the live camera).
- Docs: `docs/APP-REFERENCE.md` (architecture, IDs, behaviours), `docs/BUGS-FIXES-LOG.md` (bugs, fixes, decisions), `CHANGELOG.md`.
- Tests: `tests/t4.js` (jsdom simulation, not hardware). `cd tests && npm i jsdom @napi-rs/canvas && node t4.js ../index.html`

Printers: Phomemo M02X (`ff00`), cat/MXW01 (`ae30`, unverified). Real-printer behaviour is verified by hand from the on-screen debug log.
