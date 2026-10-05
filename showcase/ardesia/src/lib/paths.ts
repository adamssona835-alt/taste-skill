// The normal build is a site at a domain root. NEXT_PUBLIC_PREVIEW=1 builds a
// single-page preview with relative paths, for hosts that serve it from a subfolder.
export const PREVIEW = process.env.NEXT_PUBLIC_PREVIEW === "1";
export const ASSET_ROOT = PREVIEW ? "" : "/";
export const homeHref = PREVIEW ? "#main" : "/";
export const section = (id: string) => (PREVIEW ? `#${id}` : `/#${id}`);
export const caseHref = (slug: string) => (PREVIEW ? "#work" : `/work/${slug}/`);
