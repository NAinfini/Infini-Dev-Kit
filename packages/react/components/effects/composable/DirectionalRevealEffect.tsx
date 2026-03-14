import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

import { useFullMotion, useMotionAllowed } from "../../../hooks/use-motion-allowed";

const DIRECTION_MAP = {
  up: { initial: { y: "100%" }, animate: { y: 0 } },
  down: { initial: { y: "-100%" }, animate: { y: 0 } },
  left: { initial: { x: "100%" }, animate: { x: 0 } },
  right: { initial: { x: "-100%" }, animate: { x: 0 } },
} as const;

export interface DirectionalRevealEffectProps {
  children: ReactNode;
  /** Content revealed on hover */
  revealContent: ReactNode;
  /** Reveal direction (default: "up") */
  direction?: "up" | "down" | "left" | "right";
  /** Reveal duration in seconds (default: 0.35) */
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Directional slide reveal overlay on hover.
 * Extracted from RevealCard.
 */
export function DirectionalRevealEffect({
  children,
  revealContent,
  direction = "up",
  duration = 0.35,
  className,
  style,
}: DirectionalRevealEffectProps) {
  const fullMotion = useFullMotion();
  const motionAllowed = useMotionAllowed();
  const [isHovered, setIsHovered] = useState(false);

  const dirConfig = DIRECTION_MAP[direction];

  const baseStyle = {
    position: "relative" as const,
    borderRadius: "var(--infini-radius)",
    overflow: "hidden",
    ...style,
  };

  // OFF: static
  if (!motionAllowed) {
    return (
      <div className={className} style={baseStyle}>
        {children}
      </div>
    );
  }

  // REDUCED: opacity fade
  if (!fullMotion) {
    return (
      <div
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ ...baseStyle, cursor: "pointer" }}
      >
        {children}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration * 0.6 }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `color-mix(in srgb, var(--infini-color-primary) 90%, var(--infini-color-surface))`,
                color: "var(--infini-color-bg)",
                borderRadius: "var(--infini-radius)",
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

  // FULL: directional slide
  return (
    <div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ ...baseStyle, cursor: "pointer" }}
    >
      {children}
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
              background: `color-mix(in srgb, var(--infini-color-primary) 90%, var(--infini-color-surface))`,
              color: "var(--infini-color-bg)",
              borderRadius: "var(--infini-radius)",
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
