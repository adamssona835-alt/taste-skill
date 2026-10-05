// Builds responsive AVIF/WebP derivatives from /source-images and writes
// src/data/images.generated.json (dimensions, blur placeholder, credits).
import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sources = JSON.parse(await readFile(path.join(root, "scripts/image-sources.json"), "utf8"));
const outDir = path.join(root, "public/images");
const WIDTHS = [640, 960, 1440, 2048, 2400];
await mkdir(outDir, { recursive: true });

const manifest = {};
for (const src of sources) {
  const input = path.join(root, "source-images", src.file);
  // A single, quiet grade across every photograph so the set reads as one shoot.
  const base = sharp(input).rotate().modulate({ saturation: 0.86 }).gamma(1.04);
  const meta = await sharp(input).rotate().metadata();
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (!widths.includes(meta.width) && meta.width < WIDTHS.at(-1)) widths.push(meta.width);
  for (const w of widths) {
    const r = base.clone().resize({ width: w });
    await r.clone().avif({ quality: 52, effort: 5 }).toFile(path.join(outDir, `${src.name}-${w}.avif`));
    await r.clone().webp({ quality: 74 }).toFile(path.join(outDir, `${src.name}-${w}.webp`));
  }
  const blur = await base.clone().resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  manifest[src.name] = {
    width: meta.width,
    height: meta.height,
    widths: widths.sort((a, b) => a - b),
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
    credit: { creator: src.creator, source: src.source, license: src.license, url: src.url },
  };
  console.log(src.name, meta.width, "x", meta.height, widths.join(","));
}
await writeFile(path.join(root, "src/data/images.generated.json"), JSON.stringify(manifest, null, 1));
