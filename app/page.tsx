"use client";

import { useState, useRef, useEffect } from "react";
import { Hero } from "@/components/Hero";

type Section = "" | "about" | "samples" | "contact" | "residencies" | "media";

function pathToSection(path: string): Section {
  if (path === "/") return "";
  const name = path.slice(1);
  const valid: Section[] = [
    "about",
    "samples",
    "contact",
    "residencies",
    "media",
  ];
  return valid.includes(name as Section) ? (name as Section) : "";
}

const SAMPLES = [
  { name: "Cosmic Drift", style: "House", bpm: "124" },
  { name: "Lunar Bass", style: "Techno", bpm: "128" },
  { name: "Nebula Keys", style: "Melodic", bpm: "122" },
  { name: "Orbit Loop", style: "Deep House", bpm: "120" },
  { name: "Stellar Drop", style: "Tech House", bpm: "126" },
  { name: "Void Echo", style: "Minimal", bpm: "125" },
  { name: "Solar Flare", style: "Progressive", bpm: "123" },
  { name: "Gravity Well", style: "Electro", bpm: "128" },
];

export default function Home() {
  const [section, setSection] = useState<Section>("");
  const sectionRef = useRef<HTMLElement>(null);

  const handleNavClick = (path: string) => setSection(pathToSection(path));

  useEffect(() => {
    if (section && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [section]);

  return (
    <main>
      <Hero onNavClick={handleNavClick} />
      {/* Content below hero: shown when a nav knob is clicked; scrolls into view */}
      {section && (
        <section
          ref={sectionRef}
          className="relative z-10 py-16 px-4 sm:px-6 overflow-hidden"
          aria-label={section}
          style={{
            background:
              "linear-gradient(180deg, rgba(67,56,202,0.06) 0%, #06060a 12%, #06060a 100%)",
          }}
        >
          {/* Soft glow line at top */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px max-w-md opacity-60"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(129,140,248,0.5), transparent)",
            }}
          />
          <div className="max-w-2xl mx-auto relative">
            {section === "about" && (
              <div className="text-center space-y-6">
                <h2
                  className="text-3xl font-bold mb-6 bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)",
                    textShadow: "0 0 40px rgba(129,140,248,0.15)",
                  }}
                >
                  About
                </h2>
                <p className="text-slate-400">
                  Space Jam is your cosmic DJ experience — blending beats from
                  across the galaxy into one seamless set.
                </p>
                <p className="text-slate-400">
                  From underground clubs to festival stages, we bring a mix of
                  house, techno, and experimental sounds that keep the crowd
                  moving until sunrise.
                </p>
                <p className="text-slate-400">
                  Founded in 2024, Space Jam has shared the stage with artists
                  like [Artist A], [Artist B], and has held residencies at
                  [Venue X] and [Venue Y].
                </p>
                <div className="pt-6 mt-6 border-t border-white/10 text-left max-w-lg mx-auto">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span
                      className="w-1 h-5 rounded-full shrink-0"
                      style={{
                        background: "linear-gradient(180deg, #818cf8, #6366f1)",
                      }}
                    />
                    What we do
                  </h3>
                  <p className="text-slate-400 mt-3">
                    We specialize in long-format sets that take the room on a
                    journey: warm-up grooves, peak-time energy, and late-night
                    wind-downs. Every set is tailored to the venue and the
                    crowd.
                  </p>
                  <p className="text-slate-400 mt-3">
                    Beyond the decks, we run a monthly radio show and have
                    contributed to compilations on [Label A] and [Label B]. Our
                    first EP is due later this year.
                  </p>
                </div>
                <p className="text-slate-500 text-sm pt-4">
                  Based in [City]. Available for tours and one-off shows
                  worldwide.
                </p>
              </div>
            )}
            {section === "samples" && (
              <div className="space-y-8">
                <h2
                  className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)",
                    textShadow: "0 0 40px rgba(129,140,248,0.15)",
                  }}
                >
                  Samples
                </h2>
                <p className="text-slate-400 text-center">
                  Browse and preview sounds from recent sets and releases. These
                  tracks have been featured in our mixes and live sets over the
                  past year.
                </p>
                <p className="text-slate-500 text-center text-sm">
                  Click a track to preview (coming soon). All BPM and genre tags
                  are approximate.
                </p>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {SAMPLES.map((track) => (
                    <li
                      key={track.name}
                      className="group p-4 rounded-lg bg-white/5 border border-white/10 text-left transition-colors hover:border-indigo-500/40 hover:bg-white/10 pl-5"
                      style={{
                        borderLeftWidth: "3px",
                        borderLeftColor: "rgba(129,140,248,0.4)",
                      }}
                    >
                      <span className="font-medium text-white block group-hover:text-indigo-200/90 transition-colors">
                        {track.name}
                      </span>
                      <span className="text-slate-500 text-sm">
                        {track.style} · {track.bpm} BPM
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-slate-500 text-center text-sm pt-4">
                  More tracks and full sets will be added soon. Follow us on
                  SoundCloud and Bandcamp for updates.
                </p>
              </div>
            )}
            {section === "residencies" && (
              <div className="text-center space-y-6">
                <h2
                  className="text-3xl font-bold mb-6 bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)",
                    textShadow: "0 0 40px rgba(129,140,248,0.15)",
                  }}
                >
                  Residencies
                </h2>
                <p className="text-slate-400">
                  Previous and current residencies — where you can catch us
                  regularly.
                </p>
                <ul className="text-left max-w-md mx-auto space-y-2 text-slate-400">
                  <li>[Venue X] — [City]</li>
                  <li>[Venue Y] — [City]</li>
                  <li>More dates TBA.</li>
                </ul>
              </div>
            )}
            {section === "media" && (
              <div className="text-center space-y-6">
                <h2
                  className="text-3xl font-bold mb-6 bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)",
                    textShadow: "0 0 40px rgba(129,140,248,0.15)",
                  }}
                >
                  Media
                </h2>
                <p className="text-slate-400">
                  Photos and video from past sets and events.
                </p>
                <p className="text-slate-500 text-sm">
                  Gallery and reels coming soon.
                </p>
              </div>
            )}
            {section === "contact" && (
              <div className="text-center space-y-8">
                <h2
                  className="text-3xl font-bold mb-6 bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)",
                    textShadow: "0 0 40px rgba(129,140,248,0.15)",
                  }}
                >
                  Contact
                </h2>
                <p className="text-slate-400">
                  For bookings, collabs, or just to say hi — reach out below.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap">
                  <a
                    href="mailto:hello@spacejam.dj"
                    className="px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 hover:border-indigo-400/50 hover:text-indigo-200 transition-colors text-sm font-medium"
                  >
                    hello@spacejam.dj
                  </a>
                  <span className="text-slate-600">·</span>
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm">
                    @spacejam
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm">
                    @spacejam_dj
                  </span>
                </div>
                <div className="text-left max-w-md mx-auto space-y-4 pt-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                      <span
                        className="w-1 h-4 rounded-full shrink-0"
                        style={{ background: "#818cf8" }}
                      />
                      Booking inquiries
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Include the date, venue name, capacity, and type of event
                      (club night, festival, private, etc.). We typically
                      respond within 48 hours. For last-minute requests, DM us
                      on socials.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                      <span
                        className="w-1 h-4 rounded-full shrink-0"
                        style={{ background: "#818cf8" }}
                      />
                      Press &amp; collabs
                    </h3>
                    <p className="text-slate-500 text-sm">
                      For press, interviews, or collaboration ideas, use the
                      same email with a clear subject line. We’re open to
                      remixes, guest mixes, and label work.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
