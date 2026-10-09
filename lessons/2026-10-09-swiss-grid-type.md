# 004: Swiss Grid Typography

**Area:** Typography · **Date:** 2026-10-09 · **Graduated to:** [`swiss-grid-type-skill`](../skills/swiss-grid-type-skill/SKILL.md)

## Seen in

twks (twks.ch), a Geneva creative agency, Awwwards Site of the Day on 7 Oct 2026. Chosen as the backup after the owner turned down the first pick for the day. The whole site is one grotesk in a handful of sizes. A large statement paragraph starts its first line one column in, with a small smiley pictogram set inside the sentence. A "What we do" block puts a hairline across most of the width, a small label at the left and the body text far right with its own first-line indent. Navigation is plain text spread across the header grid and inverts over images. Case studies sit in two staggered columns, each captioned with a black title and a gray line of the same size.

## Why it works

- **Constraint reads as confidence.** One family and three sizes leave the work images to carry all the color and noise.
- **The grid is visible without lines.** When every indent and caption starts on a column, the eye feels the structure even in the empty cells.
- **Gray instead of small.** Same-size gray secondary text keeps every line readable and the page calm.
- **A glyph in the sentence** gives an otherwise austere statement a moment of personality, and doubles as the brand mark.

## How to build it

Measure one column from the container and use it for every indent. Full system, header, cases and JS: [`swiss-grid-type-skill`](../skills/swiss-grid-type-skill/SKILL.md).

```css
:root { --cols: 6; --m: 12px; --g: 12px; }
.page { container-type: inline-size; }
.page * { --col: calc((100cqw - 2 * var(--m) - (var(--cols) - 1) * var(--g)) / var(--cols)); }
.grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); column-gap: var(--g); padding-inline: var(--m); }
.statement { grid-column: 1 / -1; text-indent: calc(var(--col) + var(--g)); font: 600 3.66vw/1 var(--sans); }
.top { position: fixed; color: #fff; mix-blend-mode: difference; } /* outside .page */
```

## Taste rules

- Three sizes, two weights, one gray at 4.5:1 or better (#737373, not the common #8C8C8C).
- Indents are column positions, set with `text-indent` so only the first line moves.
- Navigation is text on the grid; the header inverts with `mix-blend-mode: difference`, and every hero color is checked for the inverse's contrast.
- Leave empty columns empty; stagger cases rather than filling the row.
- Never put `container-type` on an ancestor of a fixed header.

## Slop version

Four sizes and two families, gray text that fails contrast, indents in px that drift off the grid, a white nav bar with a shadow, every column filled with something, an emoji in the headline instead of a drawn mark, and centered text.
