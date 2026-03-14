import { motion } from "motion/react";
import { useState } from "react";

import type { SpectrumBorderEffectProps, EffectRevealMode } from "../../../motion-types";
import { useFullMotion, useMotionAllowed } from "../../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../../hooks/use-theme-transition";

function resolveRadius(radius?: number | string): number | string {
  return radius ?? "var(--infini-radius)";
}

function buildSpectrumGradient(colors: string[]): string {
  const safeColors = colors.length > 0
    ? colors
    : [
        "var(--infini-color-primary)",
        "var(--infini-color-accent)",
        "var(--infini-color-secondary)",
        "var(--infini-color-warning)",
      ];

  const stops = safeColors
    .map((color, index) => `${color} ${((index / Math.max(1, safeColors.length - 1)) * 360).toFixed(0)}deg`)
    .join(", ");
  return `conic-gradient(from 0deg, ${stops}, ${safeColors[0]} 360deg)`;
}

function getRevealActive(mode: EffectRevealMode, hovered: boolean): boolean {
  return mode === "always" || hovered;
}

/**
 * Original: Na3ar-17/slippery-snake-30 on UIverse
 * Rotating conic gradient visible through a border-width gap around content.
 * Architecture: outer wrapper with padding → oversized rotating gradient behind →
 * inner opaque panel covers center → gradient visible only through the padding gap.
 */
export function SpectrumBorderEffect({
  children,
  colors,
  rotate = true,
  revealMode = "hover",
  visibleArc: _visibleArc = 150,
  borderWidth = 2,
  glowIntensity = 1,
  radius,
  display = "inline-flex",
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: SpectrumBorderEffectProps) {
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const hoverTransition = useThemeTransition("hover");
  const [hovered, setHovered] = useState(false);

  const active = getRevealActive(revealMode, hovered);
  const effectiveRadius = resolveRadius(radius);
  const palette = colors && colors.length > 0
    ? colors
    : [
        "var(--infini-color-primary)",
        "var(--infini-color-accent)",
        "var(--infini-color-secondary)",
        "var(--infini-color-warning)",
      ];
  const gradient = buildSpectrumGradient(palette);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display,
        borderRadius: effectiveRadius,
        padding: borderWidth,
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
      {/* Clipping container for gradient only */}
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
        {/* Rotating gradient layer */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "200%",
            height: "200%",
            background: gradient,
            filter: glowIntensity > 1 ? `blur(${Math.round(glowIntensity)}px)` : undefined,
          }}
          initial={{ opacity: 0, x: "-50%", y: "-50%", rotate: 0 }}
          animate={
            motionAllowed
              ? {
                  opacity: active ? 1 : 0,
                  x: "-50%",
                  y: "-50%",
                  rotate: rotate && fullMotion ? 360 : 0,
                }
              : { opacity: active ? 1 : 0, x: "-50%", y: "-50%" }
          }
          transition={
            rotate && fullMotion
              ? {
                  opacity: hoverTransition,
                  rotate: {
                    duration: 3,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                  },
                }
              : { opacity: hoverTransition }
          }
        />
      </div>

      {/* Inner panel — covers center, gradient visible only through padding gap */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: effectiveRadius,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
