"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TOUR } from "@/lib/data";
import { SectionTag, Reveal } from "../chrome/Reveal";
import { scrollToSection } from "@/lib/scroll";

const PREVIEW_IMGS = [
  "/img/dj-gallery-2.webp",
  "/img/dj-gallery-3.webp",
  "/img/dj-gallery-4.webp",
  "/img/dj-gallery-1.webp",
];

export function TourDates() {
  const [hover, setHover] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <section
      id="tour"
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-44"
    >
      <SectionTag index="04" label="On tour — 2026 / 27" />
      <Reveal>
        <h2 className="mt-10 font-display text-4xl font-extrabold text-white md:text-6xl">
          Catch the <span className="text-outline-neon">transmission</span> live.
        </h2>
      </Reveal>

      <div className="relative mt-14">
        {/* floating hover preview (desktop) */}
        <AnimatePresence>
          {hover !== null && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 3 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute z-20 hidden h-56 w-44 overflow-hidden rounded-2xl border border-white/15 shadow-2xl lg:block"
              style={{ left: pos.x + 24, top: pos.y - 112 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PREVIEW_IMGS[hover % PREVIEW_IMGS.length]}
                alt=""
                className="h-full w-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {TOUR.map((stop, i) => (
          <Reveal key={stop.date + stop.city} delay={Math.min(i * 0.03, 0.25)} y={20}>
            <div
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-white/10 py-6 transition-colors last:border-b md:grid-cols-[140px_1fr_1fr_auto] md:gap-8 md:py-8"
            >
              {/* hover sweep */}
              <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-neon/15 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />

              <span className="relative font-display text-xs font-bold tracking-[0.2em] text-pulse md:text-sm">
                {stop.date}
              </span>
              <span className="relative">
                <span className="block font-display text-lg font-bold text-white transition-transform duration-300 group-hover:translate-x-2 md:text-2xl">
                  {stop.city}
                </span>
                <span className="mt-1 block text-sm text-zinc-500">{stop.venue}</span>
              </span>
              <span className="relative hidden md:block" />
              <span className="relative">
                {stop.status === "tickets" ? (
                  <button
                    onClick={() => scrollToSection("#booking")}
                    className="rounded-full border border-white/20 px-5 py-2.5 font-display text-[11px] font-bold tracking-[0.2em] text-white transition-all hover:border-neon hover:bg-neon md:px-6"
                  >
                    TICKETS
                  </button>
                ) : stop.status === "soldout" ? (
                  <span className="inline-block rounded-full border border-white/10 px-5 py-2.5 font-display text-[11px] font-bold tracking-[0.2em] text-zinc-600 line-through">
                    SOLD OUT
                  </span>
                ) : (
                  <span className="inline-block rounded-full border border-pulse/40 px-5 py-2.5 font-display text-[11px] font-bold tracking-[0.2em] text-pulse">
                    SOON
                  </span>
                )}
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-8 text-sm text-zinc-500">
          Your city not listed? <button onClick={() => scrollToSection("#booking")} className="text-neon underline underline-offset-4 hover:text-white">Request a date</button> — the ship goes where the signal is strongest.
        </p>
      </Reveal>
    </section>
  );
}
