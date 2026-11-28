# Changelog

## V1.2.1
- **Bug fix:** a stray `</div>` in the V1.2 Fresco tab closed the tab body early, so the Overlap and Exposure sliders showed outside the closed tab.
- **Tabs:** indicator is now just a round green dot, visible only when the module is in use (no switch look).
- **Endless Weird:** new "Reverse on the way up" option (Yes / No).
- **Look:** new **Off** look (after Blueprint, also Shader "Off"): no filter at all. Preview and Save keep original colors and full resolution (crop, rotate and flip still apply; frame, caption and strips are ignored; capped at 16 MP / 8192 px). Print still works with a basic Floyd-Steinberg fallback. Export file is now `fotitas-<time>.png`.
- **Fresco cool-off:** two settings: Rest every 0.5 / 1 / 2 / 3 (default) / 5 / 10 cm, and Rest for Off / 1 / 2 (default) / 3 / 4 / 6 / 8 / 12 / 15 s. Print blocks shrink to the rest interval (min 40 rows).

## V1.2
- **Intro art:** replaced by the new animated GIF (384 px wide, 4 colours, 72 KB), shown on a white paper-shaped sheet (16:9) in the black stage, as it would print.
- **Desktop live view:** the webcam now shows the whole frame (no crop) and behaves like a mirror (move left, image moves left). Desktop only; phones unchanged. The captured photo matches the preview.
- **Frames:** Polaroid has a thick black outline (plus a thin line around the photo). Postage Stamp frame removed.
- **Endless Weird** (was Weird Scanner): every line is appended to one endless image (scan twice as long = twice as long image). Lines per step now has "1 · continuous". Going up, each step is read in reverse. On-screen window scrolls like paper coming out. Stored image keeps the newest 24000 rows (~3 m); live print has no limit.
- **Tabs:** status indicator is now a larger toggle-style switch, green = module in use.
- **Fresco:** removed max paper length (technical cap 40000 rows, silent). Added Line send delay and Overheat guard (rest 4 / 8 / 15 s every 10 cm, default Normal 8 s).

## V1.1.1
- Removed the FOTITAS text logo from the top bar.
- Added the kawaii printer artwork as an animated placeholder (gentle bob) on the main stage. Shown when no image is loaded, no live camera and no scan; hidden as soon as any image appears, back when cleared. Embedded as base64 (single file kept), respects reduced-motion.

## V1.1
Top bar redesign, FOTITAS logo, single Stop; Scan/Booth side by side, random scan mode; Banner removed; Weird Scanner rewrite (up/down, print on/off, line delay, scan speed); Fresco auto-stitch with paper limit and view-only zoom; Roll with full snapshots and `.fotitas` export/import; tab status dots, Look "Custom" badge; 5 styling themes.

## V1
First FOTITAS build (from Zinester build 25): heat model, fresco, poster, roll.
