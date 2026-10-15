"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor: a dot + a trailing ring. Grows over interactive elements.
 * Disabled entirely on coarse pointers (touch).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.documentElement.classList.add("cursor-none");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let scale = 1;
    let targetScale = 1;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target as HTMLElement | null;
      const interactive = t?.closest?.("a, button, [data-cursor], input, textarea, select");
      targetScale = interactive ? 2.6 : 1;
    };

    const loop = () => {
      // dot follows fast, ring trails
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      scale += (targetScale - scale) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[95] hidden [@media(pointer:fine)]:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-10 w-10 rounded-full border border-neon/70"
        style={{ willChange: "transform" }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-pulse"
        style={{ willChange: "transform", boxShadow: "0 0 12px #22d3ee" }}
      />
    </div>
  );
}
