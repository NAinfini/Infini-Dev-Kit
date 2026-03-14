import type { Variants } from "motion/react";

import type { ThemeId } from "@infini-dev-kit/theme-core";

const SELECT_VARIANTS: Record<ThemeId, Variants> = {
  default: {
    closed: { opacity: 0, scale: 0.95, y: -6 },
    open: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: -4 },
  },
  chibi: {
    closed: { opacity: 0, y: -8, scale: 0.92 },
    open: { opacity: 1, y: 0, scale: 1.02 },
    exit: { opacity: 0, y: -4, scale: 0.95 },
  },
  cyberpunk: {
    closed: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
    open: { opacity: 1, clipPath: "inset(0 0 0% 0)" },
    exit: { opacity: 0, clipPath: "inset(100% 0 0 0)" },
  },
  "neu-brutalism": {
    closed: { opacity: 0, y: -12 },
    open: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },
  "black-gold": {
    closed: { opacity: 0, scale: 0.98, y: -4 },
    open: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: -3 },
  },
  "red-gold": {
    closed: { opacity: 0, scale: 0.98, y: -4 },
    open: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: -3 },
  },
};

export function getSelectVariants(themeId: ThemeId): Variants {
  return SELECT_VARIANTS[themeId];
}
