import { resolveMotionPreference, type MotionMode } from "../utils/motion";

import { getThemeSpec, type ThemeId } from "./theme-specs";

export type MotionIntent =
  | "enter"
  | "exit"
  | "hover"
  | "press"
  | "focus"
  | "overlay-open"
  | "overlay-close"
  | "list-update";

export interface MotionContract {
  durationMs: number;
  easing: string;
  distancePx: number;
  scaleFrom: number;
  opacityFrom: number;
}

export interface MotionContractOptions {
  mode: MotionMode;
  prefersReducedMotion: boolean;
}

const INTENT_MULTIPLIER: Record<MotionIntent, number> = {
  enter: 1,
  exit: 0.8,
  hover: 0.6,
  press: 0.45,
  focus: 0.55,
  "overlay-open": 1.1,
  "overlay-close": 0.9,
  "list-update": 0.7,
};

export function getMotionContract(
  themeId: ThemeId,
  intent: MotionIntent,
  options: MotionContractOptions,
): MotionContract {
  const theme = getThemeSpec(themeId);
  const mode = resolveMotionPreference(options.mode, options.prefersReducedMotion);

  const baseDuration = pickBaseDuration(theme.motion, intent);
  const multiplier = INTENT_MULTIPLIER[intent];

  if (mode === "off") {
    return {
      durationMs: 0,
      easing: "linear",
      distancePx: 0,
      scaleFrom: 1,
      opacityFrom: 1,
    };
  }

  if (mode === "reduced") {
    return {
      durationMs: Math.min(120, Math.max(60, Math.round(baseDuration * multiplier * 0.5))),
      easing: "linear",
      distancePx: 0,
      scaleFrom: 1,
      opacityFrom: 1,
    };
  }

  return {
    durationMs: Math.round(baseDuration * multiplier),
    easing: theme.motion.easing,
    distancePx: theme.motion.distancePx,
    scaleFrom: intent === "press" ? 0.98 : 0.99,
    opacityFrom: intent === "enter" || intent === "overlay-open" ? 0.85 : 1,
  };
}

function pickBaseDuration(
  motion: {
    enterMs: number;
    exitMs: number;
    hoverMs: number;
    pressMs: number;
  },
  intent: MotionIntent,
): number {
  switch (intent) {
    case "enter":
    case "overlay-open":
      return motion.enterMs;
    case "exit":
    case "overlay-close":
      return motion.exitMs;
    case "hover":
    case "focus":
      return motion.hoverMs;
    case "press":
      return motion.pressMs;
    case "list-update":
      return motion.hoverMs;
    default:
      return motion.enterMs;
  }
}
