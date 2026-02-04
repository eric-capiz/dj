"use client";

import { motion } from "motion/react";

const text = "DJ Space Jam";

const textStyle = {
  background: "linear-gradient(180deg, #ffffff 0%, #e0e7ff 35%, #a5b4fc 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
  textShadow:
    "0 0 24px rgba(129, 140, 248, 0.5), 0 0 48px rgba(99, 102, 241, 0.25), 0 2px 4px rgba(0,0,0,0.2)",
};

export function HeroTitle() {
  return (
    <h1
      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center shrink-0"
      aria-label={text}
    >
      <span
        className="inline-block tracking-[0.15em] sm:tracking-[0.2em]"
        style={textStyle}
      >
        {text.split("").map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: i * 0.05,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}
