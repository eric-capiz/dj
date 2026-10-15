"use client";

import { TOUR } from "@/lib/data";
import { Cut, SectionHead } from "./shared";

function StatusMark({ status }: { status: "tickets" | "soldout" | "soon" }) {
  if (status === "tickets") {
    return (
      <span className="hard-shadow-sm inline-block border-2 border-safety bg-safety px-4 py-1.5 font-grotesk text-xs font-bold uppercase tracking-[0.2em] text-ink">
        Tickets
      </span>
    );
  }
  if (status === "soldout") {
    return (
      <span className="stamp inline-block px-4 py-1.5 font-grotesk text-xs font-bold uppercase text-safety">
        Sold out
      </span>
    );
  }
  return (
    <span className="inline-block border-2 border-dashed border-concrete px-4 py-1.5 font-grotesk text-xs font-bold uppercase tracking-[0.2em] text-concrete">
        Soon
      </span>
  );
}

export function Tour() {
  return (
    <section id="tour" className="scroll-mt-14 px-4 py-12 md:px-8 md:py-16">
      <SectionHead
        index="03"
        title="Tour"
        note="2026 / 2027 — basements, warehouses, black boxes."
      />
      <ul className="border-2 border-bone">
        {TOUR.map((stop, i) => (
          <li
            key={`${stop.date}-${stop.city}`}
            className="group grid grid-cols-[1fr_auto] items-center gap-3 border-b-2 border-bone/20 px-4 py-4 transition-colors last:border-b-0 hover:bg-safety hover:text-ink md:grid-cols-[10rem_1fr_1fr_auto] md:px-6 md:py-5"
          >
            <Cut delay={Math.min(i * 0.03, 0.2)}>
              <span className="font-grotesk text-sm font-bold tabular-nums tracking-[0.1em] text-safety group-hover:text-ink">
                {stop.date}
              </span>
            </Cut>
            <span className="font-display text-xl md:text-3xl uppercase leading-none">
              {stop.city}
            </span>
            <span className="hidden font-grotesk text-xs uppercase tracking-[0.2em] opacity-70 md:block">
              {stop.venue}
            </span>
            <span className="col-span-2 md:col-span-1 md:justify-self-end">
              <StatusMark status={stop.status} />
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-grotesk text-[11px] uppercase tracking-[0.25em] text-concrete">
        * Promoters: the rider is one (1) folding table and zero (0) sparklers.
      </p>
    </section>
  );
}
