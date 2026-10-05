# Analys: Nick Saraev – "Claude Code + Nano Banana 2 + Kling = $15K Animated Sites"

Videon: https://www.youtube.com/watch?v=ZfYvv-0l9NA

> YouTube blockerar automatiska hämtningar från den här miljön, så videon kunde inte ses
> direkt. Analysen bygger på flera oberoende genomgångar av videon och Nicks närliggande
> tutorial "Claude Code + Nano Banana 2 = $10,000 Animated Websites" (källor längst ner).
> Delar som bara står i själva videon (exakta ord, hans skill-fil) kan avvika.

## Idén i en mening

Gör **två stillbilder** (start och slut) med en bildmodell, låt en videomodell skapa
**övergången** mellan dem, dela upp videon i **bildrutor** och låt sidan visa rätt ruta
beroende på hur långt besökaren har **scrollat**. Det ser ut som 3D/film men är bara en
bildsekvens på en `<canvas>`.

## Steg för steg

| # | Verktyg | Vad som händer | Detaljer som gör skillnaden |
|---|---------|----------------|-----------------------------|
| 1 | **Nano Banana 2** (Google Gemini-bildmodell) | Startbild: produkten/motivet "hel", på en enfärgad bakgrund | Bakgrunden ska ha **exakt samma färg som sajtens sektion**, så att videon smälter in i sidan. Ingen text i bilden. |
| 2 | **Nano Banana 2** | Slutbild: samma motiv, transformerat | Typiska transformationer: *deconstruction/exploded view*, *röntgen* (skal blir genomskinligt), *bygg från ingenting*, *byte av material/färg*. Samma kameravinkel och bakgrund som startbilden. |
| 3 | **Kling 3.0** (alt. Veo 3.1) | Start- + slutbild in → 5–10 s video ut | Använd läget *start frame + end frame*. Kort, enkel prompt om en **långsam, kontinuerlig** övergång. Stäng av "prompt enhancement". Hellre krispigt och enkelt än avancerat. 1080p. |
| 4 | **Claude Code** + **FFmpeg** | Videon delas upp i ~120–180 rutor | Rutorna konverteras till **WEBP** (25–35 % mindre än JPEG). Claude Code får MP4-filen + en markdown-fil med "best practices för scroll-animation" + en beskrivning av sajten. |
| 5 | **Claude Code** | Bygger sajten runt animationen | Rutorna ritas på en **canvas** (inte `<img>`-byten), första rutorna **förladdas** först, resten i ordning. Scroll-progress → rutindex. Runt det: hero, fördelar, social proof, CTA, mobilanpassning. |
| 6 | Vercel e.d. | Deploy | Färdigt på 1–2 dagar. Säljs till DTC-varumärken för 15–20 tkr USD. |

### Varför det fungerar
- **Matchande bakgrund** gör att videon inte ser ut som en ruta på sidan, utan som att sidan själv rör sig.
- **Canvas + förladdade WEBP** ger jämn uppspelning åt båda hållen, något en `<video>` med `currentTime` inte klarar lika bra (video-seek hackar, särskilt på mobil).
- **Scroll som tidslinje** gör att besökaren "spelar upp" berättelsen själv, och texten kan bytas i takt med bilden.

## Så har jag tillämpat det på en målarfirma

Transformationen för en målarfirma är självklar: **slitet rum → nymålat rum**.

| Nicks steg | Det här projektet |
|------------|-------------------|
| Startbild (Nano Banana 2) | Grått, fläckigt rum med spackellagningar, sprickor, maskeringstejp, täckpapp och färgburk |
| Slutbild (Nano Banana 2) | Samma rum, väggen i skogsgrönt, tejpen borta, varmare ljus |
| Övergång (Kling) | En roller målar väggen i tio vertikala våder, vänster till höger |
| FFmpeg → WEBP | `pipeline/build.sh`: 150 rutor, 1440 px, kvalitet 72 → **2,2 MB totalt** |
| Canvas + scroll | `site/index.html`: 420vh lång sektion, sticky canvas, cover-skalning, lerp-utjämning, tre textavsnitt som byts i takt med klippet, en mätare "Målad yta x / 18,4 m²" |

