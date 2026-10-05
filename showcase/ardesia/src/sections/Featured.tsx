"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { featured } from "@/data/site";
import { Picture } from "@/components/Picture";
import { RevealText } from "@/components/RevealText";
import { RevealImage } from "@/components/RevealImage";
import { ProjectMeta } from "@/components/ProjectMeta";
import { caseHref } from "@/lib/paths";

/**
 * One project, given the whole width. The photograph grows from a framed
 * print to full bleed as it reaches the top of the screen.
 */
export function Featured() {
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const f = frame.current;
    const i = img.current;
    if (!f || !i || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add({ desk: "(min-width: 768px)", mob: "(max-width: 767px)" }, (c) => {
        const inset = c.conditions?.desk ? "inset(9% 11% 9% 11%)" : "inset(6% 5% 6% 5%)";
        gsap.fromTo(
          f,
          { clipPath: inset },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: f, start: "top 90%", end: "top top", scrub: true },
          },
        );
        gsap.fromTo(
          i,
          { scale: 1.22 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: f, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    }, f);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" aria-labelledby="featured-title" className="pb-[clamp(6rem,12vw,12rem)]">
      <div className="frame mb-10 flex items-baseline justify-between md:mb-14">
        <p className="t-meta text-muted">Selected work</p>
        <p className="t-small text-muted">
          {featured.location}, {featured.year}
        </p>
      </div>

      <div ref={frame} className="relative h-[78svh] overflow-hidden md:h-[100svh]">
        <div ref={img} className="h-full w-full will-change-transform">
          <Picture
            name={featured.image}
            alt={featured.imageAlt}
            sizes="100vw"
            position="50% 60%"
            className="block h-full w-full"
          />
        </div>
      </div>

      <div className="frame mt-14 md:mt-20">
        <div className="grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-7">
            <RevealText as="h2" id="featured-title" className="t-hero">
              {featured.name}
            </RevealText>
            <p className="t-lead mt-8 max-w-[46ch] text-ink-2">{featured.summary}</p>
            <Link href={caseHref(featured.slug)} className="link-line link-line--on mt-10 inline-block">
              Read the case study
            </Link>
          </div>

          <div className="col-span-4 md:col-span-4 md:col-start-9">
            <RevealImage parallax={6} from="top" className="aspect-[4/5]">
              <Picture name={featured.detail} alt={featured.detailAlt} sizes="(min-width: 768px) 30vw, 100vw" className="block h-full w-full" />
            </RevealImage>
            <ProjectMeta project={featured} className="mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
