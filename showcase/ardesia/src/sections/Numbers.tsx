"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { stats } from "@/data/site";
import { RevealText } from "@/components/RevealText";

// Asymmetric placement on the 12-column grid: no two figures share a column line.
const place = [
  "md:col-span-4 md:col-start-1",
  "md:col-span-4 md:col-start-6 md:mt-[10vw]",
  "md:col-span-4 md:col-start-2 md:-mt-[2vw]",
  "md:col-span-4 md:col-start-8 md:mt-[4vw]",
];

export function Numbers() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
        const target = Number(n.dataset.count);
        const obj = { v: 0 };
        n.textContent = "0";
        ScrollTrigger.create({
          trigger: n,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              v: target,
              duration: 2.2,
              ease: "expo.out",
              onUpdate: () => {
                n.textContent = String(Math.round(obj.v));
              },
            }),
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="numbers-title" className="frame border-t border-line py-[clamp(6rem,12vw,12rem)]">
      <div className="grid-12 gap-y-16">
        <RevealText as="h2" id="numbers-title" className="t-h3 col-span-4 max-w-[18ch] md:col-span-4 md:col-start-9 md:row-start-1">
          Seventeen years, one room in Genoa.
        </RevealText>
        {stats.map((s, i) => (
          <div key={s.label} className={`col-span-4 ${place[i]} ${i === 0 ? "md:row-start-1" : ""}`}>
            <p className="font-display text-[clamp(5rem,11vw,11rem)] leading-[0.9] tracking-[-0.04em] tabular-nums">
              <span data-count={s.value}>{s.value}</span>
              {s.suffix}
            </p>
            <p className="mt-5 max-w-[30ch] text-ink-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
