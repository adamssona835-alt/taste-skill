"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onReveal } from "@/lib/intro";
import { site } from "@/data/site";
import { HeroCanvas } from "@/components/HeroCanvas";
import { RevealText } from "@/components/RevealText";
import { Button } from "@/components/Button";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const c = content.current;
    if (!el || !c) return;
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const fades = c.querySelectorAll("[data-intro]");
      onReveal(() => {
        gsap.fromTo(
          fades,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: reduce ? 0 : 1.6, delay: reduce ? 0 : 1.35, stagger: reduce ? 0 : 0.12, ease: "expo.out" },
        );
      });
      if (!reduce) {
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
          <RevealText
            as="h1"
            id="hero-title"
            trigger="intro"
            delay={0.95}
            stagger={0.12}
            className="t-hero col-span-4 md:col-span-9 lg:col-span-8"
          >
            Built from stone <br className="hidden md:block" />
            and <em className="it">light.</em>
          </RevealText>

          <div className="col-span-4 md:col-span-3 md:col-start-10 lg:col-span-4 lg:col-start-9 xl:col-span-3 xl:col-start-10">
            <p data-intro className="t-lead max-w-[30ch] text-night-ink/80">
              Ardesia is an architecture and interiors studio in Genoa, designing houses and retreats around material,
              climate and the sun.
            </p>
            <div data-intro className="mt-8">
              <Button href="/#contact" tone="light">
                {site.cta}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
