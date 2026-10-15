"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAudio } from "@/lib/use-audio";
import { scrollToSection, scrollToTop } from "@/lib/scroll";
import { MagneticButton } from "./MagneticButton";

const LINKS = [
  { label: "The Deck", target: "#deck" },
  { label: "Mixes", target: "#mixes" },
  { label: "Tour", target: "#tour" },
  { label: "Gallery", target: "#gallery" },
];

function EqBars() {
  return (
    <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] origin-bottom animate-pulse-glow bg-pulse"
          style={{ height: `${6 + ((i * 5) % 8)}px`, animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

export function Nav({ introReady }: { introReady: boolean }) {
  const { isPlaying, currentTrack } = useAudio();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (target: string) => {
    setOpen(false);
    scrollToSection(target);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={introReady ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${
          scrolled ? "bg-void/70 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10">
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3"
            aria-label="Back to top"
          >
            <span className="relative grid h-9 w-9 place-items-center">
              <span className="absolute inset-0 rounded-full border border-neon/60 transition-transform duration-500 group-hover:rotate-180" />
              <span className="absolute inset-[7px] rounded-full bg-gradient-to-br from-neon to-pulse" />
              <span className="absolute h-2 w-2 rounded-full bg-void" />
            </span>
            <span className="font-display text-sm font-bold tracking-[0.25em] text-white">
              COSMIC&nbsp;DRIFT
            </span>
          </button>

          <nav className="hidden items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.target}
                onClick={() => go(l.target)}
                className="group relative text-[13px] uppercase tracking-[0.25em] text-zinc-400 transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-neon to-pulse transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {isPlaying && currentTrack && (
                <motion.button
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  onClick={() => go("#mixes")}
                  className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 py-2 pl-4 pr-5 backdrop-blur sm:flex"
                >
                  <EqBars />
                  <span className="max-w-[140px] truncate text-xs tracking-wider text-zinc-300">
                    {currentTrack.name}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            <MagneticButton>
              <button
                onClick={() => go("#booking")}
                className="rounded-full bg-white px-5 py-2.5 font-display text-[11px] font-bold tracking-[0.2em] text-void transition-colors hover:bg-neon hover:text-white md:px-6"
              >
                BOOK
              </button>
            </MagneticButton>

            <button
              className="grid h-10 w-10 place-items-center md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <span className="relative block h-4 w-6">
                <span className={`absolute left-0 top-0 h-0.5 w-full bg-white transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[7px] h-0.5 w-full bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-0.5 w-full bg-white transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75] flex flex-col items-center justify-center gap-8 bg-void/95 backdrop-blur-2xl md:hidden"
          >
            {[...LINKS, { label: "Booking", target: "#booking" }].map((l, i) => (
              <motion.button
                key={l.target + l.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
                onClick={() => go(l.target)}
                className="font-display text-3xl font-bold text-white"
              >
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
