"use client";

import { motion } from "motion/react";
import { PERSONA } from "@/lib/y2k-data";

const LINKS = [
  { label: "MIXES", href: "#mixes" },
  { label: "THE LAB", href: "#lab" },
  { label: "TOUR", href: "#tour" },
  { label: "BOOK", href: "#book" },
];

export function Nav() {
  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.2 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="glass flex items-center gap-1 rounded-full py-2 pl-5 pr-2 shadow-[0_8px_40px_rgba(255,47,179,0.25)] sm:gap-2">
        <a href="#top" className="mr-2 font-display text-lg tracking-wide sm:mr-4 sm:text-xl">
          <span className="chrome-text">{PERSONA}</span>
        </a>
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="candy rounded-full px-3 py-2 text-[11px] font-bold tracking-[0.18em] text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:px-4 sm:text-xs"
          >
            {l.label}
          </a>
        ))}
        <a
          href="#book"
          className="candy holo ml-1 rounded-full px-4 py-2 text-[11px] font-black tracking-[0.18em] text-[#0d0628] sm:ml-2 sm:px-5 sm:text-xs"
        >
          BOOK ★
        </a>
      </nav>
    </motion.header>
  );
}
