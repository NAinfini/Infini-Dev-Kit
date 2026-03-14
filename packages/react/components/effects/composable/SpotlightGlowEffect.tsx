import type { ReactNode } from "react";
import { motion } from "motion/react";

import { useFullMotion, useMotionAllowed } from "../../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../../hooks/use-theme-transition";
import { useMouseTracker } from "../../../hooks/use-mouse-tracker";

export interface SpotlightGlowEffectProps {
  children: ReactNode;
  /** Glow color (default: theme primary) */
  glowColor?: string;
  /** Glow intensity 0–1 (default: 0.6) */
  glowIntensity?: number;
  /** Glow radius in px (default: 200) */
  glowRadius?: number;
  /** Enable mouse tracking (default: true) */
  trackMouse?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Radial gradient glow that follows the cursor.
 * Extracted from GlowCard "spotlight" variant.
 */
export function SpotlightGlowEffect({
  children,
  glowColor,
  glowIntensity = 0.6,
  glowRadius = 200,
  trackMouse = true,
  className,
  style,
}: SpotlightGlowEffectProps) {
  const fullMotion = useFullMotion();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("hover");
  const { x, y, isHovered, handlers } = useMouseTracker(fullMotion && trackMouse);

  if (!motionAllowed) {
    return (
      <div className={className} style={{ position: "relative", borderRadius: "var(--infini-radius)", overflow: "hidden", ...style }}>
        {children}
      </div>
    );
  }

  const color = glowColor ?? "var(--infini-color-primary)";

  if (!fullMotion) {
    return (
      <motion.div
        className={className}
        whileHover={{ scale: 1.01 }}
        transition={transition}
        style={{ position: "relative", borderRadius: "var(--infini-radius)", overflow: "hidden", ...style }}
      >
        {children}
      </motion.div>
    );
  }

  const glowBackground = isHovered
    ? `radial-gradient(${glowRadius}px circle at ${x}px ${y}px, color-mix(in srgb, ${color} ${Math.round(glowIntensity * 100)}%, transparent), transparent 70%)`
    : "none";

  return (
    <motion.div
      className={className}
      {...handlers}
      whileHover={{ scale: 1.01 }}
      transition={transition}
      style={{ position: "relative", borderRadius: "var(--infini-radius)", overflow: "hidden", ...style }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: "var(--infini-radius)",
          background: glowBackground,
          pointerEvents: "none",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          zIndex: 0,
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: "var(--infini-radius)",
          pointerEvents: "none",
          boxShadow: isHovered
            ? `inset 0 0 0 1px color-mix(in srgb, ${color} ${Math.round(glowIntensity * 50)}%, transparent)`
            : "none",
          transition: "box-shadow 0.3s ease",
          zIndex: 1,
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </motion.div>
  );
}
