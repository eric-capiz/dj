"use client";

import { useState, type FormEvent } from "react";
import { BOOKING_EMAIL } from "@/lib/pro-data";
import { Reveal, SectionHeading } from "./ui";

const EVENT_TYPES = ["Club set", "Festival", "Private event", "Corporate", "Wedding", "Other"];
const BUDGETS = ["$500 – $1,000", "$1,000 – $2,500", "$2,500 – $5,000", "$5,000+", "To be discussed"];

const inputCls =
  "w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-bone placeholder:text-muted/60 focus:border-amber focus:outline-none";

export function Booking() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const type = String(data.get("type") || "");
    const date = String(data.get("date") || "");
    const venue = String(data.get("venue") || "").trim();
    const budget = String(data.get("budget") || "");
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !type || !venue || !message) {
      setError("Please fill in every required field.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email address doesn't look right.");
      return;
    }

    const subject = `Booking inquiry — ${name}${date ? ` — ${date}` : ""}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Event type: ${type}`,
      `Event date: ${date || "Flexible / TBD"}`,
      `Venue / city: ${venue}`,
      `Budget range: ${budget || "To be discussed"}`,
      "",
      "Details:",
      message,
    ].join("\n");

    window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section id="book" className="scroll-mt-20 border-t border-line bg-coal py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <SectionHeading
              eyebrow="Booking"
              title="Let's talk dates"
              blurb="Clubs, festivals, private events. Share the details and you'll get a reply within a couple of days."
            />
            <Reveal>
              <div className="rounded-2xl border border-line bg-ink p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Direct
                </p>
                <a
                  href={`mailto:${BOOKING_EMAIL}`}
                  className="mt-2 block font-display text-xl font-bold text-amber hover:underline"
                >
                  {BOOKING_EMAIL}
                </a>
                <p className="mt-4 text-sm text-muted">
                  Prefer email? The form opens your mail app with everything
                  filled in — nothing is sent automatically.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            {sent ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-line bg-ink p-10 text-center">
                <p className="font-display text-3xl font-bold text-bone">Request ready ✓</p>
                <p className="mt-4 max-w-md text-muted">
                  Your email app should have opened with the inquiry addressed
                  to {BOOKING_EMAIL}. Just hit send.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-8 rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-bone hover:border-amber hover:text-amber"
                >
                  Write another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-line bg-ink p-6 md:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Name *
                    </span>
                    <input name="name" required placeholder="Your name" className={inputCls} autoComplete="name" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Email *
                    </span>
                    <input name="email" type="email" required placeholder="you@venue.com" className={inputCls} autoComplete="email" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Event type *
                    </span>
                    <select name="type" required defaultValue="" className={inputCls}>
                      <option value="" disabled>Select…</option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Event date
                    </span>
                    <input name="date" type="date" className={inputCls} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Venue / city *
                    </span>
                    <input name="venue" required placeholder="Venue, City" className={inputCls} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Budget range
                    </span>
                    <select name="budget" defaultValue="" className={inputCls}>
                      <option value="" disabled>Select…</option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Tell me about the night *
                    </span>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Room size, set length, lineup, anything I should know…"
                      className={`${inputCls} resize-y`}
                    />
                  </label>
                </div>
                {error && (
                  <p role="alert" className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  className="mt-6 w-full rounded-full bg-amber px-6 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.01] sm:w-auto sm:px-10"
                >
                  Prepare email
                </button>
                <p className="mt-4 text-xs text-muted">
                  No spam, no list — this opens your mail app with the message
                  pre-filled. You send it.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
