"use client";

import { usePlayer } from "@/lib/player";
import { TRACKS, formatClock } from "@/lib/pro-data";
import { Reveal, SectionHeading } from "./ui";

export function Music() {
  const p = usePlayer();

  return (
    <section id="music" className="scroll-mt-20 bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Music"
          title="Latest mixes"
          blurb="Studio sessions, recorded live in one take. Press play — the bar at the bottom keeps playing while you browse."
        />

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((t, i) => {
            const active = i === p.index;
            return (
              <Reveal key={t.src} delay={(i % 3) * 0.06}>
                <button
                  onClick={() => (active ? p.toggle() : p.play(i))}
                  className={`group flex h-full w-full flex-col justify-between gap-6 bg-coal p-6 text-left transition-colors hover:bg-[#17171a] ${
                    active ? "ring-1 ring-inset ring-amber/60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
                        active && p.playing
                          ? "bg-amber text-ink"
                          : "bg-white/8 text-bone group-hover:bg-amber group-hover:text-ink"
                      }`}
                    >
                      {active && p.playing ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-bone">{t.name}</h3>
                    <p className="mt-2 text-sm text-muted">
                      {t.genre} · {t.bpm} BPM ·{" "}
                      <span className="tabular-nums">
                        {p.durations[t.src] ? formatClock(p.durations[t.src]) : "––:––"}
                      </span>
                    </p>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
