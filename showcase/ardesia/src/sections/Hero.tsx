"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/data/site";
import { HeroCanvas } from "@/components/HeroCanvas";
import { Button } from "@/components/Button";
import { section } from "@/lib/paths";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const c = content.current;
    if (!el || !c) return;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      {
        // The copy leaves before the room does.
        gsap.to(c, {
          yPercent: -18,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "60% top", scrub: true },
        });
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={root}
      aria-labelledby="hero-title"
      className="relative min-h-[100dvh] overflow-hidden bg-night text-night-ink"
    >
      <HeroCanvas />
      {/* Legibility scrim behind the type only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(to_top,rgb(10_11_12/0.82),rgb(10_11_12/0.35)_45%,transparent)]"
      />

      <div ref={content} className="frame relative flex min-h-[100dvh] flex-col justify-end pb-[clamp(2.5rem,7vh,5.5rem)] pt-28">
        <div className="grid-12 items-end gap-y-10">
          <h1 id="hero-title" className="t-hero col-span-4 md:col-span-9 lg:col-span-8">
            <span className="hero-line block overflow-hidden pb-[0.06em]">
              <span className="block" style={{ "--i": 0 } as CSSProperties}>
                Built from stone
              </span>
            </span>
            <span className="hero-line -mt-[0.06em] block overflow-hidden pb-[0.12em]">
              <span className="block" style={{ "--i": 1 } as CSSProperties}>
                and <em className="it">light.</em>
              </span>
            </span>
          </h1>

          <div className="col-span-4 md:col-span-3 md:col-start-10 lg:col-span-4 lg:col-start-9 xl:col-span-3 xl:col-start-10">
            <p className="hero-fade t-lead max-w-[30ch] text-night-ink/80" style={{ "--d": "1.3s" } as CSSProperties}>
              Ardesia is an architecture and interiors studio in Genoa, designing houses and retreats around material,
              climate and the sun.
            </p>
            <div className="hero-fade mt-8" style={{ "--d": "1.45s" } as CSSProperties}>
              <Button href={section("contact")} tone="light">
                {site.cta}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
