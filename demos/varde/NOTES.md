# Varde Advokatbyrå: a law-firm portfolio demo

Built on request: a demo site aimed at a law firm, portfolio-led, "very high-tech and high-end". The firm is invented (a varde is a cairn that marks the way), so the demo can be shown to any firm. Cases, figures, people and addresses are invented and every case is presented as anonymized, which is how firms publish matters anyway.

## The idea

A dark instrument panel: thin rules, mono readouts, one ice-blue signal color, a live Stockholm clock and a crosshair readout over the field (mouse only).

1. **Hero.** "Ordning i komplexa ärenden." beside a field of 1,500 documents drawn as points (760 on phones).
2. **Metod (pinned, 460vh).** The same points take four layouts, one per reading stop: the loose data room; sorted into six piles; the relevant share gathered into one block while the rest dims; the seven decisive documents in a framed row. Counters (4 812, 312, 7) follow. Lesson 001's particle morph in 2D canvas, with a meaning a client recognizes.
3. **Utvalda ärenden (pinned, horizontal).** Five anonymized matters on a gently curved 3D track. Each card holds centered for a stretch of scroll, then the track moves on. Every cover is a generated 1-bit plate (Bayer ordered dither, lesson 002) whose subject fits the matter: two merging bodies, a split, an isometric warehouse, 220 people, rings of a model.
4. **Verksamhet (light).** Eight practice areas as an indexed list, four figures.
5. **Kontakt.** Intake form that mentions the conflict check (jävskontroll) before details are shared, two offices.

## Lessons applied

- Hold states at reading stops, in the morph and in the horizontal portfolio alike (the first version slid cases past without stopping, so every card was read in motion).
- Nothing in a pinned section shows until it is pinned; the nav flips over the light section.
- Color and type on `body`, verified inside a stand-in for the artifact viewer's reset; `overflow-x: clip` on `main`.
- Phones: the loose cloud starts lower so it never sits under the hero buttons, then rises into the stage as the section pins. Cards get more gap and less rotation, because 3D neighbours intersected at 84vw.

Verified with `node scripts/verify-demo.mjs demos/varde --stops 24`, and again wrapped in the viewer's reset.
