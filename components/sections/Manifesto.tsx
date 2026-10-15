"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { SectionTag, Reveal } from "../chrome/Reveal";

const STATEMENT =
  "I don't play tracks. I open portals — three-hour journeys from deep, hypnotic house through peak-time techno into the weightless drift after. Every set is mixed live, every transition earned.";

function Word({ children, index }: { children: string; index: number }) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0.12, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.028, 1.4), ease: [0.22, 1, 0.36, 1] }}
    >
      {children}&nbsp;
    </motion.span>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setN(Math.round((1 - Math.pow(1 - t, 3)) * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className="border-t border-white/10 pt-6">
      <div className="font-display text-5xl font-extrabold text-white md:text-6xl">
        {n}
        <span className="text-neon">{suffix}</span>
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-zinc-500">{label}</p>
    </div>
  );
}

export function Manifesto() {
  return (
    <section className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-44">
      <SectionTag index="01" label="The transmission" />
      <p className="mt-10 max-w-5xl font-display text-2xl font-semibold leading-[1.5] text-white md:text-[2.6rem] md:leading-[1.45]">
        {STATEMENT.split(" ").map((w, i) => (
          <Word key={i} index={i}>
            {w}
          </Word>
        ))}
      </p>

      <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
        <Reveal delay={0}><Stat value={240} suffix="+" label="Sets played" /></Reveal>
        <Reveal delay={0.1}><Stat value={38} suffix="" label="Cities toured" /></Reveal>
        <Reveal delay={0.2}><Stat value={11} suffix="" label="Mixes released" /></Reveal>
        <Reveal delay={0.3}><Stat value={9} suffix="yrs" label="Behind the decks" /></Reveal>
      </div>
    </section>
  );
}
