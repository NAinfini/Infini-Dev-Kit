import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

import type { GlowCardProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

/**
 * Card with a mouse-tracking border glow effect.
 * Inspired by nyxui's Glow Card.
 * The glow follows the cursor position using a radial gradient,
 * creating a spotlight effect that illuminates the card border.
 */
export function GlowCard({
  children,
  glowColor,
  glowIntensity = 0.6,
  glowRadius = 200,
  trackMouse = true,
  className,
}: GlowCardProps) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("hover");
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const effectiveGlowColor = glowColor ?? theme.palette.primary;

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!trackMouse || !fullMotion) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setMousePos({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    },
    [trackMouse, fullMotion],
  );

  const onMouseEnter = useCallback(() => setIsHovered(true), []);
  const onMouseLeave = useCallback(() => setIsHovered(false), []);

  const glowBackground = isHovered && fullMotion
    ? `radial-gradient(${glowRadius}px circle at ${mousePos.x}px ${mousePos.y}px, color-mix(in srgb, ${effectiveGlowColor} ${Math.round(glowIntensity * 100)}%, transparent), transparent 70%)`
    : "none";

  if (!fullMotion) {
    return (
      <div
        className={className}
        style={{
          position: "relative",
          borderRadius: theme.foundation.radius,
          border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
          background: theme.foundation.surface,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.01 }}
      transition={transition}
      style={{
        position: "relative",
        borderRadius: theme.foundation.radius,
        border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
        background: theme.foundation.surface,
        overflow: "hidden",
      }}
    >
      {/* Glow layer */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: theme.foundation.radius,
          background: glowBackground,
          pointerEvents: "none",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          zIndex: 0,
        }}
      />
      {/* Border glow overlay */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: theme.foundation.radius,
          pointerEvents: "none",
          boxShadow: isHovered
            ? `inset 0 0 0 1px color-mix(in srgb, ${effectiveGlowColor} ${Math.round(glowIntensity * 50)}%, transparent), 0 0 ${Math.round(glowRadius * 0.15)}px color-mix(in srgb, ${effectiveGlowColor} ${Math.round(glowIntensity * 30)}%, transparent)`
            : "none",
          transition: "box-shadow 0.3s ease",
          zIndex: 1,
        }}
      />
      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </motion.div>
  );
}
