"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 200 : 1900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic for a fast start, long tail
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        window.setTimeout(onDone, 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="overflow-hidden">
        <motion.p
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-xs tracking-[0.5em] text-neon"
        >
          COSMIC DRIFT
        </motion.p>
      </div>
      <div className="mt-6 font-display text-[22vw] md:text-[16vw] font-800 leading-none text-white tabular-nums"
        style={{ fontWeight: 800 }}
      >
        {count}
        <span className="text-neon">%</span>
      </div>
      <div className="mt-8 h-px w-56 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-neon via-flare to-pulse transition-[width] duration-100"
          style={{ width: `${count}%` }}
        />
      </div>
      <p className="mt-6 text-[11px] uppercase tracking-[0.35em] text-zinc-500">
        Tuning the transmission
      </p>
    </motion.div>
  );
}
