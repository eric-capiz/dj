"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { GALLERY } from "@/lib/y2k-data";

const POSES_SM = [
  { rotate: -7, x: "4%", y: "2%" },
  { rotate: 5, x: "52%", y: "6%" },
  { rotate: -4, x: "6%", y: "52%" },
  { rotate: 8, x: "54%", y: "58%" },
];

const POSES_LG = [
  { rotate: -7, x: "2%", y: "0%" },
  { rotate: 5, x: "26%", y: "12%" },
  { rotate: -4, x: "52%", y: "2%" },
  { rotate: 8, x: "72%", y: "14%" },
];

function useLarge() {
  const [large, setLarge] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setLarge(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return large;
}

export function Gallery() {
  const large = useLarge();
  const poses = large ? POSES_LG : POSES_SM;
  return (
    <section id="gallery" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mb-4 text-center">
        <p className="text-xs font-black tracking-[0.5em] text-white/60">♡ DRAG US AROUND ♡</p>
        <h2 className="mt-3 font-display text-5xl sm:text-7xl">
          <span className="holo-text">STICKER</span> <span className="chrome-text">WALL</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/65">
          Evidence from the floor. Grab a sticker, throw it somewhere else.
        </p>
      </div>

      <div className="relative mx-auto h-[560px] max-w-6xl sm:h-[600px]">
        {GALLERY.map((g, i) => {
          const pose = poses[i % poses.length];
          return (
            <motion.figure
              key={g.src}
              drag
              dragMomentum={false}
              whileDrag={{ scale: 1.08, zIndex: 30 }}
              whileHover={{ scale: 1.04, zIndex: 20 }}
              initial={{ opacity: 0, y: 60, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: pose.rotate }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 70, damping: 13, delay: i * 0.1 }}
              className="tape sticker absolute w-[46%] cursor-grab rounded-2xl bg-white p-2 pb-8 active:cursor-grabbing sm:w-[24%]"
              style={{ left: pose.x, top: pose.y }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                <Image
                  src={g.src}
                  alt={g.caption}
                  fill
                  sizes="(max-width: 640px) 46vw, 24vw"
                  className="object-cover"
                  draggable={false}
                />
              </div>
              <figcaption className="mt-2 text-center font-mono text-[10px] font-bold tracking-[0.2em] text-[#0d0628]">
                {g.caption}
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
      <p className="mt-6 text-center font-mono text-[10px] tracking-[0.3em] text-white/40">
        PHOTOS: XUÂN THỐNG TRẦN / CAIO ROSENDO / MART PRODUCTION VIA PEXELS
      </p>
    </section>
  );
}
