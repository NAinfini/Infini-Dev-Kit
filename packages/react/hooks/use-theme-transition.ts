import type { Transition } from "motion/react";

import type { MotionIntent } from "@infini-dev-kit/theme-core";
import { getMotionContract } from "@infini-dev-kit/theme-core";
import { resolveThemeTransition } from "./transition-utils";
import { useThemeSpring, useThemeId } from "./use-theme-spring";
import { useEffectiveMotionMode } from "./use-motion-allowed";

export function useThemeTransition(intent: MotionIntent = "enter"): Transition {
  const themeId = useThemeId();
  const mode = useEffectiveMotionMode();
  const spring = useThemeSpring();
  const contract = getMotionContract(themeId, intent, { mode });

  return resolveThemeTransition(mode, contract, spring);
}
