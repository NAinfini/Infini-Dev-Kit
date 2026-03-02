import type { SpringProfile } from "./motion-types";
import type { ThemeId } from "./theme-specs";

const SPRING_PROFILES: Record<ThemeId, SpringProfile> = {
  default: {
    stiffness: 300,
    damping: 24,
    mass: 0.8,
    bounce: 0.15,
  },
  chibi: {
    stiffness: 260,
    damping: 22,
    mass: 0.6,
    bounce: 0.18,
  },
  cyberpunk: {
    stiffness: 500,
    damping: 30,
    mass: 1,
    bounce: 0,
  },
  "neu-brutalism": {
    stiffness: 600,
    damping: 35,
    mass: 1.2,
    bounce: 0,
  },
  "black-gold": {
    stiffness: 250,
    damping: 28,
    mass: 1,
    bounce: 0.05,
  },
  "red-gold": {
    stiffness: 250,
    damping: 28,
    mass: 1,
    bounce: 0.05,
  },
};

export function getSpringProfile(themeId: ThemeId): SpringProfile {
  return SPRING_PROFILES[themeId];
}

export function resolveSpringProfile(themeId: string): SpringProfile {
  if (themeId in SPRING_PROFILES) {
    return SPRING_PROFILES[themeId as ThemeId];
  }

  return SPRING_PROFILES.default;
}
