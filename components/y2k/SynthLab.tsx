"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { glossSynth, CHORDS, type OscType } from "@/lib/synth";

const OSCS: { id: OscType; label: string; color: string }[] = [
  { id: "sawtooth", label: "SAW", color: "#ff2fb3" },
  { id: "square", label: "SQR", color: "#22d3ee" },
  { id: "triangle", label: "TRI", color: "#b6ff2e" },
  { id: "sine", label: "SIN", color: "#a78bfa" },
];

function XyPad() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0.3, y: 0.6 });
  const [down, setDown] = useState(false);

  const update = (clientX: number, clientY: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    setPos({ x, y });
    glossSynth.pad(x, y);
  };

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Gloss synth XY pad: horizontal pitch, vertical filter"
      aria-valuetext={`pitch ${Math.round(pos.x * 100)} percent, filter ${Math.round((1 - pos.y) * 100)} percent`}
      tabIndex={0}
      onKeyDown={(e) => {
        const step = 0.08;
        let { x, y } = pos;
        if (e.key === "ArrowRight") x += step;
        if (e.key === "ArrowLeft") x -= step;
        if (e.key === "ArrowUp") y -= step;
        if (e.key === "ArrowDown") y += step;
        x = Math.min(1, Math.max(0, x));
        y = Math.min(1, Math.max(0, y));
        setPos({ x, y });
        glossSynth.pad(x, y);
        if (e.key === "Escape") glossSynth.padRelease();
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDown(true);
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (down) update(e.clientX, e.clientY);
      }}
      onPointerUp={() => {
        setDown(false);
        glossSynth.padRelease();
      }}
      onPointerCancel={() => {
        setDown(false);
        glossSynth.padRelease();
      }}
      className="holo relative h-64 cursor-crosshair touch-none overflow-hidden rounded-3xl sm:h-80"
    >
      <div className="sparkle-bg absolute inset-0 opacity-60" aria-hidden />
      {/* crosshair */}
      <div
        className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-white/20 shadow-[0_0_30px_rgba(255,255,255,0.9)] backdrop-blur-sm transition-transform"
        style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, scale: down ? "1.35" : "1" }}
        aria-hidden
      />
      <p className="absolute left-4 top-3 text-[10px] font-black tracking-[0.3em] text-[#0d0628]/80">
        ← PITCH →
      </p>
      <p className="absolute bottom-3 right-4 text-[10px] font-black tracking-[0.3em] text-[#0d0628]/80">
        FILTER ↑
      </p>
      {!down && (
        <p className="absolute inset-x-0 bottom-10 text-center font-display text-lg text-[#0d0628]/70">
          TOUCH ME ★
        </p>
      )}
    </div>
  );
}

export function SynthLab() {
  const [osc, setOsc] = useState<OscType>("sawtooth");
  const [delay, setDelay] = useState(0.4);

  const stab = (i: number) => {
    glossSynth.stab(CHORDS[i]);
    if (i === 3) {
      confetti({ particleCount: 60, spread: 80, colors: ["#ff2fb3", "#22d3ee", "#b6ff2e", "#ffffff"] });
    }
  };

  return (
    <section id="lab" className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
      <div className="mb-10 text-center">
        <p className="text-xs font-black tracking-[0.5em] text-white/60">⚗ INTERACTIVE TOY ⚗</p>
        <h2 className="mt-3 font-display text-5xl sm:text-7xl">
          <span className="holo-text">GLOSS</span> <span className="chrome-text">SYNTH</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/65">
          A pocket synthesizer — drag the candy pad, flip waveforms, fire chord
          stabs. 100% synthesized live, zero samples.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 70, damping: 14 }}
          className="sticker rounded-[2rem] bg-white/5 p-4 backdrop-blur-xl sm:p-6"
        >
          <XyPad />
        </motion.div>

        <div className="flex flex-col gap-5">
          <div className="glass rounded-3xl p-5">
            <p className="mb-3 text-[10px] font-black tracking-[0.3em] text-white/60">WAVEFORM</p>
            <div className="grid grid-cols-4 gap-2">
              {OSCS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setOsc(o.id);
                    glossSynth.setType(o.id);
                  }}
                  className={`candy rounded-2xl py-3 font-display text-sm transition-transform hover:scale-105 ${
                    osc === o.id ? "text-[#0d0628]" : "bg-white/10 text-white"
                  }`}
                  style={osc === o.id ? { background: o.color } : undefined}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-5">
            <p className="mb-3 text-[10px] font-black tracking-[0.3em] text-white/60">CHORD STABS</p>
            <div className="grid grid-cols-4 gap-2">
              {CHORDS.map((c, i) => (
                <motion.button
                  key={c.name}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => stab(i)}
                  className="candy holo rounded-2xl py-3 font-display text-sm text-[#0d0628]"
                >
                  {c.name}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-black tracking-[0.3em] text-white/60">SPACE ECHO</p>
              <p className="font-mono text-xs text-white/60">{Math.round(delay * 100)}%</p>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={delay}
              onChange={(e) => {
                const v = Number(e.target.value);
                setDelay(v);
                glossSynth.setDelay(v);
              }}
              aria-label="Delay amount"
              className="w-full accent-[#ff2fb3]"
            />
            <p className="mt-3 text-xs leading-relaxed text-white/50">
              Tip: hold a note on the pad, sweep upward to open the filter, and
              smash GLITTER for confetti.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
