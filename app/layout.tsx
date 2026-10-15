import type { Metadata, Viewport } from "next";
import { Unbounded, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "COSMIC DRIFT — DJ // Transmission 001",
  description:
    "Cosmic Drift is a Chicago-born DJ transmitting deep house, techno and cosmic grooves across the planet. Listen to the mixes, catch the tour, book the night.",
  openGraph: {
    title: "COSMIC DRIFT — DJ",
    description: "Deep house / techno / cosmic grooves. Listen, tour dates, booking.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050508",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${display.variable} ${body.variable} bg-void font-body text-zinc-100 antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
