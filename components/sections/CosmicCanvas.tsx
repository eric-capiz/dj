"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number; // depth 0..1
  r: number;
  tw: number; // twinkle phase
  hue: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

/**
 * Procedural deep-space canvas: 3-layer parallax starfield, drifting nebula
 * gradients, occasional meteors. Mouse parallax + idle drift. Pauses offscreen.
 */
export function CosmicCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;

    const dpr = Math.min(1.75, window.devicePixelRatio || 1);
    const stars: Star[] = [];
    const meteors: Meteor[] = [];
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    // Offscreen nebula layer
    const nebula = document.createElement("canvas");
    const nctx = nebula.getContext("2d");

    const seed = () => {
      stars.length = 0;
      const count = Math.floor((w * h) / 5200);
      for (let i = 0; i < count; i++) {
        const z = Math.random();
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.4 + z * 1.6,
          tw: Math.random() * Math.PI * 2,
          hue: Math.random() < 0.12 ? 265 : Math.random() < 0.2 ? 190 : 0,
        });
      }
    };

    const paintNebula = () => {
      nebula.width = Math.max(2, Math.floor(w / 3));
      nebula.height = Math.max(2, Math.floor(h / 3));
      if (!nctx) return;
      nctx.clearRect(0, 0, nebula.width, nebula.height);
      const blobs: Array<[number, number, number, string]> = [
        [0.22, 0.3, 0.5, "rgba(139,92,246,0.20)"],
        [0.78, 0.62, 0.55, "rgba(34,211,238,0.13)"],
        [0.55, 0.85, 0.45, "rgba(232,121,249,0.12)"],
        [0.85, 0.15, 0.4, "rgba(99,102,241,0.16)"],
      ];
      for (const [bx, by, br, color] of blobs) {
        const g = nctx.createRadialGradient(
          bx * nebula.width, by * nebula.height, 0,
          bx * nebula.width, by * nebula.height, br * nebula.width,
        );
        g.addColorStop(0, color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        nctx.fillStyle = g;
        nctx.fillRect(0, 0, nebula.width, nebula.height);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      paintNebula();
    };

    const onMouse = (e: MouseEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
    };

    let t = 0;
    const draw = () => {
      if (!running) return;
      t += 0.008;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#050508";
      ctx.fillRect(0, 0, w, h);

      // Nebula drift
      const nx = Math.sin(t * 0.6) * 14 + (mouse.x - 0.5) * -30;
      const ny = Math.cos(t * 0.5) * 10 + (mouse.y - 0.5) * -20;
      ctx.drawImage(nebula, nx - 20, ny - 20, w + 40, h + 40);

      // Stars with parallax + twinkle
      for (const s of stars) {
        const px = (s.x + (mouse.x - 0.5) * -60 * s.z + w) % w;
        const py = (s.y + (mouse.y - 0.5) * -40 * s.z + h) % h;
        const tw = 0.55 + 0.45 * Math.sin(t * (1 + s.z * 2) + s.tw);
        const alpha = (0.25 + s.z * 0.75) * tw;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        if (s.hue > 0) ctx.fillStyle = `hsla(${s.hue}, 90%, 75%, ${alpha})`;
        else ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
        if (s.z > 0.85) {
          // cross sparkle on the brightest stars
          ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.5})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(px - s.r * 3, py);
          ctx.lineTo(px + s.r * 3, py);
          ctx.moveTo(px, py - s.r * 3);
          ctx.lineTo(px, py + s.r * 3);
          ctx.stroke();
        }
      }

      // Meteors
      if (!reduced && Math.random() < 0.006 && meteors.length < 3) {
        const sx = Math.random() * w * 0.7 + w * 0.2;
        meteors.push({
          x: sx, y: -20,
          vx: -(4 + Math.random() * 3), vy: 3 + Math.random() * 2,
          life: 0, maxLife: 60 + Math.random() * 30,
        });
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life++;
        m.x += m.vx;
        m.y += m.vy;
        const fade = 1 - m.life / m.maxLife;
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 12, m.y - m.vy * 12);
        grad.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`);
        grad.addColorStop(1, "rgba(139,92,246,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 12, m.y - m.vy * 12);
        ctx.stroke();
        if (m.life > m.maxLife) meteors.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible && !running) {
          running = true;
          raf = requestAnimationFrame(draw);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    resize();
    if (reduced) {
      // single static frame
      t = 1;
      running = true;
      draw();
      running = false;
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
