"use client";

import { useEffect, useState } from "react";
import { Ticker } from "./shared";

function useChicagoClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "America/Chicago",
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function Hero() {
  const clock = useChicagoClock();
  return (
    <section id="top" className="relative pt-14">
      {/* status strip */}
      <div className="flex items-center justify-between border-b-2 border-bone/20 px-4 py-2 font-grotesk text-[11px] font-bold uppercase tracking-[0.25em] md:px-8">
        <span className="flex items-center gap-2">
          <span className="blink-hard inline-block h-2.5 w-2.5 bg-safety" />
          ON AIR
        </span>
        <span className="hidden sm:inline text-concrete">
          EST. CHICAGO — WAREHOUSE UNIT 0047
        </span>
        <span className="tabular-nums">CHI {clock}</span>
      </div>

      {/* giant stacked type, cropped by viewport */}
      <div className="overflow-hidden px-2 pt-6 md:pt-10">
        <h1 className="font-display uppercase leading-[0.82] tracking-tight">
          <span className="block text-[26vw] md:text-[22vw]">BASS</span>
          <span className="block text-[26vw] md:text-[22vw] text-safety">
            MENT
          </span>
        </h1>
      </div>

      <div className="flex flex-col gap-6 px-4 pb-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div className="max-w-xl">
          <p className="font-grotesk text-sm md:text-base font-bold uppercase leading-relaxed">
            Eric Capiz — selector.
            <br />
            Warehouse techno / hard groove / raw electronics.
          </p>
          <p className="mt-2 font-grotesk text-xs uppercase tracking-[0.2em] text-concrete">
            130+ BPM. Four walls. No requests.
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="#mixes"
            className="hard-shadow-sm border-2 border-bone bg-bone px-6 py-3 font-display text-xl uppercase text-ink transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            Listen
          </a>
          <a
            href="#booth"
            className="hard-shadow-sm border-2 border-safety bg-safety px-6 py-3 font-display text-xl uppercase text-ink transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            The Booth
          </a>
        </div>
      </div>

      <Ticker
        inverted
        items={[
          "11 mixes out now",
          "Chicago — Detroit — Berlin",
          "Tour 2026/27",
          "Booking open",
          "No headliners",
        ]}
      />
      <div className="hazard h-4" />
    </section>
  );
}
