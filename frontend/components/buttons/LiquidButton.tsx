import { motion } from "motion/react";
import { useMemo, useState, type MouseEvent } from "react";

import { pickReadableTextColor } from "../../../utils/color";
import type { LiquidButtonProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";

/**
 * Button with a liquid metal morphing effect on hover.
 * Inspired by nyxui's Liquid Metal Button.
 * The border and background subtly warp using SVG filter turbulence,
 * enhanced with a flowing gradient highlight that follows the cursor.
 */
export function LiquidButton({
  children,
  color,
  viscosity = 1,
  onClick,
  disabled,
  className,
}: LiquidButtonProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("hover");
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const bg = color ?? theme.palette.primary;
  const textColor = pickReadableTextColor(bg);
  const isDisabled = Boolean(disabled);

  // Generate a unique filter ID so multiple instances don't clash
  const filterId = useMemo(() => `infini-liquid-${Math.random().toString(36).slice(2, 8)}`, []);

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (!fullMotion || isDisabled) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 50, y: 50 });
  };

  const baseFrequency = 0.015 / Math.max(0.3, viscosity);

  if (!motionAllowed) {
    return (
      <button
        type="button"
        className={className}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        style={{
          background: bg,
          color: textColor,
          border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
          borderRadius: theme.foundation.radius,
          fontFamily: theme.typography.en.heading,
          fontWeight: theme.typography.weights.bold,
          padding: "0.55rem 1.2rem",
          cursor: isDisabled ? "not-allowed" : "pointer",
          opacity: isDisabled ? 0.6 : 1,
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <>
      {/* SVG filter for the liquid distortion — hidden, referenced via CSS */}
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFrequency}
              numOctaves={3}
              seed={42}
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={fullMotion ? 6 : 0} />
          </filter>
        </defs>
      </svg>

      <motion.button
        type="button"
        className={className}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={
          !isDisabled
            ? {
                scale: 1.03,
                filter: `url(#${filterId})`,
              }
            : undefined
        }
        whileTap={!isDisabled ? { scale: 0.97 } : undefined}
        transition={transition}
        style={{
          position: "relative",
          overflow: "hidden",
          background: bg,
          color: textColor,
          border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} color-mix(in srgb, ${bg} 60%, ${theme.foundation.borderColor})`,
          borderRadius: theme.foundation.radius,
          fontFamily: theme.typography.en.heading,
          fontWeight: theme.typography.weights.bold,
          padding: "0.55rem 1.2rem",
          cursor: isDisabled ? "not-allowed" : "pointer",
          opacity: isDisabled ? 0.6 : 1,
          outline: "none",
        }}
      >
        {/* Flowing gradient highlight that follows cursor */}
        <motion.span
          aria-hidden
          animate={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, color-mix(in srgb, #ffffff 35%, transparent) 0%, transparent 60%)`,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            mixBlendMode: "overlay",
          }}
        />
        {/* Subtle metallic sheen animation */}
        {fullMotion && (
          <motion.span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(105deg, transparent 30%, color-mix(in srgb, #ffffff 22%, transparent) 50%, transparent 70%)`,
              pointerEvents: "none",
            }}
            animate={{ x: ["-120%", "120%"] }}
            transition={{
              duration: 2.5 * viscosity,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1.5,
            }}
          />
        )}
        <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
          {children}
        </span>
      </motion.button>
    </>
  );
}

