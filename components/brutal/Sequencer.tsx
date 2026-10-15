"use client";

import { useEffect, useRef, useState } from "react";
import {
  PRESETS,
  STEPS,
  SequencerEngine,
  VOICES,
  type Pattern,
  type VoiceId,
} from "@/lib/sequencer";
import { SectionHead } from "./shared";

export function Sequencer() {
  const engineRef = useRef<SequencerEngine | null>(null);
  const [grid, setGrid] = useState<Pattern | null>(null);
  const [step, setStep] = useState(-1);
  const [bpm, setBpm] = useState(132);
  const [preset, setPreset] = useState("WAREHOUSE");

  useEffect(() => {
    const engine = new SequencerEngine();
    engine.loadPreset("WAREHOUSE");
    engine.onStep = (s) => setStep(s);
    engineRef.current = engine;
    setGrid(engine.snapshot());
    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, []);

  const togglePlay = () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.playing) engine.stop();
    else engine.play();
    // force a re-render for the transport label
    setGrid(engine.snapshot());
  };

  const toggleStep = (voice: VoiceId, s: number) => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.toggle(voice, s);
    setGrid(engine.snapshot());
  };

  const applyPreset = (name: string) => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.stop();
    engine.loadPreset(name);
    setPreset(name);
    setGrid(engine.snapshot());
  };

  const changeBpm = (v: number) => {
    setBpm(v);
    if (engineRef.current) engineRef.current.bpm = v;
  };

  const playing = step >= 0;

  return (
    <section id="booth" className="scroll-mt-14 border-y-4 border-bone bg-coal px-4 py-12 md:px-8 md:py-16">
      <SectionHead
        index="02"
        title="The Booth"
        note="A working 16-step drum machine. All sounds synthesized live. Touch the grid."
      />

      <div className="border-2 border-bone bg-ink">
        {/* transport bar */}
        <div className="flex flex-wrap items-center gap-3 border-b-2 border-bone p-3 md:gap-5 md:p-4">
          <button
            onClick={togglePlay}
            className={`hard-shadow-sm border-2 px-6 py-3 font-display text-2xl uppercase transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 ${
              playing
                ? "border-acid bg-acid text-ink"
                : "border-safety bg-safety text-ink"
            }`}
          >
            {playing ? "Stop" : "Play"}
          </button>
          <div className="flex items-center gap-3">
            <span className="font-grotesk text-[11px] font-bold uppercase tracking-[0.25em] text-concrete">
              BPM
            </span>
            <input
              type="range"
              min={90}
              max={170}
              value={bpm}
              onChange={(e) => changeBpm(Number(e.target.value))}
              className="w-36 accent-[#ff4d00] md:w-52"
              aria-label="Tempo in BPM"
            />
            <span className="min-w-12 bg-ink px-2 py-1 text-center font-grotesk text-lg font-bold tabular-nums text-acid">
              {bpm}
            </span>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p.name)}
                className={`border-2 px-3 py-2 font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${
                  preset === p.name
                    ? "border-acid bg-acid text-ink"
                    : "border-bone/40 text-bone hover:border-bone hover:bg-coal"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* step grid */}
        <div className="overflow-x-auto p-3 md:p-4">
          <div className="min-w-[640px]">
            {VOICES.map((v) => (
              <div key={v.id} className="mb-1.5 flex items-center gap-1.5 last:mb-0">
                <span className="w-16 shrink-0 font-grotesk text-[11px] font-bold uppercase tracking-[0.15em] text-concrete">
                  {v.label}
                </span>
                <div className="grid flex-1 grid-cols-16 gap-1.5">
                  {Array.from({ length: STEPS }, (_, s) => {
                    const on = grid?.[v.id][s] ?? false;
                    const isHead = playing && step === s;
                    const beat = s % 4 === 0;
                    return (
                      <button
                        key={s}
                        onClick={() => toggleStep(v.id, s)}
                        aria-label={`${v.label} step ${s + 1} ${on ? "on" : "off"}`}
                        aria-pressed={on}
                        className={`aspect-square border-2 transition-none ${
                          on
                            ? "border-safety bg-safety"
                            : beat
                              ? "border-bone/50 bg-coal hover:border-bone"
                              : "border-bone/25 bg-ink hover:border-bone/60"
                        } ${isHead ? "outline-2 outline-acid outline-offset-1" : ""}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            {/* playhead ruler */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="w-16 shrink-0" />
              <div className="grid flex-1 grid-cols-16 gap-1.5">
                {Array.from({ length: STEPS }, (_, s) => (
                  <span
                    key={s}
                    className={`text-center font-grotesk text-[10px] font-bold tabular-nums ${
                      playing && step === s ? "text-acid" : "text-concrete/50"
                    }`}
                  >
                    {s + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hazard-thin h-3 border-t-2 border-bone" />
      </div>

      <p className="mt-4 font-grotesk text-[11px] uppercase tracking-[0.25em] text-concrete">
        * Kick / snare / clap / hats / bassline synthesized in your browser via
        WebAudio. No samples were used. Tap steps while it plays.
      </p>
    </section>
  );
}
