"use client";

const NAV_LINKS: { href: string; label: string; external?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/samples", label: "Samples" },
  { href: "/contact", label: "Contact" },
  { href: "/residencies", label: "Tour dates" },
  { href: "/media", label: "Media" },
  { href: "https://soundcloud.com", label: "SoundCloud", external: true },
  { href: "https://instagram.com", label: "Instagram", external: true },
  { href: "https://threads.net", label: "Thread", external: true },
];

const linkClass =
  "text-sm sm:text-base text-indigo-200/90 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06060a] rounded";

interface HeroNavProps {
  /** Called for internal links: show section below hero and scroll (no route change) */
  onNavClick?: (path: string) => void;
}

export function HeroNav({ onNavClick }: HeroNavProps) {
  return (
    <nav
      className="flex flex-wrap justify-center gap-x-5 gap-y-2 sm:gap-x-6 sm:gap-y-3 px-4"
      aria-label="Main navigation"
    >
      {NAV_LINKS.map(({ href, label, external }) => {
        if (external) {
          return (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {label}
            </a>
          );
        }
        // Internal: single-page only — button shows content below hero and scrolls (no navigation)
        return (
          <button
            key={href}
            type="button"
            onClick={() => onNavClick?.(href)}
            className={`${linkClass} bg-transparent border-none cursor-pointer font-inherit p-0`}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
