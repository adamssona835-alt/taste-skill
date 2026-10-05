---
name: cinematic-scroll
description: Build premium single-page sites around AI-generated studio footage that floats on the page, plus a scroll-scrubbed image sequence (exploding view, cutaway, assembly, turntable). Covers footage generation, frame extraction, the sequence player, layout, motion, performance and accessibility. Learned from studying atelier-maren.netlify.app and fixing its weaknesses.
---

# Cinematic Scroll: floating footage and scroll-scrubbed sequences

Use this skill for landing pages and studio/product sites where one physical subject
(a building, a room, a piece of furniture, a product) should feel *present*: an
interior or architecture studio, a furniture maker, a watch brand, a product launch.

It produces a page whose two signature moments are:

1. **Floating media.** Generated studio footage with a seamless backdrop, dissolved
   into the page with a mask, so the object appears to sit on the page itself with no
   visible frame.
2. **Scroll-scrubbed sequence.** A pinned section where scrolling plays a clip frame
   by frame on a canvas (an exploding view, a cutaway, an assembly), with short text
   steps keyed to progress.

Everything else on the page stays quiet so those two moments carry the brand.

Reference files in `references/`:

| File | What it is |
|---|---|
| `scroll-sequence.js` | Dependency-free sequence player (cover-fit, portrait mode, feathering, coarse-to-fine loading, reduced motion). Drop in and use `data-seq` markup. |
| `starter.html` | Complete single-file page: tokens, nav, stage hero, sequence, work, contact. Light and dark. |
| `extract-frames.sh` | ffmpeg: clip to N WebP/JPG frames, poster, backdrop colour, markup snippet. |
| `video-prompts.md` | How to generate footage that composites cleanly, with prompt templates per industry. |

---

## 1. What the reference does, and why it works

Studied: `atelier-maren.netlify.app` (interior design studio, one HTML file, Tailwind CDN).

| Move | Implementation | Why it reads as premium |
|---|---|---|
| Studio footage as hero | 5 s, 1280x720, 400 kbps MP4 loop of a furniture set orbiting on a grey cyclorama | Looks like a product shoot, costs nothing to produce |
| Frame dissolves into the page | Radial gradient from transparent to page colour over the media | No rectangle anywhere: the object floats |
| Exploding-view scroll | 121 JPG frames (960x540, 13-21 KB each, 2.6 MB total) drawn to a canvas in a 400vh sticky section | Physical, explanatory motion the reader controls |
| Text steps over the sequence | 3 frosted cards, each active in a third of the progress | Story beats aligned to what the object is doing |
| Restraint everywhere else | Cream + espresso + one sage accent; light display serif; generous space | The media is the spectacle; the UI does not compete |
| Motion grammar | One easing for everything: `cubic-bezier(0.32, 0.72, 0, 1)`; reveals = fade + 2.5rem rise + 4px blur, 0.9 s, 100 ms stagger | Consistent, slow, expensive feel |
| Details | Double-bezel image frames (tinted 6px ring + inner radius = outer - ring), pill CTA with nested arrow disc, magnetic buttons, SVG grain at 2.5%, nav turns to glass on scroll | Tactile craft cues at small scale |

### What it gets wrong (do better)

| Problem in the reference | Do this instead |
|---|---|
| Canvas sized to the image and stretched by CSS (`object-fit` does nothing on canvas): distorted on phones | Cover-fit in code with a focal point; on portrait screens show the whole subject zoomed (`scroll-sequence.js` does both) |
| All 121 frames requested on page load | Load after `window.load`, when the section is near, coarse-to-fine |
| Colour-overlay vignette must equal the page colour exactly; breaks in dark mode | CSS `mask-image` on the media, and per-frame feathering on the canvas |
| Copy laid over the footage, rescued by stacked 240px text-shadow halos | Stage composition: type above, subject below. Copy never sits on the footage |
| `.reveal` hides content by default: no JS means an empty page | Hide only under `.js` and `prefers-reduced-motion: no-preference` |
| No reduced-motion handling; autoplay video always | Static final frame, steps in flow, video paused |
| H.264-only video, no poster | WebM + MP4 sources, poster, `preload="metadata"`, pause off screen |
| Random Picsum photos in the portfolio (berries, a bridge) | Real or generated imagery of the actual subject, same grade as the footage |
| Pill eyebrow above every heading, numbered rows, marquee of abstract nouns, em dashes in copy | Ration labels (max 1 per 3 sections), no decorative numbering, no marquee filler, no em dashes |
| Mobile step cards squeezed to a narrow column | Steps as a bottom sheet across the screen width on phones |
| Tailwind Play CDN and a window scroll listener in production | Compiled CSS or plain CSS; IntersectionObserver + rAF only while visible |

---

## 2. Pipeline

1. **Art direction (5 minutes, write it down).** Subject, page colour, accent, type
   pair, and what the sequence *explains*. If the sequence explains nothing, use a
   loop instead.
2. **Generate footage.** Follow `references/video-prompts.md`: seamless backdrop,
   locked camera, start and end frames, 5-8 s. Generate the hero loop and the
   sequence from the same style reference.
3. **Extract frames.**
   `references/extract-frames.sh clip.mp4 public/frames 120 1280 webp`
   prints frame count, total size, backdrop colour and the markup attributes.
   Budget: 90-150 frames, at most ~3 MB per sequence. If over, drop to 960 px or 90 frames.
   For a portrait-heavy audience, export a second 9:16 crop and swap `data-src`
   with a media query in JS.
4. **Match the page to the footage.** Set `--page` near the sampled backdrop
   (lighter is fine, the mask hides the difference). Grade still photography to the
   same temperature.
