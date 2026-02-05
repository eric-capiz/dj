"use client";

import { useState } from "react";
import LightRays from "./LightRays";
import { HeroTitle } from "./HeroTitle";
import { HeroNav } from "./HeroNav";
import { Turntable } from "@/components/Turntable";

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
      {/* Dark base */}
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

      {/* Title + turntable: turntable is the focal point, centered ON TOP of the rays */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-2 sm:px-4 overflow-visible">
        <div
          className="flex flex-col items-center gap-4 md:gap-5 lg:gap-3 flex-1 justify-center w-full origin-center"
          style={{ transform: "scale(0.9)" }}
        >
          <HeroTitle svgColor={raysColor} />
          {/* Tablet/mobile: nav links below headphones */}
          <div className="lg:hidden w-full flex justify-center">
            <HeroNav onNavClick={onNavClick} />
          </div>
          {/* Desktop (lg+): turntable */}
          <div
            className="hidden lg:block shrink-0 filter-[drop-shadow(0_0_50px_rgba(139,92,246,0.2))]"
            style={{
              width: "57vw",
              maxWidth: "1140px",
              minWidth: "280px",
            }}
          >
            <Turntable onNavClick={onNavClick} raysColor={raysColor} />
          </div>
        </div>
      </div>

      {/* Bottom fade for content below (future) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-2"
        style={{
          background: "linear-gradient(to top, #06060a, transparent)",
        }}
      />
    </section>
  );
}
