"use client";

import Image from "next/image";
import { GALLERY } from "@/lib/data";
import { Cut, SectionHead } from "./shared";

export function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-14 border-t-2 border-bone/20 px-4 py-12 md:px-8 md:py-16">
      <SectionHead
        index="04"
        title="Evidence"
        note="Recovered from the floor. Do not adjust your set."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {GALLERY.map((img, i) => (
          <Cut key={img.src} delay={(i % 2) * 0.08}>
            <figure className="hard-shadow-sm group border-2 border-bone bg-coal">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="duotone duotone-hover object-cover"
                />
                <span className="absolute left-2 top-2 bg-ink px-2 py-1 font-grotesk text-[10px] font-bold uppercase tracking-[0.25em] text-acid">
                  {String(i + 1).padStart(3, "0")}
                </span>
              </div>
              <figcaption className="flex items-center justify-between border-t-2 border-bone px-3 py-2">
                <span className="font-grotesk text-xs font-bold uppercase tracking-[0.15em]">
                  {img.caption}
                </span>
                <span className="font-grotesk text-[10px] uppercase tracking-[0.15em] text-concrete">
                  {img.credit}
                </span>
              </figcaption>
            </figure>
          </Cut>
        ))}
      </div>
    </section>
  );
}
