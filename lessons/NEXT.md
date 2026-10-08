# Next Lesson Plan

Status: replaced (owner said no to odysseeclinic.com.au on 2026-10-09; the backup is used)
Lesson: 004
Date: 2026-10-09 (morning run 07:52 Europe/Stockholm)
Planned: 2026-10-08 23:58, replaced 2026-10-09 00:10

Replacement history:
- odysseeclinic.com.au (micro-interactions, focus rail): rejected by the owner.

## Site

- **URL:** https://twks.ch/en
- **Found in:** Awwwards Site of the Day, 7 Oct 2026 (https://www.awwwards.com/sites/twks-1), Geneva agency, nominated for Portfolio Honors. Tags: Typography, Gallery, Interaction Design, Microinteractions.
- **Area:** Typography (last three: scroll motion, imagery and art direction, WebGL and 3D)
- **Headless check:** captured 2026-10-08 23:50, desktop 8 scroll stops and mobile, screenshots checked by eye: headline, split section, case grid and footer all render.

## Technique to learn

**Grid-indexed Swiss typography.** One grotesk family in three sizes only (display about 53px / 600 / line-height 1.0, UI 20px / 400, small 16px), and every indent snapped to the column grid:
- The statement paragraph starts its first line at column 2 while the next lines run from column 1, so the indent is a grid position, not a tab.
- An inline glyph (a pictogram set at cap height on the baseline) sits inside the display sentence as a word.
- "What we do" is a split: a hairline across columns 2 to 6, a small label in column 2, and the body text in columns 5 to 6 with its own first-line indent.
- Secondary text is the same size in gray (about #8C8C8C), never smaller: case captions are title in black, one line of gray under it.
- Navigation is plain text in the same 20px, spread across the grid columns of the header.

Why it qualifies: premium (Awwwards SOTD, Swiss studio), pure CSS (grid, `text-indent` in column units, inline SVG glyph), and not covered in `lessons/` or `skills/`.

## Planned demo

An invented Basel type-and-brand studio ("Rheinlicht"): header nav spread across the grid, a display statement with a column-2 indent and an inline glyph, a "what we do" split, a case grid with title/gray-subline captions on generated posters, a list of insights, and a black footer. Original copy and imagery (generated poster graphics in canvas or SVG).

## Morning steps

1. Fetch the branch, re-read PROTOCOL.md, PRINCIPLES.md, IMPROVE.md and this file.
2. Capture https://twks.ch/en again; measure the grid (columns, gutters, margins) and the type scale from `report.json` and screenshots at 1440 and 390, and note how indents and the glyph behave at each width.
3. Build the type system as tokens (three sizes, two weights, one gray), the grid as CSS custom properties, and indents as `calc()` of the column width so they stay on the grid at every breakpoint.
4. Inline glyph: an SVG sized in `em` and aligned to cap height, with an accessible text alternative.
5. Build the full demo page, then write `skills/swiss-grid-type-skill/SKILL.md` with code identical to the demo.
6. Run `verify-demo` (all passes) until OK, look at every contact sheet including fallback and reduced, fix at least three visual flaws, verify again.
7. Score with the quality gate (every criterion at least 4, total at least 38/40), write the lesson file, register everywhere, set this file to `Status: done`, commit `Lesson 004: Grid-indexed Swiss typography (typography)`, push, notify.

## Backup

https://boc.studio (Awwwards SOTD, 19 Sep 2026): justified project strips, rows of mixed-format images fitted to one height. Area: layout and grid. Captured headless on 2026-10-08 00:28, screenshots checked by eye.
