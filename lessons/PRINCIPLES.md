# Principles

Rules distilled from every lesson so far. Each one has shown up more than once, or cost a real flaw when it was missed. Every lesson and improvement run reads this file first and applies all of it. Improvement runs keep it short: merge, sharpen, and delete rather than pile on.

## Look

1. **Never park the reader between states.** Any section where text must be read holds a settled visual state. Transitions happen between reading stops, never under them. (001 mid-morph noise, 003 pinned sections)
2. **Text over moving or busy imagery gets a scrim.** A soft gradient under the text block, never a solid box. (001 stats row)
3. **One loud thing per screen.** The visual or the headline carries weight, not both; light type next to heavy motion.
4. **Contrast sections on purpose.** A light editorial break makes dark sections feel deep, and the reverse. Fixed chrome (nav, frame, cursor) must flip with it: a dark glass pill over a light section reads as a grey smear. (001)
5. **One statement per screen.** Two sections whose text sits on adjacent edges show up together. Put empty space on one side of every section boundary. (001, 003)
6. **Copy tells the truth on the device reading it.** Numbers that depend on tier, locale or feature support are written by the code that knows them. (001 "80k points" on phones)

## Check

7. **Every state is a screenshot.** Dark mode, hover, focus, reduced motion, fallback, and every scroll stop inside pinned or scrubbed sections get looked at, not assumed. The worst flaw usually hides in the state nobody opened. verify-demo now renders reduced motion, forced fallback, 360/430 widths and focus on its own; dark mode and hover are still manual. (002 dark mode, 003 pinned sweep, 001 fallback)
8. **A fallback shows the idea, not an apology.** With the feature forced off (`CSS.supports` false, no WebGL), the page still shows the form in a cheaper medium (a 2D-canvas still, a static frame), never just a gradient blob. (001, 003)
9. **Generated or procedural imagery gets its own render-and-look loop** before it goes into a page. (003)

## Build

10. **Same values in the skill and the demo.** The SKILL.md code is the code the demo runs. Splice code blocks from the demo file rather than retyping them; retyped code drifts (001 had a different scroll driver in the skill than in the demo).
11. **Style the body, not only the root.** Text color and type go on `body` as well as `html`: embeds and artifact viewers style `body` first, and everything that inherits turns dark on dark. verify-demo's host check fails on it. (Mörkerdal, 001)
12. **Bleeding layers need a fence.** Scrims and glows with negative insets go inside a container with `position: relative` and `overflow-x: clip` (not `hidden`, which breaks sticky). A media query that resets `position` on that container silently moves the layer to the next positioned ancestor. (001 and Mörkerdal: zoomed-out phone layout, 1,900px of dead scroll)
13. **Original brand, original copy, learned pattern.** Never lift code, text, assets, or prompts from the source site.
