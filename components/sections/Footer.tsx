"use client";

import { SOCIALS, HERO_IMAGE } from "@/lib/data";
import { scrollToTop } from "@/lib/scroll";
import { Marquee, MarqueeItem } from "../chrome/Marquee";
import { Reveal } from "../chrome/Reveal";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  SoundCloud: (
    <svg width="20" height="18" viewBox="0 0 24 20" fill="currentColor">
      <path d="M2 14v-4h2v4H2zm4-6v6h2V8H6zm4-3v9h2V5h-2zm4-2v11h2V3h-2zm4 4v7h2V7h-2zm4 1v5h2V8h-2z" opacity="0.9" />
    </svg>
  ),
  YouTube: (
    <svg width="20" height="18" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="3" width="20" height="14" rx="4" />
      <path d="M10.5 8.5l4.5 2.5-4.5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  ),
  X: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-6.4L6.2 22H3l7.3-8.3L2 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20z" />
    </svg>
  ),
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10">
      <div className="border-b border-white/10 py-5">
        <Marquee slow>
          {["Cosmic Drift", "Deep House", "Techno", "Chicago", "Worldwide"].map((t) => (
            <MarqueeItem key={t}>
              <span className="text-outline font-display text-2xl font-extrabold tracking-wide md:text-3xl">
                {t}
              </span>
            </MarqueeItem>
          ))}
        </Marquee>
      </div>

      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-16 md:px-10 md:pt-24">
        <Reveal>
          <button
            onClick={scrollToTop}
            className="group block w-full text-left"
            aria-label="Back to top"
          >
            <span className="block font-display text-[13.5vw] font-extrabold leading-[0.95] text-white transition-colors group-hover:text-neon md:text-[10vw]">
              COSMIC DRIFT
            </span>
          </button>
        </Reveal>

        <div className="mt-14 flex flex-col gap-10 border-t border-white/10 pt-10 md:flex-row md:items-end md:justify-between">
          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-zinc-400 transition-all hover:-translate-y-1 hover:border-neon hover:text-neon"
              >
                {SOCIAL_ICONS[s.label] ?? s.label[0]}
              </a>
            ))}
          </div>
          <p className="max-w-md text-xs leading-relaxed text-zinc-600">
            Photography: Alena Darmel, Xuân Thống Trần, Caio Rosendo, MART
            PRODUCTION via Pexels. Audio: original Cosmic Drift mixes.
            Hero image: {HERO_IMAGE.credit}.
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
            © 2026 Cosmic Drift
          </p>
        </div>
      </div>
    </footer>
  );
}
