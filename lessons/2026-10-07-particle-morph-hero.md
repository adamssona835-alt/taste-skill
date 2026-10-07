# 001: Particle Morph Hero

**Area:** WebGL / motion · **Date:** 2026-10-07 · **Graduated to:** [`particle-morph-skill`](../skills/particle-morph-skill/SKILL.md)

## Seen in

A dark AI landing page template ("Vesper" on getlayers.ai). A mint and violet point cloud is a brain in the hero, opens into a breathing orb, flattens into a spiral galaxy above a stats row, then becomes a quiet starfield behind "Let's talk." An off-white editorial section with a portrait photo and numbered columns breaks up the dark.

## Why it works

- **Continuity.** The same particles become every section's image, so scrolling feels like one object thinking, not a slideshow.
- **Meaning per shape.** Brain = intelligence, orb = presence, galaxy = scale, starfield = calm close. The visuals carry the story the copy tells.
- **Restraint around it.** Light-weight headline, tiny uppercase meta copy in the corners, one CTA. The cloud is the only loud thing.
- **Contrast break.** A single bright editorial section makes the dark ones feel deeper.

## How to build it

One `THREE.Points` mesh. Every shape is a same-length `Float32Array` stored as a vertex attribute. A single `uProgress` uniform (driven by GSAP ScrollTrigger scrub) blends between them in the vertex shader, with a per-particle random delay so points flock instead of slide. Full code: [`particle-morph-skill`](../skills/particle-morph-skill/SKILL.md).

```glsl
float stagger(float local) {
  float d = aRandom * 0.4;
  return smoothstep(d, d + 0.6, local);
}
vec3 pos = mix(position, aShape1, stagger(clamp(uProgress, 0.0, 1.0)));
pos = mix(pos, aShape2, stagger(clamp(uProgress - 1.0, 0.0, 1.0)));
```

## Taste rules

- Two hues on one ramp, plus about 2 percent near-white "hot" points.
- Near-black background (`#05060A`), additive blending, no bloom pass on mobile.
- Idle motion slow enough to be invisible in a screenshot.
- Points step down by device tier; reduced motion freezes the cloud; a still image stands in without WebGL.

## Slop version

Rainbow points, pure black, fast spin, morphing on a timer, ten random shapes, bold headline fighting the visual, no fallback.
