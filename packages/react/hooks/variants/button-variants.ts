import type { Variants } from "motion/react";

import { getThemeSpec, type ThemeId } from "@infini-dev-kit/theme-core";

export interface ButtonRipplePalette {
  primary: string;
  secondary?: string;
}

const BUTTON_RIPPLE_PALETTES: Record<ThemeId, ButtonRipplePalette> = {
  default: { primary: "rgba(37,99,235,0.15)" },
  chibi: { primary: "rgba(255,126,182,0.2)" },
  cyberpunk: {
    primary: "rgba(0,240,255,0.2)",
    secondary: "rgba(255,42,109,0.1)",
  },
  "neu-brutalism": { primary: "rgba(0,0,0,0.08)" },
  "black-gold": { primary: "rgba(212,175,55,0.12)" },
  "red-gold": { primary: "rgba(212,175,55,0.12)" },
};

export function getButtonVariants(themeId: ThemeId): Variants {
  const theme = getThemeSpec(themeId);

  switch (themeId) {
    case "default":
      return {
        rest: { scale: 1, y: 0, filter: "brightness(1)", boxShadow: theme.depth.buttonShadow },
        hover: {
          scale: 1.03,
          y: -1,
          filter: "brightness(1.04)",
          boxShadow: theme.depth.buttonShadowHover,
        },
        tap: {
          scale: 0.96,
          y: 1,
          filter: "brightness(0.98)",
          boxShadow: theme.depth.buttonShadowPressed,
        },
        focus: { scale: 1, y: 0, opacity: 1 },
      };
    case "chibi":
      return {
        rest: { scale: 1, rotate: 0, y: 0 },
        hover: { scale: 1.05, rotate: 1.5, y: -1 },
        tap: { scaleX: 1.08, scaleY: 0.92, y: 2 },
        focus: { scale: 1, rotate: 0, opacity: 1 },
      };
    case "cyberpunk":
      // No filter/transform/opacity keyframes — these create stacking contexts that clip badge dots.
      // All visual effects (neon glow, border color) handled by CSS transitions in mantine-residual.css.
      return {
        rest: { boxShadow: theme.depth.buttonShadow },
        hover: { boxShadow: theme.depth.buttonShadowHover },
        tap: { opacity: 0.88, boxShadow: theme.depth.buttonShadowPressed },
        focus: { opacity: 1 },
      };
    case "neu-brutalism":
      return {
        rest: { x: 0, y: 0, boxShadow: theme.depth.buttonShadow },
        hover: { x: -2, y: -2, boxShadow: theme.depth.buttonShadowHover },
        tap: { x: 3, y: 3, boxShadow: theme.depth.buttonShadowPressed },
        focus: { x: 0, y: 0, opacity: 1 },
      };
    case "black-gold":
    case "red-gold":
      return {
        rest: { scale: 1, backgroundPosition: "100% 0%", boxShadow: theme.depth.buttonShadow },
        hover: {
          scale: 1.02,
          backgroundPosition: "0% 0%",
          boxShadow: theme.depth.buttonShadowHover,
        },
        tap: { scale: 0.97, boxShadow: theme.depth.buttonShadowPressed },
        focus: { scale: 1, backgroundPosition: "100% 0%", opacity: 1 },
      };
    default:
      return {
        rest: { scale: 1 },
        hover: { scale: 1.02 },
        tap: { scale: 0.98 },
        focus: { scale: 1 },
      };
  }
}

export function getButtonRipplePalette(themeId: ThemeId): ButtonRipplePalette {
  return BUTTON_RIPPLE_PALETTES[themeId];
}
