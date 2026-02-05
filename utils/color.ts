/**
 * Hex string to RGB components (0–255). Supports #RGB and #RRGGBB.
 */
export function hexToRgb(hex: string): [number, number, number] {
  if (!hex) return [0, 0, 0];
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const m = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  return m
    ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
    : [0, 0, 0];
}

/**
 * RGB components (0–255) to hex string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (x: number) =>
    Math.round(Math.max(0, Math.min(255, x)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Darken a hex color by a factor (0–1). Result components are floored.
 */
export function darkenHex(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    Math.min(255, Math.round(r * factor)),
    Math.min(255, Math.round(g * factor)),
    Math.min(255, Math.round(b * factor))
  );
}

/**
 * Lighten a hex color by a factor (0–1). Result components are capped at 255.
 */
export function lightenHex(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = (x: number) =>
    Math.min(255, Math.round(x + (255 - x) * factor));
  return rgbToHex(f(r), f(g), f(b));
}

/**
 * Hex string to rgba() CSS string.
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
