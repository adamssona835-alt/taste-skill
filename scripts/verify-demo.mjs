#!/usr/bin/env node
// Serve a demo folder, load it in headless Chromium (WebGL via SwiftShader),
// screenshot it at several scroll positions on desktop and mobile, and fail
// on any page error or console error.
//
// Usage: node scripts/verify-demo.mjs <demoDir> [outDir]
// Needs playwright-core (npm i --no-save playwright-core) and Chromium.

import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [demoDir, outArg] = process.argv.slice(2);
if (!demoDir) {
  console.error('Usage: node scripts/verify-demo.mjs <demoDir> [outDir]');
  process.exit(1);
}
const root = path.resolve(demoDir);
const outDir = path.resolve(outArg || path.join(root, '.verify'));
fs.mkdirSync(outDir, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.bin': 'application/octet-stream', '.glb': 'model/gltf-binary' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const file = fs.existsSync(p) && fs.statSync(p).isDirectory() ? path.join(p, 'index.html') : p;
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.statusCode = 404; return res.end(); }
  res.setHeader('content-type', types[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium',
  proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '<-loopback>,localhost,127.0.0.1' } : undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

const problems = [];
for (const vp of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true }]) {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, reducedMotion });
    const page = await ctx.newPage();
    const tag = `${vp.name}${reducedMotion === 'reduce' ? '-reduced' : ''}`;
    page.on('pageerror', (e) => problems.push(`[${tag}] pageerror: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text() + m.location().url)) problems.push(`[${tag}] console.error: ${m.text()}`); });
    page.on('requestfailed', (r) => { if (!/favicon/.test(r.url())) problems.push(`[${tag}] request failed: ${r.url()}`); });
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(2000);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    const steps = reducedMotion === 'reduce' ? 1 : 5;
    for (let i = 0; i <= steps; i++) {
      const y = Math.round(((h - vp.height) * i) / steps);
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(outDir, `${tag}-${i}.png`) });
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (overflow) problems.push(`[${tag}] horizontal overflow`);
    await ctx.close();
  }
}

await browser.close();
server.close();
console.log(`Screenshots in ${outDir}`);
if (problems.length) {
  console.error(`FAILED with ${problems.length} problem(s):\n` + problems.join('\n'));
  process.exit(1);
}
console.log('OK: no errors, no horizontal overflow, desktop + mobile + reduced motion rendered.');
