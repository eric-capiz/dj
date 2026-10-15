"use client";

import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null): void {
  lenis = instance;
}

export function scrollToSection(selector: string): void {
  if (typeof document === "undefined") return;
  const el = document.querySelector(selector);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function scrollToTop(): void {
  if (lenis) lenis.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
