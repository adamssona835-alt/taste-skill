"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

let instance: Lenis | null = null;
export const getLenis = () => instance;

/** Lenis drives the scroll; GSAP's ticker drives Lenis so both share one frame. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      anchors: { offset: 0 },
    });
    instance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      instance = null;
    };
  }, []);
  return null;
}
