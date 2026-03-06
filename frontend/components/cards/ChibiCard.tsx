import { motion } from "motion/react";

import type { ChibiCardProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";

/**
 * Kawaii sticker-card for the chibi theme.
 * Soft cloud shadows, large radius, gentle float-up on hover.
 * No 3D tilt — avoids clipping into neighboring cards.
 */
export function ChibiCard({
  children,
  glowColor,
  shadowLayers,
  interactive = true,
  onClick,
  style,
  className,
}: ChibiCardProps) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("hover");

  const accent = glowColor ?? theme.palette.primary ?? "#FF7EB6";
  const radius = theme.foundation.radius;
  const surface = theme.foundation.surface;
  const borderColor = theme.foundation.borderColor;
  const borderWidth = theme.foundation.borderWidth;

  // Layered soft shadow (cloud-like depth, matches chibi design spec)
  const defaultShadow = [
    `0 2px 6px color-mix(in srgb, ${accent} 10%, transparent)`,
    `0 6px 0 color-mix(in srgb, ${accent} 18%, transparent)`,
    `0 10px 20px rgba(0, 0, 0, 0.08)`,
  ];
  const shadow = (shadowLayers ?? defaultShadow).join(", ");

  // Hover: gentle lift + stronger glow
  const hoverShadow = [
    `0 4px 12px color-mix(in srgb, ${accent} 22%, transparent)`,
    `0 8px 0 color-mix(in srgb, ${accent} 22%, transparent)`,
    `0 16px 32px rgba(0, 0, 0, 0.10)`,
  ].join(", ");

  const baseStyle = {
    position: "relative" as const,
    background: surface,
    border: `${borderWidth}px solid color-mix(in srgb, ${borderColor} 60%, ${accent} 40%)`,
    borderRadius: radius,
    boxShadow: shadow,
    cursor: onClick ? "pointer" : undefined,
    ...style,
  };

  if (!fullMotion) {
    return (
      <div className={className} style={baseStyle} onClick={onClick}>
        <div style={{ position: "relative" }}>{children}</div>
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      onClick={onClick}
      whileHover={interactive ? {
        y: -4,
        boxShadow: hoverShadow,
      } : undefined}
      whileTap={interactive ? {
        scale: 0.97,
      } : undefined}
      transition={transition}
      style={{
        ...baseStyle,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div style={{ position: "relative" }}>{children}</div>
    </motion.div>
  );
}
