import { forwardRef } from "react";
import { motion } from "motion/react";

import type { GlowBorderProps } from "../../../motion-types";
import { useMotionAllowed } from "../../../hooks/use-motion-allowed";

export const GlowBorder = forwardRef<HTMLDivElement, GlowBorderProps>(
  function GlowBorder({
    children,
    glowColor,
    glowIntensity,
    animated = true,
    className,
    style,
    ...rest
  }, ref) {
    const motionAllowed = useMotionAllowed();
    const color = glowColor ?? "var(--infini-border-glow-color)";
    const intensity = glowIntensity ?? 1;
    const shouldAnimate = animated && motionAllowed;

    return (
      <div
        ref={ref}
        className={className}
        style={{ position: "relative", borderRadius: "var(--infini-border-effect-radius)", ...style }}
        {...rest}
      >
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            borderRadius: "var(--infini-border-effect-radius)",
            border: `var(--infini-border-effect-width) var(--infini-border-effect-style) ${color}`,
            boxShadow: `0 0 ${Math.round(18 * intensity)}px color-mix(in srgb, ${color} ${Math.round(intensity * 80)}%, transparent)`,
          }}
          animate={
            shouldAnimate
              ? {
                  opacity: [0.75, 1, 0.75],
                }
              : undefined
          }
          transition={
            shouldAnimate
              ? {
                  duration: 1.4,
                  ease: "easeInOut",
                  repeat: Number.POSITIVE_INFINITY,
                }
              : undefined
          }
        />
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </div>
    );
  }
);
