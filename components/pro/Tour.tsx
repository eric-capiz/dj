"use client";

import { useMemo, useState } from "react";
import { TOUR, formatTourDate, type TourDate } from "@/lib/pro-data";
import { Reveal, SectionHeading } from "./ui";

const STATUS_LABEL: Record<TourDate["status"], string> = {
  tickets: "Tickets",
  low: "Low tickets",
  soldout: "Sold out",
  soon: "On sale soon",
};

function downloadIcs(show: TourDate) {
  const start = new Date(show.datetime);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.getFullYear().toString().padStart(4, "0") +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0") +
    "T" +
    String(d.getHours()).padStart(2, "0") +
    String(d.getMinutes()).padStart(2, "0") +
    "00";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Eric Capiz//Tour//EN",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}-ericcapiz@dj`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:Eric Capiz — ${show.city}`,
    `LOCATION:${show.venue}\\, ${show.city}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `eric-capiz-${show.city.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function Tour() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOUR;
    return TOUR.filter(
      (t) =>
        t.city.toLowerCase().includes(q) ||
        t.venue.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section id="tour" className="scroll-mt-20 border-y border-line bg-coal py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="On tour"
          title="Upcoming dates"
          blurb="New dates are added as they're confirmed. Add any show straight to your calendar."
        />

        <Reveal className="mb-8">
          <label className="block max-w-sm">
            <span className="sr-only">Search by city or venue</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by city or venue…"
              className="w-full rounded-full border border-line bg-ink px-5 py-3 text-sm text-bone placeholder:text-muted/70 focus:border-amber focus:outline-none"
            />
          </label>
        </Reveal>

        <div className="overflow-hidden rounded-2xl border border-line">
          {filtered.map((show, i) => {
            const d = formatTourDate(show.datetime);
            return (
              <Reveal key={show.datetime + show.venue} delay={Math.min(i * 0.03, 0.2)}>
                <div className="grid grid-cols-[auto_1fr] items-center gap-4 border-b border-line bg-ink p-5 transition-colors last:border-b-0 hover:bg-[#101012] sm:grid-cols-[auto_1fr_auto] md:gap-8 md:p-6">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-3xl font-bold tabular-nums text-bone md:text-4xl">
                      {d.day}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                      {d.month}
                      <br />
                      {d.year}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-bold text-bone">
                      {show.city}
                    </p>
                    <p className="truncate text-sm text-muted">
                      {d.weekday} · {show.venue}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${
                        show.status === "soldout"
                          ? "bg-white/10 text-muted"
                          : show.status === "soon"
                            ? "border border-line text-muted"
                            : show.status === "low"
                              ? "bg-amber/15 text-amber"
                              : "bg-amber text-ink"
                      }`}
                    >
                      {STATUS_LABEL[show.status]}
                    </span>
                    <button
                      onClick={() => downloadIcs(show)}
                      className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-bone transition-colors hover:border-amber hover:text-amber"
                      aria-label={`Add ${show.city} show to calendar`}
                    >
                      Add to calendar
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
          {filtered.length === 0 && (
            <p className="bg-ink p-10 text-center text-muted">
              No dates match “{query}”. Try another city.
            </p>
          )}
        </div>

        <Reveal className="mt-8">
          <p className="text-sm text-muted">
            Promoters: routing inquiries and availability via the{" "}
            <a href="#book" className="font-semibold text-amber hover:underline">
              booking form
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
