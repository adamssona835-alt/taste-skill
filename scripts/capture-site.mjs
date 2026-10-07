#!/usr/bin/env node
// Capture a live website for study: scroll video, screenshots at scroll steps
// (desktop + mobile), and a design fingerprint (fonts, colors, libraries).
//
// Usage: node scripts/capture-site.mjs <url> <outDir>
// Needs playwright-core (npm i --no-save playwright-core) and Chromium.

import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const [url, outDir] = process.argv.slice(2);
if (!url || !outDir) {
  console.error('Usage: node scripts/capture-site.mjs <url> <outDir>');
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
const browser = await chromium.launch({
  executablePath,
  proxy,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

const viewports = [
  { name: 'desktop', width: 1440, height: 900, isMobile: false },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
];

const report = { url, capturedAt: new Date().toISOString(), viewports: {} };

for (const vp of viewports) {
  const dir = path.join(outDir, vp.name);
  fs.mkdirSync(dir, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
    deviceScaleFactor: 1,
    recordVideo: { dir, size: { width: vp.width, height: vp.height } },
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  let res = null;
  try {
  res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(4000); // preloaders and intro animations

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.min(14, Math.max(4, Math.ceil(height / vp.height)));
  for (let i = 0; i <= steps; i++) {
    const y = Math.round(((height - vp.height) * i) / steps);
    // smooth-ish wheel scrolling so scroll-driven animations fire like a real visit
    await page.mouse.move(vp.width * 0.6, vp.height * 0.5);
    const current = await page.evaluate(() => window.scrollY);
    const delta = y - current;
    for (let s = 0; s < 8; s++) {
      await page.mouse.wheel(0, delta / 8);
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(900);
    // heavy WebGL under software rendering can stall a frame; keep going with what we have
    await page.screenshot({ path: path.join(dir, `scroll-${String(i).padStart(2, '0')}.png`), timeout: 20000 })
      .catch((e) => errors.push(`screenshot ${i}: ${e.message.split('\n')[0]}`));
  }

  const fingerprint = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        text: el.textContent.trim().slice(0, 80),
        fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, color: cs.color,
        textTransform: cs.textTransform,
      };
    };
    const count = (arr) => Object.entries(arr.reduce((m, v) => ((m[v] = (m[v] || 0) + 1), m), {}))
      .sort((a, b) => b[1] - a[1]).slice(0, 12);
    const els = [...document.querySelectorAll('body *')].slice(0, 4000);
    const bgs = [], fgs = [], fonts = [], radii = [];
    for (const el of els) {
      const cs = getComputedStyle(el);
      if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') bgs.push(cs.backgroundColor);
      if (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
        fgs.push(cs.color);
        fonts.push(`${cs.fontFamily.split(',')[0]} ${cs.fontWeight}`);
      }
      if (cs.borderRadius !== '0px') radii.push(cs.borderRadius);
    }
    return {
      title: document.title,
      body: pick('body'), h1: pick('h1'), h2: pick('h2'), p: pick('p'), a: pick('nav a, header a'), button: pick('button, .button, [class*="btn"]'),
      topBackgrounds: count(bgs), topTextColors: count(fgs), topFonts: count(fonts), topRadii: count(radii),
      loadedFontFaces: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`).slice(0, 20),
      canvases: [...document.querySelectorAll('canvas')].map((c) => ({ w: c.width, h: c.height })),
      libraries: {
        three: !!window.THREE || !!document.querySelector('script[src*="three"]'),
        gsap: !!window.gsap, scrollTrigger: !!window.ScrollTrigger,
        lenis: !!window.lenis || !!document.querySelector('.lenis, html.lenis'),
        locomotive: !!document.querySelector('[data-scroll-container]'),
        framerMotion: !!document.querySelector('[data-projection-id], [style*="--motion"]'),
        webflow: !!document.querySelector('html[data-wf-site]'),
        framer: !!document.querySelector('#__framer-badge-container, [data-framer-name]'),
        nextjs: !!document.getElementById('__next') || !!document.querySelector('script[src*="/_next/"]'),
      },
      scripts: [...document.scripts].map((s) => s.src).filter(Boolean).slice(0, 40),
      sectionCount: document.querySelectorAll('section').length,
      pageHeight: document.documentElement.scrollHeight,
    };
  });

  report.viewports[vp.name] = { status: res?.status() ?? null, steps, errors, fingerprint };
  } catch (e) {
    report.viewports[vp.name] = { status: res?.status() ?? null, errors: [...errors, `capture aborted: ${e.message.split('\n')[0]}`] };
  }
  await context.close().catch(() => {}); // flushes the video
  const video = fs.readdirSync(dir).find((f) => f.endsWith('.webm'));
  if (video) fs.renameSync(path.join(dir, video), path.join(dir, 'scroll.webm'));
}

await browser.close();
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
console.log(`Captured ${url} -> ${outDir}`);
console.log('Make contact sheets with:');
console.log(`  ffmpeg -i ${outDir}/desktop/scroll.webm -vf "fps=1,scale=480:-1,tile=4x4" -frames:v 1 ${outDir}/desktop/sheet.jpg`);
