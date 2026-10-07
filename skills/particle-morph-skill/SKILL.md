---
name: particle-morph-hero
description: Build a living, dark-canvas WebGL hero where one particle cloud morphs between shapes (orb, galaxy, organic model) as the user scrolls and responds to the pointer. Three.js + custom shaders, GPU-only animation, device-tiered point counts, reduced-motion fallback, and the editorial layout that keeps it looking premium instead of like a screensaver.
---

# Particle Morph Hero

One particle system, several shapes, scroll is the timeline. The page feels alive because the *same* points rearrange themselves into each section's idea instead of swapping images or videos.

Reference pattern: dark SaaS / AI landing pages where a mint-to-violet point cloud breathes as an orb, opens into a spiral galaxy, then gathers into an organic form (a brain, a hand, a product silhouette) while thin, quiet typography sits around it.

Use this skill when the brief says: "immersive", "living interface", "WebGL hero", "particles", "AI product", "feels alive", "Three.js", or points at a reference like this. Do not use it for content-heavy sites, dashboards, or anything that must run well on low-end Android as the primary audience (ship the static fallback there).

---

## 1. The Rules That Make It Look Expensive

1. **One system, many targets.** Never fade one canvas out and another in. Every shape is a target position for the same N particles. The morph *is* the transition.
2. **The canvas is the art, the chrome is quiet.** Headline is light weight (300), large, tight tracking, max two lines. All other text is small uppercase meta copy (11 to 12px, letter-spacing 0.06em) parked in corners. No buttons floating over the cloud except one CTA.
3. **Two hues, one ramp.** Pick a cool pair (mint `#5EF2C2` to violet `#6B5CFF` in the reference). Color by a per-particle value (height, radius, or noise), never random per point. Add a near-white highlight for the densest 2 to 3 percent so the form has a "light source".
4. **Additive blending on near-black, not pure black.** Background `#05060A` to `#0A0B12` with one soft radial glow behind the form. Pure `#000` makes additive points look cheap.
5. **Breathing, not spinning.** Idle motion is slow curl noise on every particle (amplitude about 1 to 2 percent of shape size) plus a very slow yaw (under 0.05 rad/s). Fast rotation reads as a 2012 screensaver.
6. **Stagger the morph.** Each particle gets a random delay so the shape dissolves and re-forms like a flock, instead of all points sliding linearly at once.
7. **Pointer is a force, not a cursor.** Points near the pointer get pushed out along the view plane and spring back. Radius about 15 percent of the viewport, falloff smooth.
8. **Contrast the dark hero with a light section.** The reference alternates: dark particle hero, then an off-white editorial block with a photo and numbered columns `[01] [02]`, then dark again. The light break is what makes the dark sections feel deep.
9. **Honor the budget out loud.** Points, pixel ratio, and noise octaves step down by device tier. Reduced motion freezes the cloud at the current shape. The page must still read without WebGL.

---

## 2. Layout Blueprint (Hero)

```
┌──────────────────────────────────────────────────────────┐
│  ✳ Brand      Home  Services  Work  About    [Contact ▸] │  glass pill nav, 1px hairline border
│                                                          │
│  Motion instead                                          │  font-weight 300, clamp(40px, 6vw, 88px)
│  of chrome                                               │  line-height 1.0, letter-spacing -0.03em
│                    ░░▒▒▓▓ particle form ▓▓▒▒░░          │
│  POINT COUNTS STEP DOWN         REDUCED MOTION HONORED   │  11px uppercase meta, opacity .6
│  BY DEVICE, NOT FRAME RATE.     ACROSS THE PAGE          │
│                                          Reads presence, │  second headline, right aligned,
│                                               in motion  │  appears on scroll
└──────────────────────────────────────────────────────────┘
```

- The hero lives in a rounded frame (`border-radius: 20px` to `28px`) inset 12 to 16px from the viewport, with a hairline border `rgba(255,255,255,0.08)`. It reads like a product window, not a full-bleed demo.
- Headline left, meta copy bottom-left and right, second statement bottom-right: the form sits in the open middle-right.
- A stats row under the galaxy section (four columns, number on top in 28 to 40px weight 300, label under in 11px uppercase) grounds the abstract visual in facts.
- The closing section reuses the cloud as a flat starfield behind a simple centered "Let's talk." with a minimal form.

