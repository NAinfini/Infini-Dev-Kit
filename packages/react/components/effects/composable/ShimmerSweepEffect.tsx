import { motion } from "motion/react";
import { useState } from "react";

import type { ShimmerSweepEffectProps, EffectRevealMode } from "../../../motion-types";
import { useFullMotion, useMotionAllowed } from "../../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../../hooks/use-theme-transition";

function resolveRadius(radius?: number | string): number | string {
  return radius ?? "var(--infini-radius)";
}

function getRevealActive(mode: EffectRevealMode, hovered: boolean): boolean {
  return mode === "always" || hovered;
}

/**
 * Original: elijahgummer/thin-rabbit-53 on UIverse
 * A skewed white bar sweeps from left to right on hover.
 * Pure sweep — no lift, no scale, no glow underneath.
 */
export function ShimmerSweepEffect({
  children,
  sweepColor,
  glowColor: _glowColor,
  revealMode = "hover",
  lift: _lift,
  glowIntensity: _glowIntensity,
  angle = -13,
  duration = 0.6,
  radius,
  display = "inline-flex",
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: ShimmerSweepEffectProps) {
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const hoverTransition = useThemeTransition("hover");
  const [hovered, setHovered] = useState(false);

  const active = getRevealActive(revealMode, hovered);
  const effectiveRadius = resolveRadius(radius);
  const shimmer = sweepColor ?? "rgba(255, 255, 255, 0.25)";

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display,
        borderRadius: effectiveRadius,
        isolation: "isolate",
        ...style,
      }}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
      {...rest}
    >
      {/* Clipping container for sweep bar only */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: effectiveRadius,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {/* Sweep bar — skew is static CSS, x is animated via motion */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            background: `linear-gradient(90deg, transparent 0%, ${shimmer} 45%, ${shimmer} 55%, transparent 100%)`,
            transform: `skewX(${angle}deg)`,
          }}
          initial={{ x: "-150%" }}
          animate={
            motionAllowed
              ? { x: active ? "150%" : "-150%" }
              : undefined
          }
          transition={
            fullMotion
              ? { duration, ease: [0.25, 0.46, 0.45, 0.94] }
              : hoverTransition
          }
        />
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}
