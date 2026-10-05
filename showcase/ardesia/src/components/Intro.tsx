import type { CSSProperties } from "react";

/**
 * Entrance curtain. Animated entirely in CSS (see globals.css) so it starts on
 * first paint and lifts on time, whatever the network is doing. Hidden for
 * no-JS visitors and under reduced motion.
 */
export function Intro() {
  return (
    <div
      aria-hidden="true"
      className="intro-curtain pointer-events-none fixed inset-0 flex-col items-center justify-center bg-night text-night-ink"
      style={{ zIndex: "var(--z-intro)" }}
    >
      <div className="overflow-hidden pb-[0.12em]">
        <p className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-[-0.02em]">
          {"Ardesia".split("").map((l, i) => (
            <span key={i} data-letter className="inline-block" style={{ "--i": i } as CSSProperties}>
              {l}
            </span>
          ))}
        </p>
      </div>
      <span data-rule className="mt-6 block h-px w-24 origin-left bg-night-ink/50" />
    </div>
  );
}
