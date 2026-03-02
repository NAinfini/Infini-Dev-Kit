import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import type { RevealCardProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion } from "../hooks/use-motion-allowed";

const DIRECTION_MAP = {
  up: { initial: { y: "100%" }, animate: { y: 0 } },
  down: { initial: { y: "-100%" }, animate: { y: 0 } },
  left: { initial: { x: "100%" }, animate: { x: 0 } },
  right: { initial: { x: "-100%" }, animate: { x: 0 } },
} as const;

/**
 * Card whose hidden content is revealed on hover with a directional slide.
 * Inspired by nyxui's Reveal Card.
 * The reveal overlay slides in from the specified direction, covering
 * the original content with new content.
 */
export function RevealCard({
  children,
  revealContent,
  direction = "up",
  duration = 0.35,
  className,
}: RevealCardProps) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const [isHovered, setIsHovered] = useState(false);

  const dirConfig = DIRECTION_MAP[direction];

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
    <div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        borderRadius: theme.foundation.radius,
        border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
        background: theme.foundation.surface,
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Base content */}
      {children}

      {/* Reveal overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ ...dirConfig.initial, opacity: 0.9 }}
            animate={{ ...dirConfig.animate, opacity: 1 }}
            exit={{ ...dirConfig.initial, opacity: 0.9 }}
            transition={{ duration, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `color-mix(in srgb, ${theme.palette.primary} 90%, ${theme.foundation.surface})`,
              color: theme.foundation.background,
              borderRadius: theme.foundation.radius,
              zIndex: 1,
            }}
          >
            {revealContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
