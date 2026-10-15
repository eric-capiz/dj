"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Hard-cut reveal: clip-path wipe, no easing. */
export function Cut({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.28, delay, ease: "linear" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Stamped section header: number / title / rule. */
export function SectionHead({
  index,
  title,
  note,
}: {
  index: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="mb-8 md:mb-12">
      <Cut>
        <div className="flex items-baseline gap-4 border-b-4 border-bone pb-3">
          <span className="font-grotesk text-sm font-bold text-safety">
            [{index}]
          </span>
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-none tracking-tight">
            {title}
          </h2>
        </div>
      </Cut>
      {note && (
        <p className="mt-3 font-grotesk text-xs md:text-sm uppercase tracking-[0.2em] text-concrete">
          {note}
        </p>
      )}
    </div>
  );
}

/** Infinite marquee ticker. */
export function Ticker({
  items,
  fast,
  inverted,
}: {
  items: string[];
  fast?: boolean;
  inverted?: boolean;
}) {
  const row = [...items, ...items, ...items];
  return (
    <div
      className={`overflow-hidden border-y-4 py-2 select-none ${
        inverted
          ? "border-ink bg-safety text-ink"
          : "border-bone/25 bg-ink text-bone"
      }`}
    >
      <div className={`marquee-track ${fast ? "fast" : ""}`}>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center font-display text-xl md:text-2xl uppercase whitespace-nowrap"
              >
                <span className="px-4">{item}</span>
                <span className={inverted ? "text-ink" : "text-safety"}>///</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
