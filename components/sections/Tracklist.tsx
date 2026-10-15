"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useAudio } from "@/lib/use-audio";
import { formatTime } from "@/lib/data";
import { SectionTag, Reveal } from "../chrome/Reveal";

function LiveEq({ active }: { active: boolean }) {
  const { levels, isPlaying } = useAudio();
  const barsRef = useRef<HTMLDivElement>(null);
  const BARS = 18;

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      const lv = levels(BARS);
      const el = barsRef.current;
      if (el) {
        const kids = el.children;
        for (let i = 0; i < BARS && i < kids.length; i++) {
          const v = isPlaying ? lv[i] : 0.06 + 0.05 * Math.sin(performance.now() / 500 + i * 0.7);
          (kids[i] as HTMLElement).style.transform = `scaleY(${Math.max(0.08, v)})`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, levels, isPlaying]);

  return (
    <div ref={barsRef} className="flex h-8 items-end gap-[3px]" aria-hidden>
      {Array.from({ length: BARS }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] origin-bottom rounded-full bg-gradient-to-t from-neon to-pulse"
          style={{ height: "100%", transform: "scaleY(0.08)" }}
        />
      ))}
    </div>
  );
}

export function Tracklist() {
  const {
    tracks,
    trackIndex,
    isPlaying,
    progress,
    duration,
    durations,
    playTrack,
    toggleTrack,
    seek,
  } = useAudio();

  const onSeek = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    seek((e.clientX - r.left) / r.width);
  };

  return (
    <section id="mixes" className="relative border-t border-white/5 bg-panel/40">
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-44">
        <SectionTag index="03" label="The mixes — press play" />
        <Reveal>
          <h2 className="mt-10 font-display text-4xl font-extrabold text-white md:text-6xl">
            Eleven transmissions,
            <br />
            <span className="text-outline">zero skips.</span>
          </h2>
        </Reveal>

        <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-void/60">
          {tracks.map((t, i) => {
            const active = i === trackIndex;
            return (
              <div key={t.src}>
                <motion.button
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.55, delay: Math.min(i * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => (active ? toggleTrack() : playTrack(i))}
                  className={`group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 text-left transition-colors md:grid-cols-[auto_1fr_auto_auto_auto] md:gap-8 md:px-8 md:py-5 ${
                    active ? "bg-neon/10" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`font-display text-xs tabular-nums ${
                      active ? "text-neon" : "text-zinc-600"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="min-w-0">
                    <span
                      className={`block truncate font-display text-sm font-bold tracking-wide transition-transform duration-300 md:text-base ${
                        active ? "text-white" : "text-zinc-200 group-hover:translate-x-2 group-hover:text-white"
                      }`}
                    >
                      {t.name}
                    </span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.25em] text-zinc-500">
                      {t.style} — {t.bpm} BPM
                    </span>
                    {active && (
                      <span
                        className="mt-3 block h-[3px] w-full cursor-pointer rounded-full bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSeek(e);
                        }}
                        role="slider"
                        aria-label="Seek"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(progress * 100)}
                      >
                        <span
                          className="block h-full rounded-full bg-gradient-to-r from-neon to-pulse"
                          style={{ width: `${progress * 100}%` }}
                        />
                      </span>
                    )}
                  </span>

                  <span className="hidden md:block">
                    <LiveEq active={active} />
                  </span>

                  <span className="text-xs tabular-nums text-zinc-500">
                    {formatTime(active ? duration : durations[i])}
                  </span>

                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full border transition-all ${
                      active
                        ? "border-neon bg-neon text-white"
                        : "border-white/15 text-white group-hover:border-neon group-hover:text-neon"
                    }`}
                  >
                    {active && isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M3 2h3v10H3zM8 2h3v10H8z" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M3 2l8 5-8 5z" />
                      </svg>
                    )}
                  </span>
                </motion.button>
                {i < tracks.length - 1 && <div className="h-px bg-white/5" />}
              </div>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-6 text-center text-xs uppercase tracking-[0.35em] text-zinc-600">
            Real audio — mixed & mastered by Cosmic Drift
          </p>
        </Reveal>
      </div>
    </section>
  );
}
