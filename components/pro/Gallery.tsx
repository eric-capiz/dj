"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { GALLERY } from "@/lib/pro-data";
import { Reveal, SectionHeading } from "./ui";

export function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) => (i === null ? i : (i + dir + GALLERY.length) % GALLERY.length)),
    []
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  return (
    <section id="gallery" className="scroll-mt-20 bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="On the floor"
          blurb="Click any photo to view it full-screen."
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {GALLERY.map((g, i) => (
            <Reveal
              key={g.src}
              delay={(i % 4) * 0.06}
              className={i === 0 ? "col-span-2 row-span-2" : ""}
            >
              <button
                onClick={() => setLightbox(i)}
                className="grain group relative block aspect-square w-full overflow-hidden rounded-xl"
                aria-label={`View photo: ${g.caption}`}
              >
                <Image
                  src={g.src}
                  alt={g.caption}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/25" />
                <span className="absolute bottom-3 left-3 right-3 truncate text-left text-xs font-medium text-bone/90 opacity-0 transition-opacity group-hover:opacity-100">
                  {g.caption}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          Photos: Alena Darmel, Xuân Thống Trần, Caio Rosendo, MART PRODUCTION via Pexels.
        </p>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/92 p-4 md:p-10"
            onClick={close}
            role="dialog"
            aria-label="Photo viewer"
          >
            <button
              onClick={close}
              aria-label="Close viewer"
              className="absolute right-5 top-5 rounded-full border border-white/20 px-4 py-2 text-sm text-bone hover:border-amber hover:text-amber"
            >
              Close ✕
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-3 text-bone hover:border-amber hover:text-amber md:left-8"
            >
              ←
            </button>
            <motion.figure
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="max-h-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[78vh] w-[92vw] max-w-5xl overflow-hidden rounded-xl md:w-auto">
                <Image
                  src={GALLERY[lightbox].src}
                  alt={GALLERY[lightbox].caption}
                  width={1600}
                  height={1000}
                  className="max-h-[78vh] w-auto object-contain"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4 text-sm">
                <span className="text-bone">{GALLERY[lightbox].caption}</span>
                <span className="shrink-0 text-xs text-muted">
                  {GALLERY[lightbox].credit} · {lightbox + 1}/{GALLERY.length}
                </span>
              </figcaption>
            </motion.figure>
            <button
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-3 text-bone hover:border-amber hover:text-amber md:right-8"
            >
              →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
