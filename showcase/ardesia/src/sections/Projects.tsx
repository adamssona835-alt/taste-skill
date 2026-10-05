"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { projects } from "@/data/site";
import { Picture } from "@/components/Picture";
import { caseHref } from "@/lib/paths";

// Each entry has its own proportion and height on the line, like plates in a monograph.
const layout = [
  { w: "lg:motion-safe:w-[34vw]", aspect: "aspect-[4/3]", offset: "lg:motion-safe:mt-0", pos: "50% 55%" },
  { w: "lg:motion-safe:w-[21vw]", aspect: "aspect-[3/4]", offset: "lg:motion-safe:mt-[9vh]", pos: "50% 50%" },
  { w: "lg:motion-safe:w-[27vw]", aspect: "aspect-[1/1]", offset: "lg:motion-safe:mt-[3vh]", pos: "50% 50%" },
  { w: "lg:motion-safe:w-[33vw]", aspect: "aspect-[3/2]", offset: "lg:motion-safe:mt-[12vh]", pos: "50% 60%" },
];

/**
 * Desktop: the section pins and the reader travels sideways through the work.
 * Touch and reduced motion: a plain vertical sequence.
 */
export function Projects() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const t = track.current;
    if (!w || !t) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => t.scrollWidth - window.innerWidth;
      const tween = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: w,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: w, start: "top top", end: () => `+=${distance()}`, scrub: true } },
      );
      // Photographs drift a little against the travel for depth.
      t.querySelectorAll<HTMLElement>("[data-drift]").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={wrap} aria-labelledby="projects-title" className="relative overflow-hidden lg:motion-safe:h-[100dvh]">
      <div
        ref={track}
        className="frame flex flex-col gap-y-24 pb-[clamp(6rem,12vw,10rem)] lg:motion-safe:h-full lg:motion-safe:w-max lg:motion-safe:flex-row lg:motion-safe:items-start lg:motion-safe:gap-x-[6vw] lg:motion-safe:pb-0 lg:motion-safe:pr-[10vw] lg:motion-safe:pt-[15vh]"
      >
        <header className="lg:motion-safe:w-[24vw] lg:motion-safe:shrink-0 lg:motion-safe:pt-[4vh]">
          <h2 id="projects-title" className="t-h2">
            Four more, from the coast <em className="it">to the mountains.</em>
          </h2>
          <p className="mt-8 max-w-[34ch] text-ink-2">
            Recent houses, restorations and interiors. Each one began with a site visit and a single question about light.
          </p>
        </header>

        {projects.map((p, i) => {
          const l = layout[i % layout.length];
          return (
            <article
              key={p.slug}
              className={`w-full shrink-0 ${l.w} ${l.offset} ${i % 2 ? "md:ml-[30%] md:w-[70%] lg:motion-safe:ml-0" : "md:w-[80%]"}`}
            >
              <Link href={caseHref(p.slug)} className="img-hover group block" aria-label={`${p.name}, read the case study`}>
                <div className={`relative overflow-hidden ${l.aspect}`}>
                  <div data-drift className="absolute inset-y-0 -left-[8%] w-[116%]">
                    <Picture
                      name={p.image}
                      alt={p.imageAlt}
                      sizes="(min-width: 1024px) 34vw, (min-width: 768px) 80vw, 100vw"
                      position={l.pos}
                      className="block h-full w-full"
                    />
                  </div>
                </div>
              </Link>
              <div className="mt-6 flex items-baseline justify-between gap-6">
                <h3 className="t-h3">
                  <Link href={caseHref(p.slug)} className="link-line">
                    {p.name}
                  </Link>
                </h3>
                <span className="t-small shrink-0 text-muted">{p.year}</span>
              </div>
              <p className="t-small mt-2 text-muted">
                {p.category}, {p.location}
              </p>
              <p className="mt-4 max-w-[40ch] text-ink-2">{p.summary}</p>
              <p className="t-small mt-4 text-muted">{p.services.join(", ")}</p>
            </article>
          );
        })}
      </div>

      <span
        ref={bar}
        aria-hidden="true"
        className="absolute bottom-10 left-[var(--margin)] right-[var(--margin)] hidden h-px origin-left bg-ink/60 lg:motion-safe:block"
      />
    </section>
  );
}
