"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

const WIDTH = 1000;
const HEIGHT = 420;
const WHEEL_R = 165;
const LEFT_WHEEL_CX = 185;
const RIGHT_WHEEL_CX = WIDTH - 185;
const WHEEL_CY = HEIGHT / 2;
const MIXER_LEFT = 380;
const MIXER_RIGHT = 620;
const MIXER_TOP = 40;
const MIXER_BOTTOM = HEIGHT - 40;

const KNOB_R = 13;
const COL1 = MIXER_LEFT + 45;
const COL2 = (MIXER_LEFT + MIXER_RIGHT) / 2;
const COL3 = MIXER_RIGHT - 45;
const ROW1 = MIXER_TOP + 95;
const ROW2 = MIXER_TOP + 130;
const ROW3 = MIXER_TOP + 165;
const FADER_W = 14;
const FADER_H = 100;
const FADER_CAP_H = 12;
const FADER1_X = MIXER_LEFT + 52;
const FADER2_X = MIXER_RIGHT - 52;
const FADER_Y = MIXER_TOP + 200;
const CROSS_Y = MIXER_BOTTOM - 38;
const CROSS_CAP_W = 36;
const CROSS_CAP_H = 20;
const CROSS_TRACK_LEFT = MIXER_LEFT + 25;
const CROSS_TRACK_RIGHT = MIXER_RIGHT - 25;
const CROSS_TRACK_W = CROSS_TRACK_RIGHT - CROSS_TRACK_LEFT;

type DragKind =
  | {
      kind: "wheel";
      side: "left" | "right";
      startX: number;
      startRotation: number;
      sessionId: number;
    }
  | { kind: "fader1"; startY: number; startVal: number }
  | { kind: "fader2"; startY: number; startVal: number }
  | { kind: "cross"; startX: number; startVal: number };

const BROWSE_CX = (MIXER_LEFT + MIXER_RIGHT) / 2;
const BROWSE_CY = MIXER_TOP + 42;
const FADER_MID_Y = FADER_Y + FADER_H / 2;

interface TurntableProps {
  className?: string;
  /** When set, nav knobs call this instead of routing; use for single-page content below hero */
  onNavClick?: (path: string) => void;
  /** When set (e.g. from Hero light rays), decorative knob glow matches this color */
  raysColor?: string;
}

// Simple deterministic "random" from seed + index (for stable colors per crossfader position)
function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Crossfader: gradual color change — interpolate between fixed palettes (no rapid flashing)
const NUM_LINK_KNOBS = 10; // browse + 9 EQ
const CROSSFADER_KEYFRAMES = [0, 0.25, 0.5, 0.75, 1] as const;

// Curated starting palette at 0.5 — space-themed, cohesive (browse + 9 EQ knobs)
const DEFAULT_KNOB_PALETTE: string[] = [
  "#22d3ee", // browse — cyan
  "#818cf8", // indigo
  "#a78bfa", // violet
  "#06b6d4", // teal
  "#6366f1", // indigo
  "#38bdf8", // sky
  "#c084fc", // purple
  "#0ea5e9", // blue
  "#8b5cf6", // violet
  "#2dd4bf", // teal
];

function getLinkColorsForSeed(seed: number): string[] {
  const rnd = mulberry32(seed);
  const out: string[] = [];
  for (let i = 0; i < NUM_LINK_KNOBS; i++) {
    const hue = Math.floor(rnd() * 360);
    const sat = 65 + rnd() * 25;
    const light = 55 + rnd() * 20;
    out.push(hslToHex(hue, sat, light));
  }
  return out;
}

// Palettes: ends (0, 1) random; center (0.5) is the curated default
const CROSSFADER_PALETTES: string[][] = CROSSFADER_KEYFRAMES.map((pos) =>
  pos === 0.5
    ? DEFAULT_KNOB_PALETTE
    : getLinkColorsForSeed(Math.round(pos * 1000))
);

