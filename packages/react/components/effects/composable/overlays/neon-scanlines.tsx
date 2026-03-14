import { motion } from "motion/react";

import type { NeonScanlinesOverlay, OverlayContext } from "../../../../motion-types";

const CORNER_SIZE = 10;

export function NeonScanlinesLayer({
  ctx: _ctx, fullMotion, motionAllowed,
  neonColor, scanlines = true, cornerClips = true,
}: NeonScanlinesOverlay & { ctx: OverlayContext; fullMotion: boolean; motionAllowed: boolean }) {
  const neon = neonColor ?? "var(--infini-color-accent)";

  return (
    <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* Neon glow — pulsing border shadow */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
          boxShadow: `inset 0 0 16px color-mix(in srgb, ${neon} 45%, transparent)`,
        }}
        animate={fullMotion ? { opacity: [0.6, 1, 0.6] } : undefined}
        transition={fullMotion ? { duration: 2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY } : undefined}
      />
      {/* Animated scanlines */}
      {scanlines && motionAllowed && (
        <motion.span
          aria-hidden
          style={{
            position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none",
            background: `repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, ${neon} 4%, transparent) 2px, color-mix(in srgb, ${neon} 4%, transparent) 4px)`,
            opacity: 0.5,
          }}
          animate={fullMotion ? { backgroundPositionY: ["0px", "40px"] } : undefined}
          transition={fullMotion ? { duration: 3, ease: "linear", repeat: Number.POSITIVE_INFINITY } : undefined}
        />
      )}
      {/* Corner decorations */}
      {cornerClips && (
        <>
          <span aria-hidden style={{ position: "absolute", top: 0, left: 0, width: CORNER_SIZE + 4, height: 1, background: neon, pointerEvents: "none" }} />
          <span aria-hidden style={{ position: "absolute", top: 0, left: 0, width: 1, height: CORNER_SIZE + 4, background: neon, pointerEvents: "none" }} />
          <span aria-hidden style={{ position: "absolute", bottom: 0, right: 0, width: CORNER_SIZE + 4, height: 1, background: neon, pointerEvents: "none" }} />
          <span aria-hidden style={{ position: "absolute", bottom: 0, right: 0, width: 1, height: CORNER_SIZE + 4, background: neon, pointerEvents: "none" }} />
        </>
      )}
    </span>
  );
}
