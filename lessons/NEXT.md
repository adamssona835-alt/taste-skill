# Next Lesson Plan

Status: pending
Lesson: 005
Date: 2026-10-10 (morning run 07:52 Europe/Stockholm)
Planned: 2026-10-09 23:58

Candidates checked tonight:
- mariavasilyeva.com (Awwwards SOTD 9 Oct): not usable. Scroll is hijacked and the work is drawn in WebGL; every headless scroll stop shows the same near-empty frame.
- odysseeclinic.com.au: rejected by the owner on 9 Oct, not offered again.

## Site

- **URL:** https://boc.studio
- **Found in:** Awwwards Site of the Day, 19 Sep 2026 (https://www.awwwards.com/sites/boc-studio). Barcelona brand studio; tags: bold motion, playful micro-interactions.
- **Area:** Layout and grid (last three: typography, scroll motion, imagery and art direction)
- **Headless check:** captured 2026-10-09 23:57, desktop and mobile, screenshots checked by eye: work index, rows, sticky column and orange bar all render.
- Note: this site was the first pick on 7 Oct, when the owner chose the backup instead. It was not rejected, and it is still the strongest layout candidate.

## Technique to learn

**Justified project strips.** The work index is a stack of projects; each project is one row of four to six images of different aspect ratios, all scaled to the same height so the row fills the content width exactly. The first and last image of a row run off both edges like a film strip, which tells you the row is a sequence, not a grid. Each row has a caption line above it on three columns: project name left, one-line idea centered, "View project" right. A sticky left column holds "Work / All / Filter +", and a thin orange bar at the top shows the studio name, an info toggle, a live local clock and a status word.

Why it qualifies: premium (Awwwards SOTD), reproducible in plain CSS (`flex: <aspect-ratio> 1 0` per image, `aspect-ratio` on each), and not covered in `lessons/` or `skills/`.

The craft to get right: rows that are always exactly full width with no cropping inside the row, the edge bleed without horizontal page scroll, a minimum image height so wide panoramas do not shrink a row to a sliver, a filter that reflows rows with View Transitions, and a phone version (two rows of the strip as a horizontal scroll-snap band).

## Planned demo

An invented Lisbon brand studio ("Ferro Atelier"): orange status bar with a live Lisbon clock, a hero marquee band, a sticky work column with filter chips (Identity, Packaging, Campaign), six project strips built from original generated imagery (posters, packaging and product shots drawn in SVG and canvas), an info overlay, and a contact footer.

## Morning steps

1. Fetch the branch, re-read PROTOCOL.md, PRINCIPLES.md, IMPROVE.md and this file.
2. Capture https://boc.studio again; measure row heights, gaps, the edge bleed and the caption line at 1440 and 390; look at hover states and the filter.
3. Build the justified row with CSS only (`flex-grow` from each image's aspect ratio), then add the bleed with a negative inline margin inside an `overflow-x: clip` fence (principle 12).
4. Filter chips as `aria-pressed` buttons; reflow with `document.startViewTransition` where available, instant otherwise and under reduced motion.
5. Build the page, then write `skills/justified-strip-skill/SKILL.md` with code spliced from the demo.
6. Run `verify-demo` (all passes) until OK, look at every contact sheet, fix at least three visual flaws, verify again.
7. Score (every criterion at least 4, total at least 38/40), write the lesson, register, set this file to `Status: done`, commit `Lesson 005: Justified project strips (layout and grid)`, push, notify.

## Backup

https://milledollars.fr (Awwwards SOTD, 2 Oct 2026, Paris video studio): a one-screen project slider inside an inset rounded frame with labels in the four corners and the project title split left and right of center. Area: page transitions. Captured headless on 2026-10-09 23:58, screenshots checked by eye.
