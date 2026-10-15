"use client";

import { useEffect, useRef, useState } from "react";
import { TRACKS } from "@/lib/data";
import { SectionHead } from "./shared";

function fmt(sec: number | null) {
  if (sec === null || !isFinite(sec)) return "--:--";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function Mixes() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef<number>(-1);
  const [current, setCurrent] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [durations, setDurations] = useState<Record<number, number>>({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = new Audio();
    el.preload = "metadata";
    audioRef.current = el;
    const onTime = () => {
      if (el.duration) setProgress(el.currentTime / el.duration);
    };
    const onMeta = () =>
      setDurations((d) => ({ ...d, [indexRef.current]: el.duration }));
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.pause();
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = (i: number) => {
    const el = audioRef.current;
    if (!el) return;
    if (current === i && playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    if (current !== i) {
      el.src = TRACKS[i].src;
      indexRef.current = i;
      setCurrent(i);
    }
    void el.play();
    setPlaying(true);
  };

  return (
    <section id="mixes" className="scroll-mt-14 px-4 py-12 md:px-8 md:py-16">
      <SectionHead
        index="01"
        title="Mixes"
        note="Raw cuts. Pressed loud. 11 units."
      />
      <div className="border-2 border-bone">
        <div className="hidden grid-cols-[3rem_1fr_7rem_5rem_6rem_5rem] border-b-2 border-bone bg-coal font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-concrete md:grid">
          <span className="px-3 py-2">#</span>
          <span className="px-3 py-2">Title</span>
          <span className="px-3 py-2">Style</span>
          <span className="px-3 py-2">BPM</span>
          <span className="px-3 py-2">Time</span>
          <span className="px-3 py-2 text-right">Play</span>
        </div>
        {TRACKS.map((t, i) => {
          const active = current === i;
          return (
            <button
              key={t.src}
              onClick={() => toggle(i)}
              className={`grid w-full grid-cols-[3rem_1fr_5rem] items-center border-b border-bone/20 text-left transition-colors last:border-b-0 md:grid-cols-[3rem_1fr_7rem_5rem_6rem_5rem] ${
                active ? "bg-safety text-ink" : "hover:bg-coal"
              }`}
            >
              <span
                className={`px-3 py-3 font-grotesk text-sm font-bold tabular-nums md:py-4 ${
                  active ? "text-ink" : "text-concrete"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex items-center gap-3 px-3 py-3 md:py-4">
                <span className="font-display text-lg md:text-2xl uppercase leading-none">
                  {t.name}
                </span>
                {active && playing && (
                  <span className="flex h-4 items-end gap-[3px]" aria-hidden>
                    {[0, 1, 2, 3].map((b) => (
                      <span
                        key={b}
                        className="eq-bar w-[3px] bg-ink"
                        style={{ height: "100%", animationDelay: `${b * 0.13}s` }}
                      />
                    ))}
                  </span>
                )}
              </span>
              <span
                className={`hidden px-3 py-4 font-grotesk text-xs uppercase tracking-[0.15em] md:block ${
                  active ? "text-ink" : "text-concrete"
                }`}
              >
                {t.style}
              </span>
              <span
                className={`hidden px-3 py-4 font-grotesk text-xs font-bold tabular-nums md:block ${
                  active ? "text-ink" : "text-bone"
                }`}
              >
                {t.bpm}
              </span>
              <span
                className={`px-3 py-3 font-grotesk text-xs tabular-nums md:py-4 ${
                  active ? "text-ink" : "text-concrete"
                }`}
              >
                {fmt(durations[i] ?? null)}
              </span>
              <span className="px-3 py-3 text-right md:py-4">
                <span
                  className={`inline-block border-2 px-3 py-1 font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] ${
                    active
                      ? "border-ink text-ink"
                      : "border-bone text-bone"
                  }`}
                >
                  {active && playing ? "Stop" : "Play"}
                </span>
              </span>
              {active && (
                <span className="col-span-full block h-1 bg-ink/20 md:col-start-1 md:col-end-7">
                  <span
                    className="block h-full bg-ink"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-4 font-grotesk text-[11px] uppercase tracking-[0.25em] text-concrete">
        * Full-length recordings. Headphones recommended. Neighbors warned.
      </p>
    </section>
  );
}
