# Daily Lesson Protocol

This is the contract every daily run follows. Nobody hands the agent a website or a topic. The agent finds a premium site on its own, studies it live, and ships a **verified skill with a working demo**. Every day must match or beat the best entry so far. A day that cannot meet the bar ships nothing rather than something weaker.

Before anything else, read [`PRINCIPLES.md`](PRINCIPLES.md) and apply every rule in it.

The reference for "quality" is [`skills/particle-morph-skill`](../skills/particle-morph-skill/SKILL.md) (lesson 001). Read it before starting.

---

## 0. Evening Plan (23:55, Europe/Stockholm)

The night before each lesson, a separate routine picks tomorrow's site so the owner can veto it.

1. Pick the site exactly as section 1 describes (area rule, recency, reproducible, not already covered). Do a quick capture (`capture-site.mjs`) and look at the screenshots to prove it renders headless (a finished capture can still be all preloader); if it does not, pick another. The backup must pass the same check.
2. Write [`NEXT.md`](NEXT.md): date of the lesson, lesson number, site URL, where it was found (award page link), area, the technique to learn, why it qualifies, the planned demo concept (invented brand), the step-by-step plan for the morning, and a backup site. Set `Status: pending`.
3. Commit as `Plan for lesson NNN: <site>` and push to the working branch.
4. Send the owner a push notification in Swedish with the site link, technique and area, and say that silence means approved. End the turn with the full plan in Swedish.
5. If the owner rejects it before the morning run, pick another site (the backup if it still fits), update `NEXT.md` (`Status: replaced`, reason), push, and notify again. If the owner approves or says nothing, the morning run uses it.

In the morning, section 1 is replaced by `NEXT.md` when its date is today and its status is not `rejected`: use that site and that plan. If `NEXT.md` is missing, stale, or rejected without a replacement, find a site as usual.

## 1. Find the Source (Autonomous)

1. Read the index in [`README.md`](README.md). Note the **areas** used in the last three lessons; today's area must differ from all three.
   Areas: typography, layout and grid, color and light, scroll motion, WebGL and 3D, micro-interactions, navigation and menus, page transitions, forms and UX copy, imagery and art direction, data display, accessibility, performance, mobile-first patterns, new CSS (view transitions, scroll-driven animations, anchor positioning, container queries, `:has()`, `@starting-style`).
2. Use web search to find candidates from the last ~60 days: Awwwards Site of the Day / Developer Award, CSS Design Awards, FWA, Godly, Siteinspire, Codrops tutorials and roundups, design engineering blogs and newsletters. Awwwards blocks headless browsers, so read listings through web search / fetch, then capture the **site itself**.
3. Pick the site whose signature technique is (a) clearly premium, (b) reproducible with web standards or common libraries, (c) not already covered in `lessons/` or `skills/`.
4. Capture it live:
   ```bash
   npm i --no-save playwright-core
   node scripts/capture-site.mjs <url> /tmp/capture
   ffmpeg -i /tmp/capture/desktop/scroll.webm -vf "fps=1,scale=480:-1,tile=4x4" -frames:v 1 /tmp/capture/desktop/sheet.jpg
   ffmpeg -i /tmp/capture/mobile/scroll.webm -vf "fps=1,scale=240:-1,tile=6x3" -frames:v 1 /tmp/capture/mobile/sheet.jpg
   ```
   Look at the contact sheets and the individual scroll screenshots. Read `report.json` for fonts, colors, radii, and libraries. If capture fails or the site is mostly blank (WebGL under software rendering, bot wall), move to the next candidate. Try at least three before falling back to a technique-only lesson from a written source.
5. Never copy proprietary code, copy text, images, 3D models, or paid prompts. Learn the pattern, then build an original version with an invented brand.

## 2. Ship All Four Deliverables

| # | File | Requirement |
| --- | --- | --- |
| 1 | `skills/<slug>-skill/SKILL.md` | Frontmatter (`name`, `description`). Sections, at minimum: rules that make it premium (numbered, specific values), layout blueprint, stack, complete code (not fragments that need guessing), fallbacks and accessibility, performance checklist, anti-patterns, working demo, pre-flight questions. |
| 2 | `skills/<slug>-skill/demo/index.html` (+ `preview.webp`) | Complete single page using the technique in context (hero plus at least three sections), original brand and copy, CDN imports with pinned versions, responsive, reduced-motion path, no-JS / no-WebGL fallback where relevant. `preview.webp` is a strip of three verified screenshots. |
| 3 | `lessons/YYYY-MM-DD-<slug>.md` | Seen in (site + what it does, described not copied), Why it works, How to build it, Taste rules, Slop version. |
| 4 | Registration | Row in `lessons/README.md` index; skill added to `skills/llms.txt`, `skill.sh`, the README skills table, and `CHANGELOG.md`. |

## 3. Verify (Mandatory)

```bash
node scripts/verify-demo.mjs skills/<slug>-skill/demo /tmp/verify
```

