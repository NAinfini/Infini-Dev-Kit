import { motion } from "motion/react";

import type { SpectrumBorderOverlay, OverlayContext } from "../../../../motion-types";

function buildSpectrumGradient(colors: string[]): string {
  const safeColors = colors.length > 0
    ? colors
    : ["var(--infini-color-primary)", "var(--infini-color-accent)", "var(--infini-color-secondary)", "var(--infini-color-warning)"];
  const stops = safeColors
    .map((color, i) => `${color} ${((i / Math.max(1, safeColors.length - 1)) * 360).toFixed(0)}deg`)
    .join(", ");
  return `conic-gradient(from 0deg, ${stops}, ${safeColors[0]} 360deg)`;
}

export function SpectrumBorderLayer({
  ctx, fullMotion, motionAllowed,
  colors = [], rotate = true, revealMode = "hover", borderWidth = 2, glowIntensity = 1,
}: SpectrumBorderOverlay & { ctx: OverlayContext; fullMotion: boolean; motionAllowed: boolean }) {
  const active = revealMode === "always" || ctx.hovered;
  const gradient = buildSpectrumGradient(colors);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute", inset: 0, borderRadius: "inherit", overflow: "hidden", pointerEvents: "none", zIndex: 0,
        /* Use mask to cut out the interior, leaving only a border-width ring */
        WebkitMaskImage: `linear-gradient(#fff 0 0)`,
        WebkitMaskComposite: "xor",
        maskImage: `linear-gradient(#fff 0 0)`,
        maskComposite: "exclude",
        padding: borderWidth,
        WebkitMaskClip: "padding-box, border-box",
        maskClip: "padding-box, border-box",
      }}
    >
      <motion.div
        style={{
          position: "absolute", top: "50%", left: "50%", width: "200%", height: "200%",
          background: gradient,
          filter: glowIntensity > 1 ? `blur(${Math.round(glowIntensity)}px)` : undefined,
        }}
        initial={{ opacity: 0, x: "-50%", y: "-50%", rotate: 0 }}
        animate={
          motionAllowed
            ? { opacity: active ? 1 : 0, x: "-50%", y: "-50%", rotate: rotate && fullMotion ? 360 : 0 }
            : { opacity: active ? 1 : 0, x: "-50%", y: "-50%" }
        }
        transition={
          rotate && fullMotion
            ? { opacity: { duration: 0.3 }, rotate: { duration: 3, ease: "linear", repeat: Number.POSITIVE_INFINITY } }
            : { opacity: { duration: 0.3 } }
        }
      />
    </div>
  );
}
