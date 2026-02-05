import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cosmic Drift | DJ",
  description: "Cosmic Drift — DJ. Book, listen, and connect.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#06060a] text-white min-w-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
