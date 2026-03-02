import type { Variants } from "motion/react";

import type { ThemeId } from "../../theme/theme-specs";

function directionalSlide(distance: number): Variants {
  return {
    enter: (direction = 1) => ({
      x: direction * distance,
      y: 20,
      opacity: 0,
    }),
    active: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    exit: (direction = 1) => ({
      x: direction * -distance * 0.8,
      y: -10,
      opacity: 0,
    }),
  };
}

const PAGE_VARIANTS: Record<ThemeId, Variants> = {
  default: directionalSlide(300),
  chibi: {
    enter: () => ({ y: 40, opacity: 0, scale: 0.98 }),
    active: { y: 0, opacity: 1, scale: 1 },
    exit: { y: -16, opacity: 0, scale: 0.97 },
  },
  cyberpunk: {
    enter: () => ({
      opacity: 0,
      clipPath: "inset(0 100% 0 0)",
      filter: "saturate(0) brightness(2)",
      skewX: 1,
    }),
    active: {
      opacity: [0, 0.6, 1, 0.85, 1],
      clipPath: "inset(0 0% 0 0)",
      filter: "saturate(1) brightness(1)",
      skewX: 0,
    },
    exit: {
      opacity: [1, 0.7, 0],
      clipPath: "inset(0 0 0 100%)",
      filter: "saturate(0) brightness(1.5)",
      skewX: -0.5,
    },
  },
  "neu-brutalism": {
    enter: (direction = 1) => ({ x: direction * 360, opacity: 0 }),
    active: { x: 0, opacity: 1 },
    exit: { opacity: 0 },
  },
  "black-gold": {
    enter: { opacity: 0, scale: 0.98 },
    active: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  },
  "red-gold": {
    enter: { opacity: 0, scale: 0.98 },
    active: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  },
};

export function getPageVariants(themeId: ThemeId): Variants {
  return PAGE_VARIANTS[themeId];
}
