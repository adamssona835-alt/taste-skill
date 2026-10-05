"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, finePointer, prefersReducedMotion } from "@/lib/gsap";
import { emitSceneReady, onReveal } from "@/lib/intro";
import { Picture } from "./Picture";

/**
 * Mounts the WebGL light study. three.js is code-split and only fetched here.
 * Pauses whenever the hero is off screen or the tab is hidden.
 * Falls back to a photograph of the same idea when WebGL is unavailable.
 */
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    let disposed = false;
    const cleanups: (() => void)[] = [];

    import("@/lib/scene").then(({ LightStudy, webglAvailable }) => {
      if (disposed) return;
      if (!webglAvailable()) {
        setFallback(true);
        emitSceneReady();
        return;
      }
      const reduce = prefersReducedMotion();
      const lowPower =
        window.matchMedia("(max-width: 767px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4;

      let scene: InstanceType<typeof LightStudy>;
      try {
        scene = new LightStudy({ canvas, reducedMotion: reduce, lowPower });
      } catch {
        setFallback(true);
        emitSceneReady();
        return;
      }

      const ro = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        scene.resize(Math.max(1, width), Math.max(1, height));
      });
      ro.observe(host);

      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) scene.start();
        else scene.stop();
      });
      io.observe(host);

      const onVisibility = () => (document.hidden || !visible ? scene.stop() : scene.start());
      document.addEventListener("visibilitychange", onVisibility);

      const onPointer = (e: PointerEvent) => {
        scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
      };
      if (finePointer() && !reduce) window.addEventListener("pointermove", onPointer, { passive: true });

      const st = ScrollTrigger.create({
        trigger: host,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => scene.setScroll(self.progress),
      });

      scene.resize(host.clientWidth, host.clientHeight);
      scene.start();
      requestAnimationFrame(() => {
        canvas.style.opacity = "1";
        emitSceneReady();
      });
      const offReveal = onReveal(() => scene.playIntro());

      cleanups.push(() => {
        offReveal();
        st.kill();
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pointermove", onPointer);
        scene.dispose();
      });
    });

    return () => {
      disposed = true;
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {fallback ? (
        <Picture name="light-slits" alt="" sizes="100vw" priority className="block h-full w-full" />
      ) : (
        <canvas ref={canvasRef} className="block h-full w-full opacity-0 transition-opacity duration-1000" />
      )}
    </div>
  );
}
