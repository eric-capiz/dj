"use client";

import { useState } from "react";
import { BIO_LONG, BIO_SHORT, BOOKING_EMAIL, GALLERY, TECH_RIDER, TOUR, formatTourDate } from "@/lib/pro-data";
import { Reveal, SectionHeading } from "./ui";

async function downloadOneSheet() {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = 595;
  const M = 56;
  let y = 72;

  // Header band
  doc.setFillColor(11, 11, 12);
  doc.rect(0, 0, W, 150, "F");
  doc.setTextColor(232, 180, 74);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("ELECTRONIC PRESS KIT — ONE SHEET", M, 52);
  doc.setTextColor(245, 244, 240);
  doc.setFontSize(38);
  doc.text("ERIC CAPIZ", M, 96);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(154, 154, 160);
  doc.text("DJ · Producer — Chicago-born, Denver-based", M, 120);

  y = 190;
  const line = (gap = 8) => {
    y += gap;
  };

  // Bio
  doc.setTextColor(11, 11, 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("BIO", M, y);
  line(18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(40, 40, 44);
  for (const para of BIO_LONG) {
    const lines = doc.splitTextToSize(para, W - M * 2);
    doc.text(lines, M, y);
    y += lines.length * 14 + 10;
  }

  // Upcoming dates
  line(6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(11, 11, 12);
  doc.text("UPCOMING DATES", M, y);
  line(18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  const upcoming = TOUR.filter((t) => new Date(t.datetime).getTime() > Date.now()).slice(0, 8);
  for (const t of upcoming) {
    const d = formatTourDate(t.datetime);
    doc.setTextColor(40, 40, 44);
    doc.text(`${d.day} ${d.month} ${d.year}`, M, y);
    doc.text(`${t.city} — ${t.venue}`, M + 120, y);
    y += 16;
  }

  // Tech rider
  line(10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(11, 11, 12);
  doc.text("TECH RIDER (ABBREVIATED)", M, y);
  line(18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(40, 40, 44);
  for (const item of TECH_RIDER) {
    const lines = doc.splitTextToSize(`•  ${item}`, W - M * 2 - 12);
    doc.text(lines, M + 12, y);
    y += lines.length * 14 + 4;
  }

  // Contact footer
  line(14);
  doc.setDrawColor(232, 180, 74);
  doc.setLineWidth(2);
  doc.line(M, y, W - M, y);
  line(22);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(11, 11, 12);
  doc.text("BOOKING / PRESS", M, y);
  line(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 44);
  doc.text(BOOKING_EMAIL, M, y);

  doc.save("eric-capiz-one-sheet.pdf");
}

export function Epk() {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const copyBio = async () => {
    try {
      await navigator.clipboard.writeText([BIO_SHORT, ...BIO_LONG].join("\n\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handlePdf = async () => {
    setGenerating(true);
    try {
      await downloadOneSheet();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section id="epk" className="scroll-mt-20 border-y border-line bg-coal py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Press"
          title="Electronic press kit"
          blurb="Everything a promoter or journalist needs: hi-res photos, a copy-ready bio, the tech rider, and a downloadable one-sheet."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {/* One-sheet PDF */}
          <Reveal className="rounded-2xl border border-line bg-ink p-8">
            <h3 className="font-display text-xl font-bold text-bone">One-sheet PDF</h3>
            <p className="mt-3 text-sm text-muted">
              Bio, upcoming dates, abbreviated tech rider and contact — generated
              instantly as a PDF.
            </p>
            <button
              onClick={handlePdf}
              disabled={generating}
              className="mt-6 w-full rounded-full bg-amber px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {generating ? "Generating…" : "Download one-sheet"}
            </button>
          </Reveal>

          {/* Photos */}
          <Reveal delay={0.08} className="rounded-2xl border border-line bg-ink p-8">
            <h3 className="font-display text-xl font-bold text-bone">Press photos</h3>
            <p className="mt-3 text-sm text-muted">
              High-resolution photos, free for editorial and promotional use with
              credit.
            </p>
            <ul className="mt-6 flex flex-col gap-2">
              {GALLERY.map((g, i) => (
                <li key={g.src}>
                  <a
                    href={g.src}
                    download={`eric-capiz-press-${i + 1}.webp`}
                    className="flex items-center justify-between rounded-lg border border-line px-4 py-2.5 text-sm text-bone transition-colors hover:border-amber hover:text-amber"
                  >
                    <span className="truncate">Photo {i + 1} — {g.caption}</span>
                    <span aria-hidden>↓</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Bio + rider */}
          <Reveal delay={0.16} className="rounded-2xl border border-line bg-ink p-8">
            <h3 className="font-display text-xl font-bold text-bone">Bio & rider</h3>
            <p className="mt-3 text-sm text-muted">
              Copy the full bio for listings and programs.
            </p>
            <button
              onClick={copyBio}
              className="mt-6 w-full rounded-full border border-line px-6 py-3 text-sm font-semibold text-bone transition-colors hover:border-amber hover:text-amber"
            >
              {copied ? "Copied to clipboard ✓" : "Copy bio"}
            </button>
            <h4 className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Tech rider
            </h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-bone/80">
              {TECH_RIDER.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-amber" aria-hidden>·</span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
