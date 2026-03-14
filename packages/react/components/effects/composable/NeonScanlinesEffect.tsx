import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

import { useFullMotion, useMotionAllowed } from "../../../hooks/use-motion-allowed";

const CORNER_SIZE = 10;

export interface NeonScanlinesEffectProps {
  children: ReactNode;
  /** Neon border color (default: theme accent) */
  neonColor?: string;
  /** Enable animated scanlines (default: true) */
  scanlines?: boolean;
  /** Enable corner decorations (default: true) */
  cornerClips?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Neon-glowing borders, animated scanlines, and clipped corners.
 * Extracted from CyberpunkCard.
 */
export function NeonScanlinesEffect({
  children,
  neonColor,
  scanlines = true,
  cornerClips = true,
  className,
  style,
}: NeonScanlinesEffectProps) {
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();

  const neon = neonColor ?? "var(--infini-color-accent)";
  const radius = cornerClips ? 2 : "var(--infini-radius)";

  const clipPath = cornerClips
    ? `polygon(
        ${CORNER_SIZE}px 0, calc(100% - ${CORNER_SIZE}px) 0,
        100% ${CORNER_SIZE}px, 100% calc(100% - ${CORNER_SIZE}px),
        calc(100% - ${CORNER_SIZE}px) 100%, ${CORNER_SIZE}px 100%,
        0 calc(100% - ${CORNER_SIZE}px), 0 ${CORNER_SIZE}px
      )`
    : undefined;

  const containerStyle: CSSProperties = {
    position: "relative",
    border: `1px solid ${neon}`,
    borderRadius: radius,
    overflow: "hidden",
    clipPath,
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Neon glow — pulsing border shadow */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          boxShadow: `inset 0 0 16px color-mix(in srgb, ${neon} 45%, transparent)`,
          borderRadius: radius,
          clipPath,
        }}
        animate={fullMotion ? { opacity: [0.6, 1, 0.6] } : undefined}
        transition={fullMotion ? { duration: 2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY } : undefined}
      />

      {/* Animated scanlines */}
      {scanlines && motionAllowed && (
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              color-mix(in srgb, ${neon} 4%, transparent) 2px,
              color-mix(in srgb, ${neon} 4%, transparent) 4px
            )`,
            opacity: 0.5,
            clipPath,
          }}
          animate={fullMotion ? { backgroundPositionY: ["0px", "40px"] } : undefined}
          transition={fullMotion ? { duration: 3, ease: "linear", repeat: Number.POSITIVE_INFINITY } : undefined}
        />
      )}

      {/* Corner decorations */}
      {cornerClips && (
        <>
          <span aria-hidden style={{ position: "absolute", top: 0, left: 0, width: CORNER_SIZE + 4, height: 1, background: neon, boxShadow: `0 0 6px ${neon}` }} />
          <span aria-hidden style={{ position: "absolute", top: 0, left: 0, width: 1, height: CORNER_SIZE + 4, background: neon, boxShadow: `0 0 6px ${neon}` }} />
          <span aria-hidden style={{ position: "absolute", bottom: 0, right: 0, width: CORNER_SIZE + 4, height: 1, background: neon, boxShadow: `0 0 6px ${neon}` }} />
          <span aria-hidden style={{ position: "absolute", bottom: 0, right: 0, width: 1, height: CORNER_SIZE + 4, background: neon, boxShadow: `0 0 6px ${neon}` }} />
        </>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
