"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { Picture } from "@/components/Picture";

function Inline({ name, alt, wide = false, position }: { name: string; alt: string; wide?: boolean; position?: string }) {
  return (
    <span
      data-inline
      className={`relative mx-[0.14em] inline-block h-[0.86em] translate-y-[0.1em] overflow-hidden align-baseline ${
        wide ? "w-[2.4em]" : "w-[1.7em]"
      }`}
    >
      <Picture name={name} alt={alt} sizes="200px" position={position} className="absolute inset-0 block h-full w-full" />
    </span>
  );
}

/**
 * The brand statement reads itself: words brighten as the reader moves
 * through them, and three small photographs sit inside the sentence.
 */
export function Statement() {
  const text = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = text.current;
    if (!el || prefersReducedMotion()) return;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, { type: "words", wordsClass: "will-change-[opacity]" });
      const targets = [...split.words, ...el.querySelectorAll("[data-inline]")].sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );
      gsap.fromTo(
        targets,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 52%", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        el.querySelectorAll("[data-inline] picture"),
        { scale: 1.15 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom 40%", scrub: true } },
      );
    }, el);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section id="studio" aria-labelledby="statement-label" className="frame py-[clamp(7rem,17vw,16rem)]">
      <div className="grid-12 gap-y-8">
        <h2 id="statement-label" className="t-meta col-span-4 text-muted md:col-span-2 md:pt-[0.9em]">
          The studio
        </h2>
        <p ref={text} className="t-statement col-span-4 md:col-span-10 lg:col-span-9">
          We begin every project on the site, at first light,
          <Inline name="slate" alt="Split slate, dark grey and finely layered" position="40% 50%" /> with a notebook and no drawings. We
          look for where the sun enters
          <Inline name="light-slits" alt="Thin blades of light through slits in a dark concrete wall" wide />, what the
          ground is made of, and what a new building should leave alone.
          <Inline name="coast-mist" alt="Low tide on a rocky coast under a soft, misty sky" position="50% 78%" />
        </p>
      </div>
    </section>
  );
}