function lerpHex(c0: string, c1: string, t: number): string {
  const [r0, g0, b0] = hexToRgb(c0);
  const [r1, g1, b1] = hexToRgb(c1);
  const r = Math.round(r0 + t * (r1 - r0));
  const g = Math.round(g0 + t * (g1 - g0));
  const b = Math.round(b0 + t * (b1 - b0));
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/** Smooth palette: interpolate between keyframe palettes so colors change gradually */
function getLinkColorsGradual(crossVal: number): string[] {
  const kf = CROSSFADER_KEYFRAMES;
  const palettes = CROSSFADER_PALETTES;
  if (crossVal <= kf[0]) return palettes[0];
  if (crossVal >= kf[kf.length - 1]) return palettes[palettes.length - 1];
  let i = 0;
  while (i < kf.length - 1 && kf[i + 1] < crossVal) i++;
  const t = (crossVal - kf[i]) / (kf[i + 1] - kf[i]);
  return palettes[i].map((c, j) => lerpHex(c, palettes[i + 1][j], t));
}
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Space-themed accent colors: more vivid so fader effect is obvious (wheels, dots, caps)
function primaryColorFromFader(value: number): string {
  const keyframes: [number, string][] = [
    [0, "#2563eb"],
    [0.4, "#06b6d4"],
    [1, "#14b8a6"],
  ];
  return lerpHexKeyframes(value, keyframes);
}
function secondaryColorFromFader(value: number): string {
  const keyframes: [number, string][] = [
    [0, "#4f46e5"],
    [0.4, "#c084fc"],
    [1, "#f472b6"],
  ];
  return lerpHexKeyframes(value, keyframes);
}
function lerpHexKeyframes(
  value: number,
  keyframes: [number, string][]
): string {
  for (let i = 0; i < keyframes.length - 1; i++) {
    const [t0, c0] = keyframes[i];
    const [t1, c1] = keyframes[i + 1];
    if (value >= t0 && value <= t1) {
      const t = (value - t0) / (t1 - t0);
      const [r0, g0, b0] = hexToRgb(c0),
        [r1, g1, b1] = hexToRgb(c1);
      const r = Math.round(r0 + t * (r1 - r0));
      const g = Math.round(g0 + t * (g1 - g0));
      const b = Math.round(b0 + t * (b1 - b0));
      return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }
  }
  return keyframes[keyframes.length - 1][1];
}
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}
function darkenHex(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `#${Math.min(255, Math.round(r * factor))
    .toString(16)
    .padStart(2, "0")}${Math.min(255, Math.round(g * factor))
    .toString(16)
    .padStart(2, "0")}${Math.min(255, Math.round(b * factor))
    .toString(16)
    .padStart(2, "0")}`;
}
function lightenHex(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = (x: number) => Math.min(255, Math.round(x + (255 - x) * factor));
  return `#${f(r).toString(16).padStart(2, "0")}${f(g)
    .toString(16)
    .padStart(2, "0")}${f(b).toString(16).padStart(2, "0")}`;
}

// Site links first (left 2 cols), socials last (right col). External links open in new tab.
const KNOB_NAV: Record<string, string> = {
  browse: "/",
  "eq-0-0": "/about",
  "eq-0-1": "/samples",
  "eq-0-2": "/contact",
  "eq-1-0": "/residencies",
  "eq-1-1": "/media",
  "eq-2-0": "https://soundcloud.com",
  "eq-2-1": "https://instagram.com",
  "eq-2-2": "https://threads.net",
};

const KNOB_LABELS: Record<string, { letter: string; label: string }> = {
  browse: { letter: "H", label: "Home" },
  "eq-0-0": { letter: "A", label: "About" },
  "eq-0-1": { letter: "S", label: "Samples" },
  "eq-0-2": { letter: "C", label: "Contact" },
  "eq-1-0": { letter: "T", label: "Tour dates" },
  "eq-1-1": { letter: "M", label: "Media" },
  "eq-2-0": { letter: "O", label: "SoundCloud" },
  "eq-2-1": { letter: "I", label: "Instagram" },
  "eq-2-2": { letter: "T", label: "Thread" },
};

const FADER_DEFAULT = 0.4;
const CROSS_DEFAULT = 0.5;

