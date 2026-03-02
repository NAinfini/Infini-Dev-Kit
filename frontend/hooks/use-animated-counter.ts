import { useEffect, useRef, useState, type RefObject } from "react";
import { useInView, useMotionValueEvent, useSpring } from "motion/react";

import { useThemeSpring } from "./use-theme-spring";
import { useMotionAllowed } from "./use-motion-allowed";

interface AnimatedCounterOptions {
  once?: boolean;
}

export function useAnimatedCounter(
  target: number,
  options: AnimatedCounterOptions = {},
): { ref: RefObject<HTMLSpanElement | null>; value: number } {
  const { once = true } = options;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once });
  const springProfile = useThemeSpring();
  const motionAllowed = useMotionAllowed();
  const spring = useSpring(0, springProfile);
  const [value, setValue] = useState(0);

  useMotionValueEvent(spring, "change", (latest) => {
    setValue(Math.round(latest));
  });

  useEffect(() => {
    if (!inView) {
      return;
    }

    if (!motionAllowed) {
      setValue(target);
      return;
    }

    spring.set(target);
  }, [inView, motionAllowed, spring, target]);

  return { ref, value };
}
