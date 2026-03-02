import type { Variants } from "motion/react";

import type { ThemeId } from "../../theme/theme-specs";

const TOGGLE_VARIANTS: Record<ThemeId, Variants> = {
  default: {
    on: { x: [0, 18, 16], scale: [1, 1.06, 1.04] },
    off: { x: 0, scale: 1 },
    hover: { scale: 1.03 },
  },
  chibi: {
    on: { x: [0, 18, 16], scale: [1, 1.15, 1.08, 1.02] },
    off: { x: 0, scale: 1 },
    hover: { scale: 1.05 },
  },
  cyberpunk: {
    on: {
      x: [0, 16],
      scale: 1,
      boxShadow: "0 0 10px rgba(0,240,255,0.45)",
      opacity: [0.8, 1, 0.9, 1],
      filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
    },
    off: { x: 0, scale: 1, opacity: [1, 0.4, 1] },
    hover: {
      opacity: [1, 0.9, 1],
      boxShadow: "0 0 6px rgba(0,240,255,0.25)",
    },
  },
  "neu-brutalism": {
    on: { x: [0, 18, 16], scale: 1, y: [0, -1, 0] },
    off: { x: 0, scale: 1 },
    hover: { y: -1 },
  },
  "black-gold": {
    on: { x: [0, 16], scale: [1, 1.02], boxShadow: "0 0 8px rgba(212,175,55,0.24)" },
    off: { x: 0, scale: 1 },
    hover: { boxShadow: "0 0 8px rgba(212,175,55,0.3)" },
  },
  "red-gold": {
    on: { x: [0, 16], scale: [1, 1.02], boxShadow: "0 0 8px rgba(212,175,55,0.24)" },
    off: { x: 0, scale: 1 },
    hover: { boxShadow: "0 0 8px rgba(237,41,57,0.3)" },
  },
};

export function getToggleVariants(themeId: ThemeId): Variants {
  return TOGGLE_VARIANTS[themeId];
}
