"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { nextShow } from "@/lib/pro-data";

/** Subtle scroll reveal — professional, never flashy. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
}) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber">
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl font-bold tracking-tight text-bone md:text-5xl">
        {title}
      </h2>
      {blurb ? <p className="mt-4 max-w-2xl text-muted">{blurb}</p> : null}
    </Reveal>
  );
}

/** Live countdown to the next upcoming tour date. Timezone-safe: compares absolute times. */
export function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  const show = nextShow(now);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!show) {
    return (
      <p className="text-sm uppercase tracking-[0.2em] text-muted">
        New dates announced soon
      </p>
    );
  }

  const target = new Date(show.datetime).getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const secs = Math.floor((diff % 60_000) / 1000);

  const units: Array<[string, string]> = [
    [String(days).padStart(2, "0"), "days"],
    [String(hours).padStart(2, "0"), "hrs"],
    [String(mins).padStart(2, "0"), "min"],
    [String(secs).padStart(2, "0"), "sec"],
  ];

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber">
        Next show — {show.city} · {show.venue}
      </p>
      <div className="flex gap-5 md:gap-8">
        {units.map(([v, label]) => (
          <div key={label}>
            <div className="font-display text-4xl font-bold tabular-nums text-bone md:text-5xl">
              {v}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
