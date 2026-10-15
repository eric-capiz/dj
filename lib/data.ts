// BASSMENT data. Shapes kept identical to the previous version so the
// (now dead) cosmic routes/components still type-check.

export interface Track {
  name: string;
  style: string;
  bpm: number;
  src: string;
}

export const TRACKS: Track[] = [
  { name: "CONCRETE POETRY", style: "Raw", bpm: 132, src: "/audio/demo1.mp3" },
  { name: "SUB PRESSURE", style: "Techno", bpm: 135, src: "/audio/demo2.mp3" },
  { name: "NIGHT SHIFT", style: "Deep", bpm: 126, src: "/audio/demo3.mp3" },
  { name: "PILEDRIVER", style: "Hard Groove", bpm: 140, src: "/audio/demo4.mp3" },
  { name: "RUST BELT", style: "Industrial", bpm: 130, src: "/audio/demo5.mp3" },
  { name: "COLD STORAGE", style: "Dub Techno", bpm: 124, src: "/audio/demo6.mp3" },
  { name: "BLACKOUT", style: "Peak Time", bpm: 138, src: "/audio/demo7.mp3" },
  { name: "STEEL WOOL", style: "Breaks", bpm: 128, src: "/audio/demo8.mp3" },
  { name: "AFTERHOURS", style: "Hypnotic", bpm: 122, src: "/audio/demo9.mp3" },
  { name: "LAST TRAIN", style: "Driving", bpm: 134, src: "/audio/demo10.mp3" },
  { name: "BASSMENT TAPE", style: "Bonus", bpm: 120, src: "/audio/demo11.mp3" },
];

export interface TourStop {
  date: string;
  city: string;
  venue: string;
  status: "tickets" | "soldout" | "soon";
}

export const TOUR: TourStop[] = [
  { date: "NOV 14 2026", city: "Chicago, IL", venue: "The Salt Shed", status: "tickets" },
  { date: "NOV 28 2026", city: "Detroit, MI", venue: "Tangent Gallery", status: "tickets" },
  { date: "DEC 12 2026", city: "Brooklyn, NY", venue: "Knockdown Center", status: "tickets" },
  { date: "DEC 31 2026", city: "Chicago, IL", venue: "Radius — NYE", status: "soldout" },
  { date: "JAN 23 2027", city: "Los Angeles, CA", venue: "Warehouse 22", status: "tickets" },
  { date: "FEB 13 2027", city: "Berlin, DE", venue: "Tresor", status: "soon" },
  { date: "FEB 27 2027", city: "London, UK", venue: "Fold", status: "soon" },
  { date: "MAR 20 2027", city: "Tokyo, JP", venue: "WOMB", status: "soon" },
];

export interface GalleryImage {
  src: string;
  caption: string;
  credit: string;
}

export const GALLERY: GalleryImage[] = [
  {
    src: "/img/dj-gallery-2.webp",
    caption: "EVIDENCE 001 — CROWD CONTROL",
    credit: "Pexels",
  },
  {
    src: "/img/dj-gallery-1.webp",
    caption: "EVIDENCE 002 — BOOTH CAM",
    credit: "Xuân Thống Trần / Pexels",
  },
  {
    src: "/img/dj-gallery-3.webp",
    caption: "EVIDENCE 003 — MAIN ROOM",
    credit: "Caio Rosendo / Pexels",
  },
  {
    src: "/img/dj-gallery-4.webp",
    caption: "EVIDENCE 004 — 4AM",
    credit: "MART PRODUCTION / Pexels",
  },
];

export const HERO_IMAGE = {
  src: "/img/dj-hero.webp",
  credit: "Alena Darmel / Pexels",
};

export const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "SoundCloud", href: "https://soundcloud.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "X", href: "https://x.com" },
];

export const DOCTRINE: string[] = [
  "NO HEADLINERS. NO BOTTLE SERVICE.",
  "FOUR WALLS. ONE SYSTEM. NO MERCY.",
  "IF IT'S UNDER 120 BPM, IT'S AMBIENT.",
  "THE DANCEFLOOR IS THE DRESS CODE.",
];

// Kept for the (dead) cosmic components that still import them.
export const BOOKING_EMAIL = "ericcapiz@gmail.com";

export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "––:––";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
