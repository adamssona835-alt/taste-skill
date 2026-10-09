#!/usr/bin/env node
// Serve a demo folder, load it in headless Chromium (WebGL via SwiftShader),
// screenshot it at several scroll positions, and fail on anything a visitor
// would hit: page or console errors, failed requests, horizontal overflow,
// keyboard focus that leaves no visible mark, and phone layouts that silently
// widen the layout viewport (the page then renders zoomed out), and pages that
// scroll past the end of their content, a body background or text that changes when a host page
// (an embed, an artifact viewer) styles <body> itself, and page text that scrolls through
// unbacked fixed chrome (a headline under the logo).
//
// Passes (each one a set of screenshots in outDir):
//   desktop, mobile            normal motion, evenly spaced scroll stops
//   *-reduced                  reduced motion, same stops (not only top and bottom)
//   fallback-*                 WebGL unavailable and CSS.supports() forced false
//   w360, w430                 extra phone widths, overflow checked through the page
//   focus                      Tab through every focusable element on desktop
//
// Usage: node scripts/verify-demo.mjs <demoDir> [outDir] [--stops N]
//   --stops N   scroll stops per pass (default 5; use 30+ for pinned or scrubbed sections)
// Needs playwright-core (npm i --no-save playwright-core) and Chromium.
// If ImageMagick `convert` is on PATH, sheet-<pass>.jpg contact sheets are written too.

import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const stopsAt = args.indexOf('--stops');
const steps = stopsAt >= 0 ? Math.max(1, parseInt(args[stopsAt + 1], 10) || 5) : 5;
const [demoDir, outArg] = args.filter((a, i) => !a.startsWith('--') && (stopsAt < 0 || i !== stopsAt + 1));
if (!demoDir) {
  console.error('Usage: node scripts/verify-demo.mjs <demoDir> [outDir] [--stops N]');
  process.exit(1);
}
const root = path.resolve(demoDir);
const outDir = path.resolve(outArg || path.join(root, '.verify'));
fs.mkdirSync(outDir, { recursive: true });

const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.bin': 'application/octet-stream', '.glb': 'model/gltf-binary', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
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

// Runs before any page script: the effect's feature checks all come back negative.
const forceFallback = () => {
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    return /webgl|webgpu/i.test(type) ? null : getContext.call(this, type, ...rest);
  };
  if (window.CSS) CSS.supports = () => false;
  try { Object.defineProperty(navigator, 'gpu', { get: () => undefined }); } catch {}
};

const desktop = { width: 1440, height: 900 };
const phone = (width) => ({ width, height: 844, isMobile: true, hasTouch: true });
const passes = [
  { tag: 'desktop', vp: desktop, motion: 'no-preference' },
  { tag: 'mobile', vp: phone(390), motion: 'no-preference' },
  { tag: 'desktop-reduced', vp: desktop, motion: 'reduce' },
  { tag: 'mobile-reduced', vp: phone(390), motion: 'reduce' },
  { tag: 'fallback-desktop', vp: desktop, motion: 'no-preference', fallback: true },
  { tag: 'fallback-mobile', vp: phone(390), motion: 'no-preference', fallback: true },
  { tag: 'w360', vp: phone(360), motion: 'no-preference', stops: 2 },
  { tag: 'w430', vp: phone(430), motion: 'no-preference', stops: 2 },
];

