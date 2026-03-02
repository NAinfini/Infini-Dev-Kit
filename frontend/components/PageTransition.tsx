import { motion } from "motion/react";

import type { PageTransitionProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

function getTransitionStates(type: NonNullable<PageTransitionProps["type"]>) {
  if (type === "slide") {
    return {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    };
  }

  if (type === "scale") {
    return {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.98 },
    };
  }

  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
}

export function PageTransition({
  children,
  type = "fade",
  duration,
  className,
}: PageTransitionProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("enter");

  if (!motionAllowed) {
    return <div className={className}>{children}</div>;
  }

  const states = getTransitionStates(type);
  const resolvedDuration = Math.max(0.08, (duration ?? theme.motion.enterMs) / 1000);
  const resolvedTransition =
    duration !== undefined
      ? {
          ...transition,
          duration: resolvedDuration,
        }
      : transition;

  return (
    <motion.div
      className={className}
      initial={states.initial}
      animate={states.animate}
      exit={states.exit}
      transition={resolvedTransition}
    >
      {children}
    </motion.div>
  );
}
