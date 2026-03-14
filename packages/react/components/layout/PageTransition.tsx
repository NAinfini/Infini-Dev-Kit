import { forwardRef } from "react";
import { motion } from "motion/react";
import clsx from "clsx";

import type { PageTransitionProps } from "../../motion-types";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";

type TransitionType = NonNullable<PageTransitionProps["type"]>;

interface TransitionStates {
  initial: Record<string, number>;
  animate: Record<string, number>;
  exit: Record<string, number>;
}

function getTransitionStates(type: TransitionType): TransitionStates {
  if (type === "slide") {
    return {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0 },
    };
  }

  if (type === "slide-x") {
    return {
      initial: { opacity: 0, x: 60 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0 },
    };
  }

  if (type === "scale") {
    return {
      initial: { opacity: 0, scale: 0.92 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    };
  }

  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
}

function useTransitionConfig(type: TransitionType, durationMs: number) {
  if (type === "slide-x") {
    return {
      enter: {
        type: "spring" as const,
        stiffness: 260,
        damping: 28,
        mass: 0.8,
      },
      exit: {
        type: "tween" as const,
        ease: "easeIn" as const,
        duration: 0.15,
      },
    };
  }

  const enterDuration = Math.max(0.2, durationMs / 1000);
  return {
    enter: {
      type: "tween" as const,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      duration: enterDuration,
    },
    exit: {
      type: "tween" as const,
      ease: "easeIn" as const,
      duration: Math.min(enterDuration * 0.4, 0.12),
    },
  };
}

export const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
  function PageTransition({
    children,
    type = "fade",
    duration,
    className,
    style,
    ...rest
  }, ref) {
    const motionAllowed = useMotionAllowed();
    const fullMotion = useFullMotion();

    const states = getTransitionStates(type);
    const fadeOnly = getTransitionStates("fade");
    const config = useTransitionConfig(type, duration ?? 220);

    // OFF: completely static
    if (!motionAllowed) {
      return (
        <div ref={ref} className={clsx(className)} style={style} {...rest}>
          {children}
        </div>
      );
    }

    // REDUCED: fade-only transition, no slide/scale
    if (!fullMotion) {
      return (
        <motion.div
          ref={ref}
          className={clsx(className)}
          style={style}
          initial={fadeOnly.initial}
          animate={{
            ...fadeOnly.animate,
            transition: { type: "tween", ease: "easeOut", duration: 0.15 },
          }}
          exit={{
            ...fadeOnly.exit,
            transition: { type: "tween", ease: "easeIn", duration: 0.1 },
          }}
          {...rest}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={clsx(className)}
        style={style}
        initial={states.initial}
        animate={{
          ...states.animate,
          transition: config.enter,
        }}
        exit={{
          ...states.exit,
          transition: config.exit,
        }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);
