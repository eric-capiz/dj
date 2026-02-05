"use client";

import { motion } from "motion/react";

const text = "DJ Cosmic Drift";

const textStyle = {
  background: "linear-gradient(180deg, #ffffff 0%, #e0e7ff 35%, #a5b4fc 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
  textShadow:
    "0 0 24px rgba(129, 140, 248, 0.5), 0 0 48px rgba(99, 102, 241, 0.25), 0 2px 4px rgba(0,0,0,0.2)",
};

interface HeroTitleProps {
  /** When set (e.g. from LightRays), headphone SVG uses this color so it stays in sync with the rays */
  svgColor?: string;
}

export function HeroTitle({ svgColor }: HeroTitleProps) {
  return (
    <div className="flex flex-col items-center shrink-0">
      <div className="relative w-44 sm:w-52 md:w-60 lg:w-[20rem] xl:w-[24rem] overflow-visible flex items-center justify-center pointer-events-none">
        {/* Headphones SVG — color from props when synced to rays (React Bits), else gradient */}
        <svg
          viewBox="0 0 76 76"
          className="w-full h-auto object-contain origin-center pointer-events-none"
          style={{ transform: "scale(2.25)" }}
          aria-hidden
        >
          <defs>
            <linearGradient
              id="headphone-gradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#c7d2fe" />
              <stop offset="40%" stopColor="#a5b4fc" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <path
            fill={svgColor ?? "url(#headphone-gradient)"}
            fillOpacity={1}
            strokeLinejoin="round"
            d="M 37.75,19L 38.25,19C 38.25,19 57,19 57,39C 57,48 55,51 54,52C 54,52 51,54 51.9999,51.25C 51.9999,48.9362 53,44 53,44C 53,44 54,44 54,39C 54,33 50,22.5 39,22.5L 37,22.5C 26,22.5 22,33 22,39C 22,44 23,44 23,44C 23,44 24.0001,48.9362 24.0001,51.25C 25,54 22,52 22,52C 21,51 19,48 19,39C 19,19 37.75,19 37.75,19 Z M 26.5533,39.1655C 28.194,38.9349 29.711,40.0781 29.9416,41.7188L 31.4725,52.6117C 31.7031,54.2524 30.56,55.7694 28.9192,56C 27.2785,56.2306 25.2615,55.0875 25.0309,53.4467L 23.5,42.5538C 23.2694,40.9131 24.9126,39.3961 26.5533,39.1655 Z M 49.4467,39.1655C 51.0874,39.3961 52.7306,40.9131 52.5,42.5538L 50.9691,53.4467C 50.7385,55.0875 48.7215,56.2306 47.0808,56C 45.44,55.7694 44.2969,54.2524 44.5275,52.6117L 46.0584,41.7188C 46.289,40.0781 47.806,38.9349 49.4467,39.1655 Z "
          />
        </svg>
        <h1
          className="absolute inset-0 flex items-center justify-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-center pointer-events-none"
          style={{ transform: "translateY(-18%)" }}
          aria-label={text}
        >
          <span
            className="inline-block tracking-widest sm:tracking-[0.15em]"
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
      </div>
    </div>
  );
}