---

## 3. Stack

- `three` (r160+) with a custom `ShaderMaterial` on `THREE.Points`.
- `gsap` + `ScrollTrigger` to drive one `uProgress` uniform. (Or a raw scroll listener with damping; do not use both.)
- `MeshSurfaceSampler` from `three/examples/jsm/math/MeshSurfaceSampler.js` to turn any GLB (brain, hand, logo) into points.
- Next.js / React: mount the canvas in a client component, `dynamic(() => import(...), { ssr: false })`, and dispose everything on unmount.

---

## 4. Shape Targets

Every generator returns a `Float32Array` of length `count * 3`, centered at the origin and scaled to fit a unit-ish radius. All targets must have the same `count`.

```js
// Fibonacci sphere with a little shell thickness: the "orb".
export function orb(count, radius = 1.2) {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const shell = radius * (0.92 + Math.random() * 0.16);
    out[i * 3]     = Math.cos(theta) * r * shell;
    out[i * 3 + 1] = y * shell;
    out[i * 3 + 2] = Math.sin(theta) * r * shell;
  }
  return out;
}

// Logarithmic spiral galaxy, flattened on Y, dense bright core.
// Tilted toward the camera so the spiral reads (a flat disc is a line edge-on).
export function galaxy(count, { arms = 3, radius = 2.4, twist = 2.2, tilt = 0.32 } = {}) {
  const out = new Float32Array(count * 3);
  const cos = Math.cos(tilt), sin = Math.sin(tilt);
  for (let i = 0; i < count; i++) {
    const t = Math.pow(Math.random(), 1.6);          // bias toward the core
    const r = t * radius;
    const arm = (i % arms) / arms * Math.PI * 2;
    const angle = arm + r * twist;
    const spread = 0.35 * (1 - t * 0.6);
    const jx = (Math.random() - 0.5) * spread * r;
    const jz = (Math.random() - 0.5) * spread * r;
    const y = (Math.random() - 0.5) * 0.12 * (1 - t);
    const z = Math.sin(angle) * r + jz;
    out[i * 3]     = Math.cos(angle) * r + jx;
    out[i * 3 + 1] = y * cos - z * sin;
    out[i * 3 + 2] = y * sin + z * cos;
  }
  return out;
}

// Any mesh: sample its surface. Normalize so every model fits the same frame.
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import * as THREE from 'three';

export function fromMesh(mesh, count, size = 2.4) {
  const geo = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
  geo.computeBoundingBox();
  const box = geo.boundingBox;
  const center = box.getCenter(new THREE.Vector3());
  const scale = size / Math.max(...box.getSize(new THREE.Vector3()).toArray());
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(geo)).build();
  const p = new THREE.Vector3();
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    sampler.sample(p);
    p.sub(center).multiplyScalar(scale);
    out.set([p.x, p.y, p.z], i * 3);
  }
  return out;
}
```

Model sourcing: use a CC0 or properly licensed GLB (check Sketchfab / Poly Haven licenses), decimated to under 50k triangles; the sampler only needs the surface. Bake targets once and cache them (`Float32Array` to a `.bin` file) if sampling shows up in the startup profile.

---

## 5. The Shader

Targets live in attributes. `uProgress` runs from `0` to `shapes - 1`. Each particle computes its own local blend with a stagger.

