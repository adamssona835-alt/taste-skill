# 006: Frame Reel Transitions

**Area:** Page transitions · **Date:** 2026-10-11 · **Graduated to:** [`frame-reel-skill`](../skills/frame-reel-skill/SKILL.md)

## Seen in

MilleDollars (milledollars.fr), a Paris creative bureau for high-end video production, picked as Awwwards Site of the Day for 2 Oct 2026 (date from the plan; it could not be re-confirmed in October listings). The home page is one project at a time inside an inset frame with rounded corners and a hairline inside it. Tiny uppercase labels sit on the frame: the name split across the top corners, a one-line descriptor top center, the menu bottom left, the project number and year at the middle of each side, the client left of center and the title right of it with "Discover" between them. One wheel step does not slide to the next project: the frame zooms out until the whole reel shows as a column of rounded cards on a light gray table, moves one card, and zooms back in, with the labels gone during the move and fading back after it.

## Why it works

- **The move explains the site.** One second of zoom shows the visitor that this is a reel of films and where they are in it, without a progress bar or a list.
- **The frame stays still.** Because the labels never ride with the picture, the eye stays put and the change of project feels like a cut, not a scroll.
- **Restraint on the frame.** Twelve-pixel labels at the edges leave the picture alone; the only larger text is the client and the title.
- **Works is the same object.** Zoomed out, the reel is already the overview, so the navigation and the transition are one idea.

## How to build it

One transform on the whole stack, four keyframes. Full system, input handling, overview and case morph: [`frame-reel-skill`](../skills/frame-reel-skill/SKILL.md).

```js
// centre card `pos` at scale `s`, scaling around the viewport centre (stack has transform-origin: 0 0)
function xf(s, pos) {
  var cx = innerWidth / 2, cy = innerHeight / 2, y = pos * 1.12 * innerHeight + cy;
  return 'translate(' + cx + 'px,' + cy + 'px) scale(' + s + ') translate(' + -cx + 'px,' + -y + 'px)';
}
stack.animate([{ transform: xf(1, i) }, { transform: xf(.3, i), offset: .32 },
               { transform: xf(.3, j), offset: .68 }, { transform: xf(1, j) }],
              { duration: 1300, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
```

## Taste rules

- The frame and its labels never move; labels fade out before the move and back after it.
- One wheel gesture is one step; fast key presses add up to one move to the final target.
- Grade every still so each label measures at least 4.5:1 against white, by pixels; give labels their own soft scrims and the Discover cue a pill.
- Works is the same stack zoomed out, and case pages grow out of the still with a View Transition.
- Phones and no JS get a plain scrolling column of framed cards; every state lives in the URL hash.

## Slop version

A full-screen crossfade slider with dots and arrows, a big "View project" button, labels that slide in with each slide, a trackpad flick that skips four projects, a separate "Works" grid page, white text on a pale still with no scrim, and scroll hijacked on phones.
