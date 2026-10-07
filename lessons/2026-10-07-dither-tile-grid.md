# 002: Dither Tile Grid

**Area:** Imagery and art direction · **Date:** 2026-10-07 · **Graduated to:** [`dither-tile-skill`](../skills/dither-tile-skill/SKILL.md)

## Seen in

Aspen Search (aspensearch.com), an executive search firm for quant and AI talent, Awwwards Site of the Day on 15 Sep 2026. The page is a 50/50 grid ruled with 1px lines. Each cell is flat: off-white, light gray, near-black, or one mint accent. The images are photos rendered as fine black-and-white halftone dots, with a large flat gray brand shape laid over them. A huge grotesk wordmark sits at the bottom of a tall cell, small mono uppercase labels sit in the corners with square bullets, and two live city clocks run in the header. Line-art diagrams on the dark cells and a client list with hover-inverting rows finish it.

## Why it works

- **One treatment unifies everything.** Whatever the source photos are, the 1-bit dither makes them one family that matches the hairlines and the mono type. It reads as engineered, not stock.
- **Texture against flat.** Dots next to flat paper, ink and accent cells give the page depth without shadows, gradients or radius.
- **The flat shape is the image.** The photo drops back to texture, and the brand shape on top becomes what you remember.
- **Restraint in color.** Two neutrals, one ink, one accent. The halftone carries the visual interest, so nothing else has to.

## How to build it

Each image tile is a small canvas at 1/3 of the CSS size, scaled up with `image-rendering: pixelated`. Per pixel: sample a luminance field (a cached photo, or a math function), compare against an 8x8 Bayer threshold, write the tile's `color` or `background-color`. The same Bayer value gates a dither-in reveal, so dots appear in woven order. Full engine, fields and wiring: [`dither-tile-skill`](../skills/dither-tile-skill/SKILL.md).

```js
const b = BAYER[((y & 7) << 3) | (x & 7)];        // (v + 0.5) / 64
if (b >= gate) { px[i] = paper; continue; }        // reveal, top to bottom
let lum = field(x / w, y / h, t, aspect);
lum = (lum - 0.5) * 1.15 + 0.5;
px[i] = (invert ? lum : 1 - lum) > b ? ink : paper;
```

```css
.g { display: grid; gap: 1px; background: var(--ink); }   /* hairlines */
.g > * { background: var(--paper); }
.dither canvas { image-rendering: pixelated; }
```

## Taste rules

- Ordered Bayer dither, 3 CSS px dots snapped to whole device pixels, canvas sized to an exact multiple of the dot.
- Two colors from CSS; coverage = darkness on every surface so dark mode keeps its balance.
- Sources live between 0.15 and 0.9 luminance: no solid-ink areas, no big flat 50 percent checkerboards.
- One flat shape over the dots, one accent color, mono 12px labels, grotesk at -0.05em for the big words.
- Motion stays print-native: dither-in once, slow light drift, pointer as a soft light.

## Slop version

Random-noise or Floyd-Steinberg dither that shimmers, 1px dots that blur to gray, gray or colored dots, a dithered full-page background behind body text, borders that double at every cell, four accent colors, and every tile animating fast at once.
