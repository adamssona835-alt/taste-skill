"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { nav, site } from "@/data/site";
import { getLenis } from "./SmoothScroll";
import { homeHref, section } from "@/lib/paths";

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const [solid, setSolid] = useState(false);

  // Over the hero: transparent and light. After it: solid, and it steps aside on the way down.
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const hero = document.getElementById("hero");
    const reduce = prefersReducedMotion();
    const triggers: ScrollTrigger[] = [];

    let io: IntersectionObserver | undefined;
    if (hero) {
      // The hero counts as "under the nav" until its bottom edge passes the bar.
      io = new IntersectionObserver(
        ([entry]) => {
          setOnDark(entry.isIntersecting);
          setSolid(!entry.isIntersecting);
        },
        { rootMargin: "-72px 0px 0px 0px" },
      );
      io.observe(hero);
    } else {
      setOnDark(false);
      setSolid(true);
    }

    if (!reduce) {
      triggers.push(
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const past = self.scroll() > window.innerHeight * 0.9;
            const hide = past && self.direction === 1;
            gsap.to(el, { yPercent: hide ? -100 : 0, duration: 0.7, ease: "expo.out", overwrite: "auto" });
          },
        }),
      );
    }

    return () => {
      triggers.forEach((t) => t.kill());
      io?.disconnect();
    };
  }, []);

  // Mobile menu: lock scroll, choreograph links, trap Escape, restore focus.
  useEffect(() => {
    const m = menu.current;
    if (!m) return;
    const items = m.querySelectorAll("[data-menu-item]");
    if (open) {
      getLenis()?.stop();
      document.documentElement.style.overflow = "hidden";
      gsap.set(m, { display: "flex" });
      gsap.fromTo(m, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "power4.inOut" });
      gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 1, delay: 0.35, stagger: 0.06, ease: "expo.out" });
      (m.querySelector("a") as HTMLAnchorElement | null)?.focus({ preventScroll: true });
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    if (m.style.display === "flex") {
      gsap.to(m, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.7,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(m, { display: "none" });
        },
      });
      document.documentElement.style.overflow = "";
      getLenis()?.start();
      toggle.current?.focus({ preventScroll: true });
    }
  }, [open]);

  const tone = onDark && !open ? "text-night-ink" : open ? "text-night-ink" : "text-ink";

  return (
    <>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 ${tone} transition-colors duration-700`}
        style={{ zIndex: open ? 55 : "var(--z-nav)" }}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-0 origin-top border-b border-line bg-bg transition-transform duration-700 ease-[var(--ease-out)] ${
            solid && !open ? "scale-y-100" : "scale-y-0"
          }`}
        />
        <nav aria-label="Primary" className="frame relative flex h-16 items-center justify-between md:h-[72px]">
          <Link
            href={homeHref}
            data-nav-item
            className="font-display text-[1.65rem] leading-none tracking-[-0.02em]"
            aria-label="Ardesia, home"
          >
            Ardesia
          </Link>

          <ul className="hidden items-center gap-10 text-[0.9375rem] md:flex">
            {nav.map((item) => (
              <li key={item.href} data-nav-item>
                <Link href={item.href} className="link-line">
                  {item.label}
                </Link>
              </li>
            ))}
            <li data-nav-item>
              <Link
                href={section("contact")}
                className={`group inline-flex h-10 items-center border px-5 transition-colors duration-500 ${
                  onDark ? "border-night-ink/40 hover:border-night-ink" : "border-ink/30 hover:border-ink"
                }`}
              >
                <span className="roll">
                  <span>{site.cta}</span>
                  <span aria-hidden="true">{site.cta}</span>
                </span>
              </Link>
            </li>
          </ul>

          <button
            ref={toggle}
            type="button"
            data-nav-item
            className="relative -mr-2 px-2 py-3 text-[0.9375rem] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        className="fixed inset-0 hidden flex-col justify-between bg-night px-5 pb-8 pt-28 text-night-ink md:hidden"
        style={{ zIndex: "var(--z-menu)" }}
        aria-hidden={!open}
        inert={!open}
      >
        <ul className="flex flex-col gap-3">
          {[...nav, { label: site.cta, href: section("contact") }].map((item) => (
            <li key={item.href + item.label} className="overflow-hidden pb-1">
              <Link
                href={item.href}
                data-menu-item
                onClick={() => setOpen(false)}
                className="block font-display text-[2.75rem] leading-[1.1] tracking-[-0.02em]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="t-small text-night-muted">
          <a href={`mailto:${site.email}`} className="block text-night-ink">
            {site.email}
          </a>
          <a href={site.phoneHref} className="mt-1 block">
            {site.phone}
          </a>
        </div>
      </div>
    </>
  );
}
