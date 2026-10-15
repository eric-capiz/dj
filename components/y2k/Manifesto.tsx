"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const BEATS = [
  { big: "PLUGGED IN", small: "no laptop DJs were harmed", color: "#ff2fb3" },
  { big: "SINCE DIAL-UP", small: "128kbps of pure devotion", color: "#22d3ee" },
  { big: "FOREVER ONLINE", small: "the dancefloor never logs off", color: "#b6ff2e" },
];

const STATS = [
  { n: "240+", label: "SETS PLAYED" },
  { n: "38", label: "CITIES" },
  { n: "11", label: "MIXES" },
  { n: "9yrs", label: "ON DECKS" },
];

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Pinned sticker choreography: 3 beats scrubbed through 300vh.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".mnl-pin",
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 0.6,
        },
      });
      BEATS.forEach((_, i) => {
        const sel = `.mnl-beat-${i}`;
        tl.fromTo(
          sel,
          { scale: 0.4, rotation: -14, opacity: 0, y: 90 },
          { scale: 1, rotation: 0, opacity: 1, y: 0, duration: 1, ease: "back.out(1.6)" },
        );
        if (i < BEATS.length - 1) {
          tl.to(sel, { scale: 1.5, rotation: 10, opacity: 0, y: -90, duration: 0.8, ease: "power2.in" }, "+=0.35");
        }
      });
      tl.fromTo(
        ".mnl-stats",
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.4)" },
        "-=0.2",
      );

      // Scroll-velocity skew on the section title.
      const skewSetter = gsap.quickSetter(".mnl-skew", "skewX", "deg");
      const clampSkew = gsap.utils.clamp(-14, 14);
      ScrollTrigger.create({
        onUpdate: (self) => {
          const skew = clampSkew(self.getVelocity() / -280);
          skewSetter(skew);
          gsap.to(".mnl-skew", { skewX: 0, duration: 0.7, ease: "power3", overwrite: true });
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="manifesto" className="relative">
      <div className="mnl-pin flex h-svh flex-col items-center justify-center overflow-hidden px-4">
        <p className="mnl-skew mb-6 text-xs font-black tracking-[0.5em] text-white/60">
          ★ THE MANIFESTO ★
        </p>
        <div className="relative flex h-[46vh] w-full items-center justify-center">
          {BEATS.map((b, i) => (
            <div key={b.big} className={`mnl-beat-${i} absolute flex flex-col items-center`}>
              <div
                className="sticker candy rounded-3xl px-8 py-6 text-center sm:px-14 sm:py-8"
                style={{ background: b.color }}
              >
                <p className="font-display text-5xl text-[#0d0628] sm:text-7xl lg:text-8xl">{b.big}</p>
              </div>
              <p className="mt-4 font-mono text-sm tracking-[0.25em] text-white/70">{b.small}</p>
            </div>
          ))}
        </div>
        <div className="mnl-stats mt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="sticker glass rounded-2xl px-5 py-3 text-center"
              style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 4}deg)` }}
            >
              <p className="holo-text font-display text-3xl sm:text-4xl">{s.n}</p>
              <p className="mt-1 text-[10px] font-black tracking-[0.3em] text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* marquee divider */}
      <div className="overflow-hidden border-y-2 border-white/20 bg-black/40 py-3">
        <div className="animate-marquee-slow flex w-max whitespace-nowrap font-display text-sm tracking-[0.25em]">
          <span className="pr-8">{"BUBBLEGUM BASS ★ HYPERPOP PRESSURE ★ CHROME EVERYTHING ★ ".repeat(3)}</span>
          <span className="pr-8" aria-hidden>{"BUBBLEGUM BASS ★ HYPERPOP PRESSURE ★ CHROME EVERYTHING ★ ".repeat(3)}</span>
        </div>
      </div>
    </section>
  );
}
