# 005: Justified Project Strips

**Area:** Layout and grid · **Date:** 2026-10-10 · **Graduated to:** [`justified-strip-skill`](../skills/justified-strip-skill/SKILL.md)

## Seen in

Boc.Studio (boc.studio), a Barcelona brand studio, Awwwards Site of the Day on 19 Sep 2026. The work index is a stack of projects, and each project is one row of four to six images in mixed formats (a poster, a pack shot, a shop sign, a detail) at one shared height. The first and last image of each row are cut by the edges. A caption line under each row puts the project name left, the idea in the middle and "View project" right. A sticky left column holds "Work / All" and the filters, and a thin solid orange bar on top carries the studio name, an info toggle, a live local clock and an open or closed status. On phones each row becomes a horizontal swipe band.

## Why it works

- **A project is a sequence, not a thumbnail.** Four images side by side say more about an identity than one cropped hero, and every image keeps its own shape.
- **Mixed heights make rhythm.** Each row's height comes from its pictures, so a row of posters stands taller than a row of panoramas without anyone designing that.
- **The bleed reads as film.** Images cut by the edges suggest the row continues, and give the page a confident, unboxed feel.
- **The chrome is quiet but alive.** One accent surface, real information (the studio's time and whether it is open), no menu theatre.

## How to build it

Give each image its aspect ratio and let flexbox share the width by it. Full system, filter and phone band: [`justified-strip-skill`](../skills/justified-strip-skill/SKILL.md).

```css
.strip { --bleed: 6%; overflow: hidden; overflow: clip; margin-right: calc(-1 * var(--m)); }
.strip__track { display: flex; gap: 8px; width: calc(100% + 2 * var(--bleed)); margin-left: calc(-1 * var(--bleed)); }
.shot { flex: var(--ar) 1 0; min-width: 0; aspect-ratio: var(--ar); }   /* --ar = width / height */
.work { display: grid; grid-template-columns: 25% minmax(0, 1fr); overflow-x: clip; }
```

## Taste rules

- Never crop inside the row; curate each row's aspect-ratio sum to about 3.5 to 6 instead of clamping the height.
- Bleed both ends, run the right edge to the viewport, and fence the page with `minmax(0, 1fr)` and `overflow-x: clip`.
- One 8px gap everywhere; captions are one 18px line with gray for everything but the name.
- The accent is a surface with near-black text, used for the bar, the info panel and one band only.
- Filtering removes rows and slides the rest up through a View Transition; the count and breadcrumb follow.

## Slop version

Square `object-fit: cover` thumbnails in a three-column grid, a masonry library for ragged columns, captions overlaid on images with a gradient, a translucent blurred navbar, filter tabs that fade rows and leave holes, and a bleed that gives the whole page a horizontal scrollbar.
