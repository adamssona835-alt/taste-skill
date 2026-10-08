# Improvement Protocol

The daily lesson adds something new. This run makes everything that already exists better. Together they compound: new lessons raise the bar, improvement runs lift old work up to it, and both feed the tools and principles every later run starts from.

Run it fully autonomously. Nobody hands you a target.

---

## 1. Pick the Target

1. Read [`README.md`](README.md) (index with score history), [`PROTOCOL.md`](PROTOCOL.md) (especially "Notes from past runs"), and [`PRINCIPLES.md`](PRINCIPLES.md).
2. Choose **one** shipped skill, in this order:
   - the lowest current score;
   - on a tie, the one improved least recently (or never);
   - skip a skill improved in the last three improvement runs unless every skill has been.
3. Write down which newer notes and principles it was built *without*. Those are your first suspects.

## 2. Audit It Like a Jury

1. Run `node scripts/verify-demo.mjs skills/<slug>/demo /tmp/verify`. It must print OK. Note that the script itself may have learned checks since the skill shipped (fallback, reduced motion at every stop, 360/430, focus): an old OK is not a current OK.
2. Then go beyond it: rerun with `--stops 12` (30 for pinned or scrubbed sections) and read every `sheet-*.jpg`, then do what the script still cannot: dark mode, hover states, contrast of text over moving imagery mid-scroll.
3. Look at every screenshot. List every flaw, then rank them by how much a visitor would notice.
4. Re-read the SKILL.md as an agent seeing it for the first time. Where would you guess, get stuck, or ship slop? Missing values, vague rules, code that drifted from the demo.

## 3. Raise It

- Fix the visual flaws in the demo, most visible first. Re-verify after each batch.
- Bring SKILL.md up to date: exact values, newer principles applied, code identical to the demo, a clearer anti-pattern list, a better pre-flight.
- Regenerate `preview.webp` from the verified screenshots.
- If the skill's technique has moved on since it was written (new CSS feature, better library API, better approach seen on a newer award site), adopt it and say why.

## 4. Improve the Machine

Pick at least one of these every run. This is what makes later runs better, not only this skill.

- **Tooling.** When a note says "verify-demo misses X", teach `scripts/verify-demo.mjs` (or `capture-site.mjs`) to check X automatically. A rule that a script enforces beats a rule someone has to remember.
- **Principles.** When the same lesson shows up in two or more notes or skills, distill it into one rule in `PRINCIPLES.md` and delete the duplicate notes it replaces.
- **Protocol.** Tighten a step in `PROTOCOL.md` that let a flaw through.

Run any changed script against two existing demos before committing, so tooling changes never break what already passes.

## 5. Score and Record

- Re-score with the quality gate in `PROTOCOL.md`. Ship only if the new total is **higher** than before and every criterion is at least 4.
- Update the skill's row in the index: score becomes the history, for example `34 → 37/40`.
- Add a line to the **Improvement log** in [`README.md`](README.md): date, skill, old and new score, the biggest fix, and the machine improvement.
- If you could not raise the score, change nothing in the skill and log what you tried.

## 6. Commit

`git fetch` and rebase onto the latest branch first (the daily lesson may have pushed). Commit as `Improve <skill>: <old> → <new>/40 (<biggest fix>)`, push, confirm the push succeeded. No pull requests.
