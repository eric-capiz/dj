"use client";

import { useState } from "react";
import { BOOKING_EMAIL } from "@/lib/data";
import { Cut, SectionHead } from "./shared";

const inputCls =
  "w-full border-2 border-bone bg-ink px-3 py-3 font-grotesk text-sm text-bone placeholder:text-concrete/60 focus:border-safety focus:outline-none";

export function Booking() {
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = `BOOKING REQUEST — ${data.get("name") || "UNKNOWN"} / ${data.get("date") || "TBD"}`;
    const body = [
      `NAME: ${data.get("name")}`,
      `EMAIL: ${data.get("email")}`,
      `DATE: ${data.get("date")}`,
      `VENUE / CITY: ${data.get("venue")}`,
      ``,
      `THE NIGHT:`,
      `${data.get("details")}`,
    ].join("\n");
    window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(
      String(subject),
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section id="book" className="scroll-mt-14 border-t-4 border-safety px-4 py-12 md:px-8 md:py-16">
      <SectionHead
        index="05"
        title="Book"
        note="Warehouses, basements, black boxes. No weddings."
      />
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div>
          <Cut>
            <p className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
              Bring the
              <br />
              <span className="text-safety">system.</span>
            </p>
          </Cut>
          <div className="mt-6 space-y-2 font-grotesk text-xs uppercase tracking-[0.2em] text-concrete">
            <p>— Direct: {BOOKING_EMAIL}</p>
            <p>— Replies within 48 hours</p>
            <p>— No spam. No list. No nonsense.</p>
          </div>
          <div className="hazard mt-8 h-4 w-48" />
        </div>

        {sent ? (
          <div className="flex min-h-64 flex-col items-start justify-center border-2 border-acid p-8">
            <p className="stamp px-4 py-2 font-grotesk text-sm font-bold uppercase text-acid">
              Transmitted
            </p>
            <p className="mt-6 font-grotesk text-sm uppercase leading-relaxed tracking-[0.1em]">
              Your email client should be open with the request addressed and
              ready. Hit send.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 border-2 border-bone px-4 py-2 font-grotesk text-xs font-bold uppercase tracking-[0.2em] hover:bg-bone hover:text-ink"
            >
              Write another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="border-2 border-bone bg-coal p-4 md:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block font-grotesk text-[11px] font-bold uppercase tracking-[0.25em] text-concrete">
                  Name *
                </span>
                <input name="name" required placeholder="PROMOTER X" className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block font-grotesk text-[11px] font-bold uppercase tracking-[0.25em] text-concrete">
                  Email *
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@venue.com"
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="mb-1 block font-grotesk text-[11px] font-bold uppercase tracking-[0.25em] text-concrete">
                  Event date
                </span>
                <input name="date" placeholder="2027-02-13" className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block font-grotesk text-[11px] font-bold uppercase tracking-[0.25em] text-concrete">
                  Venue / City
                </span>
                <input name="venue" placeholder="TRESOR — BERLIN" className={inputCls} />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block font-grotesk text-[11px] font-bold uppercase tracking-[0.25em] text-concrete">
                  The night *
                </span>
                <textarea
                  name="details"
                  required
                  rows={4}
                  placeholder="ROOM CAPACITY, SYSTEM, SET LENGTH, WHAT KIND OF DAMAGE…"
                  className={inputCls}
                />
              </label>
            </div>
            <button
              type="submit"
              className="hard-shadow-sm mt-5 w-full border-2 border-safety bg-safety px-6 py-4 font-display text-2xl uppercase text-ink transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Transmit booking request
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
