export interface Track {
  name: string;
  style: string;
  bpm: number;
  src: string;
}

export const TRACKS: Track[] = [
  { name: "Cosmic Drift", style: "House", bpm: 124, src: "/audio/demo1.mp3" },
  { name: "Lunar Bass", style: "Techno", bpm: 128, src: "/audio/demo2.mp3" },
  { name: "Nebula Keys", style: "Melodic", bpm: 122, src: "/audio/demo3.mp3" },
  { name: "Orbit Loop", style: "Deep House", bpm: 120, src: "/audio/demo4.mp3" },
  { name: "Stellar Drop", style: "Tech House", bpm: 126, src: "/audio/demo5.mp3" },
  { name: "Void Echo", style: "Minimal", bpm: 125, src: "/audio/demo6.mp3" },
  { name: "Solar Flare", style: "Progressive", bpm: 123, src: "/audio/demo7.mp3" },
  { name: "Gravity Well", style: "Electro", bpm: 128, src: "/audio/demo8.mp3" },
  { name: "Starfield", style: "House", bpm: 124, src: "/audio/demo9.mp3" },
  { name: "Pulse", style: "Techno", bpm: 127, src: "/audio/demo10.mp3" },
  { name: "Eclipse", style: "Melodic", bpm: 121, src: "/audio/demo11.mp3" },
];

export interface TourStop {
  date: string;
  city: string;
  venue: string;
  status: "tickets" | "soldout" | "soon";
}

export const TOUR: TourStop[] = [
  { date: "NOV 14 2026", city: "Chicago, IL", venue: "Sound Bar", status: "tickets" },
  { date: "NOV 21 2026", city: "Detroit, MI", venue: "Magic Stick", status: "tickets" },
  { date: "DEC 05 2026", city: "Miami, FL", venue: "LIV Nightclub", status: "soldout" },
  { date: "DEC 12 2026", city: "New York, NY", venue: "Elsewhere", status: "tickets" },
  { date: "DEC 31 2026", city: "Las Vegas, NV", venue: "Hakkasan Nightclub", status: "soldout" },
  { date: "JAN 16 2027", city: "Los Angeles, CA", venue: "Exchange LA", status: "tickets" },
  { date: "FEB 06 2027", city: "Berlin, DE", venue: "Tresor", status: "soon" },
  { date: "FEB 20 2027", city: "London, UK", venue: "Fabric", status: "soon" },
  { date: "MAR 13 2027", city: "Tokyo, JP", venue: "WOMB", status: "soon" },
];

export interface GalleryImage {
  src: string;
  caption: string;
  credit: string;
}

export const GALLERY: GalleryImage[] = [
  {
    src: "/img/dj-gallery-2.webp",
    caption: "Sound Bar — Chicago",
    credit: "Pexels",
  },
  {
    src: "/img/dj-gallery-1.webp",
    caption: "LED Wall Sessions",
    credit: "Xuân Thống Trần / Pexels",
  },
  {
    src: "/img/dj-gallery-3.webp",
    caption: "Festival Main Stage",
    credit: "Caio Rosendo / Pexels",
  },
  {
    src: "/img/dj-gallery-4.webp",
    caption: "Red Room Afterhours",
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

export const BOOKING_EMAIL = "ericcapiz@gmail.com";

export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "––:––";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
