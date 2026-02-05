"use client";

import { useState } from "react";
import ElectricBorder from "@/components/ElectricBorder/ElectricBorder";

export type TourShow = {
  month: string;
  day: number;
  city: string;
  state: string;
  venue: string;
};

export type TourMonth = {
  monthKey: string;
  monthName: string;
  shows: TourShow[];
};

const ELECTRIC_COLOR = "#818cf8";

export function TourDatesCarousel({ months }: { months: TourMonth[] }) {
  const [index, setIndex] = useState(0);
  const current = months[index];
  const prev = () => setIndex((i) => (i <= 0 ? months.length - 1 : i - 1));
  const next = () => setIndex((i) => (i >= months.length - 1 ? 0 : i + 1));

  if (!months.length) return null;

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="relative min-h-[320px] flex items-stretch justify-center">
        <ElectricBorder
          color={ELECTRIC_COLOR}
          speed={1}
          chaos={0.1}
          borderRadius={20}
          className="w-full max-w-md"
        >
          <div className="p-6 bg-white/3 rounded-[20px] min-h-[280px] flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 tabular-nums">
              {current.monthName} 2026
            </h3>
            <ul className="space-y-3 flex-1 text-left">
              {current.shows.map((show) => (
                <li
                  key={`${show.month}-${show.day}-${show.venue}`}
                  className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
                >
                  <span className="font-semibold text-indigo-200/90 tabular-nums shrink-0">
                    {show.month} {show.day}
                  </span>
                  <span className="text-slate-400 text-sm">
                    {show.city}, {show.state}
                  </span>
                  <span className="text-slate-300 text-sm font-medium w-full sm:w-auto">
                    {show.venue}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ElectricBorder>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous month"
          className="w-10 h-10 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-indigo-500/40 transition-colors flex items-center justify-center font-medium"
        >
          ←
        </button>
        <div className="flex gap-1.5" aria-hidden>
          {months.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === index
                  ? "bg-indigo-400 scale-125"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next month"
          className="w-10 h-10 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-indigo-500/40 transition-colors flex items-center justify-center font-medium"
        >
          →
        </button>
      </div>
    </div>
  );
}
