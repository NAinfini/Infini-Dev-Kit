import { motion } from "motion/react";

import type { RippleOverlay } from "../../../../motion-types";

export interface RippleOverlayState {
  x: number;
  y: number;
  id: number;
}

export function RippleLayer({
  motionAllowed, ripples, color,
}: RippleOverlay & { motionAllowed: boolean; ripples: RippleOverlayState[] }) {
  if (!motionAllowed || ripples.length === 0) return null;

  const c = color ?? "color-mix(in srgb, currentColor 30%, transparent)";

  return (
    <>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "absolute", left: r.x, top: r.y, width: 20, height: 20,
            borderRadius: "50%", background: c, transform: "translate(-50%, -50%)",
            pointerEvents: "none", zIndex: 10,
          }}
        />
      ))}
    </>
  );
}
