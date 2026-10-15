"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { BOOKING_EMAIL, HERO_IMAGE } from "@/lib/data";
import { SectionTag, Reveal } from "../chrome/Reveal";
import { MagneticButton } from "../chrome/MagneticButton";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-void/70 px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-neon";

export function Booking() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    venue: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Booking request — ${form.name || "new inquiry"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nEvent date: ${form.date}\nVenue / City: ${form.venue}\n\n${form.message}`,
    );
    window.location.href = `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
    window.setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="booking" className="relative overflow-hidden border-t border-white/5">
      {/* backdrop image */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.16]">
        <Image src={HERO_IMAGE.src} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/70 to-void" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-44">
        <SectionTag index="06" label="Booking — open the airlock" />
        <div className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <h2 className="font-display text-[11vw] font-extrabold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
                LET'S MAKE
                <br />
                THE ROOM
                <br />
                <span className="text-outline-neon">LEVITATE.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md leading-relaxed text-zinc-400">
                Clubs, festivals, warehouses, rooftops, weddings that refuse
                to be boring — if there's a soundsystem and a crowd, there's
                a set. Tell me about the night and I'll bring the transmission.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <dl className="mt-10 space-y-5 text-sm">
                <div className="flex gap-6">
                  <dt className="w-24 shrink-0 text-xs uppercase tracking-[0.3em] text-zinc-500">Email</dt>
                  <dd><a href={`mailto:${BOOKING_EMAIL}`} className="text-white underline decoration-neon underline-offset-4 hover:text-neon">{BOOKING_EMAIL}</a></dd>
                </div>
                <div className="flex gap-6">
                  <dt className="w-24 shrink-0 text-xs uppercase tracking-[0.3em] text-zinc-500">Base</dt>
                  <dd className="text-white">Chicago, IL — travels worldwide</dd>
                </div>
                <div className="flex gap-6">
                  <dt className="w-24 shrink-0 text-xs uppercase tracking-[0.3em] text-zinc-500">Reply</dt>
                  <dd className="text-white">Within 48 hours</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <form
              onSubmit={submit}
              className="rounded-3xl border border-white/10 bg-panel/80 p-6 backdrop-blur-xl md:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-zinc-500" htmlFor="bk-name">Name *</label>
                  <input id="bk-name" required value={form.name} onChange={set("name")} placeholder="Your name" className={inputCls} />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-zinc-500" htmlFor="bk-email">Email *</label>
                  <input id="bk-email" required type="email" value={form.email} onChange={set("email")} placeholder="you@venue.com" className={inputCls} />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-zinc-500" htmlFor="bk-date">Event date</label>
                  <input id="bk-date" type="date" value={form.date} onChange={set("date")} className={`${inputCls} [color-scheme:dark]`} />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-zinc-500" htmlFor="bk-venue">Venue / City</label>
                  <input id="bk-venue" value={form.venue} onChange={set("venue")} placeholder="Sound Bar, Chicago" className={inputCls} />
                </div>
              </div>
              <div className="mt-5">
                <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-zinc-500" htmlFor="bk-msg">The night *</label>
                <textarea id="bk-msg" required rows={5} value={form.message} onChange={set("message")} placeholder="Capacity, vibe, set length, anything I should know…" className={`${inputCls} resize-none`} />
              </div>

              <MagneticButton>
                <button
                  type="submit"
                  className="mt-7 w-full rounded-2xl bg-gradient-to-r from-neon to-pulse py-5 font-display text-sm font-bold tracking-[0.25em] text-white transition-transform hover:scale-[1.01]"
                >
                  TRANSMIT BOOKING REQUEST
                </button>
              </MagneticButton>

              <AnimatePresence>
                {sent && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-center text-sm text-pulse"
                  >
                    Opening your email app — the request is addressed and ready to send.
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="mt-4 text-center text-xs text-zinc-600">
                No spam, no list. Your details go straight to the inbox.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
