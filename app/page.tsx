"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Hero } from "@/components/Hero";
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { TourDatesCarousel } from "@/components/TourDatesCarousel/TourDatesCarousel";
import { DomeGallery } from "@/components/DomeGallery";
import { Threads } from "@/components/Threads";
import type { TourMonth } from "@/components/TourDatesCarousel/TourDatesCarousel";

type Section = "" | "about" | "samples" | "contact" | "residencies" | "media";

function pathToSection(path: string): Section {
  const name = path.replace(/^\/+/, "").toLowerCase();
  if (!name || name === "home") return "";
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
  { name: "Cosmic Drift", style: "House", bpm: "124", src: "/audio/demo1.mp3" },
  { name: "Lunar Bass", style: "Techno", bpm: "128", src: "/audio/demo2.mp3" },
  {
    name: "Nebula Keys",
    style: "Melodic",
    bpm: "122",
    src: "/audio/demo3.mp3",
  },
  {
    name: "Orbit Loop",
    style: "Deep House",
    bpm: "120",
    src: "/audio/demo4.mp3",
  },
  {
    name: "Stellar Drop",
    style: "Tech House",
    bpm: "126",
    src: "/audio/demo5.mp3",
  },
  { name: "Void Echo", style: "Minimal", bpm: "125", src: "/audio/demo6.mp3" },
  {
    name: "Solar Flare",
    style: "Progressive",
    bpm: "123",
    src: "/audio/demo7.mp3",
  },
  {
    name: "Gravity Well",
    style: "Electro",
    bpm: "128",
    src: "/audio/demo8.mp3",
  },
  { name: "Starfield", style: "House", bpm: "124", src: "/audio/demo9.mp3" },
  { name: "Pulse", style: "Techno", bpm: "127", src: "/audio/demo10.mp3" },
  { name: "Eclipse", style: "Melodic", bpm: "121", src: "/audio/demo11.mp3" },
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

function buildTourMonths(): TourMonth[] {
  const grouped = TOUR_DATES.reduce<Record<string, typeof TOUR_DATES>>(
    (acc, show) => {
      if (!acc[show.month]) acc[show.month] = [];
      acc[show.month].push(show);
      return acc;
    },
    {}
  );
  return Object.entries(grouped).map(([monthKey, shows]) => ({
    monthKey,
    monthName: MONTH_NAMES[monthKey] ?? monthKey,
    shows,
  }));
}

const TOUR_MONTHS = buildTourMonths();

const MEDIA_IMAGES = [
  "https://images.unsplash.com/photo-1763630054438-5c76b6cb4b34?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1763630055101-2f6d6305dc38?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1763630055027-4a0ba423bd5f?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1541126274323-dbac58d14741?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&auto=format&fit=crop&q=60", // unsplash.com/photos/VFKxeErl3O0
  "https://images.unsplash.com/photo-1461784180009-21121b2f204c?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1630395822970-acd6a691d97e?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1578736641330-3155e606cd40?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1622743941533-cde694bff56a?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1574154883606-19fa4f836c54?w=500&auto=format&fit=crop&q=60",
];

export default function Home() {
  const [section, setSection] = useState<Section>("");
  const sectionRef = useRef<HTMLElement>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleNavClick = useCallback((path: string) => {
    const next = pathToSection(path);
    setSection(next);
  }, []);

  useEffect(() => {
    if (!section) return;
    // Section just mounted — wait for layout then scroll so content appears below hero
    const t = setTimeout(() => {
      const el =
        sectionRef.current ?? document.getElementById(`section-${section}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => clearTimeout(t);
  }, [section]);

  return (
    <main className="w-full min-w-0 overflow-x-hidden">
      <Hero onNavClick={handleNavClick} />
      {/* Content below hero: shown when a nav knob is clicked; scrolls into view */}
      {section && (
        <section
          id={`section-${section}`}
          ref={sectionRef}
          className="relative z-10 w-full py-10 sm:py-14 md:py-16 px-4 sm:px-6 overflow-hidden min-h-[50vh] sm:min-h-[60vh]"
          aria-label={section}
        >
          {/* Dark gradient base — behind Threads */}
          <div
            className="absolute inset-0 -z-1"
            style={{
              background:
                "linear-gradient(180deg, rgba(67,56,202,0.06) 0%, #06060a 12%, #06060a 100%)",
            }}
          />
          {/* React Bits Threads — only on Samples section */}
          {section === "samples" && (
            <div className="absolute inset-0 -z-1 pointer-events-none">
              <Threads
                color={[0.32, 0.15, 1]}
                amplitude={2.9}
                distance={0}
                enableMouseInteraction={false}
              />
            </div>
          )}
          {/* Content in its own stacking context so it always paints above canvas */}
          <div
            className="relative z-0 isolate w-full"
            style={{ transform: "translateZ(0)" }}
          >
            {/* Soft glow line at top */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px max-w-md opacity-60"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(129,140,248,0.5), transparent)",
              }}
            />
            {section === "media" ? (
              <>
                <div className="w-full max-w-2xl mx-auto text-center space-y-3 sm:space-y-4">
                  <h2
                    className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6 bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)",
                      textShadow: "0 0 40px rgba(129,140,248,0.15)",
                    }}
                  >
                    Media
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base">
                    Photos and video from past sets and events. Drag to rotate,
                    click to expand.
                  </p>
                </div>
                <div
                  className="w-full max-w-6xl mx-auto mt-8"
                  style={{ width: "100%", height: "60vh", minHeight: "420px" }}
                >
                  <DomeGallery
                    images={MEDIA_IMAGES}
                    fit={0.8}
                    minRadius={600}
                    maxVerticalRotationDeg={0}
                    segments={34}
                    dragDampening={2}
                    grayscale={false}
                    overlayBlurColor="#06060a"
                  />
                </div>
                <div className="max-w-2xl mx-auto text-center mt-6 sm:mt-8">
                  <p className="text-slate-500 text-sm">
                    Reels and more coming soon.
                  </p>
                </div>
              </>
            ) : (
              <div
                className={`section-content mx-auto relative ${
                  section === "samples"
                    ? "section-content--samples"
                    : "section-content--narrow"
                }`}
              >
                {section === "about" && (
                  <div className="text-center space-y-4 sm:space-y-6 w-full">
                    <h2
                      className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6 bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)",
                        textShadow: "0 0 40px rgba(129,140,248,0.15)",
                      }}
                    >
                      About
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base">
                      Space Jam got its start at some of the city’s busiest
                      spots — The Orbit, Neon Lounge, and Stellar Room, among
                      others — each of which turned into a residency.
                    </p>
                    <p className="text-slate-400 text-sm sm:text-base">
                      From there, Space Jam has taken the stage in some of the
                      largest rooms in town, including arena gigs and official
                      in-venue DJ sets for pro sports and college games. Whether
                      it’s a packed club or a stadium, the energy stays the
                      same.
                    </p>
                    <p className="text-slate-400 text-sm sm:text-base">
                      No matter the size of the room, Space Jam brings full
                      energy every time and keeps the crowd turned up from open
                      to close.
                    </p>
                    <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/10 text-left max-w-lg mx-auto px-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                        <span
                          className="w-1 h-4 sm:h-5 rounded-full shrink-0"
                          style={{
                            background:
                              "linear-gradient(180deg, #818cf8, #6366f1)",
                          }}
                        />
                        What we do
                      </h3>
                      <p className="text-slate-400 mt-2 sm:mt-3 text-sm sm:text-base">
                        We focus on long-format sets that take the room on a
                        journey: warm-up grooves, peak-time energy, and
                        late-night wind-downs. Every set is built for the venue
                        and the crowd.
                      </p>
                      <p className="text-slate-400 mt-2 sm:mt-3 text-sm sm:text-base">
                        Beyond the decks, we run a monthly radio show and have
                        appeared on compilations and one-off releases. New
                        material is on the way.
                      </p>
                    </div>
                    <p className="text-slate-500 text-sm pt-3 sm:pt-4">
                      Available for residencies, one-offs, and tours.
                    </p>
                  </div>
                )}
                {section === "samples" && (
                  <div className="space-y-4 sm:space-y-8 w-full">
                    <h2
                      className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-8 bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)",
                        textShadow: "0 0 40px rgba(129,140,248,0.15)",
                      }}
                    >
                      Samples
                    </h2>
                    <p className="text-slate-400 text-center text-sm sm:text-base">
                      Browse and preview sounds from recent sets and releases.
                      These tracks have been featured in our mixes and live sets
                      over the past year.
                    </p>
                    <p className="text-slate-500 text-center text-xs sm:text-sm">
                      Click play to preview. All BPM and genre tags are
                      approximate.
                    </p>
                    <audio
                      ref={audioRef}
                      onEnded={() => setPlayingIndex(null)}
                      className="sr-only"
                      aria-hidden
                    />
                    <ul className="grid w-full min-w-0 grid-cols-1 gap-3 sm:gap-6 lg:gap-8 lg:grid-cols-2">
                      {SAMPLES.map((track, i) => {
                        const isPlaying = playingIndex === i;
                        return (
                          <li
                            key={track.name}
                            className="group min-w-0 w-full p-3 sm:p-5 md:p-6 rounded-xl bg-[#0a0a0f] border border-white/10 text-left transition-colors hover:border-indigo-500/40 hover:bg-white/10 pl-4 sm:pl-6 flex items-center gap-3 sm:gap-4 relative z-10"
                            style={{
                              borderLeftWidth: "3px",
                              borderLeftColor: "rgba(129,140,248,0.4)",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                if (!audioRef.current || !track.src) return;
                                if (isPlaying) {
                                  audioRef.current.pause();
                                  setPlayingIndex(null);
                                } else {
                                  if (playingIndex !== null)
                                    audioRef.current.pause();
                                  audioRef.current.src = track.src;
                                  audioRef.current.play();
                                  setPlayingIndex(i);
                                }
                              }}
                              className="shrink-0 min-w-[44px] min-h-[44px] w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 hover:bg-indigo-500/30 hover:border-indigo-400/50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                              aria-label={isPlaying ? "Pause" : "Play"}
                            >
                              {isPlaying ? (
                                <svg
                                  className="w-5 h-5 ml-0.5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden
                                >
                                  <rect
                                    x="6"
                                    y="4"
                                    width="4"
                                    height="16"
                                    rx="1"
                                  />
                                  <rect
                                    x="14"
                                    y="4"
                                    width="4"
                                    height="16"
                                    rx="1"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-5 h-5 ml-0.5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden
                                >
                                  <path d="M8 5v14l11-7L8 5z" />
                                </svg>
                              )}
                            </button>
                            <div className="min-w-0">
                              <span className="font-medium text-white text-sm sm:text-base block group-hover:text-indigo-200/90 transition-colors">
                                {track.name}
                              </span>
                              <span className="text-slate-500 text-xs sm:text-sm">
                                {track.style} · {track.bpm} BPM
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <p className="text-slate-500 text-center text-xs sm:text-sm pt-3 sm:pt-4">
                      More tracks and full sets will be added soon. Follow us on
                      SoundCloud and Bandcamp for updates.
                    </p>
                  </div>
                )}
                {section === "residencies" && (
                  <div className="space-y-4 sm:space-y-8 w-full">
                    <div className="text-center">
                      <h2
                        className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)",
                          textShadow: "0 0 40px rgba(129,140,248,0.15)",
                        }}
                      >
                        Tour dates
                      </h2>
                      <p className="text-slate-400 text-sm sm:text-base">
                        Catch us on the road in 2026. More dates TBA.
                      </p>
                    </div>
                    <TourDatesCarousel months={TOUR_MONTHS} />
                  </div>
                )}
                {section === "contact" && (
                  <div className="text-center space-y-4 sm:space-y-8 w-full">
                    <h2
                      className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6 bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a5b4fc 100%)",
                        textShadow: "0 0 40px rgba(129,140,248,0.15)",
                      }}
                    >
                      Contact
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base px-1">
                      For bookings, collabs, or just to say hi — fill out the
                      form below. Submissions go to ericcapiz@gmail.com.
                    </p>
                    <ContactForm />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
