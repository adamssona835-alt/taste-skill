# Next Lesson Plan

Status: pending
Lesson: 004
Date: 2026-10-09 (morning run 07:52 Europe/Stockholm)
Planned: 2026-10-08 23:58

## Site

- **URL:** https://www.odysseeclinic.com.au/
- **Found in:** Awwwards Site of the Day, 8 Oct 2026 (https://www.awwwards.com/sites/odyssee), by NIGHTJAR. Tags: Luxury, Minimal, Transitions, Microinteractions, GSAP, Next.js.
- **Area:** Micro-interactions (last three: scroll motion, imagery and art direction, WebGL and 3D)
- **Headless check:** captured 2026-10-08 23:50, desktop 11 scroll stops and mobile, screenshots checked by eye: photography, type and the feature row all render.

## Technique to learn

**The focus rail.** A "Why us" row of four columns where exactly one is in focus: its image at full strength, its serif title dark, its paragraph visible. The other three sit at about 15 percent, title and image together. Above the row, a counter reads "3 : 4" and a hairline across the full width fills to the active item. Focus moves on its own on a slow timer, and hover, click and keyboard take it over. Around it: cream paper, navy ink, a thin serif for statements and a small sans for UI, and photo pairs that crop into each other.

Why it qualifies: premium (luxury clinic, Awwwards SOTD and Developer Award), reproducible with plain CSS and about 40 lines of JS, and not covered in `lessons/` or `skills/` (no lesson yet on interaction states, timers or keyboard-driven selection).

The craft to get right: dimming without losing contrast for the parts that must stay readable, pausing the timer on hover and focus and under reduced motion, an ARIA tabs pattern that screen readers and keyboards can actually use, a progress line that never jumps backwards, and a mobile version that becomes a swipe row with scroll-snap.

## Planned demo

An invented dermatology clinic ("Halde Klinik", Gothenburg): cream and ink-blue, hero with a cropped photo pair (original generated imagery: soft skin-tone gradients and macro textures of serum drops in canvas), a statement paragraph, the focus rail with four reasons ("Assessment first", "One clinician, start to finish", "Combined protocols", "Follow-up at 12 weeks"), a treatments index with hover previews, and a booking footer.

## Morning steps

1. Fetch the branch, re-read PROTOCOL.md, PRINCIPLES.md, IMPROVE.md and this file.
2. Capture https://www.odysseeclinic.com.au/ again. Study the rail frame by frame in the scroll video (timer length, fade timing, how the progress line moves), the menu overlay and the hover states. Read `report.json` for fonts, sizes and colors.
3. Build the rail: `role="tablist"` with `aria-selected`, roving `tabindex`, arrow keys, a timer that pauses on hover, focus-within, hidden tab and reduced motion, and a progress line driven by a CSS custom property.
4. Mobile: the rail becomes a horizontal scroll-snap row; the active item follows the snap position (IntersectionObserver), no timer.
5. Build the full demo page, then write `skills/focus-rail-skill/SKILL.md` with code identical to the demo.
6. Run `verify-demo` (all passes, `--stops 20`) until OK, look at every contact sheet including fallback and reduced, fix at least three visual flaws, verify again.
7. Score with the quality gate (every criterion at least 4, total at least 38/40), write the lesson file, register everywhere, set this file to `Status: done`, commit `Lesson 004: Focus rail (micro-interactions)`, push, notify.

## Backup

https://twks.ch/en (Awwwards SOTD, 7 Oct 2026, Geneva agency): Swiss grotesk typography with an inline glyph inside the headline and a two-column "what we do" split. Area: typography. Captured headless on 2026-10-08 23:50, screenshots checked by eye.
