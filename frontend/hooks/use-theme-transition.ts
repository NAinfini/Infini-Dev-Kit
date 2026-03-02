import type { Transition } from "motion/react";

import type { MotionIntent } from "../theme/motion-contracts";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { resolveThemeTransition } from "./transition-utils";
import { useThemeSpring } from "./use-theme-spring";

export function useThemeTransition(intent: MotionIntent = "enter"): Transition {
  const { motion } = useThemeSnapshot();
  const spring = useThemeSpring();
  const contract = motion.contracts[intent];

  return resolveThemeTransition(motion.effectiveMode, contract, spring);
}
