"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import Image from "next/image";
import { BIO_LONG, STATS } from "@/lib/pro-data";
import { Reveal, SectionHeading } from "./ui";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading eyebrow="About" title="Eric Capiz" />

        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="grain relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/img/dj-gallery-2.webp"
                alt="Eric Capiz performing"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>
            <p className="mt-3 text-xs text-muted">Photo: Pexels</p>
          </Reveal>

          <div>
            {BIO_LONG.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={`text-bone/85 ${i > 0 ? "mt-5" : ""} ${i === 0 ? "text-lg" : ""}`}>
                  {p}
                </p>
              </Reveal>
            ))}

            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
              {STATS.map((s) => (
                <div key={s.label} className="bg-coal p-6">
                  <p className="font-display text-4xl font-bold text-amber">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
