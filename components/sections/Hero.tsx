"use client";

import { motion } from "motion/react";
import { CosmicCanvas } from "./CosmicCanvas";
import { Marquee, MarqueeItem } from "../chrome/Marquee";
import { MagneticButton } from "../chrome/MagneticButton";
import { scrollToSection } from "@/lib/scroll";

const EASE = [0.22, 1, 0.36, 1] as const;

function StaggerWord({ word, index, ready }: { word: string; index: number; ready: boolean }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
      <motion.span
        className="inline-block will-change-transform"
        initial={{ y: "115%" }}
        animate={ready ? { y: "0%" } : {}}
        transition={{ duration: 1, delay: 0.15 + index * 0.055, ease: EASE }}
      >
        {word}
      </motion.span>
    </span>
  );
}

export function Hero({ introReady }: { introReady: boolean }) {
  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="absolute inset-0">
        <CosmicCanvas className="h-full w-full" />
      </div>
      {/* vignette + bottom fade */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,8,0.75)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-void to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-5 pt-28 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={introReady ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-6 flex items-center gap-4"
        >
          <span className="h-2 w-2 animate-pulse-glow rounded-full bg-pulse" />
          <p className="text-xs uppercase tracking-[0.45em] text-zinc-400">
            Transmission 001 — Chicago, Earth
          </p>
        </motion.div>

        <h1 className="font-display font-extrabold leading-[0.95] tracking-tight">
          <span className="block text-[15.5vw] text-white md:text-[11vw]">
            <StaggerWord word="COSMIC" index={0} ready={introReady} />
          </span>
          <span className="text-outline block text-[15.5vw] md:text-[11vw]">
            <StaggerWord word="DRIFT" index={1} ready={introReady} />
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={introReady ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="max-w-md text-base leading-relaxed text-zinc-400 md:text-lg"
          >
            Deep house, techno and cosmic grooves — beamed from Chicago
            dancefloors to the far edge of the night. Press play. Stay for
            the drop.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={introReady ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.65, ease: EASE }}
            className="flex flex-wrap items-center gap-4"
          >
            <MagneticButton>
              <button
                onClick={() => scrollToSection("#mixes")}
                className="group flex items-center gap-3 rounded-full bg-white px-7 py-4 font-display text-xs font-bold tracking-[0.2em] text-void transition-colors hover:bg-neon hover:text-white"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-void text-white transition-colors group-hover:bg-white group-hover:text-void">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M2 1l7 4-7 4z" />
                  </svg>
                </span>
                LISTEN
              </button>
            </MagneticButton>
            <MagneticButton>
              <button
                onClick={() => scrollToSection("#deck")}
                className="rounded-full border border-white/25 px-7 py-4 font-display text-xs font-bold tracking-[0.2em] text-white backdrop-blur transition-colors hover:border-neon hover:text-neon"
              >
                TOUCH THE DECK
              </button>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={introReady ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 1 }}
        className="relative z-10 mx-auto mb-6 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute left-0 top-0 h-1/2 w-full bg-pulse"
            animate={{ y: ["-100%", "220%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>

      {/* ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={introReady ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 1 }}
        className="relative z-10 border-t border-white/10 bg-void/60 py-4 backdrop-blur"
      >
        <Marquee>
          {["World tour 2026/27", "Booking open", "11 mixes out now", "Chicago → Berlin → Tokyo"].map(
            (t) => (
              <MarqueeItem key={t}>
                <span className="font-display text-sm tracking-[0.2em] text-zinc-300">{t}</span>
              </MarqueeItem>
            ),
          )}
        </Marquee>
      </motion.div>
    </section>
  );
}
