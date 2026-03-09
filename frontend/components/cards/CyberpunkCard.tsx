import { motion } from "motion/react";
import { forwardRef, type CSSProperties } from "react";

import type { CyberpunkCardProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";

const CORNER_SIZE = 10;

/**
 * Card with neon-glowing borders, animated scanlines, and clipped corners.
 * On hover the border glow intensifies and the card lifts slightly.
 */
export const CyberpunkCard = forwardRef<HTMLDivElement, CyberpunkCardProps>(
  function CyberpunkCard({
    children,
    neonColor,
    scanlines = true,
    cornerClips = true,
    interactive = true,
    onClick,
    style,
    className,
    ...rest
  }, ref) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();

  const neon = neonColor ?? theme.palette.accent ?? "#00f0ff";
  const radius = cornerClips ? 2 : theme.foundation.radius;

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
    background: theme.foundation.surface,
    border: `1px solid ${neon}`,
    borderRadius: radius,
    overflow: "hidden",
    clipPath,
    cursor: onClick ? "pointer" : undefined,
    ...style,
  };

  const cardInner = (
    <div ref={ref} className={className} style={containerStyle} onClick={onClick} {...rest}>
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
        animate={
          fullMotion
            ? { opacity: [0.6, 1, 0.6] }
            : undefined
        }
        transition={
          fullMotion
            ? { duration: 2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }
            : undefined
        }
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
          animate={
            fullMotion
              ? { backgroundPositionY: ["0px", "40px"] }
              : undefined
          }
          transition={
            fullMotion
              ? { duration: 3, ease: "linear", repeat: Number.POSITIVE_INFINITY }
              : undefined
          }
        />
      )}

      {/* Corner decorations */}
      {cornerClips && (
        <>
          {/* Top-left corner accent */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: CORNER_SIZE + 4,
              height: 1,
              background: neon,
              boxShadow: `0 0 6px ${neon}`,
            }}
          />
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1,
              height: CORNER_SIZE + 4,
              background: neon,
              boxShadow: `0 0 6px ${neon}`,
            }}
          />
          {/* Bottom-right corner accent */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: CORNER_SIZE + 4,
              height: 1,
              background: neon,
              boxShadow: `0 0 6px ${neon}`,
            }}
          />
          <span
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 1,
              height: CORNER_SIZE + 4,
              background: neon,
              boxShadow: `0 0 6px ${neon}`,
            }}
          />
        </>
      )}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );

  if (!fullMotion || !interactive) {
    return cardInner;
  }

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        filter: `drop-shadow(0 0 6px color-mix(in srgb, ${neon} 50%, transparent))`,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ borderRadius: radius, filter: "drop-shadow(0 0 0 transparent)" }}
    >
      {cardInner}
    </motion.div>
  );
  },
);
