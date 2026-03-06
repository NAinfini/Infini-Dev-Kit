import { motion } from "motion/react";

import type { GlowBorderProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useMotionAllowed } from "../../hooks/use-motion-allowed";

export function GlowBorder({
  children,
  glowColor,
  glowIntensity,
  animated = true,
  className,
}: GlowBorderProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const color = glowColor ?? theme.effects.border.glowColor;
  const intensity = glowIntensity ?? theme.effects.hover.glowIntensity;
  const shouldAnimate = animated && motionAllowed && theme.effects.border.animated !== false;

  return (
    <div className={className} style={{ position: "relative", borderRadius: theme.effects.border.radius }}>
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: theme.effects.border.radius,
          border: `${theme.effects.border.width} ${theme.effects.border.style} ${color}`,
          boxShadow: `0 0 ${Math.round((theme.effects.hover.glowSpread || 18) * intensity)}px color-mix(in srgb, ${color} ${Math.round(intensity * 80)}%, transparent)`,
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
