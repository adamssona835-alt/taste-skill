# Dina Hariri, Advokat: "Klartext"

A premium rebuild of the owner's client site for advokat Dina Hariri, built on request with the techniques from the lessons. The earlier version lived in a Design canvas that turned out to be empty, so this is a new build. Facts not known about the firm are bracketed placeholders (address, phone, e-mail) and the practice areas are a plausible general list to be confirmed by the client.

## The idea

A lawyer's work is turning dense text into plain answers, so that is the motion. The page is laid out like a statute: a blue margin rule runs down the page, sections are numbered paragraphs (§ 1 to § 5) listed in the margin, and the index follows the reader.

1. **§ 1 Hero.** The name, huge, in Newsreader on faint ruled paper; the claim "Juridik på svenska. Inte på juridiska."
2. **§ 2 Klartext (pinned, 420vh).** A real-looking clause from a lease, 70 words of legalese. Three held states: the original; the eight words that carry the meaning marked in ballpoint blue while the rest dims; then those eight words lift off the page and fly, staggered in reading order, into a plain sentence ("Du har rätt att säga upp avtalet, skriftligen och tre månader i förväg."). It is the particle morph from lesson 001 done with words: one set of elements, two layouts, the move is the transition.
3. **§ 3 Verksamhet.** A table of contents with dotted leaders instead of cards.
4. **§ 4 Arbetssätt.** Four steps on a margin line that fills with scroll; rättsskydd and rättshjälp explained beside it.
5. **§ 5 Kontakt.** Dark section, form, confidentiality line, and a signature that writes itself (clip-path scrubbed by scroll) as the page closes.

## How the word morph works

`{word}` in the markup marks the eight key words in both texts. On load both paragraphs are split into spans and stacked in one grid cell. `measure()` records each key word's offset and the font-size ratio between the two texts; each frame sets `translate()` and `scale()` with `transform-origin: 0 0`, centered on the line box so line-height differences do not show. When every word has landed, the flying spans hide and the real spans in the plain sentence show, so the final text is crisp, selectable DOM. Reduced motion jumps between the three states.

## Lessons applied (and one new one)

- Hold states at reading stops; nothing in the pinned section shows until it is pinned (one statement per screen).
- Color and type set on `body`, verified inside a stand-in for the artifact viewer's reset (the Mörkerdal bug).
- `overflow-x: clip` on `main`; fixed nav and margin index flip over dark sections.
- New: the blue marker under the key words travelled with them and turned into big blue blocks mid-flight. Decoration that belongs to the page must stay on the page when the words lift off.

Verified with `node scripts/verify-demo.mjs demos/hariri --stops 20`, and again wrapped in the viewer's reset.