export default function Turntable({
  className = "",
  onNavClick,
  raysColor,
}: TurntableProps) {
  const router = useRouter();
  const handleNav = useCallback(
    (path: string) => {
      if (path.startsWith("http")) {
        window.open(path, "_blank", "noopener,noreferrer");
        return;
      }
      if (onNavClick) onNavClick(path);
      else router.push(path);
    },
    [onNavClick, router]
  );
  const [leftWheelRotation, setLeftWheelRotation] = useState(0);
  const [rightWheelRotation, setRightWheelRotation] = useState(0);
  const [pressedKnob, setPressedKnob] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    label: string;
    x: number;
    y: number;
  } | null>(null);
  const [fader1Val, setFader1Val] = useState(FADER_DEFAULT);
  const [fader2Val, setFader2Val] = useState(FADER_DEFAULT);
  const [crossVal, setCrossVal] = useState(CROSS_DEFAULT);

  const primaryColor = primaryColorFromFader(fader1Val);
  const secondaryColor = secondaryColorFromFader(fader2Val);
  const linkColors = getLinkColorsGradual(crossVal);

  const dragRef = useRef<DragKind | null>(null);
  const wheelSessionIdRef = useRef(0);
  const leftRotationRef = useRef(0);
  const rightRotationRef = useRef(0);
  const captureRef = useRef<{ target: Element; pointerId: number } | null>(
    null
  );

  useEffect(() => {
    if (dragRef.current?.kind !== "wheel") {
      leftRotationRef.current = leftWheelRotation;
      rightRotationRef.current = rightWheelRotation;
    }
  }, [leftWheelRotation, rightWheelRotation]);

  const handleWheelMouseDown = useCallback(
    (side: "left" | "right", e: React.PointerEvent) => {
      e.preventDefault();
      const target = e.currentTarget as Element;
      const pointerId = e.pointerId;
      try {
        target.setPointerCapture(pointerId);
        captureRef.current = { target, pointerId };
      } catch {
        captureRef.current = null;
      }
      wheelSessionIdRef.current += 1;
      const startRotation =
        side === "left" ? leftRotationRef.current : rightRotationRef.current;
      dragRef.current = {
        kind: "wheel",
        side,
        startX: e.clientX,
        startRotation,
        sessionId: wheelSessionIdRef.current,
      };
    },
    []
  );

  const applyWheelMove = useCallback((clientX: number) => {
    const d = dragRef.current;
    if (!d || d.kind !== "wheel" || d.sessionId !== wheelSessionIdRef.current)
      return;
    const newRotation = d.startRotation + (clientX - d.startX);
    if (d.side === "left") {
      leftRotationRef.current = newRotation;
      setLeftWheelRotation(newRotation);
    } else {
      rightRotationRef.current = newRotation;
      setRightWheelRotation(newRotation);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;

      if (d.kind === "wheel") {
        applyWheelMove(e.clientX);
        return;
      }

      if (d.kind === "fader1") {
        const deltaY = d.startY - e.clientY;
        const newVal = Math.max(0, Math.min(1, d.startVal + deltaY / 120));
        setFader1Val(newVal);
        return;
      }
      if (d.kind === "fader2") {
        const deltaY = d.startY - e.clientY;
        const newVal = Math.max(0, Math.min(1, d.startVal + deltaY / 120));
        setFader2Val(newVal);
        return;
      }
      if (d.kind === "cross") {
        const deltaX = e.clientX - d.startX;
        const newVal = Math.max(0, Math.min(1, d.startVal + deltaX / 200));
        setCrossVal(newVal);
      }
    },
    [applyWheelMove]
  );

  const handleMouseUp = useCallback(() => {
    if (dragRef.current?.kind === "wheel") {
      wheelSessionIdRef.current += 1;
      try {
        if (captureRef.current)
          captureRef.current.target.releasePointerCapture(
            captureRef.current.pointerId
          );
      } catch {
        /* ignore */
      }
      captureRef.current = null;
    }
    dragRef.current = null;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (dragRef.current?.kind === "wheel") applyWheelMove(e.clientX);
    },
    [applyWheelMove]
  );

  const handlePointerUp = useCallback(() => {
    handleMouseUp();
  }, [handleMouseUp]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`select-none w-full min-w-0 relative ${className}`.trim()}
      onMouseLeave={handleMouseUp}
    >
      {/* Custom tooltip (replaces browser default) */}
      {typeof document !== "undefined" &&
        tooltip &&
        createPortal(
          <div
            className="pointer-events-none rounded-md px-3 py-1.5 text-sm font-medium text-white shadow-lg"
            style={{
              position: "fixed",
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%) translateY(-8px)",
              zIndex: 9999,
              background: "rgba(15, 15, 20, 0.95)",
              border: "1px solid rgba(129, 140, 248, 0.5)",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {tooltip.label}
          </div>,
          document.body
        )}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMid meet"
        style={{
          minWidth: 0,
          filter:
            "drop-shadow(0 30px 60px rgba(0,0,0,0.55)) drop-shadow(0 0 80px rgba(139,92,246,0.18)) drop-shadow(0 0 120px rgba(59,130,246,0.08))",
        }}
      >
        <defs>
          {/* Base plate shadow */}
          <filter id="plateShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.35" />
          </filter>
          {/* Jog wheel outer ring - metallic with cool blue highlight */}
          <linearGradient id="wheelRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0e8f0" />
            <stop offset="20%" stopColor="#a5b4fc" />
            <stop offset="40%" stopColor="#6366f1" />
            <stop offset="60%" stopColor="#64748b" />
            <stop offset="80%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          {/* Jog wheel center - matte black */}
          <radialGradient id="wheelCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="70%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0d0d0d" />
          </radialGradient>
          {/* Center label (vinyl look) */}
          <radialGradient id="wheelLabel" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#333" />
            <stop offset="100%" stopColor="#111" />
          </radialGradient>
          {/* Mixer panel - matte black */}
          <linearGradient id="mixerPanel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#252525" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0f0f0f" />
          </linearGradient>
          {/* Link knobs (browse + EQ) - each gets a random color from crossfader position */}
          {linkColors.map((color, i) => (
            <linearGradient
              key={i}
              id={`knobLink-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={lightenHex(color, 0.35)} />
              <stop offset="50%" stopColor={color} />
              <stop offset="100%" stopColor={darkenHex(color, 0.85)} />
            </linearGradient>
          ))}
          {/* Fader track */}
          <linearGradient id="faderTrack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0a0a" />
            <stop offset="100%" stopColor="#151515" />
          </linearGradient>
          {/* Fader cap - primary (fader1), strong accent */}
          <linearGradient
            id="faderCapPrimary"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={darkenHex(primaryColor, 0.7)} />
            <stop offset="25%" stopColor={primaryColor} />
            <stop offset="50%" stopColor={lightenHex(primaryColor, 0.5)} />
            <stop offset="75%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={darkenHex(primaryColor, 0.7)} />
          </linearGradient>
          {/* Fader cap - secondary (fader2), strong accent */}
          <linearGradient
            id="faderCapSecondary"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={darkenHex(secondaryColor, 0.7)} />
            <stop offset="25%" stopColor={secondaryColor} />
            <stop offset="50%" stopColor={lightenHex(secondaryColor, 0.5)} />
            <stop offset="75%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={darkenHex(secondaryColor, 0.7)} />
          </linearGradient>
          {/* Crossfader cap - secondary (fader2), bold */}
          <linearGradient id="crossfaderCap" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={darkenHex(secondaryColor, 0.6)} />
            <stop offset="50%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={darkenHex(secondaryColor, 0.6)} />
          </linearGradient>
          {/* Base texture: horizontal grooves with a hint of silver */}
          <pattern
            id="baseGrooves"
            patternUnits="userSpaceOnUse"
            width="14"
            height="14"
          >
            {[2, 5, 8, 11, 12].map((y) => (
              <line
                key={y}
                x1={0}
                y1={y}
                x2={14}
                y2={y}
                stroke="#9ca3af"
                strokeWidth="0.8"
                opacity="0.5"
              />
            ))}
          </pattern>
          {/* Decorative knob glow — stronger; matches raysColor when provided */}
          <filter
            id="decoKnobGlow"
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feFlood
              floodColor={raysColor ?? "#a5b4fc"}
              floodOpacity="0.45"
              result="glow"
            />
            <feComposite in="glow" in2="blur" operator="in" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base plate */}
        <rect
          x={40}
          y={20}
          width={WIDTH - 80}
          height={HEIGHT - 40}
          rx={12}
          fill="#1c1c1c"
          filter="url(#plateShadow)"
        />
        <rect
          x={44}
          y={24}
          width={WIDTH - 88}
          height={HEIGHT - 48}
          rx={10}
          fill="url(#mixerPanel)"
        />
        {/* Subtle groove texture overlay on base */}
        <rect
          x={44}
          y={24}
          width={WIDTH - 88}
          height={HEIGHT - 48}
          rx={10}
          fill="url(#baseGrooves)"
          pointerEvents="none"
        />

        {/* Left jog wheel — outer ring fixed, platter + label rotate so the turn is visible */}
        <g
          transform={`translate(${LEFT_WHEEL_CX}, ${WHEEL_CY})`}
          style={{ cursor: "grab" }}
          onPointerDown={(e) => handleWheelMouseDown("left", e)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Outer grip ring (fixed) */}
          <circle
            r={WHEEL_R}
            fill="url(#wheelRing)"
            stroke={primaryColor}
            strokeWidth="3"
            opacity="0.95"
          />
          <circle
            r={WHEEL_R - 8}
            fill="none"
            stroke={primaryColor}
            strokeWidth="1.5"
            opacity="0.7"
          />
          {/* Rotating part: platter + vinyl grooves + edge + center label + spin indicator dot */}
          <g transform={`rotate(${leftWheelRotation})`}>
            <circle r={WHEEL_R - 14} fill="url(#wheelCenter)" />
            {/* Vinyl grooves */}
            {[55, 70, 85, 100, 115, 130, 145].map((r) => (
              <circle
                key={r}
                r={r}
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="0.8"
                opacity="0.5"
              />
            ))}
            <circle
              r={WHEEL_R - 14}
              fill="none"
              stroke={primaryColor}
              strokeWidth="2"
              opacity="0.6"
            />
            {/* Colored dot so you can see the platter spin */}
            <circle
              cx={0}
              cy={-(WHEEL_R - 14 - 28)}
              r={12}
              fill={primaryColor}
              stroke={darkenHex(primaryColor, 0.5)}
              strokeWidth="2"
            />
            <circle
              r={42}
              fill="url(#wheelLabel)"
              stroke="#333"
              strokeWidth="1"
            />
            <circle r={12} fill="#0a0a0a" />
          </g>
        </g>

        {/* Right jog wheel — same: ring fixed, platter turns */}
        <g
          transform={`translate(${RIGHT_WHEEL_CX}, ${WHEEL_CY})`}
          style={{ cursor: "grab" }}
          onPointerDown={(e) => handleWheelMouseDown("right", e)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <circle
            r={WHEEL_R}
            fill="url(#wheelRing)"
            stroke={secondaryColor}
            strokeWidth="3"
            opacity="0.95"
          />
          <circle
            r={WHEEL_R - 8}
            fill="none"
            stroke={secondaryColor}
            strokeWidth="1.5"
            opacity="0.7"
          />
          <g transform={`rotate(${rightWheelRotation})`}>
            <circle r={WHEEL_R - 14} fill="url(#wheelCenter)" />
            {/* Vinyl grooves */}
            {[55, 70, 85, 100, 115, 130, 145].map((r) => (
              <circle
                key={r}
                r={r}
                fill="none"
                stroke="#0a0a0a"
                strokeWidth="0.8"
                opacity="0.5"
              />
            ))}
            <circle
              r={WHEEL_R - 14}
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              opacity="0.6"
            />
            {/* Colored dot so you can see the platter spin */}
            <circle
              cx={0}
              cy={-(WHEEL_R - 14 - 28)}
              r={12}
              fill={secondaryColor}
              stroke={darkenHex(secondaryColor, 0.7)}
              strokeWidth="2"
            />
            <circle
              r={42}
              fill="url(#wheelLabel)"
              stroke="#333"
              strokeWidth="1"
            />
            <circle r={12} fill="#0a0a0a" />
          </g>
        </g>

        {/* Mixer center */}
        <g>
          <rect
            x={MIXER_LEFT}
            y={MIXER_TOP}
            width={MIXER_RIGHT - MIXER_LEFT}
            height={MIXER_BOTTOM - MIXER_TOP}
            rx={6}
            fill="#141414"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Decorative knobs — 2 each side of Home button; glow matches light rays */}
          {[BROWSE_CX - 52, BROWSE_CX - 88].map((cx) => (
            <g key={`l-${cx}`}>
              <circle
                cx={cx}
                cy={BROWSE_CY}
                r={8}
                fill="#1e1e24"
                stroke={raysColor ?? primaryColor}
                strokeWidth="1.5"
                opacity="0.95"
                filter="url(#decoKnobGlow)"
              />
              <circle cx={cx} cy={BROWSE_CY} r={4} fill="#2a2a32" />
            </g>
          ))}
          {[BROWSE_CX + 52, BROWSE_CX + 88].map((cx) => (
            <g key={`r-${cx}`}>
              <circle
                cx={cx}
                cy={BROWSE_CY}
                r={8}
                fill="#1e1e24"
                stroke={raysColor ?? secondaryColor}
                strokeWidth="1.5"
                opacity="0.95"
                filter="url(#decoKnobGlow)"
              />
              <circle cx={cx} cy={BROWSE_CY} r={4} fill="#2a2a32" />
            </g>
          ))}
          {/* Decorative knobs — 2×3 grid, centered in the gap between faders */}
          {[FADER_MID_Y - 25, FADER_MID_Y, FADER_MID_Y + 25].map((cy) =>
            [BROWSE_CX - 26, BROWSE_CX + 26].map((cx) => (
              <g key={`f-${cx}-${cy}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={8}
                  fill="#1e1e24"
                  stroke={raysColor ?? "#a5b4fc"}
                  strokeWidth="1.5"
                  opacity="0.95"
                  filter="url(#decoKnobGlow)"
                />
                <circle cx={cx} cy={cy} r={4} fill="#2a2a32" />
              </g>
            ))
          )}

          {/* Top row - browse/load knob (cyan), pressable */}
          <g
            transform={
              pressedKnob === "browse"
                ? `translate(${(MIXER_LEFT + MIXER_RIGHT) / 2}, ${
                    MIXER_TOP + 42
                  }) scale(0.92) translate(${-(
                    (MIXER_LEFT + MIXER_RIGHT) /
                    2
                  )}, ${-(MIXER_TOP + 42)})`
                : undefined
            }
            onMouseDown={(e) => {
              e.preventDefault();
              setPressedKnob("browse");
            }}
            onClick={() => handleNav(KNOB_NAV.browse)}
            onPointerEnter={(e) =>
              setTooltip({
                label: KNOB_LABELS.browse.label,
                x: e.clientX,
                y: e.clientY,
              })
            }
            onPointerLeave={() => setTooltip(null)}
            onMouseUp={() => setPressedKnob(null)}
            onMouseLeave={() => setPressedKnob(null)}
            style={{ cursor: "pointer" }}
          >
            <title>{KNOB_LABELS.browse.label}</title>
            <circle
              cx={(MIXER_LEFT + MIXER_RIGHT) / 2}
              cy={MIXER_TOP + 42}
              r={26}
              fill="url(#knobLink-0)"
              stroke={darkenHex(linkColors[0], 0.55)}
              strokeWidth="1"
            />
            <circle
              cx={(MIXER_LEFT + MIXER_RIGHT) / 2}
              cy={MIXER_TOP + 42}
              r={19}
              fill={darkenHex(linkColors[0], 0.25)}
              opacity="0.6"
            />
            <text
              x={(MIXER_LEFT + MIXER_RIGHT) / 2}
              y={MIXER_TOP + 42}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff"
              stroke="#0f0f0f"
              strokeWidth="2"
              paintOrder="stroke fill"
              fontSize="14"
              fontWeight="700"
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {KNOB_LABELS.browse.letter}
            </text>
          </g>

          {/* EQ knobs - 3 columns x 3 rows, pressable (skip if no label) */}
          {[COL1, COL2, COL3].map((cx, i) =>
            [ROW1, ROW2, ROW3].map((cy, j) => {
              const id = `eq-${i}-${j}`;
              if (!KNOB_LABELS[id]) return <g key={id} />;
              const knobIndex = 1 + i * 3 + j;
              return (
                <g
                  key={id}
                  transform={
                    pressedKnob === id
                      ? `translate(${cx}, ${cy}) scale(0.88) translate(${-cx}, ${-cy})`
                      : undefined
                  }
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setPressedKnob(id);
                  }}
                  onClick={() => {
                    const path = KNOB_NAV[id];
                    if (path) handleNav(path);
                  }}
                  onPointerEnter={(e) =>
                    setTooltip({
                      label: KNOB_LABELS[id].label,
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onPointerLeave={() => setTooltip(null)}
                  onMouseUp={() => setPressedKnob(null)}
                  onMouseLeave={() => setPressedKnob(null)}
                  style={{ cursor: "pointer" }}
                >
                  <title>{KNOB_LABELS[id].label}</title>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={KNOB_R}
                    fill={`url(#knobLink-${knobIndex})`}
                    stroke={darkenHex(linkColors[knobIndex], 0.6)}
                    strokeWidth="1"
                  />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    stroke="#0f0f0f"
                    strokeWidth="1.5"
                    paintOrder="stroke fill"
                    fontSize="12"
                    fontWeight="700"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {KNOB_LABELS[id].letter}
                  </text>
                </g>
              );
            })
          )}

          {/* Channel faders - two vertical, draggable caps */}
          <g>
            <rect
              x={FADER1_X - FADER_W / 2}
              y={FADER_Y}
              width={FADER_W}
              height={FADER_H}
              rx={3}
              fill="url(#faderTrack)"
              stroke="#334155"
              strokeWidth="1"
            />
            <rect
              x={FADER1_X - FADER_W / 2 + 2}
              y={FADER_Y + (1 - fader1Val) * (FADER_H - FADER_CAP_H)}
              width={FADER_W - 4}
              height={FADER_CAP_H}
              rx={2}
              fill="url(#faderCapPrimary)"
              onMouseDown={(e) => {
                e.preventDefault();
                dragRef.current = {
                  kind: "fader1",
                  startY: e.clientY,
                  startVal: fader1Val,
                };
              }}
              style={{ cursor: "ns-resize" }}
            />
          </g>
          <g>
            <rect
              x={FADER2_X - FADER_W / 2}
              y={FADER_Y}
              width={FADER_W}
              height={FADER_H}
              rx={3}
              fill="url(#faderTrack)"
              stroke="#334155"
              strokeWidth="1"
            />
            <rect
              x={FADER2_X - FADER_W / 2 + 2}
              y={FADER_Y + (1 - fader2Val) * (FADER_H - FADER_CAP_H)}
              width={FADER_W - 4}
              height={FADER_CAP_H}
              rx={2}
              fill="url(#faderCapSecondary)"
              onMouseDown={(e) => {
                e.preventDefault();
                dragRef.current = {
                  kind: "fader2",
                  startY: e.clientY,
                  startVal: fader2Val,
                };
              }}
              style={{ cursor: "ns-resize" }}
            />
          </g>

          {/* Crossfader at bottom - draggable */}
          <rect
            x={CROSS_TRACK_LEFT}
            y={CROSS_Y}
            width={CROSS_TRACK_W}
            height={12}
            rx={2}
            fill="url(#faderTrack)"
            stroke="#334155"
            strokeWidth="1"
          />
          <rect
            x={CROSS_TRACK_LEFT + crossVal * (CROSS_TRACK_W - CROSS_CAP_W)}
            y={CROSS_Y - 4}
            width={CROSS_CAP_W}
            height={CROSS_CAP_H}
            rx={3}
            fill="url(#crossfaderCap)"
            onMouseDown={(e) => {
              e.preventDefault();
              dragRef.current = {
                kind: "cross",
                startX: e.clientX,
                startVal: crossVal,
              };
            }}
            style={{ cursor: "ew-resize" }}
          />
        </g>
      </svg>
    </div>
  );
}
