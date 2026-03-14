import type { Variants } from "motion/react";

import type { ThemeId } from "@infini-dev-kit/theme-core";

export interface OverlayVariants {
  modal: Variants;
  drawer: Variants;
  toast: Variants;
}

const OVERLAY_VARIANTS: Record<ThemeId, OverlayVariants> = {
  default: {
    modal: {
      hidden: { opacity: 0, scale: 0.9, y: 12 },
      visible: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95 },
    },
    drawer: {
      hidden: { opacity: 0, x: 36 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 24 },
    },
    toast: {
      hidden: { opacity: 0, x: 28, scale: 0.95 },
      visible: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 20, scale: 0.98 },
    },
  },
  chibi: {
    modal: {
      hidden: { opacity: 0, y: -60, scale: 0.86 },
      visible: { opacity: 1, y: 0, scale: 1.02 },
      exit: { opacity: 0, y: -24, scale: 0.92 },
    },
    drawer: {
      hidden: { opacity: 0, x: 40, scale: 0.96 },
      visible: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 28, scale: 0.94 },
    },
    toast: {
      hidden: { opacity: 0, scale: 0.5, y: -12 },
      visible: { opacity: 1, scale: 1.06, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: -8 },
    },
  },
  cyberpunk: {
    modal: {
      hidden: {
        opacity: 0,
        x: -8,
        clipPath: "inset(0 100% 0 0)",
        filter: "saturate(0) brightness(1.6)",
      },
      visible: {
        opacity: [0, 1, 0.75, 1],
        x: [-8, 2, 0],
        clipPath: "inset(0 0% 0 0)",
        filter: "saturate(1) brightness(1)",
        boxShadow: "0 0 30px rgba(0,240,255,0.2), -3px 0 0 rgba(0,240,255,0.15), 3px 0 0 rgba(255,42,109,0.15)",
      },
      exit: {
        opacity: [1, 0.6, 0],
        clipPath: "inset(0 0 0 100%)",
        filter: "saturate(0) brightness(1.4)",
      },
    },
    drawer: {
      hidden: {
        opacity: 0,
        clipPath: "inset(0 0 100% 0)",
        filter: "brightness(1.5)",
      },
      visible: {
        opacity: [0, 1, 0.8, 1],
        clipPath: "inset(0 0 0% 0)",
        filter: "brightness(1)",
      },
      exit: {
        opacity: [1, 0.7, 0],
        clipPath: "inset(100% 0 0 0)",
        filter: "brightness(1.3)",
      },
    },
    toast: {
      hidden: { opacity: 0, x: 28, filter: "brightness(1.4)" },
      visible: {
        opacity: [0, 1, 0.7, 1],
        x: [28, -2, 0],
        filter: "brightness(1)",
      },
      exit: {
        opacity: [1, 0.5, 0],
        x: 20,
        filter: "brightness(1.3)",
      },
    },
  },
  "neu-brutalism": {
    modal: {
      hidden: { opacity: 0, y: -100 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0 },
    },
    drawer: {
      hidden: { opacity: 0, x: 100 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 100 },
    },
    toast: {
      hidden: { opacity: 0, x: 36 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 24 },
    },
  },
  "black-gold": {
    modal: {
      hidden: { opacity: 0, scale: 0.96, y: 8 },
      visible: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.97 },
    },
    drawer: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 18 },
    },
    toast: {
      hidden: { opacity: 0, x: 24, scale: 0.95 },
      visible: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 16, scale: 0.98 },
    },
  },
  "red-gold": {
    modal: {
      hidden: { opacity: 0, scale: 0.96, y: 8 },
      visible: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.97 },
    },
    drawer: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 18 },
    },
    toast: {
      hidden: { opacity: 0, x: 24, scale: 0.95 },
      visible: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: 16, scale: 0.98 },
    },
  },
};

export function getOverlayVariants(themeId: ThemeId): OverlayVariants {
  return OVERLAY_VARIANTS[themeId];
}
