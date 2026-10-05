import type { MetadataRoute } from "next";
import { allProjects, site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-10-01");
  return [
    { url: `${site.url}/`, lastModified: now, priority: 1 },
    ...allProjects.map((p) => ({ url: `${site.url}/work/${p.slug}/`, lastModified: now, priority: 0.8 })),
    { url: `${site.url}/credits/`, lastModified: now, priority: 0.2 },
  ];
}
