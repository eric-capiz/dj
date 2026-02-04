import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Space Jam | DJ",
  description: "Space Jam — DJ. Book, listen, and connect.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#06060a] text-white">{children}</body>
    </html>
  );
}
