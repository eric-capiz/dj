import type { Metadata, Viewport } from "next";
import { Inter_Tight, Inter } from "next/font/google";
import "./globals.css";

const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eric Capiz — DJ & Producer",
  description:
    "Eric Capiz is a Chicago-born, Denver-based DJ playing house and techno. Latest mixes, tour dates, EPK, and booking.",
  openGraph: {
    title: "Eric Capiz — DJ & Producer",
    description:
      "House / techno / club. Latest mixes, tour dates, press kit, booking.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${sans.variable} bg-ink font-sans text-bone antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
