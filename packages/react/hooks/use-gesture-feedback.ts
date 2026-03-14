import { useMemo } from "react";

import type { MotionGestureFeedback } from "../motion-types";
import type { ThemeId } from "@infini-dev-kit/theme-core";
import { useThemeId } from "./use-theme-spring";
import { useFullMotion } from "./use-motion-allowed";
import { useThemeTransition } from "./use-theme-transition";

type GestureMap = Omit<MotionGestureFeedback, "transition">;

const GESTURE_FEEDBACK: Record<ThemeId, GestureMap> = {
  default: {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.96, y: 1 },
  },
  chibi: {
    whileHover: { scale: 1.04, y: -3 },
    whileTap: { scale: 0.98, y: -1 },
  },
  cyberpunk: {
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
  const themeId = useThemeId();
  const transition = useThemeTransition("press");
  const fullMotion = useFullMotion();

  return useMemo(() => {
    if (!fullMotion) {
      return {};
    }

    return {
      ...GESTURE_FEEDBACK[themeId],
      transition,
    };
  }, [fullMotion, themeId, transition]);
}
