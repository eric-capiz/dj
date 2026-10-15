"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "motion/react";
import { AudioProvider } from "@/lib/use-audio";
import { Preloader } from "@/components/chrome/Preloader";
import { CustomCursor } from "@/components/chrome/CustomCursor";
import { SmoothScroll } from "@/components/chrome/SmoothScroll";
import { Nav } from "@/components/chrome/Nav";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Turntable } from "@/components/sections/Turntable";
import { Tracklist } from "@/components/sections/Tracklist";
import { TourDates } from "@/components/sections/TourDates";
import { Gallery } from "@/components/sections/Gallery";
import { Booking } from "@/components/sections/Booking";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  // introReady gates the preloader exit animation via AnimatePresence above.
  const [introReady, setIntroReady] = useState(false);
  const handleIntroDone = useCallback(() => setIntroReady(true), []);

  return (
    <AudioProvider>
      <SmoothScroll />
      <AnimatePresence>
        {!introReady && <Preloader onDone={handleIntroDone} />}
      </AnimatePresence>
      <CustomCursor />
      <Nav introReady={introReady} />
      <main>
        <Hero introReady={introReady} />
        <Manifesto />
        <Turntable />
        <Tracklist />
        <TourDates />
        <Gallery />
        <Booking />
      </main>
      <Footer />
    </AudioProvider>
  );
}
