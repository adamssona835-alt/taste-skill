# Meher & Loom: halo showcase demo

Built on request from an owner-supplied reel (an AI-generated concept for a luxury sari label, shown on a monitor). The on-screen text in the reel was placeholder gibberish, so only the design system was studied. Brand, copy and every image here are original: the sari, the zari embroidery, the satin ribbon and the sparks are all generated in SVG and canvas at load.

Not registered as a daily lesson: it scores 36/40 on the protocol gate (best so far is 37), mainly because the imagery is stylized and needs JavaScript to appear.

## What the design does

1. **Halo and pedestal staging.** The product stands on a dark drum pedestal with a glowing rim, inside a thin gold ring (`border` + outer and inset `box-shadow` glow) with a brighter arc that travels around it (`conic-gradient` masked to the ring, animated through a registered `--spin` angle). Slow gold dust drifts round the ring on a canvas.
2. **Scenes, numbered.** Every section is "Scene 0N" with a small uppercase eyebrow, a serif display line with one italic gold word, a vertical rail showing the current scene number, and pagination dashes in the hero.
3. **Loupe to iris.** A circular loupe hovers over the product showing the embroidery at 3.4x (the same zari image as a background, offset to the pointer). The next scene is pinned and opens that macro image through `clip-path: circle()` scrubbed by scroll, then draws annotation callouts with leader lines (`pathLength="1"` dash offset).
4. **Dark, light, dark rhythm.** Night brown (`#14110E`) for the hero, the thread, the macro, the quote and the finale; ivory and blush for the collection and the motion scene. The header and the rail invert over the light scenes.
5. **Floating numbered cards.** The collection is five white cards with big serif numerals, scattered at different depths and slight rotations, each drifting at its own scroll speed.
6. **Satin ribbon.** A wide ribbon that twists across the motion scene, drawn as 220 thin slices whose shade follows the cosine of the twist (front lit, back darker), so it reads as satin.
7. **Champagne pills.** Primary actions are gold-gradient pills with an inner highlight; secondary actions are underlined text links.

## Bugs found while building (worth remembering)

- A rule like `.scene > * { position: relative }` silently overrode `position: absolute` on a canvas inside the scene; the canvas collapsed to 0px high. Exclude decorative layers with `:not()`.
- Canvases sized on load are sized before fonts settle. Use a `ResizeObserver` on the canvas, and repaint after every refit (setting `width` clears it).
- A loupe with a static image is dull: drift it on its own when there is no pointer (and on touch), and gate that loop on visibility.
- On mobile, absolute-positioned callouts collide. Stack them in a column and drop the leader lines.

Verified with `node scripts/verify-demo.mjs demos/meher-loom-halo` (desktop, mobile, reduced motion), plus 17-stop desktop and 16-stop mobile sweeps, a forced JS-fallback sweep, and a reduced-motion sweep.
