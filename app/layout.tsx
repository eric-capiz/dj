import type { Metadata, Viewport } from "next";
import { Titan_One, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Titan_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CHROME//EC — Eric Capiz // Hyperpop DJ",
  description:
    "CHROME//EC is Eric Capiz on the decks: hyperpop pressure, bubblegum bass and chrome-plated club energy. Chicago-born. Mixes, the gloss synth lab, tour stubs, booking.",
  openGraph: {
    title: "CHROME//EC — Eric Capiz",
    description:
      "Hyperpop / bubblegum bass / chrome club energy. Mixes, synth lab, tour dates, booking.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0d0628",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
