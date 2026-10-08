# 003: Scroll Scrub Story

**Area:** Scroll motion · **Date:** 2026-10-08 · **Graduated to:** [`scroll-scrub-story-skill`](../skills/scroll-scrub-story-skill/SKILL.md)

## Seen in

White Desert (white-desert.com), luxury Antarctic expeditions, Awwwards Site of the Day on 11 Sep 2026. The page reads like a slow film. A huge condensed "ANTARCTICA" sits at the fold over a pale hero. A founder's statement in an uppercase serif lights up word by word as you scroll and ends in a handwritten signature that draws itself in. A photo opens out of an inset frame to full bleed. Then a pinned "Our Camps" scene: the mountain photo is replaced by an ice texture arriving in vertical strips, and camp cards in frosted frames glide in from the right across the ice. Thin column lines run over the whole page, and one orange tab sits on the right edge.

## Why it works

- **Scroll is the only clock.** Everything follows the scrollbar both ways, so readers set the pace and nothing waits or plays without them.
- **Reading becomes a gesture.** Lighting the statement word by word makes people read the brand's one important paragraph at the speed they scroll.
- **One pinned scene, used well.** Holding the viewport for one chapter (the camps) gives it the weight of a film scene; the rest of the page scrolls normally.
- **Restraint in type and color.** Condensed sans for the place, serif for the voice, grotesk for the UI; navy, white, ice and one warm accent.

## How to build it

One registered property per section, `--p`, from 0 to 1. Native `animation-timeline: view()` animates it where supported, a 20-line rAF fallback writes it elsewhere, and reduced motion leaves it at its initial value of 1 (finished state). Every effect is a `calc()` of `--p`. Full driver, CSS and generated imagery: [`scroll-scrub-story-skill`](../skills/scroll-scrub-story-skill/SKILL.md).

```css
@property --p { syntax: '<number>'; inherits: true; initial-value: 1; }
@keyframes scrub-p { from { --p: 0; } to { --p: 1; } }
.scrub { animation: scrub-p linear both; animation-timeline: view(); }

.statement .w { opacity: clamp(.16, calc(var(--p) * (var(--n) + 3) - var(--i)), 1); }
.sign path { stroke-dasharray: 1; stroke-dashoffset: calc(1 - var(--p)); } /* pathLength="1" */
.reveal { clip-path: inset(calc((1 - var(--p)) * 9%) calc((1 - var(--p)) * 6vw)); }
```

```html
<p class="statement" data-range="cover 12 58" data-words>...</p>
<section class="camps" data-range="contain 0 100">...</section>
```

## Taste rules

- Scrub, never trigger. One pin per page, about five viewports long, with overlapping phases so something always moves.
- Words light from 0.16 to 1 opacity, three words of overlap. They never slide or blur.
- Strips alternate direction and each shows its own slice of one image.
- Native scroll only: no wheel hijacking, sticky for pinning, anchors still work.
- Text over images always on a scrim or a frosted chip.

## Slop version

Every block fades up on a timer as it enters, a smooth-scroll library hijacks the wheel, three pinned sections in a row, words that bounce in letter by letter, white captions on white snow, and a page that is blank without JavaScript because the progress starts at 0.
