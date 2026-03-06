import { motion } from "motion/react";
import { useMemo } from "react";

import type { RippleBackgroundProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion } from "../../hooks/use-motion-allowed";

/**
 * Background container with concentric ripple rings expanding outward.
 * Inspired by nyxui's Dynamic Ripple / Water Ripple Effect.
 * Enhanced with theme-aware colors and motion gating.
 * Each ring expands, fades, and loops — creating a radar/sonar pulse effect.
 */
export function RippleBackground({
  children,
  color,
  rings = 3,
  duration = 4,
  className,
}: RippleBackgroundProps) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();

  const rippleColor = color ?? theme.palette.primary;
  const ringCount = Math.max(1, Math.min(rings, 6));
  const cycleDuration = Math.max(1, duration);

  const ringElements = useMemo(() => {
    return Array.from({ length: ringCount }, (_, i) => ({
      id: i,
      delay: (i / ringCount) * cycleDuration,
    }));
  }, [ringCount, cycleDuration]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ripple rings layer */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {fullMotion &&
          ringElements.map((ring) => (
            <motion.span
              key={ring.id}
              style={{
                position: "absolute",
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `2px solid ${rippleColor}`,
                opacity: 0,
              }}
              animate={{
                scale: [0, 4, 10],
                opacity: [0, 0.35, 0],
              }}
              transition={{
                duration: cycleDuration,
                ease: "easeOut",
                repeat: Number.POSITIVE_INFINITY,
                delay: ring.delay,
              }}
            />
          ))}
      </div>

      {/* Content */}
      {children && (
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      )}
    </div>
  );
}
