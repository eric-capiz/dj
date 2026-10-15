"use client";

import { Nav } from "@/components/brutal/Nav";
import { Hero } from "@/components/brutal/Hero";
import { Doctrine } from "@/components/brutal/Doctrine";
import { Mixes } from "@/components/brutal/Mixes";
import { Sequencer } from "@/components/brutal/Sequencer";
import { Tour } from "@/components/brutal/Tour";
import { Gallery } from "@/components/brutal/Gallery";
import { Booking } from "@/components/brutal/Booking";
import { Footer } from "@/components/brutal/Footer";

// BASSMENT — brutalist warehouse reboot.
// Note: the previous cosmic theme's components (components/sections/*,
// components/chrome/*, old app routes) remain in the repo as dead code —
// nothing on this page imports them. push_files cannot delete files.

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Doctrine />
        <Mixes />
        <Sequencer />
        <Tour />
        <Gallery />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
