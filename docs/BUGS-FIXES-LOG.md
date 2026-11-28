# FOTITAS: Bugs, Fixes, Elements and Decisions Log

Newest first. "Verified" means checked in the jsdom simulation only unless it says hardware.

## V1.2.1 (simulation-tested only)
| Item | Change | Notes |
|---|---|---|
| Fresco tab layout bug | My V1.2 HTML edit left an extra `</div>`; the Overlap/Exposure sliders fell outside `#tabPanoBody` (seen in the user's screenshot). Removed it | Test: `tabPanoBody.contains(panoOverlap)` |
| Tab dot | `.tab-dot` = 14 px round, `opacity:0` when off, green glow when `.on` | Toggle look removed (looked clickable) |
| Endless reverse | `weirdReverse` select (yes default); in `FORM_SKIP` | |
| Off look | `LOOKS.off`, Shader option `off`, `drawOff()` + `drawRegionColor()`; `last.color` holds the colour canvas; `renderBitmapToView` draws it (smooth, not pixelated); `exportCurrentImage` saves `last.color`; `ditherGrayToMono` maps `off` to `fs` for any other caller | Vertical fresco drawn upright (rot 3 → 0 temporarily). Roll restores via form (`mode=off`) + source |
| Fresco cool-off | `panoRestEvery` (cm) + `panoRest` (s); `frescoPace().rows`; bands shrink to the interval | M02X only. Cat/MXW01 still no rests (unverified) |

## V1.2 (simulation-tested only, not yet on the phone)
| Item | Change | Notes |
|---|---|---|
| Live view on computer cropped | `#vidWrap` was `aspect-ratio:4/3` + `object-fit:cover`. Desktop now sets the aspect ratio from `videoWidth/videoHeight` and `object-fit:contain`; `html.desktop` raises max-height to 64vh | `DESKTOP` = fine pointer, no coarse pointer, not iPhone/iPad/Android |
| Live view inverted on computer | Webcam reports no `facingMode`, so `facing` stayed `environment` (no mirror). Desktop with no facingMode now sets `facing='user'` | Capture and scans mirror with the preview (existing `facing==='user'` logic) |
| Polaroid | Thick black outline (6 px) + thin photo outline in `composeWithFrame` | Postage Stamp frame removed (option, pads, drawing). Old roll items with `frame=stamp` fall back to no frame |
| Endless Weird | Rewritten: `endlessAppend` (1024-row segment canvases), `grabWeirdSlice(...up)` reverses rows in the slice on the up pass, tail canvas scrolls on screen, sender merges queued slices (≤12 rows per push), gate = queued rows ≥ max(2·step, 12) | Step 1 added; per-RAF cap 8 → 24 slices. Stored image cap 24000 rows. Roll export no longer shrinks long thin images (`encodeEl` area rule) |
| Tab indicator | `.tab-dot` is a 34×18 toggle switch; `.on` = green with glow | Per-tab colours no longer used (`--dotc` ignored) |
| Fresco | `panoMaxCm` removed; `FR_MAXROWS = 40000` silent cap; added `panoLineMs` (per-row pacing, M02X bands and cat data loop) and `panoRest` (rest every 800 rows, M02X only) | Both ids in `FORM_SKIP` (printer settings, not roll content). Cat/MXW01 rest breaks not implemented (pausing mid-job unverified) |
| Tests | 38 checks incl. endless length grows with time (1.5 s → ~950 rows, 3 s → ~1900 rows at 640 lines/s), polaroid outline row black, rest breaks counted (3200 rows → 3 rests) | Simulation only |

## V1.1.1 (user-tested: "it works")
- Top bar logo removed (user: "horrible as is"). Empty-stage artwork added: `#emptyArt` / `#emptyImg`, toggled by `updEmptyArt()` (300 ms poll: `!src && !last && vidWrap.hidden && slitCv.hidden && !slitActive`).
- Tests updated (`tests/t4.js`): logo absent, art shown at start, hidden with an image, back when cleared. 33 checks pass (simulation).

## V1.1 changes (all simulation-tested, none hardware-tested)
| Area | Change | Notes |
|---|---|---|
| Top bar | Removed the "zinester print lab" text bar; added the FOTITAS logo; model-only select; Bluetooth-icon-only connect; ALL chip; single Stop | `btnDisc` and its JS refs removed; `connLabel` removed |
| Capture | Scan and Booth side by side; Live orange | Scan option rows added |
| Scan | New random mode (`scanDir='r'`): shuffled cell grid, single cells plus ~35% clusters of 2–4, fills any unfilled cells at the end | Tested at 1 s |
| Banner | Button, handler and all `btnBanner` refs removed | `sidewaysBanner` kept internally for Fresco |
| Weird Scanner | Rewritten: up/down oscillation, gradual build, print on/off, line delay, scan speed, one Start/Stop toggle | Live-print pacing **unverified on hardware** |
| Fresco | Removed max-frame and Stitch button; added paper limit and memory budget; auto restitch on add / remove / reorder; view-only zoom | |
| Roll | Full snapshots; Export / Import `.fotitas`; per-item delete | |
| Tabs | Right-side text removed except Look ("Custom"); status dots on the rest | Hidden legacy spans kept so old JS writes don't throw |
| Styling | 5 themes, persisted | Only the Zine and Game Boy attributes were checked in tests; look at the others on the phone |

## Bugs found and fixed
| # | Bug | Cause | Fix | Version |
|---|---|---|---|---|
| 1 | After clearing a vertical Fresco, the next image stayed rotated | Clear handler left `rot=3` | Clear handler now sets `rot = 0` | V1 |
| 2 | Weird Scanner printed unevenly, stalled, "buggy" vs build 21 | Slices were sent without pacing; no backlog control | Sender paces each slice to `h * weirdLineMs`; the scanner only advances when the queue is below 2; heat-safe wait added | V1.1 (hardware check pending) |
| 3 | Fresco X/Y and zoom altered the print | `cropRect()` cropped the source | Full rect when `src.pano`; zoom only crops the displayed preview | V1.1 |
| 4 | Roll "Load" lost settings and modules | Old roll stored only the 1-bit bitmap | Snapshot of form, globals, source or frames, module images | V1.1 |
| 5 | Tab headers showed stale text (e.g. "live view") | Per-tab text badges | Replaced with `.tab-dot` driven by `src.mod` and state | V1.1 |
| 6 | (Test harness only) `scrollIntoView is not a function` in jsdom | jsdom lacks it | Stubbed in `t4.js`. Not an app bug | n/a |
| 7 | (Test only) the paper-limit test did not trigger | 50 cm was above the 35 cm stitch | Test now uses a 20 cm limit; refusal verified (6 → 6 frames) | n/a |

## Test results (V1.1 suite `t4.js`, all pass)
Top bar and order · capture order · no `btnBanner` · scan modes `v h r` · random and vertical scan end with `src.mod='scan'` · weird scanner prints (writes counted), stops and keeps the image · print-off writes 0 · fresco add 6 frames, reorder, paper limit refusal · view zoom leaves `last` unchanged · roll save / load for fresco and photo · export → import round trip restores fresco and photo · themes switch · M02X dry-run print adds heat.

## V1.3 BETA fixes (found in testing)
- QR: column zig-zag skipped the wrong column after the timing pattern (left holes in the matrix). Fixed (`col === 6 → 5`).
- QR: alignment patterns on the timing row/column (v7+) were skipped because timing cells counted as taken. Now only finder corners are skipped.

## Open observations (not yet bugs)
- Endless Weird up-pass "reverse" is read as: rows inside each slice are flipped on the up pass (with step 1 the up pass is the scene mirrored vertically). If you meant something else (e.g. the whole up-pass strip reversed), tell me.
- Fresco rest/line-delay timing is unverified on hardware.
- Imported fresco rebuilt to 384×2458 vs 384×2432 for the in-memory one. Likely caption or stamp rows or the re-encoded frames; check on the phone, and compare exact heights in the next test pass.
- Roll is memory-only (lost on page reload unless exported).
- The `.fotitas` file can get large (~280 KB for 2 items in test; real photos will be several MB each). Watch iPhone memory with 30 items.
- In the weird-scanner dry run, `info` shows "printing" correctly, but real pacing depends on the printer's ~40 rows/s (estimated from earlier logs, **not measured**).

## Decisions
- Keep GB01 (`0x51 0x78`) as a fallback until the MXW01 name and characteristics are confirmed in the debug log.
- Fresco memory budget 48 MP total, 4096 px long side; paper length = `long/short × 384 / 80` cm.
- Banner removed from the UI only; the internal sideways flag stays because the vertical Fresco needs it.
- Themes use CSS variables only; the default Zine look has no `data-theme` attribute.

## Next things to verify on the phone (priority order)
1. Connect M02X, print a normal photo (regression check).
2. Weird Scanner live print: continuity and pacing; tune `weirdLineMs`.
3. Fresco 3+ frames: limit, zoom, print.
4. Roll Load exactness, then Export, reload, Import.
5. MXW01 connect: paste the debug log (device name, services, characteristics).

## BETA lab: to verify on the phone
1. Strip booth, Time smear, Time-lapse: camera start, countdown, Stop.
2. Doodle: finger drawing, undo, page scroll not hijacked.
3. Add photos (file picker) in Sticker, Collage, Morph B.
4. Scan a printed QR with a phone camera.
