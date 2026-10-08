# Principles

Rules distilled from every lesson so far. Each one has shown up more than once, or cost a real flaw when it was missed. Every lesson and improvement run reads this file first and applies all of it. Improvement runs keep it short: merge, sharpen, and delete rather than pile on.

## Look

1. **Never park the reader between states.** Any section where text must be read holds a settled visual state. Transitions happen between reading stops, never under them. (001 mid-morph noise, 003 pinned sections)
2. **Text over moving or busy imagery gets a scrim.** A soft gradient under the text block, never a solid box. (001 stats row)
3. **One loud thing per screen.** The visual or the headline carries weight, not both; light type next to heavy motion.
4. **Contrast sections on purpose.** A light editorial break makes dark sections feel deep, and the reverse.

## Check

5. **Every state is a screenshot.** Dark mode, hover, focus, reduced motion, fallback, and every scroll stop inside pinned or scrubbed sections get looked at, not assumed. The worst flaw usually hides in the state nobody opened. (002 dark mode, 003 pinned sweep)
6. **Force the fallback path and look at it.** Turn off the feature the effect depends on (`CSS.supports` false, no WebGL) and confirm the page still reads well.
7. **Generated or procedural imagery gets its own render-and-look loop** before it goes into a page. (003)

## Build

8. **Same values in the skill and the demo.** The SKILL.md code is the code the demo runs.
9. **Original brand, original copy, learned pattern.** Never lift code, text, assets, or prompts from the source site.
