"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { GALLERY } from "@/lib/data";
import { SectionTag } from "../chrome/Reveal";

export function Gallery() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-68%"]);

  return (
    <section id="gallery" className="relative border-t border-white/5 bg-panel/40">
      <div ref={targetRef} className="relative h-[300vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto w-full max-w-[1600px] px-5 md:px-10">
            <SectionTag index="05" label="Field recordings" />
          </div>
          <motion.div style={{ x }} className="mt-10 flex gap-5 pl-5 md:gap-8 md:pl-10">
            {GALLERY.map((img, i) => (
              <figure
                key={img.src}
                className="group relative w-[74vw] shrink-0 overflow-hidden rounded-3xl border border-white/10 sm:w-[52vw] lg:w-[34vw]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.caption}
                    fill
                    sizes="(max-width: 768px) 74vw, 34vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-transparent to-transparent" />
                  <span className="absolute left-5 top-5 font-display text-xs text-white/70">
                    {String(i + 1).padStart(2, "0")} / {String(GALLERY.length).padStart(2, "0")}
                  </span>
                  <figcaption className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <p className="font-display text-lg font-bold text-white md:text-xl">
                      {img.caption}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-zinc-400">
                      {img.credit}
                    </p>
                  </figcaption>
                </div>
              </figure>
            ))}

            {/* end card */}
            <div className="flex w-[74vw] shrink-0 items-center justify-center sm:w-[40vw] lg:w-[26vw]">
              <p className="text-outline max-w-[10ch] text-center font-display text-4xl font-extrabold leading-tight md:text-5xl">
                WERE YOU THERE?
              </p>
            </div>
          </motion.div>

          <div className="mx-auto mt-8 w-full max-w-[1600px] px-5 md:px-10">
            <div className="h-px w-full bg-white/10">
              <motion.div className="h-full origin-left bg-gradient-to-r from-neon to-pulse" style={{ scaleX: scrollYProgress }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
