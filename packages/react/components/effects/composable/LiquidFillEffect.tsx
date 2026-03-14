import { motion } from "motion/react";
import { useState, type CSSProperties } from "react";

import type { LiquidFillEffectProps, EffectRevealMode } from "../../../motion-types";
import { useFullMotion, useMotionAllowed } from "../../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../../hooks/use-theme-transition";

function resolveRadius(radius?: number | string): number | string {
  return radius ?? "var(--infini-radius)";
}

function getRevealActive(mode: EffectRevealMode, hovered: boolean): boolean {
  return mode === "always" || hovered;
}

/**
 * Original: nikk7007/blue-mayfly-40 on UIverse
 * Twin circles expand from scale(0) → scale(1) on hover from opposite corners.
 */
export function LiquidFillEffect({
  children,
  color,
  mode: _mode,
  revealMode = "hover",
  opacity: _opacity = 0.34,
  radius,
  display = "inline-flex",
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: LiquidFillEffectProps) {
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const hoverTransition = useThemeTransition("hover");
  const [hovered, setHovered] = useState(false);

  const active = getRevealActive(revealMode, hovered);
  const fillColor = color ?? "var(--infini-color-primary)";
  const effectiveRadius = resolveRadius(radius);

  const circles: { top: string; left: string }[] = [
    { top: "0%", left: "0%" },
    { top: "100%", left: "100%" },
  ];

  const circleBase: CSSProperties = {
    position: "absolute",
    width: "150%",
    aspectRatio: "1",
    borderRadius: "50%",
    backgroundColor: fillColor,
    pointerEvents: "none",
    zIndex: 1,
    translate: "-50% -50%",
  };

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
      {/* Clipping container for circles only */}
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
        {circles.map((pos, i) => (
          <motion.div
            key={i}
            style={{
              ...circleBase,
              top: pos.top,
              left: pos.left,
            }}
            initial={{ scale: 0 }}
            animate={
              motionAllowed
                ? { scale: active ? 1 : 0 }
                : { scale: active ? 1 : 0 }
            }
            transition={
              fullMotion
                ? { duration: 1, ease: [0.76, 0, 0.24, 1] }
                : hoverTransition
            }
          />
        ))}
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}
