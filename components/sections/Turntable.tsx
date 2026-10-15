"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useAudio } from "@/lib/use-audio";
import { audioEngine } from "@/lib/audio-engine";
import { SectionTag, Reveal } from "../chrome/Reveal";

const RPM33 = 200; // deg/sec visual speed at 33⅓
const RPM45 = 270; // deg/sec visual speed at 45

function pointerAngle(e: React.PointerEvent, el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
}

function normDelta(d: number): number {
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

export function Turntable() {
  const { trackIndex, tracks, isPlaying, next, prev, playTrack } = useAudio();
  const [power, setPower] = useState(false);
  const [needleDown, setNeedleDown] = useState(false);
  const [is33, setIs33] = useState(true);

  const vinylRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    rotation: 0,
    velocity: 0,
    dragging: false,
    lastAngle: 0,
    lastT: 0,
    power: false,
    needleDown: false,
    trackIndex: -1,
    base: RPM33,
  });

  // keep physics state in sync with React state
  stateRef.current.power = power;
  stateRef.current.needleDown = needleDown;
  stateRef.current.trackIndex = trackIndex;
  stateRef.current.base = is33 ? RPM33 : RPM45;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = stateRef.current;

      if (!s.dragging) {
        const target = s.power ? s.base : 0;
        // ease toward target speed (fast spin-up, gentle spin-down)
        const k = target > s.velocity ? 3.2 : 1.4;
        s.velocity += (target - s.velocity) * Math.min(1, k * dt);
        if (Math.abs(s.velocity) < 0.4 && target === 0) s.velocity = 0;
      }
      s.rotation = (s.rotation + s.velocity * dt) % 360;
      if (vinylRef.current) {
        vinylRef.current.style.transform = `rotate(${s.rotation}deg)`;
      }

      // audio coupling
      const shouldPlay = s.power && s.needleDown && s.trackIndex >= 0;
      if (shouldPlay && !audioEngine.isPlaying) {
        audioEngine.playTrack(s.trackIndex);
      } else if (!shouldPlay && audioEngine.isPlaying) {
        audioEngine.pause();
      }
      if (shouldPlay && audioEngine.isPlaying) {
        const rate = s.velocity / s.base;
        audioEngine.setRate(Math.max(0.05, rate));
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = vinylRef.current;
    if (!el) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const s = stateRef.current;
    s.dragging = true;
    s.lastAngle = pointerAngle(e, el);
    s.lastT = performance.now();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = stateRef.current;
    const el = vinylRef.current;
    if (!s.dragging || !el) return;
    const a = pointerAngle(e, el);
    const now = performance.now();
    const dt = Math.max(8, now - s.lastT) / 1000;
    const d = normDelta(a - s.lastAngle);
    s.rotation = (s.rotation + d) % 360;
    const instV = d / dt;
    s.velocity = s.velocity * 0.65 + instV * 0.35;
    s.lastAngle = a;
    s.lastT = now;
  };

  const onPointerUp = () => {
    stateRef.current.dragging = false;
  };

  const current = trackIndex >= 0 ? tracks[trackIndex] : null;

  return (
    <section id="deck" className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-44">
      <SectionTag index="02" label="The deck — touch it" />

      <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* Deck */}
        <Reveal className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            {/* neon underglow */}
            <div
              className={`absolute -inset-6 rounded-[2.5rem] blur-3xl transition-opacity duration-700 ${
                power ? "bg-neon/25 opacity-100" : "bg-neon/10 opacity-40"
              }`}
              aria-hidden
            />
            <div className="relative h-full w-full rounded-[2rem] border border-white/10 bg-panel p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_80px_rgba(0,0,0,0.6)] md:p-7">
              {/* platter */}
              <div className="platter-ring relative aspect-square w-full rounded-full p-[3.5%] shadow-[0_10px_40px_rgba(0,0,0,0.7)]">
                <div
                  ref={vinylRef}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  className="vinyl-grooves relative h-full w-full touch-none select-none rounded-full"
                  data-cursor="spin"
                  role="slider"
                  aria-label="Vinyl — drag to spin or scratch"
                  aria-valuemin={0}
                  aria-valuemax={360}
                >
                  {/* label */}
                  <div className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_40deg,#8b5cf6,#22d3ee,#e879f9,#8b5cf6)] p-[2px]">
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-void/95 text-center">
                      <p className="font-display text-[8px] font-bold tracking-[0.2em] text-white md:text-[10px]">
                        COSMIC
                      </p>
                      <p className="font-display text-[8px] font-bold tracking-[0.2em] text-neon md:text-[10px]">
                        DRIFT
                      </p>
                      <p className="mt-1 text-[7px] tracking-[0.25em] text-zinc-500 md:text-[8px]">
                        {is33 ? "33⅓" : "45"} RPM
                      </p>
                    </div>
                  </div>
                  {/* spindle */}
                  <div className="absolute left-1/2 top-1/2 h-[3%] w-[3%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-600" />
                  {/* light streak */}
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.09)_20deg,transparent_40deg,transparent_180deg,rgba(255,255,255,0.06)_200deg,transparent_220deg)]" />
                </div>
              </div>

              {/* tonearm */}
              <button
                onClick={() => setNeedleDown((v) => !v)}
                className="absolute right-[9%] top-[6%] h-[34%] w-[16%]"
                aria-label={needleDown ? "Lift the needle" : "Drop the needle"}
                data-cursor="needle"
              >
                <motion.div
                  className="relative h-full w-full origin-top"
                  animate={{ rotate: needleDown ? 24 : 42 }}
                  transition={{ type: "spring", stiffness: 120, damping: 16 }}
                  style={{ transformOrigin: "50% 8%" }}
                >
                  <span className="absolute left-1/2 top-0 h-[16%] w-[26%] -translate-x-1/2 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-700 shadow-lg" />
                  <span className="absolute left-1/2 top-[12%] h-[80%] w-[5%] -translate-x-1/2 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-700" />
                  <span className="absolute bottom-[2%] left-1/2 h-[10%] w-[16%] -translate-x-1/2 rounded-sm bg-zinc-800" />
                  <span
                    className={`absolute bottom-0 left-1/2 h-[4%] w-[8%] -translate-x-1/2 rounded-full transition-colors ${
                      needleDown ? "bg-pulse shadow-[0_0_10px_#22d3ee]" : "bg-zinc-600"
                    }`}
                  />
                </motion.div>
              </button>

              {/* controls */}
              <div className="absolute bottom-[5%] left-[7%] flex items-center gap-3">
                <button
                  onClick={() => setPower((v) => !v)}
                  className={`h-11 w-11 rounded-full border transition-all duration-300 ${
                    power
                      ? "border-neon bg-neon/20 shadow-[0_0_18px_rgba(139,92,246,0.8)]"
                      : "border-white/15 bg-white/5"
                  }`}
                  aria-label="Power"
                  data-cursor="power"
                >
                  <span className={`mx-auto block h-3 w-3 rounded-full ${power ? "bg-neon" : "bg-zinc-600"}`} />
                </button>
                <div className="flex overflow-hidden rounded-full border border-white/15">
                  {(["33", "45"] as const).map((s) => {
                    const active = (s === "33") === is33;
                    return (
                      <button
                        key={s}
                        onClick={() => setIs33(s === "33")}
                        className={`px-3 py-2 font-display text-[10px] font-bold tracking-widest transition-colors ${
                          active ? "bg-white text-void" : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="absolute bottom-[6%] right-[8%] text-right">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  {power ? (isPlaying ? "Playing" : needleDown ? "Cued" : "Spinning") : "Standby"}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Copy + transport */}
        <div>
          <Reveal>
            <h2 className="font-display text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Grab the vinyl.
              <br />
              <span className="text-outline-neon">Scratch the sky.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-lg leading-relaxed text-zinc-400">
              This deck is live. Hit power, drop the needle, and the current
              mix starts rolling with real vinyl crackle. Grab the record
              mid-spin to scratch it — the pitch follows your hand. Flick it
              and let inertia do the rest.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 rounded-2xl border border-white/10 bg-panel/80 p-5 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">Now on the deck</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold text-white">
                    {current ? current.name : "No track cued"}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {current ? `${current.style} — ${current.bpm} BPM` : "Pick a mix below"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-neon hover:text-neon"
                    aria-label="Previous track"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2h2v10H3zM12 2L5.5 7 12 12z" /></svg>
                  </button>
                  <button
                    onClick={() => {
                      if (trackIndex < 0) playTrack(0);
                      else if (isPlaying) audioEngine.pause();
                      else playTrack(trackIndex);
                    }}
                    className="grid h-14 w-14 place-items-center rounded-full bg-white text-void transition-transform hover:scale-105"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2h3v10H3zM8 2h3v10H8z" /></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l8 5-8 5z" /></svg>
                    )}
                  </button>
                  <button
                    onClick={next}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-neon hover:text-neon"
                    aria-label="Next track"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M9 2h2v10H9zM2 2l6.5 5L2 12z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <ul className="mt-8 space-y-3 text-sm text-zinc-400">
              {[
                ["01", "Power on, needle down — the mix starts with analog crackle."],
                ["02", "Drag the vinyl to scratch. Pitch bends with your hand."],
                ["03", "Flick and release — inertia keeps it spinning."],
                ["04", "Switch 33⅓ / 45 to pitch the whole set up or down."],
              ].map(([n, t]) => (
                <li key={n} className="flex gap-4">
                  <span className="font-display text-xs text-pulse">{n}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
