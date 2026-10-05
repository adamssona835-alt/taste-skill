# Ardesia: architecture and interiors, Genoa

A premium editorial website for a fictional architecture studio, with a real-time three.js hero.
See `DESIGN.md` for the creative direction.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out (deploy anywhere)
npm run images     # rebuild AVIF/WebP derivatives from ./source-images
```

**Stack:** Next.js 15 (static export), TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText), Lenis and three.js. three.js is code-split and fetched only after the page has loaded and the browser is idle; the entrance is pure CSS, so the hero is readable before any JavaScript runs.

```
src/app        routes: /, /work/[slug]/, /credits/, sitemap, robots, 404
src/sections   page sections
src/components shared UI and motion primitives
src/lib        scene.ts (WebGL light study), gsap setup, images, intro choreography
src/data       all content (site.ts) and the generated image manifest
scripts        image optimisation
```

Content is sample content. The domain, address, phone and people are invented. The photographs are CC0 (StockSnap, WordPress Photo Directory) or used under the Unsplash License. Credits are listed at `/credits/`.
