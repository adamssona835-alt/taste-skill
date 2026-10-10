# Next Lesson Plan

Status: pending
Lesson: 006
Date: 2026-10-11 (morning run 07:52 Europe/Stockholm)
Planned: 2026-10-10 23:57

## Site

- **URL:** https://milledollars.fr
- **Found in:** Awwwards Site of the Day, 2 Oct 2026 (https://www.awwwards.com/sites_of_the_day). Paris creative bureau for high-end video production. It was the backup for lesson 005 and still fits.
- **Area:** Page transitions (last three: layout and grid, typography, scroll motion)
- **Headless check:** captured 2026-10-10 23:56, desktop and mobile, screenshots checked by eye: the inset rounded frame, the full-bleed project still, the corner labels, the split title ("Richard Mille" left, "The Dazzling Division" right), the "Discover" cue at the center and the plain-text menu all render. The background video does not play headless ("no supported source"); the poster frame shows.

## Technique to learn

**A one-screen project reel with framed transitions.** The whole home page is one project at a time, full bleed inside an inset frame with rounded corners and a hairline inner border. Small labels sit in the four corners (studio name split "Mille." top left and "Dollars" top right, a one-line descriptor top center, a counter "01" and the year at the vertical middle of each edge, the menu bottom left, sound bottom right). The client name sits left of center and the project title right of center, with "Discover" between them. Moving to the next project, or into a project page, is a transition: the image wipes or scales inside the frame while the labels stay put.

Why it qualifies: premium (Awwwards SOTD), reproducible with web standards (View Transitions API, same-document for the reel and cross-document `@view-transition` for real page changes, `clip-path` wipes as fallback), and not covered: no lesson or skill in the repo does page or slide transitions.

The craft to get right: the frame and labels must never move during a transition (only the picture changes), the transition must be interruptible (fast clicks or wheel flicks queue no backlog), keyboard and wheel and swipe all navigate, reduced motion becomes an instant crossfade-free swap, video only plays for the visible project, the split title must not collide with the center cue on narrow screens, and every label over imagery needs a scrim (principle: scrim under text over imagery).

## Planned demo

An invented Marseille film studio, **"Sel Noir"**: a reel of five projects (a perfume film, a ferry line campaign, a ceramic house, a night swim brand, a record sleeve shoot), each with an original generated still drawn in SVG and canvas (film grain, gradients, silhouettes) and an optional CSS-animated "video" loop. Home is the framed reel; "Discover" opens a project page (same document, a View Transition morphs the still into the project hero); a works index and an info view complete the four menu entries. Counter, year and client update per project.

## Morning steps

1. Fetch the branch, re-read PROTOCOL.md, PRINCIPLES.md, IMPROVE.md and this file.
2. Capture https://milledollars.fr again; measure the frame inset, radius and border, the corner label sizes and positions at 1440 and 390; record the transition between projects and into a project (screenshots mid-transition, timing).
3. Build the frame and corner labels as fixed chrome that never re-renders; the project picture is the only thing that changes.
4. Reel navigation: buttons, arrow keys, wheel (debounced, one step per gesture) and swipe; `document.startViewTransition` with named elements (`view-transition-name: still`) and a `clip-path` wipe; instant swap under reduced motion; ignore input while a transition runs, skip to the latest target.
5. Project page: open with a View Transition that morphs the still into the page hero; back button and Escape return to the same project; update the URL hash so a reload lands on the same view.
6. Write `skills/frame-reel-transition-skill/SKILL.md` with code spliced from the demo.
7. Run `verify-demo` (all passes) until OK, take extra screenshots mid-transition and after rapid navigation, look at every sheet, fix at least three visual flaws, verify again.
8. Score (every criterion at least 4, total at least 39/40, the current best after today's improvement of lesson 004), write the lesson, register, set this file to `Status: done`, commit `Lesson 006: Framed reel transitions (page transitions)`, push, notify.

## Backup

https://www.trevornoah.com (Awwwards Site of the Day and Developer Award, Sep 2026, by OFF+BRAND, https://www.awwwards.com/sites/trevor-noah): a torn-paper collage portrait with objects bursting out of the head, cut-out stickers, and a pink-on-navy palette. Area: imagery and art direction (torn-edge cut-outs with SVG filters and masks). Captured headless on 2026-10-10 23:57, desktop and mobile, screenshots checked by eye: the collage hero, the statement and the media section render (a cookie banner covers the bottom right).
