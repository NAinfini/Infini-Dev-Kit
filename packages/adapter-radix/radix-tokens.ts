import { getThemeSpec, type ThemeId } from "@infini-dev-kit/theme-core";
import type {
  RadixThemeProps,
  RadixCssOverrides,
  RadixAccentColor,
  RadixGrayColor,
  RadixRadius,
} from "./radix-types";

/**
 * Map a hex color to the nearest Radix accent color scale by hue.
 */
function hexToRadixAccent(hex: string): RadixAccentColor {
  const raw = hex.replace("#", "");
  const full = raw.length === 3
    ? raw.split("").map((c) => c + c).join("")
    : raw.slice(0, 6);

  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  if (d === 0) return "gray";

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  const hue = h * 360;

  // Gold/amber special case
  if (hue >= 35 && hue <= 50) {
    const l = (max + min) / 2;
    if (l > 0.4) return "gold";
    return "amber";
  }

  // Sort HUE_MAP by maxHue for linear scan
  const sorted: [number, RadixAccentColor][] = [
    [15, "tomato"], [25, "red"], [35, "orange"], [45, "amber"],
    [55, "yellow"], [80, "lime"], [130, "grass"], [145, "green"],
    [160, "jade"], [175, "teal"], [195, "cyan"], [215, "blue"],
    [230, "indigo"], [250, "iris"], [265, "violet"], [280, "purple"],
    [335, "crimson"], [345, "pink"], [355, "plum"], [360, "tomato"],
  ];

  for (const [maxHue, color] of sorted) {
    if (hue <= maxHue) return color;
  }

  return "tomato";
}

function radiusToRadix(px: number): RadixRadius {
  if (px <= 0) return "none";
  if (px <= 4) return "small";
  if (px <= 8) return "medium";
  if (px <= 16) return "large";
  return "full";
}

/**
 * Build Radix `<Theme>` component props from an Infini theme.
 *
 * @example
 * ```ts
 * import { buildRadixThemeProps } from "@infini-dev-kit/adapter-radix";
 * import { Theme } from "@radix-ui/themes";
 *
 * const props = buildRadixThemeProps("cyberpunk");
 * // → { appearance: "dark", accentColor: "cyan", radius: "small", ... }
 *
 * <Theme {...props}>
 *   <App />
 * </Theme>
 * ```
 */
export function buildRadixThemeProps(themeId: ThemeId): RadixThemeProps {
  const theme = getThemeSpec(themeId);

  return {
    appearance: theme.colorScheme,
    accentColor: hexToRadixAccent(theme.palette.primary),
    grayColor: "auto" as RadixGrayColor,
    radius: radiusToRadix(theme.foundation.radius),
    scaling: "100%",
  };
}

/**
 * Build CSS variable overrides for fine-grained Radix Themes customization.
 *
 * Radix Theme props only offer coarse control (e.g. `accentColor: "cyan"`).
 * These CSS overrides let you push exact ThemeSpec values into Radix's
 * custom property layer for pixel-perfect fidelity.
 *
 * @example
 * ```ts
 * import { buildRadixThemeProps, buildRadixCssOverrides } from "@infini-dev-kit/adapter-radix";
 * import { Theme } from "@radix-ui/themes";
 *
 * const props = buildRadixThemeProps("red-gold");
 * const css = buildRadixCssOverrides("red-gold");
 *
 * <Theme {...props} style={css}>
 *   <App />
 * </Theme>
 * ```
 */
export function buildRadixCssOverrides(themeId: ThemeId): RadixCssOverrides {
  const theme = getThemeSpec(themeId);

  return {
    "--color-background": theme.foundation.background,
    "--color-surface": theme.foundation.surface,
    "--color-panel-solid": theme.foundation.surface,
    "--default-font-family": theme.typography.en.body,
    "--heading-font-family": theme.typography.en.heading,
    "--code-font-family": theme.typography.en.mono,
    "--color-overlay": theme.overlays.modalBackdrop,
    "--shadow-2": theme.depth.cardShadow,
    "--shadow-3": theme.depth.dropdownShadow,
    "--space-1": "4px",
    "--space-2": "8px",
    "--space-3": "12px",
    "--space-4": "16px",
  };
}