```js
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;     // 0..2 for three shapes
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3  uPointer;      // world-space pointer on the z=0 plane
  uniform float uPointerForce;
  attribute vec3 aShape1;
  attribute vec3 aShape2;
  attribute float aRandom;
  varying float vMix;
  varying float vGlow;

  // cheap hash noise, plenty for breathing
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
  }

  float stagger(float local) {
    // each particle starts its move at a different moment
    float d = aRandom * 0.4;
    return smoothstep(d, d + 0.6, local);
  }

  void main() {
    float p01 = clamp(uProgress, 0.0, 1.0);
    float p12 = clamp(uProgress - 1.0, 0.0, 1.0);
    vec3 pos = mix(position, aShape1, stagger(p01));
    pos = mix(pos, aShape2, stagger(p12));

    // breathing
    vec3 n = hash3(pos * 1.7 + floor(uTime * 0.25 + aRandom * 4.0));
    vec3 n2 = hash3(pos * 1.7 + floor(uTime * 0.25 + aRandom * 4.0) + 1.0);
    pos += mix(n, n2, fract(uTime * 0.25 + aRandom * 4.0)) * 0.025;

    // pointer repulsion in the view plane
    vec3 toP = pos - uPointer;
    float dist = length(toP.xy);
    float push = (1.0 - smoothstep(0.0, 0.9, dist)) * uPointerForce;
    pos.xy += normalize(toP.xy + 1e-4) * push * 0.35;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.6 + aRandom * 0.8) / -mv.z;

    // 0 = violet, 1 = mint: height for tall forms, radius for flat ones
    vMix = clamp(0.3 + pos.y * 0.3 + length(pos.xz) * 0.2, 0.0, 1.0);
    vGlow = step(0.975, aRandom);                 // ~2.5% hot points
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;  // mint
  uniform vec3 uColorB;  // violet
  varying float vMix;
  varying float vGlow;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uColorB, uColorA, vMix);
    col = mix(col, vec3(0.92, 0.98, 1.0), vGlow * 0.8);
    gl_FragColor = vec4(col, alpha * (0.55 + vGlow * 0.45));
  }
`;
```

---

## 6. Scene Setup

```js
import * as THREE from 'three';

export function createParticleHero(canvas, targets /* [Float32Array, ...] length 3 */) {
  const tier = deviceTier();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio, tier.maxDpr);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const count = targets[0].length / 3;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(targets[0], 3));
  geo.setAttribute('aShape1', new THREE.BufferAttribute(targets[1], 3));
  geo.setAttribute('aShape2', new THREE.BufferAttribute(targets[2], 3));
  const rnd = new Float32Array(count);
  for (let i = 0; i < count; i++) rnd[i] = Math.random();
  geo.setAttribute('aRandom', new THREE.BufferAttribute(rnd, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4); // morph moves points; skip per-frame culling math

  const material = new THREE.ShaderMaterial({
    vertexShader, fragmentShader,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uProgress: { value: 0 },
      uSize: { value: tier.pointSize }, uPixelRatio: { value: dpr },
      uPointer: { value: new THREE.Vector3(99, 99, 0) }, uPointerForce: { value: 0 },
      uColorA: { value: new THREE.Color('#5EF2C2') }, uColorB: { value: new THREE.Color('#6B5CFF') },
    },
  });
  const points = new THREE.Points(geo, material);
  scene.add(points);

  // pointer → world on z=0 plane
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  let pointerTarget = 0;
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    ray.ray.intersectPlane(plane, material.uniforms.uPointer.value);
    pointerTarget = 1;
  };
  const onLeave = () => { pointerTarget = 0; };
  window.addEventListener('pointermove', onMove, { passive: true });
  canvas.addEventListener('pointerleave', onLeave);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  // pause when offscreen or tab hidden
  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(canvas);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock();
  let raf;
  const tick = () => {
    raf = requestAnimationFrame(tick);
    if (!visible || document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!reduce) {
      material.uniforms.uTime.value += dt;
      points.rotation.y += dt * 0.04;
    }
    const f = material.uniforms.uPointerForce;
    f.value += (pointerTarget - f.value) * Math.min(dt * 4, 1);
    renderer.render(scene, camera);
  };
  tick();

  return {
    material, points,
    setProgress(v) { material.uniforms.uProgress.value = v; },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      geo.dispose(); material.dispose(); renderer.dispose();
    },
  };
}

