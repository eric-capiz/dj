// Professional site data for ericcapiz — DJ site (round 4).
// NOTE: lib/data.ts is intentionally left untouched — dead components from
// earlier rounds still import its shapes.

export const BOOKING_EMAIL = "ericcapiz@gmail.com";

export interface ProTrack {
  name: string;
  genre: string;
  bpm: number;
  src: string;
}

export const TRACKS: ProTrack[] = [
  { name: "Midnight Frequency", genre: "House", bpm: 124, src: "/audio/demo1.mp3" },
  { name: "Concrete Poetry", genre: "Tech House", bpm: 126, src: "/audio/demo2.mp3" },
  { name: "Neon District", genre: "Deep House", bpm: 122, src: "/audio/demo3.mp3" },
  { name: "Piledriver", genre: "Techno", bpm: 132, src: "/audio/demo4.mp3" },
  { name: "Afterhours", genre: "Melodic", bpm: 120, src: "/audio/demo5.mp3" },
  { name: "Sub Pressure", genre: "Bass House", bpm: 128, src: "/audio/demo6.mp3" },
  { name: "Last Train", genre: "Progressive", bpm: 126, src: "/audio/demo7.mp3" },
  { name: "Velvet Rope", genre: "Deep House", bpm: 123, src: "/audio/demo8.mp3" },
  { name: "Warehouse Hymn", genre: "Techno", bpm: 130, src: "/audio/demo9.mp3" },
  { name: "Golden Hour", genre: "House", bpm: 124, src: "/audio/demo10.mp3" },
  { name: "Encore", genre: "Peak Time", bpm: 128, src: "/audio/demo11.mp3" },
];

export interface TourDate {
  /** Local venue time, ISO */
  datetime: string;
  city: string;
  venue: string;
  status: "tickets" | "low" | "soldout" | "soon";
  ticketUrl?: string;
}

export const TOUR: TourDate[] = [
  { datetime: "2026-11-14T22:00:00", city: "Chicago, IL", venue: "The Salt Shed", status: "tickets" },
  { datetime: "2026-11-28T23:00:00", city: "Detroit, MI", venue: "Tangent Gallery", status: "tickets" },
  { datetime: "2026-12-12T22:00:00", city: "Brooklyn, NY", venue: "Knockdown Center", status: "low" },
  { datetime: "2026-12-31T21:00:00", city: "Chicago, IL", venue: "Radius — NYE", status: "soldout" },
  { datetime: "2027-01-23T22:00:00", city: "Los Angeles, CA", venue: "Warehouse 22", status: "tickets" },
  { datetime: "2027-02-13T23:00:00", city: "Berlin, DE", venue: "Tresor", status: "soon" },
  { datetime: "2027-02-27T23:00:00", city: "London, UK", venue: "FOLD", status: "soon" },
  { datetime: "2027-03-20T23:00:00", city: "Tokyo, JP", venue: "WOMB", status: "soon" },
];

export interface GalleryPhoto {
  src: string;
  caption: string;
  credit: string;
}

export const GALLERY: GalleryPhoto[] = [
  { src: "/img/dj-hero.webp", caption: "Live at the booth", credit: "Alena Darmel / Pexels" },
  { src: "/img/dj-gallery-1.webp", caption: "Peak-time energy", credit: "Xuân Thống Trần / Pexels" },
  { src: "/img/dj-gallery-2.webp", caption: "Club night, Chicago", credit: "Pexels" },
  { src: "/img/dj-gallery-3.webp", caption: "Festival main stage", credit: "Caio Rosendo / Pexels" },
  { src: "/img/dj-gallery-4.webp", caption: "Afterhours set", credit: "MART PRODUCTION / Pexels" },
];

export const BIO_SHORT =
  "Chicago-born, Denver-based DJ playing house and techno with a focus on long, patient sets — deep grooves early, peak-time pressure late.";

export const BIO_LONG = [
  "Eric Capiz is a Chicago-born, Denver-based DJ whose sets move between deep house, tech house and driving techno. Raised on Chicago's club culture, his approach is patient and floor-first: long blends, careful pacing, and track selection built for rooms that dance, not phones that film.",
  "His mixes have become a calling card — eleven studio sessions spanning deep, hypnotic grooves to peak-time pressure — and his calendar keeps him moving between the Midwest, both coasts, and select international dates.",
  "For bookings, press, and remix inquiries, use the booking form below.",
];

export const STATS = [
  { value: 11, suffix: "", label: "Studio mixes released" },
  { value: 8, suffix: "", label: "Tour dates announced" },
  { value: 4, suffix: "+", label: "Years behind the decks" },
  { value: 124, suffix: "", label: "Average BPM, peak time" },
];

export const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "SoundCloud", href: "https://soundcloud.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "X", href: "https://x.com" },
];

export const TECH_RIDER: string[] = [
  "2× Pioneer CDJ-3000 (or equivalent) + DJM-A9 / DJM-900NXS2",
  "Booth monitor with independent volume control",
  "2× XLR or RCA inputs available for backup controller",
  "Stable power at the booth — no shared lighting circuits",
  "Bottled water at the booth",
];

export function formatClock(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatTourDate(iso: string): { day: string; month: string; year: string; weekday: string } {
  const d = new Date(iso);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    year: String(d.getFullYear()),
    weekday: d.toLocaleString("en-US", { weekday: "short" }).toUpperCase(),
  };
}

/** Next upcoming show strictly after now, or null. */
export function nextShow(now: number = Date.now()): TourDate | null {
  const upcoming = TOUR.filter((t) => new Date(t.datetime).getTime() > now).sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );
  return upcoming[0] ?? null;
}
