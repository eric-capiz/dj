"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePlayer } from "@/lib/player";
import { TRACKS, formatClock } from "@/lib/pro-data";

function Visualizer({ analyser, playing }: { analyser: AnalyserNode | null; playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const data = new Uint8Array(analyser ? analyser.frequencyBinCount : 32);
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      if (analyser && playing) analyser.getByteFrequencyData(data);
      else if (!playing) data.fill(0);
      const bars = 28;
      const gap = 2;
      const bw = (width - gap * (bars - 1)) / bars;
      for (let i = 0; i < bars; i++) {
        const v = analyser ? data[Math.floor((i / bars) * data.length)] / 255 : 0;
        const h = Math.max(2, v * height);
        ctx.fillStyle = "rgba(232,180,74,0.9)";
        ctx.fillRect(i * (bw + gap), height - h, bw, h);
      }
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [analyser, playing]);

  return <canvas ref={canvasRef} width={140} height={36} className="h-9 w-[140px]" aria-hidden />;
}

export function StickyPlayer() {
  const p = usePlayer();
  const seekRef = useRef<HTMLInputElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Publish the player's rendered height (+ breathing room) as a CSS variable
  // so page content can reserve clearance and the fixed bar never covers it.
  // Re-measured on resize via ResizeObserver (height differs across widths).
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const root = document.documentElement;
    const apply = () => {
      const h = Math.ceil(bar.getBoundingClientRect().height);
      root.style.setProperty("--player-clearance", `${h + 16}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  const progress = p.duration > 0 ? (p.currentTime / p.duration) * 100 : 0;

  return (
    <>
      {/* Queue drawer */}
      <AnimatePresence>
        {p.queueOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60"
              onClick={() => p.setQueueOpen(false)}
            />
            <motion.aside
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-[61] max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-line bg-coal p-5 md:left-auto md:right-6 md:w-[420px] md:rounded-2xl md:border"
              role="dialog"
              aria-label="Up next"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-bone">Up next</h3>
                <button
                  onClick={() => p.setQueueOpen(false)}
                  className="rounded-full px-3 py-1 text-sm text-muted hover:bg-white/5 hover:text-bone"
                >
                  Close
                </button>
              </div>
              <ol className="flex flex-col">
                {TRACKS.map((t, i) => (
                  <li key={t.src}>
                    <button
                      onClick={() => p.play(i)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/5 ${
                        i === p.index ? "bg-white/5" : ""
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`text-xs tabular-nums ${i === p.index ? "text-amber" : "text-muted"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span className={`block text-sm font-medium ${i === p.index ? "text-amber" : "text-bone"}`}>
                            {t.name}
                          </span>
                          <span className="block text-xs text-muted">
                            {t.genre} · {t.bpm} BPM
                          </span>
                        </span>
                      </span>
                      <span className="text-xs tabular-nums text-muted">
                        {p.durations[t.src] ? formatClock(p.durations[t.src]) : "––:––"}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Player bar */}
      <div
        ref={barRef}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ink/92 backdrop-blur-md"
      >
        {/* Seek */}
        <button
          className="group relative block h-4 w-full cursor-pointer"
          aria-label="Seek"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            if (p.duration > 0) p.seek(ratio * p.duration);
          }}
        >
          <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-white/10">
            <span className="block h-full bg-amber transition-[width]" style={{ width: `${progress}%` }} />
          </span>
        </button>

        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 pb-3 pt-1 md:gap-5 md:px-8">
          {/* Transport */}
          <div className="flex items-center gap-1">
            <button
              onClick={p.prev}
              aria-label="Previous track"
              className="rounded-full p-2 text-bone/80 transition-colors hover:bg-white/5 hover:text-bone"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M6 5h2v14H6zM20 5v14L9 12z" />
              </svg>
            </button>
            <button
              onClick={p.toggle}
              aria-label={p.playing ? "Pause" : "Play"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-amber text-ink transition-transform hover:scale-105"
            >
              {p.playing ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              onClick={p.next}
              aria-label="Next track"
              className="rounded-full p-2 text-bone/80 transition-colors hover:bg-white/5 hover:text-bone"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
              </svg>
            </button>
          </div>

          {/* Meta */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-bone">{p.track.name}</p>
            <p className="truncate text-xs text-muted">
              {p.track.genre} · {p.track.bpm} BPM · {formatClock(p.currentTime)} / {formatClock(p.duration)}
            </p>
          </div>

          {/* Visualizer (desktop) */}
          <div className="hidden md:block">
            <Visualizer analyser={p.analyser} playing={p.playing} />
          </div>

          {/* Volume (desktop) */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={p.toggleMute}
              aria-label={p.muted ? "Unmute" : "Mute"}
              className="p-1 text-bone/70 hover:text-bone"
            >
              {p.muted || p.volume === 0 ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M11 5 6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M11 5 6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
                </svg>
              )}
            </button>
            <input
              ref={seekRef}
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={p.muted ? 0 : p.volume}
              onChange={(e) => p.setVolume(Number(e.target.value))}
              className="slider w-24"
              aria-label="Volume"
            />
          </div>

          {/* Queue */}
          <button
            onClick={() => p.setQueueOpen(true)}
            aria-label="Open queue"
            className="rounded-full p-2 text-bone/80 transition-colors hover:bg-white/5 hover:text-bone"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
