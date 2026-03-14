import { motion } from "motion/react";

import type { ShimmerSweepOverlay, OverlayContext } from "../../../../motion-types";

export function ShimmerSweepLayer({
  ctx, fullMotion, motionAllowed,
  sweepColor = "rgba(255, 255, 255, 0.25)", revealMode = "hover", angle = -13, duration = 0.6,
}: ShimmerSweepOverlay & { ctx: OverlayContext; fullMotion: boolean; motionAllowed: boolean }) {
  const active = revealMode === "always" || ctx.hovered;

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <motion.div
        style={{
          position: "absolute", top: 0, left: 0, height: "100%", width: "100%",
          background: `linear-gradient(90deg, transparent 0%, ${sweepColor} 45%, ${sweepColor} 55%, transparent 100%)`,
          transform: `skewX(${angle}deg)`,
        }}
        initial={{ x: "-150%" }}
        animate={motionAllowed ? { x: active ? "150%" : "-150%" } : undefined}
        transition={fullMotion ? { duration, ease: [0.25, 0.46, 0.45, 0.94] } : { duration: 0.3 }}
      />
    </div>
  );
}
