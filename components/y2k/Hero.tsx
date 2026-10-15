"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { webglAvailable } from "./ChromeStage";

const ChromeStage = dynamic(() => import("./ChromeStage").then((m) => m.ChromeStage), {
  ssr: false,
  loading: () => null,
});

/** Magnetic wrapper: element gravitates toward the cursor. */
function Magnetic({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14 });
  const sy = useSpring(y, { stiffness: 180, damping: 14 });
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="inline-block"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

const TICKER = "11 FRESH MIXES ★ CHICAGO → BERLIN → TOKYO ★ BOOKING OPEN ★ 100% HUMAN ★ NO SKIPS ★ ";

export function Hero() {
  const [gl, setGl] = useState(true);
  useEffect(() => {
    setGl(webglAvailable());
  }, []);

  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden">
      {gl && <ChromeStage />}

      {/* overlay copy */}
      <div className="pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.15 }}
          className="sticker holo animate-float rounded-full px-5 py-2 text-xs font-black tracking-[0.3em] text-[#0d0628] sm:text-sm"
        >
          ★ ERIC CAPIZ ON THE DECKS ★
        </motion.div>

        <h1 className="mt-6 font-display leading-[0.85]">
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 13, delay: 0.3 }}
            className="chrome-text block text-[19vw] drop-shadow-[0_10px_30px_rgba(255,47,179,0.35)] sm:text-[15vw] lg:text-[11rem]"
          >
            CHROME
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 13, delay: 0.45 }}
            className="holo-text block text-[19vw] sm:text-[15vw] lg:text-[11rem]"
          >
            //EC
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-6 max-w-xl text-balance text-base text-white/75 sm:text-lg"
        >
          Hyperpop pressure, bubblegum bass &amp; chrome-plated club energy —
          beamed live from Chicago to everywhere.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <a
              href="#mixes"
              className="candy holo rounded-full px-8 py-4 font-display text-lg tracking-wide text-[#0d0628] shadow-[0_10px_36px_rgba(255,47,179,0.45)] transition-transform hover:scale-105"
            >
              ▶ PRESS PLAY
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#lab"
              className="candy glass rounded-full px-8 py-4 font-display text-lg tracking-wide text-white transition-transform hover:scale-105"
            >
              ENTER THE LAB ⚗
            </a>
          </Magnetic>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="relative z-10 pb-24 text-center text-xs font-bold tracking-[0.4em] text-white/60"
      >
        SCROLL ↓
      </motion.div>

      {/* ticker */}
      <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-y-2 border-white/20 bg-black/40 py-3 backdrop-blur-md">
        <div className="animate-marquee flex w-max whitespace-nowrap font-display text-sm tracking-[0.2em] text-white/90">
          <span className="pr-8">{TICKER.repeat(3)}</span>
          <span className="pr-8" aria-hidden>{TICKER.repeat(3)}</span>
        </div>
      </div>
    </section>
  );
}
