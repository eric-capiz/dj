"use client";

import { Y2KAudioProvider } from "@/lib/y2k-audio";
import { SmoothScroll } from "@/components/y2k/SmoothScroll";
import { Nav } from "@/components/y2k/Nav";
import { Hero } from "@/components/y2k/Hero";
import { Manifesto } from "@/components/y2k/Manifesto";
import { Mixes } from "@/components/y2k/Mixes";
import { SynthLab } from "@/components/y2k/SynthLab";
import { Tour } from "@/components/y2k/Tour";
import { Gallery } from "@/components/y2k/Gallery";
import { Booking } from "@/components/y2k/Booking";
import { Footer } from "@/components/y2k/Footer";

// CHROME//EC — liquid-chrome Y2K reboot (round 3).
// Prior themes' components (components/sections/*, components/chrome/*,
// components/brutal/*, old app routes) remain in the repo as dead code —
// nothing on this page imports them. push_files cannot delete files.

export default function Home() {
  return (
    <Y2KAudioProvider>
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Mixes />
        <SynthLab />
        <Tour />
        <Gallery />
        <Booking />
      </main>
      <Footer />
    </Y2KAudioProvider>
  );
}
