import { AnimatePresence, motion } from "motion/react";

import type { DirectionalRevealOverlay, OverlayContext } from "../../../../motion-types";

const DIR_MAP = {
  up: { initial: { y: "100%" }, animate: { y: 0 } },
  down: { initial: { y: "-100%" }, animate: { y: 0 } },
  left: { initial: { x: "100%" }, animate: { x: 0 } },
  right: { initial: { x: "-100%" }, animate: { x: 0 } },
} as const;

export function DirectionalRevealLayer({
  ctx, fullMotion, motionAllowed,
  revealContent, direction = "up", duration = 0.35,
}: DirectionalRevealOverlay & { ctx: OverlayContext; fullMotion: boolean; motionAllowed: boolean }) {
  if (!motionAllowed) return null;

  const dir = DIR_MAP[direction];

  return (
    <AnimatePresence>
      {ctx.hovered && (
        <motion.div
          initial={fullMotion ? { ...dir.initial, opacity: 0.9 } : { opacity: 0 }}
          animate={fullMotion ? { ...dir.animate, opacity: 1 } : { opacity: 1 }}
          exit={fullMotion ? { ...dir.initial, opacity: 0.9 } : { opacity: 0 }}
          transition={{ duration: fullMotion ? duration : duration * 0.6, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            background: "color-mix(in srgb, var(--infini-color-primary) 90%, var(--infini-color-surface))",
            color: "var(--infini-color-bg)", borderRadius: "inherit", pointerEvents: "none", zIndex: 1,
          }}
        >
          {revealContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
