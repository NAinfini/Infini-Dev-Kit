import { motion } from "motion/react";
import { useMemo } from "react";

import type { BubbleBackgroundProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion } from "../hooks/use-motion-allowed";

interface BubbleConfig {
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  driftX: number;
}

/**
 * Floating bubble particles as an animated background.
 * Inspired by nyxui's Bubble Background.
 * Generates configurable bubbles that float upward with drift,
 * creating an ambient particle effect.
 */
export function BubbleBackground({
  children,
  count = 20,
  colors,
  minSize = 8,
  maxSize = 60,
  speed = 1,
  className,
}: BubbleBackgroundProps) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();

  const effectiveColors = colors ?? [
    theme.palette.primary,
    theme.palette.accent,
    theme.palette.secondary,
  ];

  const bubbles = useMemo<BubbleConfig[]>(() => {
    const seeded: BubbleConfig[] = [];
    for (let i = 0; i < count; i++) {
      const seed = (i * 7919 + 1013) % 9973;
      const norm = seed / 9973;
      const seed2 = (seed * 3571 + 997) % 9973;
      const norm2 = seed2 / 9973;

      seeded.push({
        x: norm * 100,
        y: 100 + norm2 * 30,
        size: minSize + norm2 * (maxSize - minSize),
        color: effectiveColors[i % effectiveColors.length],
        duration: (8 + norm * 12) / speed,
        delay: norm * 8,
        driftX: (norm2 - 0.5) * 60,
      });
    }
    return seeded;
  }, [count, minSize, maxSize, speed, effectiveColors]);

  if (!fullMotion) {
    return (
      <div className={className} style={{ position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    );
  }

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden" }}>
      {/* Bubble layer */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {bubbles.map((bubble, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              left: `${bubble.x}%`,
              bottom: `-${bubble.size}px`,
              width: bubble.size,
              height: bubble.size,
              borderRadius: "50%",
              background: `radial-gradient(circle at 30% 30%, color-mix(in srgb, ${bubble.color} 40%, white), color-mix(in srgb, ${bubble.color} 60%, transparent))`,
              opacity: 0.3,
            }}
            animate={{
              y: [0, -(window.innerHeight + bubble.size + 100)],
              x: [0, bubble.driftX, 0],
              opacity: [0, 0.4, 0.3, 0],
              scale: [0.5, 1, 1, 0.8],
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
