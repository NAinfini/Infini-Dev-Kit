import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

import type { ProgressRingProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

/**
 * Circular progress indicator with animated stroke, optional glow, and label.
 * Theme-aware colors and motion-gated animations.
 */
export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 6,
  color,
  trackColor,
  showLabel = true,
  label,
  glow = false,
  className,
}: ProgressRingProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("enter");
  const ringColor = color ?? theme.palette.primary;
  const ringTrack = trackColor ?? theme.foundation.borderColor;
  const clampedValue = Math.max(0, Math.min(100, value));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animated stroke offset
  const motionProgress = useMotionValue(0);
  const strokeDashoffset = useTransform(motionProgress, (v) => circumference * (1 - v / 100));

  useEffect(() => {
    if (motionAllowed) {
      motionProgress.set(clampedValue);
    } else {
      motionProgress.jump(clampedValue);
    }
  }, [clampedValue, motionAllowed, motionProgress]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringTrack}
          strokeWidth={strokeWidth}
        />

        {/* Progress */}
        {motionAllowed ? (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            transition={transition}
            filter={glow ? `drop-shadow(0 0 4px ${ringColor})` : undefined}
          />
        ) : (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - clampedValue / 100)}
            filter={glow ? `drop-shadow(0 0 4px ${ringColor})` : undefined}
          />
        )}
      </svg>

      {/* Label */}
      {(showLabel || label) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: theme.typography.display,
            fontWeight: theme.typography.displayWeight,
            fontSize: size * 0.2,
            color: theme.palette.text,
          }}
        >
          {label ?? `${Math.round(clampedValue)}%`}
        </div>
      )}
    </div>
  );
}
