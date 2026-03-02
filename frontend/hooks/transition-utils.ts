import type { Transition } from "motion/react";

import type { EffectiveMotionMode } from "../../utils/motion";
import type { MotionContract } from "../theme/motion-contracts";
import type { SpringProfile } from "../theme/motion-types";

export function resolveThemeTransition(
  mode: EffectiveMotionMode,
  contract: MotionContract,
  spring: SpringProfile,
): Transition {
  if (mode === "off") {
    return { type: "tween", duration: 0 };
  }

  if (mode === "reduced") {
    return {
      type: "tween",
      ease: "linear",
      duration: Math.min(0.12, Math.max(0.06, contract.durationMs / 1000)),
    };
  }

  if (mode === "minimum") {
    return {
      type: "tween",
      ease: "linear",
      duration: 0.06,
    };
  }

  return {
    type: "spring",
    stiffness: spring.stiffness,
    damping: spring.damping,
    mass: spring.mass,
    bounce: spring.bounce,
    restDelta: 0.01,
    restSpeed: 0.01,
  };
}
