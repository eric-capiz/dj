"use client";

import { SOCIALS } from "@/lib/data";
import { Ticker } from "./shared";

export function Footer() {
  return (
    <footer className="border-t-4 border-bone">
      <Ticker
        fast
        items={[
          "BASSMENT",
          "Eric Capiz",
          "Chicago — Worldwide",
          "130+ BPM",
          "No requests",
        ]}
      />
      <div className="overflow-hidden px-2 pt-8">
        <p className="glitch-hover font-display uppercase leading-[0.82] tracking-tight text-[18vw] text-bone">
          BASSMENT
        </p>
      </div>
      <div className="grid gap-6 border-t-2 border-bone/20 px-4 py-8 font-grotesk text-[11px] uppercase tracking-[0.2em] text-concrete md:grid-cols-3 md:px-8">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-bone hover:bg-safety hover:text-ink hover:px-1"
            >
              {s.label}
            </a>
          ))}
        </div>
        <p className="leading-relaxed">
          Photos: Alena Darmel, Xuân Thống Trần, Caio Rosendo, MART PRODUCTION
          via Pexels.
        </p>
        <p className="leading-relaxed md:text-right">
          © 2026 Bassment — all frequencies reserved.
          <br />
          No cosmos were harmed.
        </p>
      </div>
      <div className="hazard h-4" />
    </footer>
  );
}
