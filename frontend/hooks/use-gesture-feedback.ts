import { useMemo } from "react";

import type { MotionGestureFeedback } from "../theme/motion-types";
import type { ThemeId } from "../theme/theme-specs";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion } from "./use-motion-allowed";
import { useThemeTransition } from "./use-theme-transition";

type GestureMap = Omit<MotionGestureFeedback, "transition">;

const GESTURE_FEEDBACK: Record<ThemeId, GestureMap> = {
  default: {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.96, y: 1 },
  },
  chibi: {
    // rotate removed — tilt is baked into stagger entry only
    whileHover: { scale: 1.04, y: -3 },
    whileTap: { scale: 0.98, y: -1 },
  },
  cyberpunk: {
    // No transform/filter/animation here — CSS handles all cyberpunk button effects
    // via transition-based box-shadow/border-color (avoids stacking context → badge clipping)
    whileHover: {},
    whileTap: { opacity: 0.88 },
  },
  "neu-brutalism": {
    whileHover: { x: -3, y: -3 },
    whileTap: { x: 2, y: 2, scale: 0.99 },
  },
  "black-gold": {
    whileHover: { y: -2 },
    whileTap: { scale: 0.97 },
  },
  "red-gold": {
    whileHover: { y: -2 },
    whileTap: { scale: 0.97 },
  },
};

export function useGestureFeedback(): MotionGestureFeedback {
  const { state } = useThemeSnapshot();
  const transition = useThemeTransition("press");
  const fullMotion = useFullMotion();

  return useMemo(() => {
    if (!fullMotion) {
      return {};
    }

    return {
      ...GESTURE_FEEDBACK[state.themeId],
      transition,
    };
  }, [fullMotion, state.themeId, transition]);
}
