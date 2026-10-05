"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { emitReveal, onSceneReady } from "@/lib/intro";
import { getLenis } from "./SmoothScroll";

/**
 * Entrance curtain. Holds for the wordmark, waits briefly for the 3D scene,
 * then lifts. Never blocks for more than ~2.4s, and never renders without JS.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) {
      emitReveal();
      return;
    }
    getLenis()?.stop();
    window.scrollTo(0, 0);

    let lifted = false;
    const letters = el.querySelectorAll("[data-letter]");
    const rule = el.querySelector("[data-rule]");

    const tl = gsap.timeline();
    tl.fromTo(letters, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.045, ease: "expo.out" })
      .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0.1);

    const lift = () => {
      if (lifted) return;
      lifted = true;
      const minHold = Math.max(0, 1.15 - tl.time());
      gsap.delayedCall(minHold, () => {
        emitReveal();
        gsap
          .timeline({
            onComplete: () => {
              el.style.display = "none";
              getLenis()?.start();
            },
          })
          .to(letters, { yPercent: -110, duration: 0.8, stagger: 0.025, ease: "power3.in" })
          .to(rule, { scaleX: 0, transformOrigin: "right", duration: 0.7, ease: "power3.in" }, 0)
          .to(el, { yPercent: -100, duration: 1.25, ease: "power4.inOut" }, 0.35);
      });
    };

    const off = onSceneReady(lift);
    const fallback = window.setTimeout(lift, 2400);
    return () => {
      off();
      window.clearTimeout(fallback);
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="intro-curtain fixed inset-0 flex-col items-center justify-center bg-night text-night-ink"
      style={{ zIndex: "var(--z-intro)" }}
    >
      <div className="overflow-hidden pb-[0.12em]">
        <p className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-[-0.02em]">
          {"Ardesia".split("").map((l, i) => (
            <span key={i} data-letter className="inline-block will-change-transform">
              {l}
            </span>
          ))}
        </p>
      </div>
      <span data-rule className="mt-6 block h-px w-24 origin-left bg-night-ink/50" />
    </div>
  );
}
