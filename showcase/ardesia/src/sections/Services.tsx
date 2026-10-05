"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { gsap, finePointer, prefersReducedMotion } from "@/lib/gsap";
import { services } from "@/data/site";
import { Picture } from "@/components/Picture";
import { RevealText } from "@/components/RevealText";

/**
 * An index, not a grid of cards. On desktop a photograph trails the pointer
 * and changes with the row; on touch each row opens in place.
 */
export function Services() {
  const list = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const l = list.current;
    const f = float.current;
    if (!l || !f || !finePointer()) return;
    const reduce = prefersReducedMotion();
    gsap.set(f, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(f, "x", { duration: reduce ? 0 : 0.9, ease: "expo.out" });
    const yTo = gsap.quickTo(f, "y", { duration: reduce ? 0 : 0.9, ease: "expo.out" });
    const rTo = gsap.quickTo(f, "rotation", { duration: 1.2, ease: "expo.out" });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      const r = l.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
      if (!reduce) rTo(gsap.utils.clamp(-4, 4, (e.clientX - lastX) * 0.35));
      lastX = e.clientX;
    };
    const enter = (e: PointerEvent) => {
      const r = l.getBoundingClientRect();
      gsap.set(f, { x: e.clientX - r.left, y: e.clientY - r.top });
      lastX = e.clientX;
    };
    l.addEventListener("pointerenter", enter);
    l.addEventListener("pointermove", move);
    return () => {
      l.removeEventListener("pointerenter", enter);
      l.removeEventListener("pointermove", move);
    };
  }, []);

  useEffect(() => {
    const f = float.current;
    if (!f) return;
    gsap.to(f, {
      opacity: active === null ? 0 : 1,
      scale: active === null ? 0.92 : 1,
      duration: 0.7,
      ease: "expo.out",
    });
    if (active !== null) {
      const layers = f.querySelectorAll<HTMLElement>("[data-layer]");
      layers.forEach((layer, i) => {
        gsap.to(layer, {
          clipPath: i === active ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
          duration: i === active ? 0.9 : 0.6,
          ease: "expo.out",
          zIndex: i === active ? 2 : 1,
        });
      });
    }
  }, [active]);

  return (
    <section id="services" aria-labelledby="services-title" className="frame py-[clamp(6rem,12vw,12rem)]">
      <div className="grid-12">
        <RevealText as="h2" id="services-title" className="t-h2 col-span-4 md:col-span-8 lg:col-span-7">
          One team, from the ground <em className="it">to the door handle.</em>
        </RevealText>
      </div>

      <div ref={list} className="relative mt-16 md:mt-24" onPointerLeave={() => setActive(null)}>
        {/* Trailing photograph (decorative; each row carries its own text). */}
        <div
          ref={float}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 hidden aspect-[4/5] w-[clamp(220px,19vw,320px)] opacity-0 md:block"
          style={{ zIndex: 3 }}
        >
          {services.map((s) => (
            <div key={s.name} data-layer className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
              <Picture name={s.image} alt="" sizes="320px" className="block h-full w-full" />
            </div>
          ))}
        </div>

        <ul className="border-t border-line">
        {services.map((s, i) => {
          const isOpen = open === i;
          const dim = active !== null && active !== i;
          return (
            <li key={s.name} className="relative border-b border-line">
              {/* Desktop row */}
              <div
                className="hidden cursor-default grid-cols-12 items-baseline gap-x-[var(--gutter)] py-9 transition-opacity duration-700 md:grid"
                style={{ opacity: dim ? 0.3 : 1 }}
                onPointerEnter={() => setActive(i)}
              >
                <h3
                  className="col-span-7 font-display text-[clamp(2.4rem,4.6vw,4.75rem)] leading-[1.05] tracking-[-0.02em] transition-transform duration-700 ease-[var(--ease-out)]"
                  style={{ transform: active === i ? "translateX(1.25rem)" : "none" }}
                >
                  {s.name}
                </h3>
                <p className="col-span-4 col-start-9 max-w-[36ch] text-ink-2">{s.text}</p>
              </div>

              {/* Touch row */}
              <div className="md:hidden">
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-6 text-left font-display text-[2.25rem] leading-[1.1] tracking-[-0.02em]"
                    aria-expanded={isOpen}
                    aria-controls={`service-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {s.name}
                    <Plus
                      aria-hidden="true"
                      weight="light"
                      className="size-6 shrink-0 transition-transform duration-500"
                      style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                    />
                  </button>
                </h3>
                <div
                  id={`service-${i}`}
                  className="grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <div className="grid grid-cols-5 gap-4 pb-8">
                      <p className="col-span-3 text-ink-2">{s.text}</p>
                      <div className="col-span-2 aspect-[4/5] overflow-hidden">
                        <Picture name={s.image} alt={s.alt} sizes="40vw" className="block h-full w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        </ul>
      </div>
    </section>
  );
}
