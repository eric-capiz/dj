"use client";

import { motion } from "motion/react";
import { SOCIALS, PERSONA } from "@/lib/y2k-data";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-white/15 pt-16">
      <div className="mx-auto max-w-6xl px-4">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
          className="chrome-text text-center font-display text-[16vw] leading-none sm:text-[11rem]"
        >
          {PERSONA}
        </motion.p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="candy glass rounded-full px-5 py-2.5 text-xs font-black tracking-[0.25em] text-white/80 transition-transform hover:scale-110 hover:text-white"
            >
              {s.label.toUpperCase()}
            </a>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-[11px] tracking-[0.2em] text-white/40 sm:flex-row">
          <p>© 2026 {PERSONA} — ALL FREQUENCIES RESERVED</p>
          <p>PHOTOS: PEXELS ★ MADE OF 100% RECYCLED PIXELS</p>
        </div>
      </div>
      <div className="holo h-3" aria-hidden />
    </footer>
  );
}
