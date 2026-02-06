"use client";

import { useState } from "react";
import { motion } from "motion/react";
import LightRays from "./LightRays";
import { HeroTitle } from "./HeroTitle";
import { HeroNav } from "./HeroNav";
import { Turntable } from "@/components/Turntable";

const turntableCaptionStyle = {
  background: "linear-gradient(180deg, #ffffff 0%, #e0e7ff 35%, #a5b4fc 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent" as const,
  textShadow:
    "0 0 24px rgba(129, 140, 248, 0.5), 0 0 48px rgba(99, 102, 241, 0.25), 0 2px 4px rgba(0,0,0,0.2)",
};

const TURNTABLE_CAPTION = "Tap the letters to navigate";

interface HeroProps {
  /** When set, turntable nav knobs call this instead of routing (e.g. show content below hero) */
  onNavClick?: (path: string) => void;
}

export function Hero({ onNavClick }: HeroProps) {
  const [raysColor, setRaysColor] = useState("#e0e7ff");

  return (
    <section
      className="relative min-h-screen w-full min-w-0 bg-[#06060a] overflow-x-hidden"
      aria-label="Hero"
    >
      <div className="absolute inset-0 bg-[#06060a] z-0" />

      {/* React Bits Light Rays — full hero, rays shine down over the whole area */}
      <div
        className="absolute inset-0 z-1"
        style={{ width: "100%", height: "100%" }}
      >
        <LightRays
          raysOrigin="top-center"
          raysColor="#e0e7ff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
          cycleRaysColor
          raysColorCycleIntervalMs={1800}
          onRaysColorChange={setRaysColor}
          className="hero-light-rays"
        />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-2 sm:px-4 overflow-visible">
        <div
          className="flex flex-col items-center gap-6 sm:gap-12 md:gap-10 lg:gap-3 flex-1 justify-center w-full origin-center"
          style={{ transform: "scale(0.9)" }}
        >
          <HeroTitle svgColor={raysColor} />
          <div className="lg:hidden w-full flex justify-center mt-10 sm:mt-14 md:mt-20">
            <HeroNav onNavClick={onNavClick} />
          </div>
          <div
            className="hidden lg:flex lg:flex-col lg:items-center shrink-0 gap-3 filter-[drop-shadow(0_0_50px_rgba(139,92,246,0.2))]"
            style={{
              width: "57vw",
              maxWidth: "1140px",
              minWidth: "280px",
            }}
          >
            <Turntable onNavClick={onNavClick} raysColor={raysColor} />
            <p
              className="text-xs sm:text-sm font-medium text-center tracking-widest sm:tracking-[0.15em]"
              style={turntableCaptionStyle}
              aria-hidden
            >
              {TURNTABLE_CAPTION.split("").map((char, i) => (
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
            </p>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-2"
        style={{
          background: "linear-gradient(to top, #06060a, transparent)",
        }}
      />
    </section>
  );
}
