"use client";

import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { onReveal } from "@/lib/intro";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** "scroll" reveals on entering the viewport; "intro" waits for the entrance curtain. */
  trigger?: "scroll" | "intro";
  delay?: number;
  stagger?: number;
};

/**
 * Lines rise out of a mask. Splits by rendered line, and re-splits on resize
 * so wrapping is always the real wrapping, never a guess.
 */
export function RevealText({ as = "div", children, className, id, trigger = "scroll", delay = 0, stagger = 0.09 }: Props) {
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
    let off = () => {};

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
          if (trigger === "intro") {
            off = onReveal(() => play());
          } else {
            st?.kill();
            st = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => play() });
          }
        },
      });
    });

    return () => {
      off();
      st?.kill();
      split?.revert();
    };
  }, [trigger, delay, stagger]);

  return createElement(as, { ref, className, id, "data-reveal": "" }, children);
}
