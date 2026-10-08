# Mörkerdal: a night in one scroll

An original site built on request ("a website with scroll motion, your own idea, at the standard you have learned"). Invented brand: a small dark-sky observatory in Norrbotten with four domes and twelve guests a night. Swedish copy throughout. No images, no libraries: the sky, the trails, the aurora and the treeline are drawn in canvas and SVG at load.

## The idea

The page is one night. Scroll is the clock: 18:40 at the top, 06:10 at the bottom, shown live in the nav. The sky turns 15 degrees per hour of that clock, exactly as the real sky does, so the scroll position, the clock and the star positions always agree.

1. **Dusk hero.** A huge serif wordmark over a dusk gradient with only the brightest stars out, a mountain and spruce silhouette with three lit domes along the bottom.
2. **The exposure (pinned, 340vh).** The shutter opens at 19:30 and closes at 23:30. Every star draws its arc around the pole, so four hours of scroll leave four hours (60 degrees) of star trails. A meter counts exposure time and degrees; Polstjärnan is marked once the statement mentions it. Three statements, one at a time, each holding a third of the pinned scroll.
3. **Paper break.** Off-white editorial block: two numbered columns, a figure plate with a whole night (93 degrees of trails) over a lit dome, and a stats row. The nav flips light while it sits over the paper.
4. **Aurora.** After the paper, the trails are gone (a new night of looking) and soft curtains rise, rendered at one sixth resolution so the upscale blurs them. The only idle motion on the page.
5. **The night, hour by hour.** A program list whose ember line fills as you scroll and lights each hour as it passes.
6. **Dawn booking.** The sky warms to dawn behind the booking form; stars fade out.

## Principles applied

- Never park the reader between states: statements change only at fixed thirds of the pinned scroll and the first one waits until the stage has pinned, so the hero headline never shares the screen with it.
- One loud thing per screen, and a scrim under every statement over the sky (lighter and wider at dawn, where a dark scrim reads as a smudge).
- Contrast sections on purpose, with the nav flipping over the light one.
- Reduced motion: the sky jumps between the section moments instead of scrubbing (the exposure itself still follows scroll, since that is reading, not ambient motion), no aurora drift, no reveals.
- No JavaScript: a static night gradient, all three statements stacked, all program rows lit.

## Bugs found while building (worth remembering)

- **Scrims widened the phone layout viewport.** The scrim gradients use a negative inset and bleed sideways. On a phone that widened the layout viewport to 453px and the whole page rendered zoomed out, while `scrollWidth` and the old overflow check stayed green (the lesson 001 demo had the same bug at 397px). Fix: `main { overflow-x: clip; }`, which unlike `hidden` keeps `position: sticky` working. verify-demo now compares `innerWidth` to the phone width.
- **A media query broke the scrim's containing block.** `.night .head { position: static }` on phones overrode the scrim's `position: relative`, so its absolute gradient sized itself against all of `<main>` and the page scrolled about 1,900px past the footer. verify-demo now fails when the page scrolls past the end of its content.
- The first statement of the pinned section switched on as soon as the section entered, so it shared the screen with the hero headline. It now waits until the stage is within 12 percent of the top.
- **Dark headings inside the artifact viewer.** The page set its text color on `html`; the viewer's own reset styles `body` with dark text, so every heading and the nav wordmark inherited near-black on a near-black sky. Only the owner's phone showed it. Set color and type on `body` too, and test inside a stand-in for the host's reset.
- The first aurora read as a green picket fence: too even and too sharp. Lower resolution, gaps between rays, and 78 percent strength fixed it.

Verified with `node scripts/verify-demo.mjs demos/morkerdal --stops 16` (desktop, phones at 360/390/430, reduced motion at every stop, forced fallback, keyboard focus).
