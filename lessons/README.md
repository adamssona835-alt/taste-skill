# Daily Web Design Lessons

One technique a day, found and studied by the agent itself from live premium sites, shipped as a verified skill with a working demo.

How every lesson is made, and the quality bar it must clear: [`PROTOCOL.md`](PROTOCOL.md). Each day must score at least as high as the best day before it.

Two loops run every day:

- **Learn** (morning, [`PROTOCOL.md`](PROTOCOL.md)): a new technique from a live award-level site, shipped as a skill with a verified demo.
- **Improve** (evening, [`IMPROVE.md`](IMPROVE.md)): the weakest existing skill is audited and raised, and the tools or [`PRINCIPLES.md`](PRINCIPLES.md) get sharper so later runs start from a higher floor.

Each lesson is short and practical:

- **Seen in**: where the pattern showed up (described, never copied).
- **Why it works**: the design reason, not just the effect.
- **How to build it**: minimal working code.
- **Taste rules**: what keeps it premium.
- **Slop version**: how it usually goes wrong.

The full, reusable version of each lesson lives in `skills/<slug>-skill/` with a demo verified in headless Chromium.

## Index

| # | Date | Lesson | Area | Source | Skill | Score |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 2026-10-07 | [Particle morph hero](2026-10-07-particle-morph-hero.md) | WebGL and 3D | getlayers.ai "Vesper" template | [`particle-morph-skill`](../skills/particle-morph-skill/SKILL.md) | 34 → 38/40 |
| 002 | 2026-10-07 | [Dither tile grid](2026-10-07-dither-tile-grid.md) | Imagery and art direction | aspensearch.com (Awwwards SOTD, 15 Sep 2026) | [`dither-tile-skill`](../skills/dither-tile-skill/SKILL.md) | 36 → 38/40 |
| 003 | 2026-10-08 | [Scroll scrub story](2026-10-08-scroll-scrub-story.md) | Scroll motion | white-desert.com (Awwwards SOTD, 11 Sep 2026) | [`scroll-scrub-story-skill`](../skills/scroll-scrub-story-skill/SKILL.md) | 37/40 |
| 004 | 2026-10-09 | [Swiss grid typography](2026-10-09-swiss-grid-type.md) | Typography | twks.ch (Awwwards SOTD, 7 Oct 2026) | [`swiss-grid-type-skill`](../skills/swiss-grid-type-skill/SKILL.md) | 38/40 |

## Improvement log

| Date | Skill | Score | Biggest fix | Machine improvement |
| --- | --- | --- | --- | --- |
| 2026-10-08 | particle-morph-skill | 34 → 38/40 | Shapes now hold at every reading stop, with one statement per screen behind a scrim (before: two headlines over a bare, half-formed galaxy); plus a light nav over the paper section, a 2D-canvas orb still for the plate and the no-WebGL fallback, per-shape fit so the galaxy never clips at 360px, and a device-true stat | verify-demo learned reduced motion at every stop, a forced-fallback pass (no WebGL, `CSS.supports` false), 360/430 widths, overflow at every stop, a keyboard focus-visibility check, `--stops N` and contact sheets; three new principles (fixed chrome flips with sections, one statement per screen, device-true copy) and code spliced from the demo |
| 2026-10-08 | dither-tile-skill | 36 → 38/40 | Without canvas every tile was the same gray fade; a `--shape` mask per field now prints the subject (sphere, rings, swell, ridge, dawn) as a CSS halftone. Also lifted the ridge foreground out of solid ink | verify-demo learned a host check: the page is loaded under a stand-in for a viewer's `<body>` reset and every text box is compared; it found and fixed the same dark-text bug in the lesson 001 demo. New principle: style the body, not only the root |
