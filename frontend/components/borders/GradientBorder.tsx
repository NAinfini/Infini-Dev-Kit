import { forwardRef } from "react";
import { motion } from "motion/react";
import clsx from "clsx";

import type { GradientBorderProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useMotionAllowed } from "../../hooks/use-motion-allowed";

/**
 * Container with animated rotating gradient border.
 * The border cycles through color stops using a conic-gradient mask technique.
 * Theme-aware and motion-gated.
 */
export const GradientBorder = forwardRef<HTMLDivElement, GradientBorderProps>(
  function GradientBorder({
    children,
    colors,
    borderWidth = 2,
    duration = 3,
    animated = true,
    radius,
    className,
    style,
    ...rest
  }, ref) {
    const { theme } = useThemeSnapshot();
    const motionAllowed = useMotionAllowed();
    const shouldAnimate = animated && motionAllowed;

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
        ref={ref}
        className={clsx(className)}
        style={{
          position: "relative",
          borderRadius: effectiveRadius,
          padding: borderWidth,
          overflow: "hidden",
          ...style,
        }}
        {...rest}
      >
        {/* Gradient border layer */}
        {shouldAnimate ? (
          <motion.div
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              inset: "-50%",
              background: `conic-gradient(${gradientStops})`,
              zIndex: 0,
              pointerEvents: "none",
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
              pointerEvents: "none",
            }}
          />
        )}

        {/* Inner content with opaque background + base border */}
        <div
          style={{
            position: "relative",
            borderRadius: Math.max(0, effectiveRadius - borderWidth),
            border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
            background: theme.foundation.surface,
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);
