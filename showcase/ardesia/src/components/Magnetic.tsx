"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, finePointer, prefersReducedMotion } from "@/lib/gsap";

/** Pulls its child a few pixels toward the pointer. Mouse and trackpad only. */
export function Magnetic({ children, strength = 0.28, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || prefersReducedMotion()) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "expo.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "expo.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(gsap.utils.clamp(-10, 10, dx * strength));
      yTo(gsap.utils.clamp(-8, 8, dy * strength));
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
