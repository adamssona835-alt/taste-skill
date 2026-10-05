/*
 * scroll-sequence.js
 * Scroll-scrubbed image sequence ("exploding view", product turntable, build-up).
 * Dependency-free. ~3 KB. Works with plain HTML or inside any framework.
 *
 * Markup:
 *   <section class="seq" data-seq data-frames="121"
 *            data-src="frames/f_{i}.jpg" data-pad="3" data-focus="50% 55%"
 *            data-portrait-zoom="1.3">
 *     <div class="seq-sticky">
 *       <canvas class="seq-canvas" role="img" aria-label="A model house opening into a cutaway"></canvas>
 *       <div class="seq-step" data-range="0.05,0.30">...</div>
 *       <div class="seq-step" data-range="0.38,0.63">...</div>
 *     </div>
 *   </section>
 *   <script src="scroll-sequence.js"></script>   // auto-inits every [data-seq]
 *
 * What it does better than the naive version:
 *  - cover-fits frames on landscape screens (no stretching), with a focal point
 *  - on portrait screens shows the whole subject, zoomed by data-portrait-zoom,
 *    instead of cropping a 16:9 sequence down to a sliver
 *  - renders at device pixel ratio (capped at 2) so it stays sharp
 *  - loads nothing until the section is ~1.5 screens away
 *  - loads coarse-to-fine (every 8th frame, then 4th, 2nd, all) so scrubbing works
 *    almost immediately and sharpens as the rest arrives
 *  - feathers every frame inside its own drawn rectangle, so the studio backdrop
 *    dissolves into the page at any canvas shape (data-feather="0" to disable)
 *  - eases the displayed frame toward the scroll target, so the motion has weight
 *  - runs its loop only while the section is on screen; no scroll listeners
 *  - prefers-reduced-motion: no scrubbing, shows the final frame and all steps in flow
 */
(function () {
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init(section) {
    const canvas = section.querySelector(".seq-canvas");
    const ctx = canvas.getContext("2d");
    const count = parseInt(section.dataset.frames, 10);
    const pad = parseInt(section.dataset.pad || "3", 10);
    const pattern = section.dataset.src;
    const [fx, fy] = (section.dataset.focus || "50% 50%").split(" ").map((v) => parseFloat(v) / 100);
    const portraitZoom = parseFloat(section.dataset.portraitZoom || "1.3");
    const feather = section.dataset.feather !== "0";
    const steps = [...section.querySelectorAll(".seq-step")].map((el) => ({
      el,
      range: el.dataset.range.split(",").map(Number),
    }));
    const url = (i) => pattern.replace("{i}", String(i + 1).padStart(pad, "0"));
    const frames = new Array(count);
    let shown = -1;
    let eased = 0;
    let running = false;
    let raf = 0;

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      shown = -1;
      draw(Math.round(eased));
    }

    function nearestLoaded(i) {
      for (let d = 0; d < count; d++) {
        if (frames[i - d]?.ready) return i - d;
        if (frames[i + d]?.ready) return i + d;
      }
      return -1;
    }

    function draw(target) {
      const i = nearestLoaded(target);
      if (i < 0 || i === shown) return;
      shown = i;
      const img = frames[i].img;
      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const portrait = cw / ch < 0.9 && iw / ih > 1.2;
      const s = portrait ? (cw / iw) * portraitZoom : Math.max(cw / iw, ch / ih);
      const w = iw * s, h = ih * s;
      const x = (cw - w) * fx, y = (ch - h) * fy;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, x, y, w, h);
      if (feather) {
        // Keep an ellipse of the visible part of the frame, fading to transparent.
        const vx = Math.max(0, x), vy = Math.max(0, y);
        const vw = Math.min(cw, x + w) - vx, vh = Math.min(ch, y + h) - vy;
        ctx.save();
        ctx.globalCompositeOperation = "destination-in";
        ctx.translate(vx + vw / 2, vy + vh / 2);
        ctx.scale(vw / 2, vh / 2);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        g.addColorStop(0.55, "rgba(0,0,0,1)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(-1, -1, 2, 2);
        ctx.restore();
      }
    }

    function load(i) {
      if (frames[i]) return Promise.resolve();
      const img = new Image();
      img.decoding = "async";
      frames[i] = { img, ready: false };
      img.src = url(i);
      return img
        .decode()
        .then(() => {
          frames[i].ready = true;
          if (shown < 0 || Math.abs(i - Math.round(eased)) < Math.abs(shown - Math.round(eased))) {
            shown = -1;
            draw(Math.round(eased));
          }
        })
        .catch(() => {});
    }

    async function loadAll() {
      // Coarse-to-fine: the sequence is scrubbable after ~1/8 of the bytes.
      for (const stride of [8, 4, 2, 1]) {
        const batch = [];
        for (let i = 0; i < count; i += stride) batch.push(load(i));
        batch.push(load(count - 1));
        await Promise.all(batch);
      }
    }

    function progress() {
      const r = section.getBoundingClientRect();
      const travel = section.offsetHeight - window.innerHeight;
      return travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
    }

    function tick() {
      const p = progress();
      const target = p * (count - 1);
      eased += (target - eased) * 0.18;
      if (Math.abs(target - eased) < 0.01) eased = target;
      draw(Math.round(eased));
      for (const s of steps) s.el.classList.toggle("is-active", p >= s.range[0] && p <= s.range[1]);
      section.style.setProperty("--seq-progress", p.toFixed(4));
      if (running) raf = requestAnimationFrame(tick);
    }

    if (reduce()) {
      section.classList.add("seq--static");
      load(count - 1).then(() => {
        eased = count - 1;
        size();
      });
      new ResizeObserver(size).observe(canvas);
      return;
    }

    new ResizeObserver(size).observe(canvas);

    // Start loading once the page itself has loaded (hero media first) and the
    // section is within about a screen of the viewport.
    const watch = () => {
      const near = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            near.disconnect();
            loadAll();
          }
        },
        { rootMargin: "100% 0px" },
      );
      near.observe(section);
    };
    if (document.readyState === "complete") watch();
    else window.addEventListener("load", watch, { once: true });

    // Animate only while visible.
    new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(tick);
    }).observe(section);
  }

  function boot() {
    document.querySelectorAll("[data-seq]").forEach(init);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
