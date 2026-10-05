"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lightStudy } from "@/data/site";
import { Picture } from "@/components/Picture";
import { getLenis } from "@/components/SmoothScroll";

/**
 * The one moment the page turns to night. A pinned sequence: the hour changes,
 * the photograph changes with it, the reader controls the pace.
 */
export function LightStudy() {
  const root = useRef<HTMLElement>(null);
  const slab = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const el = root.current;
    const s = slab.current;
    if (!el || !s) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Night arrives as a slab that widens to the edges.
      gsap.fromTo(
        s,
        { clipPath: "inset(0% 5% 0% 5%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true } },
      );
    });

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const frames = gsap.utils.toArray<HTMLElement>("[data-frame]", el);
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      // Each hour holds for most of its third of the scroll; the change happens at the seam.
      frames.forEach((f, i) => {
        if (i === 0) return;
        const at = i - 0.32;
        tl.fromTo(f, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.64, ease: "power2.inOut" }, at);
        tl.fromTo(f.firstElementChild, { scale: 1.18 }, { scale: 1, duration: 0.64 }, at);
        tl.to(frames[i - 1].firstElementChild, { scale: 1.08, yPercent: -4, duration: 0.64 }, at);
      });
      tl.set({}, {}, frames.length);
      stRef.current = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${window.innerHeight * 2.2}`,
        pin: el.querySelector<HTMLElement>("[data-pin]"),
        scrub: 0.8,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate: (self) => setStep(Math.min(frames.length - 1, Math.floor(self.progress * frames.length * 0.999))),
      });
      return () => {
        stRef.current = null;
      };
    });

    return () => mm.revert();
  }, []);

  const goTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const y = st.start + ((st.end - st.start) * (i + 0.5)) / lightStudy.length;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section ref={root} aria-labelledby="light-title" className="relative text-night-ink">
      <div ref={slab} aria-hidden="true" className="absolute inset-0 bg-night" />

      {/* Desktop: pinned. */}
      <div data-pin className="frame relative hidden h-[100dvh] items-center motion-safe:lg:flex">
        <div className="grid-12 w-full items-center">
          <div className="col-span-5">
            <h2 id="light-title" className="t-h2 max-w-[13ch]">
              Every room is drawn at <em className="it">three hours.</em>
            </h2>

            <div className="relative mt-16 h-[9.5rem]" aria-live="polite">
              {lightStudy.map((l, i) => (
                <div
                  key={l.time}
                  className="absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out)]"
                  style={{ opacity: step === i ? 1 : 0, transform: `translateY(${(i - step) * 18}px)` }}
                  aria-hidden={step !== i}
                >
                  <p className="font-display text-[4.5rem] leading-none tracking-[-0.03em] tabular-nums">{l.time}</p>
                  <p className="mt-4 max-w-[38ch] text-night-ink/75">{l.text}</p>
                </div>
              ))}
            </div>

            <ol className="mt-10 flex gap-8 t-small">
              {lightStudy.map((l, i) => (
                <li key={l.title}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className={`link-line transition-colors duration-500 ${step === i ? "link-line--on text-night-ink" : "text-night-muted hover:text-night-ink"}`}
                    aria-current={step === i ? "step" : undefined}
                  >
                    {l.title}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="col-span-6 col-start-7">
            <div className="relative mx-auto aspect-[4/5] h-[78vh] max-w-full overflow-hidden">
              {lightStudy.map((l, i) => (
                <div key={l.time} data-frame className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
                  <div className="h-full w-full will-change-transform">
                    <Picture name={l.image} alt={l.alt} sizes="40vw" className="block h-full w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Touch and reduced motion: a simple sequence. */}
      <div className="frame relative py-[clamp(6rem,14vw,10rem)] motion-safe:lg:hidden">
        <h2 className="t-h2 max-w-[13ch]">
          Every room is drawn at <em className="it">three hours.</em>
        </h2>
        <ol className="mt-16 grid gap-20 md:grid-cols-2 md:gap-x-[var(--gutter)] lg:grid-cols-3">
          {lightStudy.map((l, i) => (
            <li key={l.time} className={i === 1 ? "ml-[18%] md:ml-0 md:mt-24" : i === 2 ? "mr-[12%] md:mr-0" : ""}>
              <div className="aspect-[4/5] overflow-hidden">
                <Picture name={l.image} alt={l.alt} sizes="(min-width: 768px) 45vw, 90vw" className="block h-full w-full" />
              </div>
              <p className="mt-6 font-display text-[3rem] leading-none tracking-[-0.03em] tabular-nums">{l.time}</p>
              <p className="mt-3 max-w-[38ch] text-night-ink/75">{l.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
