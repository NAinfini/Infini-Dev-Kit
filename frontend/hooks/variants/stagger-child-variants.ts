import type { Variants } from "motion/react";

import type { ThemeId } from "../../theme/theme-specs";

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export const staggerChildMinimal: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Cyberpunk: scan-in with opacity flicker — hard steps, no easing
export const staggerChildCyber: Variants = {
  hidden: {
    opacity: 0,
    x: -6,
    clipPath: "inset(0 100% 0 0)",
  },
  visible: {
    opacity: [0, 1, 0.6, 1, 0.8, 1],
    x: 0,
    clipPath: "inset(0 0% 0 0)",
    transitionEnd: { clipPath: "none" },
  },
};

// Chibi: cute rotate wobble baked into entry only — hover stays flat (no compound tilt)
export const staggerChildChibi: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -3 },
  visible: { opacity: [0, 1], scale: [0.8, 1.08, 0.97, 1], rotate: [-3, 1.5, -0.5, 0] },
};

// Neu-brutalism: sticker slam-in — drops from above with rotation, hard stop, no bounce
export const staggerChildBrutal: Variants = {
  hidden: { opacity: 0, y: -24, rotate: -3 },
  visible: { opacity: 1, y: 0, rotate: 0 },
};

export const staggerChildGold: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.99 },
  visible: { opacity: [0, 1], y: 0, scale: 1 },
};

// Red-gold: imperial stamp entrance — scale down like a seal being pressed
export const staggerChildRedGold: Variants = {
  hidden: { opacity: 0, scale: 1.2 },
  visible: { opacity: [0, 1], scale: [1.2, 0.97, 1] },
};

export function getStaggerChildVariants(themeId: ThemeId, fullMotion = true): Variants {
  if (!fullMotion) return staggerChildMinimal;
  if (themeId === "cyberpunk") return staggerChildCyber;
  if (themeId === "chibi") return staggerChildChibi;
  if (themeId === "neu-brutalism") return staggerChildBrutal;
  if (themeId === "red-gold") return staggerChildRedGold;
  if (themeId === "black-gold") return staggerChildGold;
  return staggerChild;
}
