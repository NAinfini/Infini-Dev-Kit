import type { ThemeSpec } from "../theme-specs";

export type GlowStatus = "primary" | "success" | "warning" | "error" | "info";

export function resolveControlGlow(theme: ThemeSpec, status: GlowStatus): string {
  const color = resolveGlowColor(theme, status);

  switch (theme.id) {
    case "default":
      return `0 0 0 3px ${hexToRgba(color, 0.18)}`;
    case "chibi":
      return `0 0 0 3px ${hexToRgba(color, 0.25)}`;
    case "cyberpunk":
      return `0 0 0 1px ${hexToRgba(color, 0.62)}, 0 0 6px ${hexToRgba(color, 0.58)}`;
    case "neu-brutalism":
      return `4px 4px 0 ${color}`;
    case "black-gold":
      return `0 0 0 2px ${hexToRgba(color, 0.32)}`;
    case "red-gold":
      return `0 0 0 2px ${hexToRgba(color, 0.35)}`;
    default:
      return `0 0 0 2px ${hexToRgba(color, 0.2)}`;
  }
}

function resolveGlowColor(theme: ThemeSpec, status: GlowStatus): string {
  switch (status) {
    case "primary":
      return theme.palette.primary;
    case "success":
      return theme.palette.success;
    case "warning":
      return theme.palette.warning;
    case "error":
      return theme.palette.danger;
    case "info":
      return theme.palette.accent;
    default:
      return theme.palette.primary;
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const isShort = value.length === 3;

  const channels = isShort
    ? value.split("").map((segment) => Number.parseInt(`${segment}${segment}`, 16))
    : [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));

  return `rgba(${channels[0]},${channels[1]},${channels[2]},${alpha})`;
}
