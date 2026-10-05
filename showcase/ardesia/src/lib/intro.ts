"use client";

// Tiny event bus for the entrance choreography:
// curtain lifts -> scene lights -> type rises -> nav becomes interactive.

const REVEAL = "ardesia:reveal";
const SCENE_READY = "ardesia:scene-ready";

declare global {
  interface Window {
    __ardesia?: { revealed?: boolean; sceneReady?: boolean };
  }
}

function state() {
  window.__ardesia ??= {};
  return window.__ardesia;
}

export function onReveal(cb: () => void) {
  if (state().revealed) {
    cb();
    return () => {};
  }
  window.addEventListener(REVEAL, cb, { once: true });
  return () => window.removeEventListener(REVEAL, cb);
}

export function emitReveal() {
  if (state().revealed) return;
  state().revealed = true;
  window.dispatchEvent(new Event(REVEAL));
}

export function onSceneReady(cb: () => void) {
  if (state().sceneReady) {
    cb();
    return () => {};
  }
  window.addEventListener(SCENE_READY, cb, { once: true });
  return () => window.removeEventListener(SCENE_READY, cb);
}

export function emitSceneReady() {
  state().sceneReady = true;
  window.dispatchEvent(new Event(SCENE_READY));
}
