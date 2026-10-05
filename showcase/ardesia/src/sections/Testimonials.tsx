"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { testimonials } from "@/data/site";

/**
 * One voice at a time. Tabs are named after the projects, so the reader
 * chooses a house rather than paging through quotes.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const quote = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = quote.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(el.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08, ease: "expo.out" });
  }, [index]);

  const onKey = (e: KeyboardEvent) => {
    const n = testimonials.length;
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % n;
    else if (e.key === "ArrowLeft") next = (index - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setIndex(next);
    tabs.current[next]?.focus();
  };

  const t = testimonials[index];

  return (
    <section aria-labelledby="testimonials-title" className="bg-bg-2 py-[clamp(6rem,12vw,11rem)]">
      <div className="frame">
        <h2 id="testimonials-title" className="sr-only">
          What clients say
        </h2>

        <div
          role="tablist"
          aria-label="Testimonials by project"
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 t-small"
          onKeyDown={onKey}
        >
          {testimonials.map((item, i) => (
            <button
              key={item.project}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`tab-${i}`}
              type="button"
              aria-selected={index === i}
              aria-controls="testimonial-panel"
              tabIndex={index === i ? 0 : -1}
              onClick={() => setIndex(i)}
              className={`link-line transition-colors duration-500 ${index === i ? "link-line--on text-ink" : "text-muted hover:text-ink"}`}
            >
              {item.project}
            </button>
          ))}
        </div>

        <div
          ref={quote}
          id="testimonial-panel"
          role="tabpanel"
          aria-labelledby={`tab-${index}`}
          className="mx-auto mt-14 flex min-h-[15rem] max-w-[56rem] flex-col items-center text-center md:mt-20"
        >
          <blockquote className="t-statement !text-[clamp(1.6rem,2.9vw,2.9rem)]">
            <p>&ldquo;{t.quote}&rdquo;</p>
          </blockquote>
          <p className="mt-10">
            <span className="block">{t.name}</span>
            <span className="t-small text-muted">{t.role}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
