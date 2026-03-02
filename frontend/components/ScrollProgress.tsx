import { motion, useScroll, useSpring, useTransform } from "motion/react";
import type { CSSProperties } from "react";

import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion } from "../hooks/use-motion-allowed";
import { useThemeSpring } from "../hooks/use-theme-spring";

export interface ScrollProgressProps {
  className?: string;
  style?: CSSProperties;
  thicknessPx?: number;
  zIndex?: number;
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

export function ScrollProgress({
  className,
  style,
  thicknessPx = 3,
  zIndex = 999,
}: ScrollProgressProps) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const springProfile = useThemeSpring();

  const { scrollYProgress } = useScroll();
  const springScaleX = useSpring(scrollYProgress, springProfile);
  const scaleX = useTransform(springScaleX, clampProgressScale);

  if (!fullMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className={className}
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
    />
  );
}
