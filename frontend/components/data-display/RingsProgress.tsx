import { motion } from "motion/react";
import { useMemo, type CSSProperties } from "react";

import type { RingsProgressProps, RingsProgressSection } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useMotionAllowed } from "../../hooks/use-motion-allowed";

/**
 * Concentric ring progress indicator.
 * Each ring is rendered as an SVG circle with stroke-dasharray animation.
 * Unlike Mantine's RingProgress (single ring, multiple sections),
 * this renders multiple independent concentric rings — one per section.
 * Theme-aware and motion-gated.
 */
export function RingsProgress({
  rings,
  size = 120,
  thickness = 8,
  gap = 4,
  roundCaps = true,
  label,
  animated = true,
  animationDuration = 0.8,
  trackAlpha = 0.15,
  className,
}: RingsProgressProps) {
  useThemeSnapshot(); // ensure we're inside InfiniProvider
  const motionAllowed = useMotionAllowed();
  const shouldAnimate = animated && motionAllowed;

  const center = size / 2;

  const ringData = useMemo(() => {
    return rings.map((ring, idx) => {
      const radius = center - thickness / 2 - idx * (thickness + gap);
      if (radius <= 0) return null;
      const circumference = 2 * Math.PI * radius;
      const clampedValue = Math.max(0, Math.min(100, ring.value));
      const filledLength = (clampedValue / 100) * circumference;
      const gapLength = circumference - filledLength;
      return {
        ...ring,
        radius,
        circumference,
        filledLength,
        gapLength,
      };
    }).filter(Boolean) as Array<RingsProgressSection & { radius: number; circumference: number; filledLength: number; gapLength: number }>;
  }, [rings, center, thickness, gap]);

  const containerStyle: CSSProperties = {
    position: "relative",
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
  };

  const labelStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  };

  return (
    <div className={className} style={containerStyle}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        {ringData.map((ring, idx) => (
          <g key={idx}>
            {/* Track (background) */}
            <circle
              cx={center}
              cy={center}
              r={ring.radius}
              fill="none"
              stroke={ring.color}
              strokeWidth={thickness}
              strokeOpacity={trackAlpha}
            />

            {/* Filled arc */}
            {shouldAnimate ? (
              <motion.circle
                cx={center}
                cy={center}
                r={ring.radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={thickness}
                strokeLinecap={roundCaps ? "round" : "butt"}
                initial={{
                  strokeDasharray: `0 ${ring.circumference}`,
                }}
                animate={{
                  strokeDasharray: `${ring.filledLength} ${ring.gapLength}`,
                }}
                transition={{
                  duration: animationDuration,
                  ease: [0.4, 0, 0.2, 1],
                  delay: idx * 0.1,
                }}
              />
            ) : (
              <circle
                cx={center}
                cy={center}
                r={ring.radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={thickness}
                strokeLinecap={roundCaps ? "round" : "butt"}
                strokeDasharray={`${ring.filledLength} ${ring.gapLength}`}
              />
            )}
          </g>
        ))}
      </svg>

      {label ? <div style={labelStyle}>{label}</div> : null}
    </div>
  );
}
