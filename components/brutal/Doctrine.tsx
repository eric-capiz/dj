"use client";

import { DOCTRINE } from "@/lib/data";
import { Cut } from "./shared";

export function Doctrine() {
  return (
    <section className="border-b-2 border-bone/20 px-4 py-10 md:px-8 md:py-14">
      <p className="mb-6 font-grotesk text-xs font-bold uppercase tracking-[0.3em] text-safety">
        [HOUSE RULES]
      </p>
      <ul>
        {DOCTRINE.map((rule, i) => (
          <li key={rule} className="border-t-2 border-bone/20 last:border-b-2">
            <Cut delay={i * 0.05}>
              <p className="glitch-hover py-3 font-display text-2xl md:text-4xl uppercase leading-none md:py-4">
                <span className="mr-4 font-grotesk text-sm font-bold text-concrete">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {rule}
              </p>
            </Cut>
          </li>
        ))}
      </ul>
    </section>
  );
}
