import { useMemo } from "react";
import { motion } from "motion/react";
import { useMotionAllowed } from "../hooks/use-motion-allowed";

type ShimmerSkeletonProps = {
  rows?: number;
  rowHeight?: number;
  gap?: number;
  borderRadius?: number;
};

function buildRowWidths(rows: number): string[] {
  const presets = ["100%", "96%", "92%", "88%", "95%", "84%", "90%"];
  return Array.from({ length: rows }, (_, index) => presets[index % presets.length] ?? "100%");
}

export function ShimmerSkeleton({
  rows = 6,
  rowHeight = 14,
  gap = 10,
  borderRadius = 8,
}: ShimmerSkeletonProps) {
  const motionAllowed = useMotionAllowed();
  const widths = useMemo(() => buildRowWidths(Math.max(1, rows)), [rows]);

  return (
    <div
      aria-hidden
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
      }}
    >
      {widths.map((width, index) => (
        <motion.div
          key={`${index}-${width}`}
          style={{
            height: rowHeight,
            width,
            borderRadius,
            backgroundImage:
              "linear-gradient(90deg, color-mix(in srgb, var(--infini-color-text, #111827) 9%, transparent) 0%, color-mix(in srgb, var(--infini-color-text, #111827) 18%, transparent) 50%, color-mix(in srgb, var(--infini-color-text, #111827) 9%, transparent) 100%)",
            backgroundSize: "220% 100%",
          }}
          animate={
            motionAllowed
              ? {
                  backgroundPosition: ["200% 0%", "-40% 0%"],
                }
              : undefined
          }
          transition={
            motionAllowed
              ? {
                  duration: 1.2,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.02,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
