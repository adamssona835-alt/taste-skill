"use client";

import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  stagger?: number;
};

/**
 * Lines rise out of a mask. Splits by rendered line, and re-splits on resize
 * so wrapping is always the real wrapping, never a guess.
 */
export function RevealText({ as = "div", children, className, id, delay = 0, stagger = 0.09 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.visibility = "visible";
      return;
    }

    let split: SplitText | null = null;
    let st: ScrollTrigger | undefined;
    let played = false;

    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "reveal-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: "visible" });
          if (played) return;
          gsap.set(self.lines, { yPercent: 105 });
          const play = () => {
            played = true;
            return gsap.to(self.lines, {
              yPercent: 0,
              duration: 1.35,
              stagger,
              delay,
              ease: "expo.out",
            });
          };
          st?.kill();
          st = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => play() });
        },
      });
    });

    return () => {
      st?.kill();
      split?.revert();
    };
  }, [delay, stagger]);

  return createElement(as, { ref, className, id, "data-reveal": "" }, children);
}
