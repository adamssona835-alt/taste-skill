// Renderar scene.html till PNG-bildrutor (ersätter Kling-steget lokalt).
// Användning: node render-frames.mjs [antal=150] [utmapp=./out/png]
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const here = dirname(fileURLToPath(import.meta.url));
const count = Number(process.argv[2] || 150);
const outDir = resolve(process.argv[3] || resolve(here, 'out/png'));
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(pathToFileURL(resolve(here, 'scene.html')).href);
const canvas = page.locator('#c');

for (let i = 0; i < count; i++) {
  const t = i / (count - 1);
  await page.evaluate(t => window.renderFrame(t), t);
  await canvas.screenshot({ path: `${outDir}/f_${String(i + 1).padStart(4, '0')}.png` });
  if (i % 25 === 0) console.log(`frame ${i + 1}/${count}`);
}
await browser.close();
console.log(`klart: ${count} bildrutor i ${outDir}`);
