"use client";

import { BOOKING_EMAIL, SOCIALS } from "@/lib/pro-data";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink pb-32 pt-16 md:pb-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="font-display text-[13vw] font-extrabold leading-none tracking-tight text-bone/95 md:text-8xl">
          ERIC CAPIZ
        </p>

        <div className="mt-12 grid gap-10 border-t border-line pt-10 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Booking</p>
            <a
              href={`mailto:${BOOKING_EMAIL}`}
              className="mt-2 block font-medium text-bone hover:text-amber"
            >
              {BOOKING_EMAIL}
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Follow</p>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-bone hover:text-amber"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Photos</p>
            <p className="mt-2 text-sm text-muted">
              Alena Darmel, Xuân Thống Trần, Caio Rosendo, MART PRODUCTION via
              Pexels.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 Eric Capiz. All rights reserved.</p>
          <p>Chicago-born · Denver-based</p>
        </div>
      </div>
    </footer>
  );
}
