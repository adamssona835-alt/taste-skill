# Generating the footage

The whole look depends on footage that was *shot for the page*: one subject, a seamless
studio backdrop, soft even light, a locked camera. Any current image and video model
works (Veo, Kling, Runway, Luma, Sora, Hailuo...). Use the same recipe in each.

## Rules that make it composite cleanly

| Rule | Why |
|---|---|
| Seamless, single-colour cyclorama backdrop, no horizon line | The edges must dissolve into the page under the mask |
| Backdrop colour close to the page colour (light grey for cream pages, charcoal for dark pages) | The fade then reads as atmosphere, not as a vignette |
| Soft, even, top-left key light, gentle contact shadow | Premium product-photography feel; shadow grounds the object |
| Subject centred, filling about 55-65% of the frame width | Leaves room for the feathered edge |
| Locked-off or extremely slow camera, no shake, no cuts | Scrubbing exposes every wobble |
| 16:9, 5-8 seconds, 24 fps, no text, no people unless intended | 120-190 source frames; enough for a smooth scrub |
| Same seed / same style reference for every clip on a page | The hero and the sequence must look like one shoot |

## Workflow: start frame, end frame, interpolate

1. Generate the **start still** (the closed or assembled state).
2. Generate the **end still** from the start still with an edit/reference prompt
   (the opened, exploded or finished state), so geometry and lighting match.
3. Give both to the video model as first and last frame. Prompt only the motion.
4. Reject any clip where the camera drifts, the backdrop flickers, or parts morph
   rather than move. Re-roll; do not fix in the browser.

## Prompt templates

**Hero loop (subject on a stage)**
> Product photography of [a furnished living-room set: oak lounge chairs, a low
> travertine table, a linen sofa, a floor lamp, a potted fiddle-leaf fig] on a
> seamless light grey studio cyclorama. Soft diffused key light from top left,
> gentle contact shadows, no horizon line. Slow 15-degree orbit around the
> subject, locked height, no shake. Photoreal, neutral grade, 16:9.

**Exploding / cutaway sequence (architecture, interiors)**
> Start frame: a white architectural scale model of a single-storey house with a
> hipped roof, centred on a seamless light grey cyclorama, soft overhead light.
> End frame: the same model opened into a sectional cutaway, roof lifted on its
> trusses, walls slid apart to reveal the stair, kitchen and rooms.
> Motion: the parts separate smoothly along clean axes, nothing morphs, camera locked.

**Assembly (furniture, product, joinery)**
> Start: the components of [an oak dining chair] floating apart in an exploded
> axonometric arrangement on a seamless warm grey backdrop. End: the assembled chair.
> Motion: parts glide together and seat into their joints, camera locked, even light.

**Material close-up (for a quieter second sequence)**
> Macro of [honed travertine / brushed brass / boucle] on a seamless backdrop,
> a slow raking light sweeps left to right across the surface, camera locked.

## Adapting to other industries

| Business | Hero loop | Scroll sequence |
|---|---|---|
| Architecture | Massing model orbit | Model opening into a section |
| Interior design | Furnished set orbit | Empty room furnishing itself |
| Furniture / product | Product turntable | Exploded view assembling |
| Jewellery / watches | Piece rotating on a plinth | Movement exploding into components |
| Cosmetics | Bottle with slow light sweep | Ingredients assembling into the product |
| Food / hospitality | Plated dish, slow orbit | Dish building layer by layer |
| Automotive / hardware | Vehicle turntable | Shell lifting off the chassis |

The scroll sequence should *explain* something (structure, craft, process). If it
only spins, use a looping video instead and save the bytes.