It must print `OK`. It runs desktop, phones at 360/390/430, reduced motion at every scroll stop, and a forced-fallback pass (WebGL unavailable, `CSS.supports()` false), and fails on page errors, console errors, failed requests, horizontal overflow at any stop, any element Tab reaches without a visible focus change, a phone layout viewport wider than the phone, scroll past the end of the content, and a body background or text that changes when a host page styles `<body>`. For pinned or scrubbed sections add `--stops 30`. With ImageMagick installed it writes `sheet-<pass>.jpg` contact sheets, one row per pass.

Then **look at every contact sheet, including the fallback and reduced ones** and write down at least three visual flaws (overlaps, unreadable text over busy backgrounds, awkward wraps, dead space, mobile cramping, motion parked mid-transition). Fix them and verify again. Repeat until a fresh look finds nothing worth fixing. Fold what you learned into the skill's "Working Demo" notes so the next agent does not repeat it.

Every code block in `SKILL.md` must match what the demo actually runs.

## 4. Quality Gate

Score 1 to 5 on each criterion. Be harsh; a 5 means an Awwwards jury would not flinch.

| Criterion | What a 5 looks like |
| --- | --- |
| Visual craft | Screenshots look like a real studio site, not a tutorial. |
| Technique depth | Explains *why*, gives exact values, covers edge cases. |
| Code completeness | Copy, paste, run. No placeholders, no "add your logic here". |
| Verified | `verify-demo` OK and three or more visual fixes made. |
| Accessibility | Reduced motion, contrast, focus states, semantic DOM, fallback. |
| Performance | Budgets stated, paused offscreen, tiered by device where relevant. |
| Originality | Invented brand and copy; the pattern is learned, not lifted. |
| Reusability | Another agent can apply it to a different brand tomorrow. |

**Ship only if** every criterion is at least 4 **and** the total is at least the highest total in the index. If not, keep improving. If time runs out, push nothing to `skills/` and record the attempt in the index as `not shipped` with the reason.

Record the total (out of 40) in the index row.

## 5. Commit

One lesson commit per day, message `Lesson NNN: <technique> (<area>)`, pushed to the working branch (plus the evening `Plan for lesson NNN` commit). After the lesson ships, set `NEXT.md` to `Status: done` in the same commit. No pull requests unless the owner asks.

## 6. Improve the Protocol

If today taught something about *how* to run these lessons (a better capture trick, a check that would have caught a bug, a source that works well), add one line below. The protocol should get sharper every day.

### Notes from past runs

- 2026-10-07: Awwwards resets headless connections; direct site capture works for most studios. Heavy WebGL sites may time out a few screenshots under SwiftShader; the capture script keeps going and logs which ones.
- 2026-10-07: A section parked mid-morph looked like noise in screenshots. Always check every scroll stop, not only the hero.
- 2026-10-07: Match `playwright-core` to `/opt/pw-browsers` (chromium-1194 = `@1.56.1`) or capture fails on ffmpeg; Chromium needs `<-loopback>` in the proxy bypass (now in verify-demo); and verify-demo never toggles theme or hovers, so screenshot dark mode and hover states yourself (lesson 002's worst flaw only showed in dark mode).
- 2026-10-08: Generated imagery needs its own render-and-look loop before it goes into the page. (The pinned-section sweep, forced `CSS.supports` fallback and mid-page reduced motion from this note are now built into verify-demo: `--stops 30`, the `fallback-*` and `*-reduced` passes.)
- 2026-10-08 (improve): A dense sweep catches transit frames, but the bugs a visitor remembers sat at reading stops past the hero: two statements on one screen, a dark nav over a light section, a stat that was false on phones. Read every contact sheet end to end, not only the first frames. A dense sweep's 500ms wait can catch reveal animations mid-blur; judge those at the default stops.
- 2026-10-08 (Mörkerdal demo): Two bugs passed every old check: a sideways-bleeding scrim widened the phone layout viewport (the page rendered zoomed out, `scrollWidth` stayed equal to the widened `innerWidth`), and a scrim positioned against `<main>` made the page scroll 1,900px past the footer. verify-demo now fails on both. If the last screenshots of a mobile pass look identical and empty, suspect dead scroll.
- 2026-10-08 (improve): The new host check (page loaded under a stand-in for a viewer's body reset, every text box compared) found the same dark-text bug in the lesson 001 demo that had only shown on the owner's phone in Mörkerdal. verify-demo's forced fallback only disables WebGL; for a 2D-canvas effect, also look at the page once with `getContext` returning `null`.
- 2026-10-08 (owner report): The republished Halcyon artifact was a white screen on a desktop. The demo set its dark background on `html` only; the viewer paints its light background on `body`, which covers the root, and the light text vanished on it. The host check only compared text, so it passed. It now compares the body background too and fails on the old demo.
- 2026-10-09: With `mix-blend-mode: difference` text, the color a reader sees is the inverse of what is under it; compute that inverse's contrast for every hero color (a vivid cobalt gave 4.1:1). And `container-type` on a wrapper makes `position: fixed` children scroll with it: keep fixed chrome outside container wrappers.
