"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { nav, site } from "@/data/site";
import { getLenis } from "@/components/SmoothScroll";
import { PREVIEW } from "@/lib/paths";

export function Footer() {
  const mark = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = mark.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("span"),
        { yPercent: 100 },
        {
          yPercent: 0,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 2 });
    else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
  };

  return (
    <footer className="frame overflow-hidden border-t border-line pt-16 md:pt-20">
      <div className="grid-12 gap-y-10 t-small">
        <div className="col-span-2 md:col-span-3">
          <p className="text-muted">Studio</p>
          <address className="mt-3 not-italic leading-relaxed">
            {site.address.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
        </div>
        <div className="col-span-2 md:col-span-3">
          <p className="text-muted">Contact</p>
          <a href={`mailto:${site.email}`} className="link-line mt-3 inline-block">
            {site.email}
          </a>
          <a href={site.phoneHref} className="link-line mt-1 block w-fit">
            {site.phone}
          </a>
        </div>
        <nav aria-label="Footer" className="col-span-2 md:col-span-3">
          <p className="text-muted">Index</p>
          <ul className="mt-3 space-y-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-line">
                  {n.label}
                </Link>
              </li>
            ))}
            {!PREVIEW && (
              <li>
                <Link href="/credits/" className="link-line">
                  Image credits
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="col-span-2 flex flex-col items-start justify-between md:col-span-3 md:items-end">
          <button type="button" onClick={toTop} className="link-line">
            Back to top
          </button>
          <p className="mt-6 text-muted md:mt-0">&copy; 2026 {site.legalName}</p>
        </div>
      </div>

      <p
        ref={mark}
        aria-hidden="true"
        className="mt-16 select-none overflow-hidden whitespace-nowrap pb-[0.04em] font-display text-[25.5vw] leading-[0.9] tracking-[-0.045em] md:mt-24"
      >
        {"Ardesia".split("").map((l, i) => (
          <span key={i} className="inline-block">
            {l}
          </span>
        ))}
      </p>
    </footer>
  );
}
