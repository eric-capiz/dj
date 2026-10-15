"use client";

import { useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { BOOKING_EMAIL } from "@/lib/y2k-data";

export function Booking() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", date: "", venue: "", night: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Booking: ${form.name} — ${form.date || "TBD"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nDate: ${form.date}\nVenue/City: ${form.venue}\nThe night:\n${form.night}`,
    );
    // Build the addressed email without leaving the page in test environments.
    const url = `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${body}`;
    const a = document.createElement("a");
    a.href = url;
    a.style.display = "none";
    document.body.appendChild(a);
    // Only navigate when a mail client can plausibly handle it.
    try {
      a.click();
    } catch {
      /* noop */
    }
    a.remove();
    setSent(true);
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.7 },
      colors: ["#ff2fb3", "#22d3ee", "#b6ff2e", "#a78bfa", "#ffffff"],
    });
  };

  const field =
    "w-full rounded-2xl border-2 border-white/15 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 outline-none transition-colors focus:border-[#ff2fb3]";

  return (
    <section id="book" className="relative mx-auto max-w-3xl px-4 py-24 sm:py-32">
      <div className="mb-10 text-center">
        <p className="text-xs font-black tracking-[0.5em] text-white/60">✉ SLIDE INTO THE INBOX ✉</p>
        <h2 className="mt-3 font-display text-5xl sm:text-7xl">
          <span className="chrome-text">BOOK</span> <span className="holo-text">THE NIGHT</span>
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 70, damping: 14 }}
        className="sticker candy relative overflow-hidden rounded-[2rem] bg-white/5 p-6 backdrop-blur-xl sm:p-10"
      >
        <div className="holo absolute inset-x-0 top-0 h-2" aria-hidden />
        {sent ? (
          <div className="flex flex-col items-center py-10 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 6 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="sticker holo rounded-2xl px-8 py-4 font-display text-3xl text-[#0d0628]"
            >
              ★ TRANSMITTED ★
            </motion.div>
            <p className="mt-6 max-w-md text-white/70">
              Your request is addressed to <span className="font-bold text-white">{BOOKING_EMAIL}</span> and
              ready in your email app. No spam, no list — just chrome.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 rounded-full border-2 border-white/20 px-6 py-2 text-sm font-bold text-white/70 hover:border-white/50 hover:text-white"
            >
              Send another →
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs font-black tracking-[0.25em] text-white/60">
                NAME *
                <input required value={form.name} onChange={set("name")} placeholder="Your name" className={field} />
              </label>
              <label className="flex flex-col gap-2 text-xs font-black tracking-[0.25em] text-white/60">
                EMAIL *
                <input required type="email" value={form.email} onChange={set("email")} placeholder="you@party.com" className={field} />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs font-black tracking-[0.25em] text-white/60">
                EVENT DATE
                <input value={form.date} onChange={set("date")} placeholder="12/31/2026" className={field} />
              </label>
              <label className="flex flex-col gap-2 text-xs font-black tracking-[0.25em] text-white/60">
                VENUE / CITY
                <input value={form.venue} onChange={set("venue")} placeholder="Neo Metro, Chicago" className={field} />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-xs font-black tracking-[0.25em] text-white/60">
              THE NIGHT *
              <textarea
                required
                value={form.night}
                onChange={set("night")}
                placeholder="Rooftop, 500 capacity, sunset set, confetti budget approved…"
                rows={4}
                className={`${field} resize-none`}
              />
            </label>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="candy holo mt-2 rounded-full py-4 font-display text-xl tracking-wide text-[#0d0628] shadow-[0_10px_36px_rgba(255,47,179,0.45)]"
            >
              TRANSMIT BOOKING REQUEST ★
            </motion.button>
            <p className="text-center text-xs text-white/40">No spam, no list. Just chrome.</p>
          </form>
        )}
      </motion.div>
    </section>
  );
}
