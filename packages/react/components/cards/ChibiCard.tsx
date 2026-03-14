import { motion } from "motion/react";
import { forwardRef } from "react";

import type { ChibiCardProps } from "../../motion-types";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";

/**
 * Kawaii sticker-card for the chibi theme.
 * Soft cloud shadows, large radius, gentle float-up on hover.
 * No 3D tilt — avoids clipping into neighboring cards.
 */
export const ChibiCard = forwardRef<HTMLDivElement, ChibiCardProps>(
  function ChibiCard({
    children,
    glowColor,
    shadowLayers,
    interactive = true,
    loading = false,
    onClick,
    style,
    className,
    ...rest
  }, ref) {
  const fullMotion = useFullMotion();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("hover");

  if (loading) return null;

  const accent = glowColor ?? "var(--infini-color-primary)";

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
    background: "var(--infini-color-surface)",
    border: `var(--infini-border-width) solid color-mix(in srgb, var(--infini-color-border) 60%, ${accent} 40%)`,
    borderRadius: "var(--infini-radius)",
    boxShadow: shadow,
    cursor: onClick ? "pointer" : undefined,
    ...style,
  };

  // OFF: completely static
  if (!motionAllowed) {
    return (
      <div ref={ref} className={className} style={baseStyle} onClick={onClick} {...rest}>
        <div style={{ position: "relative" }}>{children}</div>
      </div>
    );
  }

  // REDUCED: subtle opacity hover only
  if (!fullMotion) {
    return (
      <motion.div
        ref={ref}
        className={className}
        onClick={onClick}
        {...rest}
        whileHover={interactive ? { opacity: 0.9 } : undefined}
        transition={transition}
        style={{ ...baseStyle, cursor: onClick ? "pointer" : "default" }}
      >
        <div style={{ position: "relative" }}>{children}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onClick={onClick}
      {...rest}
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
  },
);
