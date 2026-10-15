"use client";

import type { ReactNode } from "react";

export function Marquee({
  children,
  slow = false,
  className = "",
}: {
  children: ReactNode;
  slow?: boolean;
  className?: string;
}) {
  return (
    <div className={`marquee ${className}`}>
      <div className={`marquee-track ${slow ? "slow" : ""}`}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

export function MarqueeItem({ children }: { children: ReactNode }) {
  return (
    <span className="mx-6 flex items-center gap-6 whitespace-nowrap">
      {children}
      <span className="inline-block h-2 w-2 rotate-45 bg-neon" aria-hidden />
    </span>
  );
}