**Viktigt:** Jag har inte tillgång till Nano Banana 2 eller Kling härifrån (de kräver ditt
konto/API-nyckel). Därför ersätts steg 1–3 av `pipeline/scene.html`, en ritad scen som renderas
till en riktig MP4 (`pipeline/out/transition.mp4`). **Resten av pipelinen är exakt samma**, så du
kan byta in en riktig Kling-video med ett kommando:

```bash
cd malarfirma/pipeline
KLING_VIDEO=/sökväg/till/kling.mp4 ./build.sh     # skriver om site/frames/
```

Sajten läser antalet rutor från `site/frames/manifest.json`, så det spelar ingen roll om du extraherar 120 eller 180.

## Prompter att köra själv

### Nano Banana 2, startbild
```
Photorealistic interior photo of an empty Scandinavian living room wall, straight-on
eye-level view, 16:9. Old worn grey-beige paint with water stains, hairline cracks and
fresh white filler patches. White wooden window with mullions on the right, blue painter's
tape along the window frame and skirting board. Light grey drop cloth on an oak plank floor,
an open paint bucket with dark forest green paint. Soft daylight from the window.
No people, no text, no logos.
```

### Nano Banana 2, slutbild (ladda upp startbilden som referens)
```
The exact same room, same camera angle, same framing and lighting. The wall is now freshly
painted in a deep forest green (NCS S 6020-G10Y), smooth, even, matte finish. All tape removed,
filler patches and cracks gone, crisp clean edges against the white window frame and skirting.
Slightly warmer afternoon light. Keep every other object identical. No people, no text.
```

### Kling 3.0, start + slutbild
```
Static camera, very slow push-in. A paint roller enters from the left and paints the wall
in smooth vertical strokes from left to right until the entire wall is forest green. Then the
roller exits and the tape is peeled away. Continuous, calm, realistic motion.
```
Inställningar: 5 s (eller 10 s), 1080p, *prompt enhancement av*, ingen kamerarörelse utöver push-in.

### Prompt till Claude Code (motsvarande Nicks)
```
Här är transition.mp4 och scroll-animation-best-practices.md. Bygg en svensk sajt för
målarfirman Lindqvist Måleri i Uppsala. Dela upp videon i ~150 WEBP-rutor med ffmpeg,
rita dem på en sticky canvas som styrs av scroll (förladda första rutan först), och bygg
sektionerna: tjänster med riktpriser, arbetsprocess, kulörväljare med NCS-koder,
ROT-kalkylator och offertformulär. Mobilanpassat, respektera prefers-reduced-motion.
```

## Filer

```
malarfirma/
├── ANALYS.md              ← den här filen
├── pipeline/
│   ├── scene.html         ← ersätter Nano Banana + Kling (ritad transition)
│   ├── render-frames.mjs  ← Playwright renderar scenen till PNG
│   └── build.sh           ← PNG → MP4 → ffmpeg → WEBP-rutor (eller KLING_VIDEO=…)
└── site/
    ├── index.html         ← sajten
    └── frames/            ← 150 WEBP + manifest.json
```

Kör lokalt: `npx http-server malarfirma/site` och öppna http://localhost:8080
(rutorna hämtas med relativa sökvägar, så sidan behöver serveras, inte öppnas som fil).

## Källor
- [Claude Code + Nano Banana 2 + Kling = $15K Animated Sites (YouTube)](https://www.youtube.com/watch?v=ZfYvv-0l9NA)
- [ScienceBased.AI: Build Scroll-Triggered Animations with Claude Code & Kling AI](https://www.sciencebased.ai/ai-examples/claude-code-scroll-animations)
- [Geeky Gadgets: Using Claude Code & Nano Banana 2 to Build 3D Website Animations](https://www.geeky-gadgets.com/nano-banana-2-3d-website-animations/)
- [Chase AI: Claude Code + Nano Banana 2: Build 3D Scroll Websites](https://www.chaseai.io/blog/claude-code-nano-banana-2-3d-scroll-websites)
- [The Creators AI: 4 Nano Banana Workflows As Sellable Services](https://thecreatorsai.com/p/hire-nano-banana-2-and-fire-your)
