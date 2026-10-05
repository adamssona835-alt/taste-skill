import type { Metadata } from "next";
import { images } from "@/lib/images";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Image credits",
  description: "Photography credits and licences for the Ardesia website.",
  alternates: { canonical: "/credits/" },
};

export default function Credits() {
  const rows = Object.entries(images).sort(([a], [b]) => a.localeCompare(b));
  return (
    <>
      <main id="main" className="frame pb-32 pt-36 md:pt-44">
        <h1 className="t-h2 max-w-[16ch]">Image credits</h1>
        <p className="t-lead mt-8 max-w-[56ch] text-ink-2">
          Ardesia is a fictional studio created as a design study. The projects, people and figures on this site are
          invented. The photographs are real, used under the licences below, and are not pictures of the projects they
          illustrate.
        </p>
        <ul className="mt-16 grid gap-x-[var(--gutter)] gap-y-8 border-t border-line pt-10 t-small md:grid-cols-3">
          {rows.map(([name, m]) => (
            <li key={name}>
              <p className="text-ink">{name.replace(/-/g, " ")}</p>
              <p className="mt-1 text-muted">
                {m.credit.creator ? `${m.credit.creator}, ` : ""}
                <a href={m.credit.url} className="link-line" rel="noopener">
                  {m.credit.source}
                </a>
                , {m.credit.license}
              </p>
            </li>
          ))}
        </ul>
        <p className="t-small mt-16 max-w-[60ch] text-muted">
          The opening scene is rendered live in the browser with three.js. Typefaces: Bodoni Moda and Hanken Grotesk, both
          under the SIL Open Font License.
        </p>
      </main>
      <Footer />
    </>
  );
}
