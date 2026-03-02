import { motion } from "motion/react";

import type { LoadingSkeletonProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useMotionAllowed } from "../hooks/use-motion-allowed";

function resolveShape(type: NonNullable<LoadingSkeletonProps["type"]>) {
  if (type === "avatar") {
    return { width: 36, height: 36, radius: "50%" };
  }
  if (type === "card") {
    return { width: "100%", height: 88, radius: "14px" };
  }
  if (type === "custom") {
    return { width: "100%", height: 20, radius: "10px" };
  }
  return { width: "100%", height: 12, radius: "8px" };
}

export function LoadingSkeleton({
  type = "text",
  count = 3,
  shimmer = true,
  className,
}: LoadingSkeletonProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const shape = resolveShape(type);
  const rows = Math.max(1, count);

  return (
    <div className={className} style={{ display: "grid", gap: 10 }}>
      {Array.from({ length: rows }).map((_, index) => (
        <motion.div
          // eslint-disable-next-line react/no-array-index-key
          key={`${type}-${index}`}
          style={{
            width: shape.width,
            height: shape.height,
            borderRadius: shape.radius,
            border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} color-mix(in srgb, ${theme.foundation.borderColor} 45%, transparent)`,
            backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${theme.foundation.surfaceAccent} 90%, transparent) 0%, color-mix(in srgb, ${theme.effects.hover.shimmerColor} 55%, transparent) 50%, color-mix(in srgb, ${theme.foundation.surfaceAccent} 90%, transparent) 100%)`,
            backgroundSize: "220% 100%",
          }}
          animate={
            motionAllowed && shimmer
              ? {
                  backgroundPosition: ["210% 0%", "-50% 0%"],
                }
              : undefined
          }
          transition={
            motionAllowed && shimmer
              ? {
                  duration: Math.max(0.45, theme.effects.hover.shimmerDuration / 1000),
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.03,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
