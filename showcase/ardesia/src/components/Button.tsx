import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Magnetic } from "./Magnetic";

type Props = {
  href: string;
  children: string;
  tone?: "ink" | "light";
  className?: string;
};

/**
 * The one button on the site. Square, solid, label rolls on hover while a
 * terracotta fill rises from the bottom edge.
 */
export function Button({ href, children, tone = "ink", className = "" }: Props) {
  const base =
    tone === "ink"
      ? "bg-ink text-bg"
      : "bg-night-ink text-night";
  const external = href.startsWith("mailto:") || href.startsWith("tel:");
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      <span className="roll relative">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        weight="light"
        className="relative size-[1.1em] transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </>
  );
  const cls = `group relative inline-flex h-14 items-center gap-6 overflow-hidden whitespace-nowrap px-7 text-[0.9375rem] font-medium tracking-[0.01em] transition-colors duration-500 group-hover:text-[#f4f2ee] hover:text-[#f4f2ee] focus-visible:text-[#f4f2ee] ${base} ${className}`;
  return (
    <Magnetic>
      {external ? (
        <a href={href} className={cls}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {inner}
        </Link>
      )}
    </Magnetic>
  );
}
