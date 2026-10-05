import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allProjects } from "@/data/site";
import { Picture } from "@/components/Picture";
import { RevealImage } from "@/components/RevealImage";
import { RevealText } from "@/components/RevealText";
import { ProjectMeta } from "@/components/ProjectMeta";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = allProjects.find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.name}, ${p.location}`;
  return {
    title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}/` },
    openGraph: {
      type: "article",
      title: `${title} | Ardesia`,
      description: p.summary,
      url: `/work/${p.slug}/`,
      images: [{ url: `/images/${p.image}-1440.webp`, alt: p.imageAlt }],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const i = allProjects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = allProjects[i];
  const next = allProjects[(i + 1) % allProjects.length];

  return (
    <>
      <main id="main">
        <article>
          <header className="frame pb-14 pt-36 md:pb-20 md:pt-44">
            <nav aria-label="Breadcrumb" className="t-small text-muted">
              <Link href="/#work" className="link-line">
                Work
              </Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{p.name}</span>
            </nav>
            <RevealText as="h1" trigger="scroll" className="t-hero mt-8 max-w-[14ch]">
              {p.name}
            </RevealText>
            <div className="grid-12 mt-12 gap-y-10 md:mt-16">
              <p className="t-lead col-span-4 max-w-[46ch] text-ink-2 md:col-span-6">{p.summary}</p>
              <ProjectMeta project={p} className="col-span-4 md:col-span-4 md:col-start-9" />
            </div>
          </header>

          <RevealImage parallax={6} className="h-[70svh] md:h-[92svh]">
            <Picture name={p.image} alt={p.imageAlt} sizes="100vw" priority className="block h-full w-full" />
          </RevealImage>

          <div className="frame py-[clamp(6rem,12vw,11rem)]">
            <div className="grid-12 gap-y-16">
              <div className="col-span-4 md:col-span-5 md:col-start-2">
                {p.body.map((para, k) => (
                  <p key={k} className={`t-lead text-ink-2 ${k ? "mt-6" : ""}`}>
                    {para}
                  </p>
                ))}
              </div>
              <div className="col-span-3 col-start-2 md:col-span-4 md:col-start-9 md:mt-[12vw]">
                <RevealImage parallax={8} from="right" className="aspect-[4/5]">
                  <Picture name={p.detail} alt={p.detailAlt} sizes="(min-width: 768px) 30vw, 75vw" className="block h-full w-full" />
                </RevealImage>
              </div>
            </div>
          </div>
        </article>

        <nav aria-label="Next project" className="frame border-t border-line py-16 md:py-24">
          <Link href={`/work/${next.slug}/`} className="img-hover group grid-12 items-center gap-y-8">
            <span className="col-span-4 md:col-span-7">
              <span className="t-small block text-muted">Next project</span>
              <span className="t-h2 mt-4 block transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-3">
                {next.name}
              </span>
            </span>
            <span className="col-span-2 block aspect-[4/3] overflow-hidden md:col-span-3 md:col-start-10">
              <Picture name={next.image} alt="" sizes="25vw" className="block h-full w-full" />
            </span>
          </Link>
        </nav>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