5. **Build from `starter.html`.** Keep its structure; replace copy, tokens and assets.
6. **QA** with the checklist in section 7.

---

## 3. Page structure

Keep it short. This format is strongest at 5-7 sections.

| # | Section | Layout | Notes |
|---|---|---|---|
| 1 | Hero | Stage: centred type on top, floating loop below (about 50svh) | Headline under 6 words, subtext under 20, one CTA |
| 2 | Sequence | 380-450vh tall section, sticky 100svh canvas, 3 steps | Each step: short heading + one sentence; progress hairline under the nav |
| 3 | Studio / philosophy | Editorial: large heading, two short columns, a few real figures | Plain-text figures, no count-up gimmicks needed |
| 4 | Work | Asymmetric grid of double-bezel frames (2fr/1fr, then one wide) | Real imagery only; caption = place, year, name |
| 5 | Services or process | Rows with hairline dividers, name left, description right | No `01/02/03` unless order genuinely matters |
| 6 | Testimonial | One quote, max 3 lines, name + project | No decorative quote glyph needed |
| 7 | Contact + footer | Centred heading, one pill CTA, the address as selectable text | Same CTA label as the nav |

Do not add a second sequence unless it explains something different (for example,
structure first, then materials).

---

## 4. Design defaults (change per brand)

**Palette.** Page = footage backdrop family. One ink, one secondary ink, one muted,
one hairline, one accent used only on small elements. The reference uses
cream `#FDFBF7` / espresso `#1C1917` / sage `#5F6B5E`. Rotate families between
projects (stone + graphite + rust; bone + ink + cobalt; charcoal page with light
footage); do not ship cream + espresso every time.

**Type.** A light display serif or refined grotesk at 300-400 weight for headings
(`clamp(3.2rem, 8vw, 7.5rem)`, line-height ~1, tracking -0.02em), a quiet sans
for body at 17px/1.65. The reference pairs Cormorant Garamond with Plus Jakarta
Sans. Rotate between projects: display from Cormorant, Newsreader, Bodoni Moda or
Gloock; body from Hanken Grotesk, Instrument Sans, Manrope or Satoshi. Avoid Fraunces
and Instrument Serif as defaults (see taste-skill).

**Shape.** One radius for frames and cards (16-24px), pill for buttons only.
Double-bezel frames: outer `padding: 6px; border-radius: R; background: ink at 3%;
inset 1px hairline`, inner `border-radius: R - 6px; overflow: hidden`.

**Texture.** SVG `feTurbulence` grain on one fixed, pointer-events-none layer at
2-5% opacity. Never on scrolling containers.

---

## 5. Motion spec

| Element | Spec |
|---|---|
| Global easing | `cubic-bezier(0.32, 0.72, 0, 1)` for everything |
| Reveal | opacity 0 to 1, translateY 2rem to 0, blur 4px to 0, 0.9 s, stagger 90-100 ms, fires once at 12% visibility |
| Sequence scrub | displayed frame eases toward the scroll target at 0.18 per frame; steps fade 0.7 s with a 1.25rem rise |
| Image hover | scale 1.04-1.05 over 1.2 s |
| Buttons | magnetic follow at 0.12 of the pointer offset, release over 0.7 s; arrow disc nudges 2px up-right and scales 1.06 |
| Nav | transparent over the hero, then page colour at 84% + 18px blur + 1px hairline, 0.7 s |
| Never | bounce, spin, parallax on everything, more than one marquee, constant motion besides the hero loop |

---

## 6. Sequence player usage

```html
<section class="seq" data-seq data-frames="120"
         data-src="frames/frame_{i}.webp" data-pad="3"
         data-focus="50% 58%" data-portrait-zoom="1.35">
  <div class="seq-sticky">
    <canvas class="seq-canvas" role="img" aria-label="What the sequence shows"></canvas>
    <img class="seq-fallback" src="frames/poster.jpg" alt="The final state">
    <div class="seq-bar" aria-hidden="true"></div>
    <div class="seq-steps">
      <div class="seq-step" data-range="0.04,0.30">...</div>
      <div class="seq-step" data-range="0.36,0.63">...</div>
      <div class="seq-step" data-range="0.69,1.00">...</div>
    </div>
  </div>
</section>
<script src="scroll-sequence.js"></script>
```

- `data-focus`: focal point for cover-fit crops on wide screens.
- `data-portrait-zoom`: on portrait screens the full frame width is shown times this factor.
- `data-feather="0"`: turn off per-frame edge feathering (only if the footage already
  has a backdrop identical to the page).
- The section exposes `--seq-progress` (0 to 1) for any CSS you want to drive.
- With GSAP already on the page, the same draw function can run from a
  `ScrollTrigger` `onUpdate` instead of the built-in observer loop.

---

## 7. Pre-flight checklist

- [ ] Footage has a seamless backdrop, a locked camera, and no morphing parts
- [ ] Hero loop: WebM + MP4, poster, under ~1.5 MB, paused off screen and under reduced motion
- [ ] Sequence: at most ~3 MB, loads after `load`, coarse-to-fine, cover-fit, portrait mode checked on a 390px screen
- [ ] No hard rectangle edges around any footage, in light and dark mode
- [ ] Copy never sits on top of the footage
- [ ] Page is fully readable with JavaScript off, and with reduced motion on
- [ ] Canvas has `role="img"` and an `aria-label` describing the sequence; steps are real headings
- [ ] One easing, one radius scale, one accent; labels rationed; no em dashes; no placeholder photography
- [ ] Same CTA label everywhere; contact details visible as text
- [ ] Lighthouse on mobile: LCP under 2.5 s (the hero text is the LCP element, not the video)
