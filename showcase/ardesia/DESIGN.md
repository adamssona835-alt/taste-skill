# Ardesia: creative direction

**Reading this as:** a portfolio and enquiry site for a small architecture and interiors studio, written for private clients commissioning a house. The language is editorial and architectural, built on a classical serif, restrained motion and one real-time 3D moment.

Ardesia is fictional. *Ardesia* is Italian for slate, the stone quarried in Liguria above Lavagna. The studio is in Genoa and builds houses, restorations and retreats between the Apennines and the sea.

## Brand personality
Quiet, exact and patient. The studio is closer to restorers than to "starchitects": it surveys first, intervenes little and builds with local material. The site should feel the same way: unhurried, confident and free of decoration.

## Visual language
- **Concept: stone and light.** Every major decision comes back to material (slate, concrete, lime, oak) and to the movement of the sun.
- **Hero:** a real-time WebGL room of board-marked concrete. Low sun behind a wall of irregular piers lays blades of light across the floor, and the blades drift slowly. The scene is procedural and loads no 3D assets.
- **Corners:** sharp everywhere. Buildings have arrises, not radii.
- **No cards, no shadows, no gradients**, apart from one functional scrim behind the hero copy.

## Typography
| Role | Face | Spec |
|---|---|---|
| Display / H1 | Bodoni Moda, opsz 96, 400 | clamp(3.1rem, 8.4vw, 9.6rem) / 0.98, -0.025em |
| H2 | Bodoni Moda | clamp(2.35rem, 5vw, 5.4rem) / 1.02 |
| H3 | Bodoni Moda, opsz 48 | clamp(1.55rem, 2.3vw, 2.4rem) / 1.1 |
| Statement | Bodoni Moda, opsz 72 | clamp(1.7rem, 3.5vw, 3.75rem) / 1.16 |
| Body / nav / CTA | Hanken Grotesk 400/500 | 17px / 1.6 |
| Meta (eyebrow) | Hanken Grotesk 500 | 12px, 0.14em, uppercase. Used 4 times on the whole page |

Why Bodoni: it comes from Parma (1798), it has a rational, constructed contrast that reads as architecture, and it is Italian. Emphasis always uses the italic of the same family, never a second display face.

## Colour
Slate and limestone, with one accent: the terracotta of Genoese facades.
`--bg #e8e7e2` · `--ink #151718` · `--ink-2 #3f4345` · `--muted #5d6163` · `--accent #a3482a` · `--night #111314`.
Dark mode follows the OS. The page turns to night once, deliberately, for the light study.

## Layout and spacing
- 12 columns (4 on mobile), gutter `clamp(16px, 2vw, 32px)`, page margin `clamp(20px, 4.2vw, 72px)`.
- Section rhythm varies on purpose, from about 6rem to 16rem. No two sections share a layout family:
  full-bleed 3D, typographic statement with inline images, overlapping image pair, interactive index, expanding full-bleed, pinned horizontal gallery, pinned night sequence, scattered triad, asymmetric figures, tabbed quote, split CTA, wordmark footer.

## Image direction
Natural light, material, shadow and coast. One grade is applied to every photograph (−14% saturation, slight gamma lift) so the set reads as a single shoot. Crops are intentional (`object-position` per use). Images are served as AVIF and WebP at 5 widths with blurred placeholders, and lazy-loaded below the fold.

## Motion language
- **Easing:** expo.out for reveals, power4.inOut for curtains. Durations run 1.1 to 1.6s, with staggers of 0.06 to 0.12s.
- **Entrance:** wordmark curtain, then the curtain lifts, the sun rises behind the wall, the camera settles, the headline lines rise and finally the nav fades in.
- **Scroll:** line-masked headings, shutter-style image reveals with a settling zoom, gentle parallax, a featured image that grows to full bleed, a pinned sideways gallery and a pinned three-hour light sequence.
- **Interaction:** a magnetic CTA (8 to 10px maximum) with a rolling label and a terracotta fill, an image that trails the pointer in the services index, and slow 1.035 scaling on image hover.
- **Never:** bouncing, spinning, glows, particles or a custom cursor.
- **Reduced motion:** with `prefers-reduced-motion` on, there is no curtain, no smooth scroll and no pinning. The 3D scene renders a still frame and all content is visible immediately.

## Mobile
Designed separately rather than shrunk. The hero lens widens so the slit wall stays in frame, and the 3D scene runs at lower resolution with lighter shadows. The services index becomes an accordion with its own images. The gallery becomes a vertical sequence with alternating indents. The light study becomes three stacked hours. Touch targets are at least 44px and the menu is a full-screen overlay.
