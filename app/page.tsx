"use client";

import { useState, useRef, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { ContactForm } from "@/components/ContactForm/ContactForm";

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

const TOUR_DATES = [
  { month: "Jan", day: 9, city: "Miami", state: "FL", venue: "LIV Nightclub" },
  { month: "Jan", day: 17, city: "Chicago", state: "IL", venue: "Sound Bar" },
  {
    month: "Feb",
    day: 6,
    city: "Las Vegas",
    state: "NV",
    venue: "Hakkasan Nightclub",
  },
  { month: "Feb", day: 14, city: "Detroit", state: "MI", venue: "Magic Stick" },
  {
    month: "Feb",
    day: 17,
    city: "New Orleans",
    state: "LA",
    venue: "Fillmore New Orleans",
  },
  { month: "Feb", day: 20, city: "Portland", state: "OR", venue: "45 East" },
  { month: "Feb", day: 21, city: "Seattle", state: "WA", venue: "Q Nightclub" },
  {
    month: "Feb",
    day: 22,
    city: "Eugene",
    state: "OR",
    venue: "McDonald Theatre",
  },
  {
    month: "Feb",
    day: 28,
    city: "Indianapolis",
    state: "IN",
    venue: "Old National Centre",
  },
  {
    month: "Mar",
    day: 1,
    city: "Denver",
    state: "CO",
    venue: "Temple Nightclub Denver",
  },
  {
    month: "Mar",
    day: 6,
    city: "Santa Cruz",
    state: "CA",
    venue: "The Catalyst",
  },
  {
    month: "Mar",
    day: 7,
    city: "Las Vegas",
    state: "NV",
    venue: "Marquee Nightclub",
  },
  { month: "Mar", day: 8, city: "Phoenix", state: "AZ", venue: "Sunbar" },
  { month: "Mar", day: 20, city: "Cincinnati", state: "OH", venue: "Bogart's" },
  {
    month: "Mar",
    day: 21,
    city: "New York",
    state: "NY",
    venue: "Marquee New York",
  },
  {
    month: "Mar",
    day: 22,
    city: "Las Vegas",
    state: "NV",
    venue: "Hakkasan Nightclub",
  },
  {
    month: "Mar",
    day: 28,
    city: "Las Vegas",
    state: "NV",
    venue: "OMNIA Nightclub",
  },
  {
    month: "Apr",
    day: 4,
    city: "Boston",
    state: "MA",
    venue: "Big Night Live",
  },
  {
    month: "Apr",
    day: 18,
    city: "Las Vegas",
    state: "NV",
    venue: "Hakkasan Nightclub",
  },
  {
    month: "Apr",
    day: 25,
    city: "Austin",
    state: "TX",
    venue: "Concourse Project",
  },
  { month: "May", day: 9, city: "Houston", state: "TX", venue: "NOTO Houston" },
  {
    month: "May",
    day: 25,
    city: "Las Vegas",
    state: "NV",
    venue: "OMNIA Nightclub",
  },
  {
    month: "Jun",
    day: 20,
    city: "Las Vegas",
    state: "NV",
    venue: "OMNIA Nightclub",
  },
  { month: "Jun", day: 28, city: "Atlanta", state: "GA", venue: "District" },
  {
    month: "Jul",
    day: 4,
    city: "Las Vegas",
    state: "NV",
    venue: "Marquee Nightclub",
  },
  {
    month: "Jul",
    day: 26,
    city: "Las Vegas",
    state: "NV",
    venue: "OMNIA Nightclub",
  },
  {
    month: "Aug",
    day: 2,
    city: "San Francisco",
    state: "CA",
    venue: "1015 Folsom",
  },
];

const MONTH_NAMES: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
};

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
                  Space Jam got its start at some of the city’s busiest spots —
                  The Orbit, Neon Lounge, and Stellar Room, among others — each
                  of which turned into a residency.
                </p>
                <p className="text-slate-400">
                  From there, Space Jam has taken the stage in some of the
                  largest rooms in town, including arena gigs and official
                  in-venue DJ sets for pro sports and college games. Whether
                  it’s a packed club or a stadium, the energy stays the same.
                </p>
                <p className="text-slate-400">
                  No matter the size of the room, Space Jam brings full energy
                  every time and keeps the crowd turned up from open to close.
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
                    We focus on long-format sets that take the room on a
                    journey: warm-up grooves, peak-time energy, and late-night
                    wind-downs. Every set is built for the venue and the crowd.
                  </p>
                  <p className="text-slate-400 mt-3">
                    Beyond the decks, we run a monthly radio show and have
                    appeared on compilations and one-off releases. New material
                    is on the way.
                  </p>
                </div>
                <p className="text-slate-500 text-sm pt-4">
                  Available for residencies, one-offs, and tours.
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
              <div className="space-y-8">
                <div className="text-center">
                  <h2
                    className="text-3xl font-bold mb-4 bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)",
                      textShadow: "0 0 40px rgba(129,140,248,0.15)",
                    }}
                  >
                    Tour dates
                  </h2>
                  <p className="text-slate-400">
                    Catch us on the road in 2026. More dates TBA.
                  </p>
                </div>
                <div className="space-y-8 max-w-3xl mx-auto">
                  {Object.entries(
                    TOUR_DATES.reduce<Record<string, typeof TOUR_DATES>>(
                      (acc, show) => {
                        if (!acc[show.month]) acc[show.month] = [];
                        acc[show.month].push(show);
                        return acc;
                      },
                      {}
                    )
                  ).map(([monthKey, shows]) => (
                    <div key={monthKey} className="space-y-3">
                      <h3
                        className="text-sm font-semibold uppercase tracking-wider text-indigo-300/90"
                        style={{
                          borderLeft: "3px solid rgba(129,140,248,0.5)",
                          paddingLeft: "0.75rem",
                        }}
                      >
                        {MONTH_NAMES[monthKey]} 2026
                      </h3>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {shows.map((show) => (
                          <li
                            key={`${show.month}-${show.day}-${show.venue}`}
                            className="group p-4 rounded-lg bg-white/5 border border-white/10 text-left transition-colors hover:border-indigo-500/40 hover:bg-white/10 pl-5"
                            style={{
                              borderLeftWidth: "3px",
                              borderLeftColor: "rgba(129,140,248,0.4)",
                            }}
                          >
                            <span className="font-semibold text-white tabular-nums group-hover:text-indigo-200/90 transition-colors">
                              {show.month} {show.day}
                            </span>
                            <span className="text-slate-400 text-sm block mt-0.5">
                              {show.city}, {show.state}
                            </span>
                            <span className="text-slate-300 text-sm font-medium block mt-1">
                              {show.venue}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
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
                  For bookings, collabs, or just to say hi — fill out the form
                  below. Submissions go to ericcapiz@gmail.com.
                </p>
                <ContactForm />
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
