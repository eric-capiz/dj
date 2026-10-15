import type { Metadata, Viewport } from "next";
import { Anton, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BASSMENT — Eric Capiz // Warehouse Sets",
  description:
    "BASSMENT is Eric Capiz on the decks: warehouse techno, hard groove and raw electronics. Chicago-born. 130+ BPM. No requests.",
  openGraph: {
    title: "BASSMENT — Eric Capiz",
    description:
      "Warehouse techno / hard groove / raw electronics. Mixes, the booth, tour dates, booking.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${mono.variable} bg-ink font-grotesk text-bone antialiased`}
      >
        {children}
        {/* photocopy grain */}
        <div aria-hidden className="grain-overlay" />
        {/* scanlines */}
        <div aria-hidden className="scanlines-overlay" />
      </body>
    </html>
  );
}