const problems = [];
const shots = {};
const watch = (page, tag) => {
  page.on('pageerror', (e) => problems.push(`[${tag}] pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text() + m.location().url)) problems.push(`[${tag}] console.error: ${m.text()}`); });
  page.on('requestfailed', (r) => { if (!/favicon/.test(r.url())) problems.push(`[${tag}] request failed: ${r.url()}`); });
};

// Fixed chrome (a header, a side tab) whose text has no backing of its own lets page text scroll
// straight through it: a headline under the logo reads as one garbled word. At every stop, sample
// each unbacked text box inside a fixed element and fail if page text sits right under it.
const chromeHits = () => {
  const alpha = (c) => { const m = c.match(/[\d.]+/g); return !m ? 0 : m.length > 3 ? +m[3] : 1; };
  const solid = (s) => alpha(s.backgroundColor) >= 0.5 || s.backgroundImage !== 'none' || (s.backdropFilter || 'none') !== 'none';
  const backed = (el, root) => {
    for (let e = el; e; e = e === root ? null : e.parentElement) {
      if (solid(getComputedStyle(e))) return true;
      for (const pe of ['::before', '::after']) { const s = getComputedStyle(e, pe); if (s.content !== 'none' && solid(s)) return true; }
    }
    return false;
  };
  const hidden = (el) => { for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (+s.opacity < 0.1 || s.visibility === 'hidden') return true; } return false; };
  const roots = [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'fixed' && e.getClientRects().length);
  const inChrome = (e) => roots.some((r) => r.contains(e));
  const hits = [];
  for (const root of roots) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let t; (t = walker.nextNode());) {
      if (!t.textContent.trim() || hidden(t.parentElement) || backed(t.parentElement, root)) continue;
      const r = document.createRange(); r.selectNodeContents(t);
      for (const b of r.getClientRects()) {
        if (b.width < 2 || b.bottom < 0 || b.top > innerHeight) continue;
        for (const fx of [0.2, 0.5, 0.8]) for (const fy of [0.35, 0.65]) {
          const x = b.left + b.width * fx, y = b.top + b.height * fy;
          for (const e of document.elementsFromPoint(x, y)) {
            if (inChrome(e)) continue;
            const under = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim() && (() => { const q = document.createRange(); q.selectNodeContents(n); return [...q.getClientRects()].some((c) => x >= c.left && x <= c.right && y >= c.top && y <= c.bottom); })());
            if (under) { hits.push(`"${t.textContent.trim().slice(0, 20)}" over "${e.textContent.trim().slice(0, 20)}"`); break; }
            const s = getComputedStyle(e); if (alpha(s.backgroundColor) >= 0.9 || s.backgroundImage !== 'none') break;
          }
        }
      }
    }
  }
  return [...new Set(hits)];
};

for (const pass of passes) {
  const { tag, vp } = pass;
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, reducedMotion: pass.motion });
  if (pass.fallback) await ctx.addInitScript(forceFallback);
  const page = await ctx.newPage();
  watch(page, tag);
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(2000);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const n = pass.stops ?? steps;
  shots[tag] = [];
  let overflowAt = null, chromeAt = null;
  for (let i = 0; i <= n; i++) {
    const y = Math.round(((h - vp.height) * i) / n);
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(n > 10 ? 500 : 1200);
    const file = path.join(outDir, `${tag}-${i}.png`);
    await page.screenshot({ path: file });
    shots[tag].push(file);
    // overflow can appear only once a section scrolls in, so check at every stop
    if (overflowAt === null && await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) overflowAt = i;
    if (chromeAt === null) { const hit = await page.evaluate(chromeHits); if (hit.length) chromeAt = [i, hit]; }
  }
  if (chromeAt) problems.push(`[${tag}] page text scrolls through fixed chrome at stop ${chromeAt[0]} (give the header a backing band): ${chromeAt[1].slice(0, 2).join(', ')}`);
  if (overflowAt !== null) problems.push(`[${tag}] horizontal overflow (first seen at stop ${overflowAt})`);
  // On a phone, content that bleeds sideways (even under overflow-x: hidden on body) widens the
  // layout viewport and the whole page renders zoomed out. scrollWidth cannot see it, innerWidth can.
  // Scrolling past the end: an absolutely positioned layer (a scrim, a glow) whose containing block is
  // further up than intended stretches the page below the footer into empty screens.
  const dead = await page.evaluate(() => document.documentElement.scrollHeight - Math.max(document.body.offsetHeight, document.body.getBoundingClientRect().bottom + scrollY));
  if (dead > 2) problems.push(`[${tag}] page scrolls ${Math.round(dead)}px past the end of its content (an absolute layer is positioned against the wrong ancestor)`);
  if (vp.isMobile) {
    const iw = await page.evaluate(() => window.innerWidth);
    if (iw > vp.width + 1) problems.push(`[${tag}] layout viewport widened to ${iw}px on a ${vp.width}px phone: something bleeds sideways and the page zooms out (try overflow-x: clip on the bleeding section)`);
  }
  await ctx.close();
}

// Host page: an embed or artifact viewer often styles <body> itself (dark text, a small system font,
// a light color-scheme). Text that inherits from body instead of setting its own color then changes
// look inside the host. Load the page twice, plain and under such a reset, and compare every text box.
{
  const hostReset = () => {
    const add = () => {
      if (document.getElementById('__host')) return;
      const st = document.createElement('style');
      st.id = '__host';
      st.textContent = ':root{color-scheme:light}body{margin:0;font:14px system-ui;background:#faf9f7;color:#1f1e1c}';
      document.head.prepend(st); // first in the cascade, like the host's own skeleton
    };
    if (document.head) add(); else document.addEventListener('DOMContentLoaded', add);
  };
  const looks = async (withHost) => {
    const ctx = await browser.newContext({ viewport: desktop, reducedMotion: 'reduce' });
    if (withHost) await ctx.addInitScript(hostReset);
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'load', timeout: 45000 });
    await page.waitForTimeout(800);
    const out = await page.evaluate(() => [['body background', (({ backgroundColor: c, backgroundImage: i }) => `${c} ${i}`)(getComputedStyle(document.body))], ...[...document.body.querySelectorAll('*')]
      .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && el.getClientRects().length)
      .map((el) => { const s = getComputedStyle(el); return [el.tagName.toLowerCase() + ' "' + el.textContent.trim().slice(0, 28) + '"', `${s.color} ${s.fontSize} ${s.fontFamily.split(',')[0]}`]; })]);
    await ctx.close();
    return out;
  };
  const plain = await looks(false), hosted = await looks(true);
  const changed = plain.filter(([, look], i) => hosted[i] && hosted[i][1] !== look).map(([id], i) => id);
  if (changed.length) problems.push(`[host] ${changed.length} element(s) change background, color or size when a host page styles <body> (set background, color and font on body yourself; a bare body turns the page white), e.g. ${changed.slice(0, 3).join(', ')}`);
}

// Keyboard focus: every element Tab reaches must look different when focused.
{
  const ctx = await browser.newContext({ viewport: desktop });
  const page = await ctx.newPage();
  watch(page, 'focus');
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(1500);
  const look = (el) => {
    const s = getComputedStyle(el);
    return [s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0 ? `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}` : 'none', s.boxShadow, s.borderColor, s.backgroundColor, s.color, s.textDecorationLine].join('|');
  };
  const baseline = await page.evaluate((lookSrc) => {
    const look = eval(lookSrc);
    window.__focusBase = new Map();
    document.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])').forEach((el) => window.__focusBase.set(el, look(el)));
    return window.__focusBase.size;
  }, look.toString());
  const seen = new Set();
  const invisible = [];
  for (let i = 0; i < Math.min(baseline + 2, 60); i++) {
    await page.keyboard.press('Tab');
    const r = await page.evaluate((lookSrc) => {
      const look = eval(lookSrc);
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const id = el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).join('.')}` : '') + ` "${(el.textContent || el.getAttribute('aria-label') || el.placeholder || '').trim().slice(0, 30)}"`;
      const before = window.__focusBase.get(el);
      return { id, same: before !== undefined && before === look(el) };
    }, look.toString());
    if (!r) continue;
    if (seen.has(r.id)) break;
    seen.add(r.id);
    if (r.same) invisible.push(r.id);
    if (seen.size <= 3) await page.screenshot({ path: path.join(outDir, `focus-${seen.size}.png`) });
  }
  invisible.forEach((id) => problems.push(`[focus] no visible focus style: ${id}`));
  await ctx.close();
}

await browser.close();
server.close();

if (spawnSync('convert', ['-version']).status === 0) {
  for (const [tag, files] of Object.entries(shots)) {
    const w = tag.startsWith('desktop') || tag === 'fallback-desktop' ? 480 : 200;
    spawnSync('convert', [...files, '-resize', `${w}x`, '+append', path.join(outDir, `sheet-${tag}.jpg`)]);
  }
}

console.log(`Screenshots in ${outDir}`);
if (problems.length) {
  console.error(`FAILED with ${problems.length} problem(s):\n` + problems.join('\n'));
  process.exit(1);
}
console.log(`OK: no errors, no horizontal overflow, visible focus, clear chrome; desktop + mobile (360/390/430) + reduced motion + forced fallback rendered at ${steps} stops.`);
