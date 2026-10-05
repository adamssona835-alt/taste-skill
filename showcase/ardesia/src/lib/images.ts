import data from "@/data/images.generated.json";

export type ImageName = keyof typeof data;
export type ImageMeta = {
  width: number;
  height: number;
  widths: number[];
  blur: string;
  credit: { creator: string | null; source: string; license: string; url: string };
};

export const images = data as Record<string, ImageMeta>;

export function srcSet(name: string, format: "avif" | "webp") {
  const meta = images[name];
  if (!meta) throw new Error(`Unknown image: ${name}`);
  return meta.widths.map((w) => `/images/${name}-${w}.${format} ${w}w`).join(", ");
}

export function fallbackSrc(name: string) {
  const meta = images[name];
  const w = meta.widths.find((x) => x >= 1440) ?? meta.widths.at(-1);
  return `/images/${name}-${w}.webp`;
}
