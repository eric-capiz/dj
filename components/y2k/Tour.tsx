"use client";

import { motion } from "motion/react";
import { TOUR } from "@/lib/y2k-data";

const STUB_COLORS = ["#ff2fb3", "#22d3ee", "#b6ff2e", "#a78bfa", "#ff9f1c"];

function statusSticker(status: string) {
  if (status === "soldout")
    return (
      <span className="sticker inline-block -rotate-6 rounded-lg bg-[#ff2fb3] px-3 py-1 font-display text-xs text-white">
        SOLD OUT ★
      </span>
    );
  if (status === "soon")
    return (
      <span className="sticker inline-block rotate-3 rounded-lg bg-[#22d3ee] px-3 py-1 font-display text-xs text-[#0d0628]">
        SOON…
      </span>
    );
  return (
    <span className="candy holo inline-block -rotate-2 rounded-lg px-4 py-1.5 font-display text-xs text-[#0d0628] transition-transform hover:scale-110">
      GET TICKETS →
    </span>
  );
}

export function Tour() {
  return (
    <section id="tour" className="relative mx-auto max-w-5xl px-4 py-24 sm:py-32">
      <div className="mb-12 text-center">
        <p className="text-xs font-black tracking-[0.5em] text-white/60">✈ ADMIT EVERYONE ✈</p>
        <h2 className="mt-3 font-display text-5xl sm:text-7xl">
          <span className="chrome-text">TOUR</span> <span className="holo-text">STUBS</span>
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        {TOUR.map((stop, i) => (
          <motion.div
            key={`${stop.date}-${stop.city}`}
            initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, rotate: 0 }}
            whileInView={{ opacity: 1, x: 0, rotate: (i % 2 === 0 ? -1 : 1) * 0.8 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 70, damping: 14 }}
            whileHover={{ scale: 1.02, rotate: 0 }}
            className="group relative"
          >
            <div
              className="ticket-perf glass relative flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10"
              style={{ borderLeft: `6px solid ${STUB_COLORS[i % STUB_COLORS.length]}` }}
            >
              {/* holographic shine */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%)",
                }}
                aria-hidden
              />
              <div className="flex items-center gap-5">
                <div
                  className="sticker flex h-16 w-16 shrink-0 rotate-[-6deg] items-center justify-center rounded-2xl font-display text-lg text-[#0d0628]"
                  style={{ background: STUB_COLORS[i % STUB_COLORS.length] }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="font-mono text-xs font-bold tracking-[0.3em] text-white/60">{stop.date}</p>
                  <p className="mt-1 font-display text-2xl sm:text-3xl">{stop.city}</p>
                  <p className="text-sm text-white/60">{stop.venue}</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="barcode hidden h-12 w-28 opacity-70 sm:block" aria-hidden />
                {statusSticker(stop.status)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
