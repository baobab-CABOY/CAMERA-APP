# FOTITAS: App Reference (V1.1)

Single-file web app (`FOTITAS-V1.1.html`, vanilla JS, inline CSS, no libraries). Runs in Bluefy on iPhone (primary) and Chrome on macOS (debug). Project: Tiniburn.

## 1. Status
- Current build: **V1.1** (`/mnt/user-data/outputs/FOTITAS-V1.1.html`, ~214 KB). V1 kept as `FOTITAS-V1.html`.
- Tested only in jsdom with a fake canvas, a fake printer characteristic and fake cameras. Syntax checked with `node --check`.
- **Never tested on real hardware:** BLE connect and printing, getUserMedia camera, real heat behaviour, Weird Scanner live-print pacing, Web Share and download in Bluefy, large `.fotitas` exports on iPhone memory.
- Hosting: GitHub Pages (HTTPS). The file-input camera fallback always exists.

## 2. Hardware and protocols
| Printer | Service | Characteristics | Framing | Status |
|---|---|---|---|---|
| Phomemo **M02X** (driver `phomemoDriver`) | `ff00` | write `ff02` (writeWithoutResponse), 160 B chunks, ~20 ms sleep | M02X raster | Worked in earlier builds, per the user |
| Cat / **MXW01** (JEPEErbz C9, P/N JP24) | `ae30` | cmds `ae01`, notify `ae02`, bulk `ae03` | `0x22 0x21` + CRC8 | **Unverified**; GB01 `0x51 0x78` kept as fallback |

- Width 384 px (48 bytes per row). Burn = 1 = black. Bit order and command sequence must be verified from the debug log.
- Rows per cm ≈ 80 (`cm = rows / 80`).
- Printer is chosen in the top-bar select (`printerModel`: M02X / MXW01).

## 3. Pipeline
capture → `src` → crop/rotate/mirror → resize to 384 → adjust (brightness, contrast, gamma, threshold, invert) → dither (Dot: Floyd-Steinberg / Atkinson; Normal: threshold) → `last = {mono, w, h}` → driver `printBitmap`.

Key globals and functions:
- `src = {el, w, h, mod?, pano?, layers?, keepView?, opticLong?}`; `mod` ∈ `stereo para dexp zine optic booth weird scan fresco` (drives tab dots and roll labels).
- `rot`, `mirror`, `sidewaysBanner` (internal only now; the Banner button is removed, the Fresco still uses it for sideways review).
- `cropRect()`, `clampCrop()`, `applyZoom()`, `lockY()`, `zoomChanged()`, `fitView` (contain fit).
- `computeGrayForSize`, `srcBoxFor`, `composeFresco(box,k)`, `renderBitmapToView(imgObj, tagNote, disp, ov)` (stores `lastArgs`), `draw()`, `schedule()`.
- Poster: `buildPosterStrips`, `posterGap`, `activeStripIdx`, `selectedStrips`.
- Heat: `heatAdd`, `heatTick`, `heatWait(target, jobId)`, `monoDots`, `heatSafe` checkbox, `heatBudget`.
- Print session: `sessionOpen/sessionClose`, `makeSink`, `streamAbort`, `printerReady`, `m02xWrite`, `masterStop`, `panicStop`.
- Tab dots: `updTabDots()` (called at the end of `renderBitmapToView` and in scan start/stop).
- Look: `LOOKS`, `LOOK_NAMES`, `currentLookKey`, `lookCustom`, `applyLook(key)`, `refreshLookBadge()`, `setLookUI()`.
- Roll: `historyQueue`, `snapshotState()`, `collectForm()/applyForm()` (skip set `FORM_SKIP`), `saveToHistory(img, auto)`, `loadRollItem(it)`, `renderHistory()`, `exportRoll()`, `importRollFile(f)`, `serializeItem/deserializeItem`.
- Fresco: `panoFrames`, `frescoLayout(frames,horiz,ovPct)`, `updFrescoStatus()`, `addPanoCanvas(cv)`, `moveFrame`, `removeFrame`, `stitchPanorama(andScroll, quiet)`, `stitchSoon`, `frameStats`, `FR_BUDGET = 48e6`.
- Styling: `setTheme(t, quiet)` with localStorage key `fotitasTheme`.

