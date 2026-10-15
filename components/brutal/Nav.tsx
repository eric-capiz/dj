"use client";

const LINKS = [
  { label: "MIXES", href: "#mixes" },
  { label: "BOOTH", href: "#booth" },
  { label: "TOUR", href: "#tour" },
  { label: "PHOTOS", href: "#gallery" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[80] border-b-2 border-bone/20 bg-ink">
      <div className="flex h-14 items-stretch justify-between">
        <a
          href="#top"
          className="glitch-hover flex items-center gap-2 border-r-2 border-bone/20 bg-safety px-4 font-display text-xl uppercase text-ink"
        >
          BASSMENT
        </a>
        <nav className="hidden items-stretch md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex items-center border-l-2 border-bone/20 px-5 font-grotesk text-xs font-bold uppercase tracking-[0.25em] text-bone transition-colors hover:bg-bone hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#book"
          className="flex items-center gap-2 border-l-2 border-bone/20 px-4 md:px-6 font-grotesk text-xs font-bold uppercase tracking-[0.25em] text-acid transition-colors hover:bg-acid hover:text-ink"
        >
          <span className="blink-hard inline-block h-2 w-2 bg-current" />
          Book
        </a>
      </div>
    </header>
  );
}
