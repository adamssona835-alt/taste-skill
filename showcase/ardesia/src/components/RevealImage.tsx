"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  /** Vertical drift of the photograph inside its frame, in percent. 0 disables parallax. */
  parallax?: number;
  /** Which edge the mask opens from. */
  from?: "bottom" | "top" | "left" | "right";
  delay?: number;
};

const INSET: Record<NonNullable<Props["from"]>, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * A frame that opens like a shutter while the photograph inside settles from
 * a slight zoom. Optional parallax keeps the image moving inside the crop.
 */
export function RevealImage({ children, className = "", parallax = 0, from = "bottom", delay = 0 }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const f = frame.current;
    const i = inner.current;
    if (!f || !i || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.set(f, { clipPath: INSET[from] });
      gsap.set(i, { scale: 1.18 });
      ScrollTrigger.create({
        trigger: f,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(f, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, delay, ease: "expo.inOut" });
          gsap.to(i, { scale: 1, duration: 2.2, delay, ease: "expo.out" });
        },
      });
      if (parallax) {
        const shift = () => (f.offsetHeight * parallax) / 100;
        gsap.fromTo(
          i.firstElementChild,
          { y: () => -shift() },
          {
            y: () => shift(),
            ease: "none",
            scrollTrigger: { trigger: f, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          },
        );
      }
    });
    return () => ctx.revert();
  }, [from, parallax, delay]);

  return (
    <div ref={frame} className={`relative overflow-hidden ${className}`}>
      <div ref={inner} className="relative h-full w-full will-change-transform">
        <div
          className={parallax ? "absolute inset-x-0" : "h-full w-full"}
          style={parallax ? { top: `-${parallax}%`, height: `${100 + parallax * 2}%` } : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
