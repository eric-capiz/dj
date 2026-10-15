"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Countdown, Reveal } from "./ui";

const HERO_CREDIT = "Alena Darmel / Pexels";

export function Hero() {
  return (
    <section id="top" className="grain relative flex min-h-[100svh] items-end overflow-hidden">
      <Image
        src="/img/dj-hero.webp"
        alt="Eric Capiz performing live"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-28 pt-36 md:px-8 md:pb-32">
        <Reveal>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-amber">
            DJ · Producer — Chicago → Denver
          </p>
        </Reveal>
        <motion.h1
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[17vw] font-extrabold leading-[0.92] tracking-tight text-bone sm:text-7xl md:text-8xl"
        >
          ERIC
          <br />
          CAPIZ
        </motion.h1>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-lg text-bone/80">
            House and techno, played patient. Long blends, deep grooves early —
            pressure late.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#music"
              className="rounded-full bg-bone px-7 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Listen to the mixes
            </a>
            <a
              href="#book"
              className="rounded-full border border-bone/30 px-7 py-3 text-sm font-semibold text-bone transition-colors hover:border-amber hover:text-amber"
            >
              Book Eric
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.35}>
          <div className="mt-12 border-t border-white/15 pt-8">
            <Countdown />
          </div>
        </Reveal>
      </div>

      <p className="absolute bottom-5 right-5 z-10 hidden text-[11px] text-bone/50 md:block">
        Photo: {HERO_CREDIT}
      </p>
    </section>
  );
}
