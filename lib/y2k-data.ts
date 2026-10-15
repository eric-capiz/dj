// CHROME//EC data — Y2K liquid-chrome reboot.
// Shapes mirror lib/data.ts so dead code keeps type-checking.

export interface Track {
  name: string;
  style: string;
  bpm: number;
  src: string;
}

export const TRACKS: Track[] = [
  { name: "DIAL-UP DREAMS", style: "Hyperpop", bpm: 140, src: "/audio/demo1.mp3" },
  { name: "BUBBLEGUM BASS", style: "Bubblegum", bpm: 128, src: "/audio/demo2.mp3" },
  { name: "CYBER TEA ROOM", style: "Ambient", bpm: 96, src: "/audio/demo3.mp3" },
  { name: "FROSTED TIPS", style: "Eurodance", bpm: 138, src: "/audio/demo4.mp3" },
  { name: "LAVA LAMP", style: "Downtempo", bpm: 104, src: "/audio/demo5.mp3" },
  { name: "TAMAGOTCHI", style: "Chiptune", bpm: 152, src: "/audio/demo6.mp3" },
  { name: "GLITTER MODEM", style: "Glitch", bpm: 130, src: "/audio/demo7.mp3" },
  { name: "AFTER THE MALL", style: "Synthwave", bpm: 116, src: "/audio/demo8.mp3" },
  { name: "JUICE BOX", style: "Pop", bpm: 124, src: "/audio/demo9.mp3" },
  { name: "STARRY CHATROOM", style: "Trance", bpm: 136, src: "/audio/demo10.mp3" },
  { name: "Y2K SURVIVOR", style: "Bonus", bpm: 128, src: "/audio/demo11.mp3" },
];

export interface TourStop {
  date: string;
  city: string;
  venue: string;
  status: "tickets" | "soldout" | "soon";
}

export const TOUR: TourStop[] = [
  { date: "NOV 14 2026", city: "Chicago, IL", venue: "Neo Metro", status: "tickets" },
  { date: "NOV 28 2026", city: "Detroit, MI", venue: "The Cyber Loft", status: "tickets" },
  { date: "DEC 12 2026", city: "Brooklyn, NY", venue: "Glasshouse", status: "tickets" },
  { date: "DEC 31 2026", city: "Chicago, IL", venue: "Y2K NYE @ Radius", status: "soldout" },
  { date: "JAN 23 2027", city: "Los Angeles, CA", venue: "Pixel Warehouse", status: "tickets" },
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
  { src: "/img/dj-gallery-2.webp", caption: "EXHIBIT A — LAN PARTY", credit: "Pexels" },
  { src: "/img/dj-gallery-1.webp", caption: "EXHIBIT B — BOOTH CAM", credit: "Xuân Thống Trần / Pexels" },
  { src: "/img/dj-gallery-3.webp", caption: "EXHIBIT C — MAIN ROOM", credit: "Caio Rosendo / Pexels" },
  { src: "/img/dj-gallery-4.webp", caption: "EXHIBIT D — 4AM", credit: "MART PRODUCTION / Pexels" },
];

export const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "SoundCloud", href: "https://soundcloud.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "X", href: "https://x.com" },
];

export const BOOKING_EMAIL = "ericcapiz@gmail.com";

export const PERSONA = "CHROME//EC";

export function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "--:--";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
