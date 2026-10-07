# Next Lesson Plan

Status: approved (owner said yes to white-desert.com on 2026-10-08)
Lesson: 003
Date: 2026-10-08 (morning run 07:52 Europe/Stockholm)
Planned: 2026-10-08 00:30, replaced 2026-10-08 00:50

Replacement history:
- boc.studio (layout and grid): the owner chose the backup instead.
- seasats.com (the backup, scroll motion): not usable. It stays on its preloader in headless Chromium after 45 seconds on desktop and mobile, so it cannot be studied live. (The first version of this file wrongly said it captured OK; the screenshots had not been checked.)
- Chosen instead: the strongest scroll-motion site that renders headless.

## Site

- **URL:** https://white-desert.com
- **Found in:** Awwwards Site of the Day, 11 Sep 2026 (https://www.awwwards.com/sites/white-desert)
- **Area:** Scroll motion (last three: imagery and art direction, WebGL and 3D)
- **Headless check:** captured OK on 2026-10-08 00:45, desktop 15 scroll stops, screenshots checked by eye.

## Technique to learn

**Scroll-scrubbed editorial reveals for a luxury travel story.** Three linked moves, all tied to scroll position:
1. A large serif statement whose words light up one by one from pale to ink as you scroll through it, signed off with a handwritten signature line that draws in.
2. An image revealed through vertical slices: the photo is cut into tall strips that open at staggered speeds, with a centered serif title over it.
3. A pinned section where landscape cards slide horizontally across a full-bleed textured background, each card with a title, short copy and coordinates.

Why it qualifies: premium (luxury hospitality, Awwwards SOTD), reproducible with CSS scroll-driven animations (`animation-timeline: view()` / `scroll()`) and a small GSAP ScrollTrigger fallback, and no lesson or skill covers scroll motion yet.

## Planned demo

An invented polar expedition company (working name "Kalde Reach", Tromsø) with: full-bleed hero with huge condensed title, a word-by-word lighting statement with an SVG signature that draws on scroll, a sliced image reveal, a pinned horizontal track of three camp cards over a CSS/SVG-generated ice texture, a trips grid, and an enquiry footer. All imagery original: CSS/SVG gradients and generated textures, no copied photos.

## Morning steps

1. Fetch the branch, re-read PROTOCOL.md and this file.
2. Capture https://white-desert.com again; study the three moves frame by frame in the scroll video (start/end points, easing, how long each stays pinned) and on mobile. Read `report.json` for fonts, sizes and colors.
3. Build each move with native CSS scroll-driven animations first; feature-detect `CSS.supports('animation-timeline: view()')` and fall back to GSAP ScrollTrigger (pinned versions) where unsupported.
4. Reduced motion: every element shows in its final state, no pinning, horizontal track becomes a normal vertical list.
5. Build the full demo page, then write `skills/scroll-reveal-story-skill/SKILL.md` with code identical to the demo.
6. Run `verify-demo` until OK, also screenshot mid-scroll inside the pinned track and mid-reveal states, fix at least three visual flaws, verify again.
7. Score with the quality gate (needs every criterion at least 4 and total at least 36/40), write the lesson file, register everywhere, set this file to `Status: done`, commit `Lesson 003: Scroll-scrubbed editorial reveals (scroll motion)`, push, notify.

## Backup

https://www.cerebrium.ai (Awwwards SOTD, 10 Sep 2026): sticky feature list that highlights the active item while product panels scroll past, plus a dark-to-light section handoff. Area: scroll motion. Captured headless on 2026-10-08 00:45, screenshots checked by eye.