## 4. UI map

**Top bar:** printer model select · Bluetooth-icon connect button (`btnConnect`) · ALL chip (`bleAll` checkbox) · FOTITAS logo (`.logo-fotitas`) · heat chip · battery chip · red Stop (`btnPanic`).

**Capture and Source:**
1. Live (`btnLive`, orange) | 🤳 Selfie
2. Scan (`btnScan`) | Booth (`btnBooth`), with option rows `scanSecs` (1–30 s) and `scanDir` (`v` / `h` / `r` = random pixels and clusters), `boothCount`, `boothDelay`
3. Camera | Library
4. Rotate | Flip

**Tabs** (each has a `.tab-dot`, glowing when the module is active; only Look shows text):
Look (`lookBadge`, shows "Custom" when edited) · Stereo / 3D · Double exposure · Poster · Zine maker (Type, Cipher, Optic) · Weird Scanner · Parallax · Fresco.

**Weird Scanner controls:** `weirdSweepDir` (v/h), `weirdPrint` (on/off), `weirdStep` (5–30), `weirdScanSpeed` (20–640 lines/s, default 80), `weirdLineMs` (12–80 ms per line sent, default 25), single toggle `btnStartWeirdScan` ("▶ Start Scanner" / "■ Stop & keep image").

**Fresco controls:** Snap Frame, Add Files, Clear, frame list (reorder / remove), `panoDir`, `panoMaxCm` (50 / 100 / 200 / 300 / 500 cm, default 200), `panoOverlap`, `panoExp`, status line `panoBadge`. There is no max-frame setting and no Stitch button (auto).

**Camera Roll:** Export (`btnRollExport`), Import (`btnRollImport`, `fRoll`), Clear, items with Load and ✕.

**Advanced console:** 🎨 Styling (5 looks), version label, debug log, BLE tools.

**Themes:** Zine (default, no attribute), Game Boy, Terminal, Vapor, Blueprint, via `html[data-theme=...]` CSS variables.

## 5. Behaviours worth remembering
- **Weird Scanner:** time-based up/down oscillation; up to 8 slices per animation frame; with print on, it is gated on the queue (<2) so it never builds a backlog; each slice is paced to `h * weirdLineMs`; heat-safe wait if `heatTick() > 100`. With print off, Stop stores the image (`src.mod='weird'`) and you print normally.
- **Fresco:** frames are stored near-native (long side ≤ 4096) inside a 48 MP total budget. A frame is refused with a log message if the memory budget is full or the stitched length would exceed `panoMaxCm`. One frame = plain source. Two or more = layered compose with exposure match and feather. **Zoom and X/Y are view-only:** `cropRect()` returns the full rect when `src.pano`, and `renderBitmapToView` shows a window of the finished print.
- **Roll items** are snapshots: all form values except connection, scan and zoom settings; the view globals; the source image or frames; module inputs. Auto-saves are de-duplicated. Max 30 items.
- **`.fotitas` file:** JSON with `magic: "FOTITAS-ROLL"` and `version: 1`. Sources are PNG when ≤ 1.6 MP, else JPEG 0.9, capped at ~2600 px (frames 3000, mods 1600). Mono-only items are bit-packed base64. Export uses Web Share when possible, else a download.
- **Look badge:** shows "Custom" when mode, br, ct, gm, th or invert differ from the active look.

## 6. Working rules (from project instructions)
- Short replies, a numbered test list, and tell the user which milestone we're on.
- Label guessed protocol details "unverified"; diagnose from the pasted debug log.
- Small changes go out as exact find/replace edits; whole file only when needed.
- Keep the image pipeline separate from the printer drivers.
- Test harness (in `/home/claude/tools`): `t4.js` (V1.1 suite), `node t4.js <html>`.

## 7. Known gaps and ideas
- Verify MXW01 command sequence, bit order and CRC on the real printer.
- Tune `weirdLineMs` and heat limits on hardware.
- Roll lives in memory only. It is lost on reload unless exported (no IndexedDB yet).
- Possible later phase: ESP32-S3 serving the UI over its own Wi-Fi AP (file-input camera only).
