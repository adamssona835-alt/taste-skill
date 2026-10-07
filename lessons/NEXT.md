# Next Lesson Plan

Status: pending
Lesson: 003
Date: 2026-10-08 (morning run 07:52 Europe/Stockholm)
Planned: 2026-10-08 00:30 (evening plan made late for this first run)

## Site

- **URL:** https://boc.studio
- **Found in:** Awwwards Site of the Day, 19 Sep 2026 (https://www.awwwards.com/sites/boc-studio)
- **Area:** Layout and grid (last three: imagery and art direction, WebGL and 3D)
- **Headless check:** captured OK on 2026-10-08 00:28, desktop and mobile, no page errors, 5 scroll stops each.

## Technique to learn

**Justified project strips.** The work index puts each project on one row made of several images and videos with different aspect ratios. Every item in a row is sized to the same height so the row fills the full content width exactly, with no cropping and no gaps left over. A row has a small caption line underneath (name, one-line idea, "View project"). A sticky left column holds "Work / All / Filter +". A thin accent bar at the top shows a live clock and a status word, and an orange marquee band breaks the dark hero.

Why it qualifies: premium (studio-grade work index), reproducible with plain CSS (`flex-grow` set to each item's aspect ratio) plus a few lines of JS, and not covered in `lessons/` or `skills/`.

## Planned demo

An invented studio (working name "Ferro Atelier", Lisbon) with a dark work index: hero with marquee band, sticky filter column, 6 to 8 justified project strips built from original procedural or CSS-generated images (no copied media), filter chips that re-flow the strips with View Transitions, an about block, and a contact footer.

## Morning steps

1. Fetch the branch, re-read PROTOCOL.md and this file.
2. Capture https://boc.studio again; study the work index at desktop and mobile (how rows break, caption line, sticky column, hover states). Read `report.json` for fonts, sizes and colors.
3. Build the CSS-only justified row (`flex: <aspect> 1 0`, `aspect-ratio` on each item) and test edge cases: one-item rows, very wide panoramas, last-row behavior, mobile fallback to two-up or a horizontal scroll strip.
4. Add filtering with `document.startViewTransition` (fallback: instant), keyboard-accessible chips with `aria-pressed`, reduced motion skips the transition.
5. Build the full demo page, then write `skills/justified-strip-skill/SKILL.md` with code identical to the demo.
6. Run `verify-demo` until OK, screenshot dark/hover/filter states too, fix at least three visual flaws, verify again.
7. Score with the quality gate (needs every criterion at least 4 and total at least 36/40), write the lesson file, register everywhere, set this file to `Status: done`, commit `Lesson 003: Justified project strips (layout and grid)`, push, notify.

## Backup

https://seasats.com (Awwwards SOTD, 8 Sep 2026): scroll-led product storytelling with Lenis, area scroll motion. Captured headless on 2026-10-07 (desktop screenshots OK).
