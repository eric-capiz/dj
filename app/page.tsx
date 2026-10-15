"use client";

import { AudioProvider } from "@/lib/player";
import { Nav } from "@/components/pro/Nav";
import { Hero } from "@/components/pro/Hero";
import { Ticker } from "@/components/pro/Ticker";
import { Music } from "@/components/pro/Music";
import { Tour } from "@/components/pro/Tour";
import { About } from "@/components/pro/About";
import { Epk } from "@/components/pro/Epk";
import { Gallery } from "@/components/pro/Gallery";
import { Booking } from "@/components/pro/Booking";
import { Footer } from "@/components/pro/Footer";
import { StickyPlayer } from "@/components/pro/StickyPlayer";

// ERIC CAPIZ — professional DJ site (round 4).
// Prior themes' components (components/sections/*, components/chrome/*,
// components/brutal/*, components/y2k/*, old app routes) remain in the repo as
// dead code — nothing on this page imports them. push_files cannot delete files.

export default function Home() {
  return (
    <AudioProvider>
      <Nav />
      <main>
        <Hero />
          <Ticker
            items={[
              "New mixes out now",
              "On tour 2026 — 2027",
              "EPK available",
              "Booking open",
            ]}
          />
          <Music />
          <Tour />
          <About />
          <Epk />
          <Gallery />
          <Booking />
      </main>
      <Footer />
      <StickyPlayer />
    </AudioProvider>
  );
}