export function deviceTier() {
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const small = Math.min(screen.width, screen.height) < 700;
  if (small || cores <= 4 || mem <= 2) return { count: 18000, maxDpr: 1.5, pointSize: 22 };
  if (cores <= 8) return { count: 45000, maxDpr: 1.75, pointSize: 20 };
  return { count: 80000, maxDpr: 2, pointSize: 18 };
}
```

Generate targets with `deviceTier().count` so every tier gets full shapes, just fewer points. Never lower count at runtime based on FPS: popping density looks broken.

---

## 7. Scroll Choreography

The canvas is `position: fixed` (or sticky inside the hero section stack); the sections scroll over it and the progress uniform follows.

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const state = { p: 0 };
gsap.to(state, {
  p: 2,
  ease: 'none',
  scrollTrigger: { trigger: '#story', start: 'top top', end: 'bottom bottom', scrub: 1.2 },
  onUpdate: () => hero.setProgress(state.p),
});

// headline swaps ride the same timeline, offset so text lands after the shape settles
gsap.utils.toArray('[data-statement]').forEach((el) => {
  gsap.fromTo(el, { autoAlpha: 0, y: 24, filter: 'blur(8px)' }, {
    autoAlpha: 1, y: 0, filter: 'blur(0px)',
    scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 45%', scrub: true },
  });
});
```

Section to shape mapping in the reference: hero = brain or orb (identity), "how it works" = orb opening (process), proof / stats = galaxy (scale), contact = flattened starfield (calm). Pick shapes that *mean* something for the product. A random torus knot means nothing.

Camera moves are optional and small: dolly from `z = 7` to `z = 5.5` across the galaxy section. The galaxy target is already tilted about 18 degrees; raise `tilt` toward `0.6` if the spiral should face the viewer more.

---

## 8. Fallbacks and Accessibility

- **No WebGL / save-data / very low tier:** render a pre-exported still (AVIF/WebP of the hero frame) in the same frame. Detect with a try/catch around `getContext('webgl2') || getContext('webgl')` and `navigator.connection?.saveData`.
- **`prefers-reduced-motion: reduce`:** no breathing, no rotation, no scrubbed morph. Snap `uProgress` to the integer shape for the section in view with a 400ms opacity crossfade on the canvas, or just keep the first shape.
- The canvas is decorative: `aria-hidden="true"`, and every statement drawn near it exists as real DOM text.
- Text over the cloud must hit 4.5:1. Put a soft radial vignette (`radial-gradient` from transparent to `rgba(5,6,10,0.7)`) under text blocks, never a solid box.
- Do not hijack scroll. Native scroll + scrub. No wheel-jacking, no forced snapping.

---

## 9. Performance Checklist

- [ ] One draw call for the whole cloud (`THREE.Points`, one material).
- [ ] All motion in the vertex shader; JS only updates 3 to 4 uniforms per frame.
- [ ] `antialias: false` (points do not need it), DPR capped per tier.
- [ ] Render loop paused when the canvas is offscreen or the tab is hidden.
- [ ] Targets generated once; GLB loaded with Draco/meshopt, sampled, then the mesh is disposed.
- [ ] Lighthouse LCP element is the headline text, not the canvas. Canvas initializes after first paint (`requestIdleCallback` or after `load`).
- [ ] Full teardown on route change (geometry, material, renderer, observers, listeners).

---

## 10. Anti-Patterns (Instant Slop)

- Rainbow or fully random per-particle colors.
- Pure black background with full-opacity points (looks like noise, not light).
- Constant fast rotation or bouncing.
- Morphing every 3 seconds on a timer, unrelated to scroll or story.
- Ten shapes. Three, maybe four, is a story; ten is a demo reel.
- Heavy bold headline fighting the particles. Keep type light; let the cloud carry weight.
- Glow faked with `UnrealBloomPass` at full resolution on mobile. Additive blending plus a few hot points gets 90 percent of the look for free.
- Copying someone else's site, prompt, or model. Learn the pattern, then make shapes and copy that belong to your product.

---

## 11. Pre-Flight

Before shipping, answer yes to all:

1. Does each shape mean something for this product?
2. Is it one particle system morphing, not crossfaded canvases?
3. Is idle motion slow enough that you would not notice it in a screenshot?
4. Does the page read and convert with WebGL disabled?
5. Does reduced motion stop every continuous animation?
6. Is there a light editorial section somewhere to give the dark sections contrast?
7. Mobile mid-tier: steady 60fps (or 30 locked) on the hero with the tier's point count?
