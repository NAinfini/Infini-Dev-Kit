import type { Variants } from "motion/react";

import type { ThemeId } from "../../theme/theme-specs";

const REVEAL_VARIANTS: Record<ThemeId, Variants> = {
  default: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  },
  chibi: {
    hidden: { opacity: 0, y: 18, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  cyberpunk: {
    hidden: {
      opacity: 0,
      x: -12,
      clipPath: "inset(0 100% 0 0)",
      filter: "brightness(1.8) saturate(0)",
    },
    visible: {
      opacity: [0, 1, 0.7, 1],
      x: [-12, 2, -1, 0],
      clipPath: "inset(0 0% 0 0)",
      filter: "brightness(1) saturate(1)",
      transitionEnd: {
        clipPath: "none",
      },
    },
  },
  "neu-brutalism": {
    hidden: { opacity: 0, y: -12 },
    visible: { opacity: 1, y: 0 },
  },
  "black-gold": {
    hidden: { opacity: 0, y: 12, scale: 0.99 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  "red-gold": {
    hidden: { opacity: 0, y: 12, scale: 0.99 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
};

export function getRevealVariants(themeId: ThemeId): Variants {
  return REVEAL_VARIANTS[themeId];
}
