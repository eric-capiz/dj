"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/** Fade-and-rise scroll reveal. */
export function Reveal({ children, delay = 0, y = 36, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface SectionTagProps {
  index: string;
  label: string;
}

/** Numbered section eyebrow, e.g. "01 — THE DECK". */
export function SectionTag({ index, label }: SectionTagProps) {
  return (
    <Reveal>
      <div className="flex items-center gap-4">
        <span className="font-display text-xs text-neon">{index}</span>
        <span className="h-px w-12 bg-neon/60" />
        <span className="text-xs uppercase tracking-[0.4em] text-zinc-400">{label}</span>
      </div>
    </Reveal>
  );
}
