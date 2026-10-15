"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import confetti from "canvas-confetti";
import { useY2KAudio } from "@/lib/y2k-audio";
import { TRACKS, formatTime } from "@/lib/y2k-data";

const CASE_COLORS = ["#ff2fb3", "#22d3ee", "#b6ff2e", "#a78bfa", "#ff9f1c"];

/** Analyser-driven EQ bars for the active track. */
function EqBars({ active }: { active: boolean }) {
  const { levels, isPlaying } = useY2KAudio();
  const [, force] = useState(0);
  const bars = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !isPlaying) return;
    let raf = 0;
    const tick = () => {
      force((x) => x + 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, isPlaying]);

  const vals = active && isPlaying ? levels(18) : new Array(18).fill(0.06);
  return (
    <div ref={bars} className="flex h-10 items-end gap-[3px]" aria-hidden>
      {vals.map((v, i) => (
        <div
          key={i}
          className="holo w-full rounded-sm transition-[height] duration-75"
          style={{ height: `${Math.max(8, v * 100)}%` }}
        />
      ))}
    </div>
  );
}

function JewelCase({ index }: { index: number }) {
  const { trackIndex, isPlaying, toggleTrack, durations, progress, duration } = useY2KAudio();
  const track = TRACKS[index];
  const active = trackIndex === index;
  const [liked, setLiked] = useState(false);
  const accent = CASE_COLORS[index % CASE_COLORS.length];

  // Custom 3D tilt.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 18 });
  const sry = useSpring(ry, { stiffness: 220, damping: 18 });
  const glareX = useTransform(sry, [-14, 14], ["20%", "80%"]);
  const glare = useTransform(
    glareX,
    (gx) => `linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.28) ${gx}, transparent 70%)`,
  );

  const like = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      const r = (e.target as HTMLElement).getBoundingClientRect();
      confetti({
        particleCount: 45,
        spread: 65,
        startVelocity: 28,
        origin: { x: (r.left + r.width / 2) / window.innerWidth, y: r.top / window.innerHeight },
        colors: [accent, "#ffffff", "#22d3ee"],
      });
    }
    setLiked((v) => !v);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 80, damping: 14, delay: (index % 3) * 0.08 }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 22);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 18);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className="group relative"
    >
      <div
        className={`glass relative overflow-hidden rounded-3xl p-5 transition-shadow ${
          active ? "shadow-[0_0_50px_rgba(255,47,179,0.45)]" : "hover:shadow-[0_0_36px_rgba(34,211,238,0.3)]"
        }`}
        style={{ borderTop: `4px solid ${accent}` }}
      >
        {/* holographic glare sweep */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
          aria-hidden
        />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black tracking-[0.3em]" style={{ color: accent }}>
              {track.style.toUpperCase()} ★ {track.bpm} BPM
            </p>
            <h3 className="mt-2 font-display text-2xl leading-none">{track.name}</h3>
          </div>
          <button
            onClick={like}
            aria-label={liked ? "Unlike track" : "Like track"}
            className={`shrink-0 rounded-full px-3 py-2 text-lg transition-transform hover:scale-125 ${liked ? "" : "grayscale"}`}
          >
            💿
          </button>
        </div>

        <EqBars active={active} />

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => toggleTrack(index)}
            aria-label={active && isPlaying ? `Pause ${track.name}` : `Play ${track.name}`}
            className="candy rounded-full px-5 py-2.5 font-display text-sm tracking-wide text-[#0d0628] transition-transform hover:scale-105"
            style={{ background: accent }}
          >
            {active && isPlaying ? "❚❚ PAUSE" : "▶ PLAY"}
          </button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="holo h-full rounded-full transition-[width] duration-300"
              style={{ width: `${active ? (progress || 0) * 100 : 0}%` }}
            />
          </div>
          <span className="font-mono text-xs text-white/60">
            {formatTime(active ? duration : durations[index] || 0)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export function Mixes() {
  return (
    <section id="mixes" className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
      <div className="mb-12 text-center">
        <p className="text-xs font-black tracking-[0.5em] text-white/60">★ FRESH OUT THE DRIVE ★</p>
        <h2 className="mt-3 font-display text-5xl sm:text-7xl">
          <span className="chrome-text">MIX</span> <span className="holo-text">TAPES</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/65">
          Eleven transmissions from the chrome dimension. Hit play — the hero
          up top dances to whatever&apos;s spinning.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TRACKS.map((t, i) => (
          <JewelCase key={t.src} index={i} />
        ))}
      </div>
    </section>
  );
}
