import { motion } from "motion/react";

import type { GradientBorderProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion } from "../hooks/use-motion-allowed";

/**
 * Container with animated rotating gradient border.
 * The border cycles through color stops using a conic-gradient mask technique.
 * Theme-aware and motion-gated.
 */
export function GradientBorder({
  children,
  colors,
  borderWidth = 2,
  duration = 3,
  animated = true,
  radius,
  className,
}: GradientBorderProps) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const shouldAnimate = animated && fullMotion;

  const effectiveColors = colors ?? [
    theme.palette.primary,
    theme.palette.accent,
    theme.palette.secondary,
    theme.palette.primary,
  ];
  const effectiveRadius = radius ?? theme.foundation.radius;

  const gradientStops = effectiveColors.map((c, i) => `${c} ${(i / (effectiveColors.length - 1)) * 100}%`).join(", ");

  return (
    <div
      className={className}
      style={{
        position: "relative",
        borderRadius: effectiveRadius,
        padding: borderWidth,
      }}
    >
      {/* Gradient border layer */}
      {shouldAnimate ? (
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: effectiveRadius,
            background: `conic-gradient(${gradientStops})`,
            zIndex: 0,
          }}
        />
      ) : (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: effectiveRadius,
            background: `linear-gradient(135deg, ${gradientStops})`,
            zIndex: 0,
          }}
        />
      )}

      {/* Inner content with opaque background */}
      <div
        style={{
          position: "relative",
          borderRadius: Math.max(0, effectiveRadius - borderWidth),
          background: theme.foundation.surface,
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}
