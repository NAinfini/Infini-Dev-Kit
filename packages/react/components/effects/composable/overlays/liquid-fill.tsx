import { motion } from "motion/react";
import type { CSSProperties } from "react";

import type { LiquidFillOverlay, OverlayContext } from "../../../../motion-types";

const CIRCLES: { top: string; left: string }[] = [
  { top: "0%", left: "0%" },
  { top: "100%", left: "100%" },
];

export function LiquidFillLayer({
  ctx, fullMotion, motionAllowed: _motionAllowed,
  color = "var(--infini-color-primary)", revealMode = "hover", opacity: fillOpacity = 0.34,
}: LiquidFillOverlay & { ctx: OverlayContext; fullMotion: boolean; motionAllowed: boolean }) {
  const active = revealMode === "always" || ctx.hovered;

  const circleBase: CSSProperties = {
    position: "absolute", width: "150%", aspectRatio: "1", borderRadius: "50%",
    backgroundColor: color, opacity: fillOpacity, pointerEvents: "none", translate: "-50% -50%",
  };

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {CIRCLES.map((pos, i) => (
        <motion.div
          key={i}
          style={{ ...circleBase, top: pos.top, left: pos.left }}
          initial={{ scale: 0 }}
          animate={{ scale: active ? 1 : 0 }}
          transition={fullMotion ? { duration: 1, ease: [0.76, 0, 0.24, 1] } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}
