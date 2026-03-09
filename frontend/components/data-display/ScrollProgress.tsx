import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { forwardRef, type CSSProperties, type RefObject } from "react";
import clsx from "clsx";

import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion } from "../../hooks/use-motion-allowed";
import { useThemeSpring } from "../../hooks/use-theme-spring";

export interface ScrollProgressProps {
  className?: string;
  style?: CSSProperties;
  thicknessPx?: number;
  zIndex?: number;
  container?: RefObject<HTMLElement | null>;
}

export function clampProgressScale(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
}

export const ScrollProgress = forwardRef<HTMLDivElement, ScrollProgressProps>(
  function ScrollProgress({
    className,
    style,
    thicknessPx = 3,
    zIndex = 999,
    container,
    ...rest
  }, ref) {
    const { theme } = useThemeSnapshot();
    const fullMotion = useFullMotion();
    const springProfile = useThemeSpring();

    const { scrollYProgress } = useScroll(container ? { container } : undefined);
    const springScaleX = useSpring(scrollYProgress, springProfile);
    const scaleX = useTransform(springScaleX, clampProgressScale);

    if (!fullMotion) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        aria-hidden
        className={clsx(className)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: thicknessPx,
          background: theme.palette.primary,
          transformOrigin: "0% 50%",
          zIndex,
          scaleX,
          ...style,
        }}
        {...rest}
      />
    );
  }
);
