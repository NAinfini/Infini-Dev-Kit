import { motion } from "motion/react";
import { useCallback, useRef, useState, type CSSProperties } from "react";

import type { DepthButtonProps, DepthButtonType } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

const SIZE_MAP = {
  sm: { paddingBlock: "0.35rem", paddingInline: "0.7rem", fontSize: 13 },
  md: { paddingBlock: "0.55rem", paddingInline: "1.1rem", fontSize: 15 },
  lg: { paddingBlock: "0.7rem", paddingInline: "1.5rem", fontSize: 17 },
} as const;

type TiltZone = "left" | "middle" | "right";

function resolveTypeColors(
  type: DepthButtonType,
  theme: ReturnType<typeof useThemeSnapshot>["theme"],
): { bg: string; shadow: string } {
  switch (type) {
    case "secondary":
      return {
        bg: theme.foundation.surface,
        shadow: theme.foundation.borderColor,
      };
    case "danger":
      return {
        bg: theme.palette.danger,
        shadow: `color-mix(in srgb, ${theme.palette.danger} 70%, black)`,
      };
    case "primary":
    default:
      return {
        bg: theme.button.backgroundActive,
        shadow: theme.button.backgroundShadow,
      };
  }
}

interface RippleState {
  x: number;
  y: number;
  id: number;
}

/**
 * 3D raised button with depth shadow that compresses on press.
 * Inspired by react-awesome-button's signature 3D depth effect.
 * Enhanced with ripple effect, pointer-position-aware tilt on hover,
 * href/anchor mode, before/after icon slots, and semantic type variants.
 */
export function DepthButton({
  children,
  type: buttonType = "primary",
  raiseLevel,
  color,
  shadowColor,
  onClick,
  href,
  target,
  before,
  after,
  ripple = true,
  hoverTilt = true,
  hoverPressure = 1,
  disabled,
  size = "md",
  className,
}: DepthButtonProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("press");
  const [ripples, setRipples] = useState<RippleState[]>([]);
  const rippleIdRef = useRef(0);
  const [tiltZone, setTiltZone] = useState<TiltZone | null>(null);

  const typeColors = resolveTypeColors(buttonType, theme);
  const depth = raiseLevel ?? Math.max(0, theme.button.raiseLevel);
  const bg = color ?? typeColors.bg;
  const shadow = shadowColor ?? typeColors.shadow;
  const textColor = buttonType === "secondary" ? theme.palette.text : theme.foundation.background;
  const sizing = SIZE_MAP[size];
  const isDisabled = Boolean(disabled);
  const pressure = Math.max(0, hoverPressure);

  const handleRipple = useCallback(
    (event: React.MouseEvent) => {
      if (!ripple || !motionAllowed) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      rippleIdRef.current += 1;
      const id = rippleIdRef.current;
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    },
    [ripple, motionAllowed],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!hoverTilt || !motionAllowed || isDisabled) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const relX = event.clientX - rect.left;
      const third = rect.width / 3;
      if (relX < third) {
        setTiltZone("left");
      } else if (relX > third * 2) {
        setTiltZone("right");
      } else {
        setTiltZone("middle");
      }
    },
    [hoverTilt, motionAllowed, isDisabled],
  );

  const handleMouseLeave = useCallback(() => {
    setTiltZone(null);
  }, []);

  // Compute tilt skew based on pointer zone (react-awesome-button style)
  const tiltSkew = (() => {
    if (!tiltZone || !hoverTilt || !motionAllowed) return { skew: 0, liftY: -Math.round(depth * 0.25) };
    const skewDeg = pressure * 1.2;
    switch (tiltZone) {
      case "left":
        return { skew: skewDeg, liftY: -Math.round(depth * 0.25) };
      case "right":
        return { skew: -skewDeg, liftY: -Math.round(depth * 0.25) };
      case "middle":
        return { skew: 0, liftY: -Math.round(depth * 0.35) };
    }
  })();

  const baseStyle: CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
    borderRadius: theme.foundation.radius,
    background: bg,
    color: textColor,
    fontFamily: theme.typography.display,
    fontWeight: theme.typography.displayWeight,
    paddingBlock: sizing.paddingBlock,
    paddingInline: sizing.paddingInline,
    fontSize: sizing.fontSize,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.6 : 1,
    userSelect: "none",
    outline: "none",
    overflow: "hidden",
    textDecoration: "none",
  };

  const contentEl = (
    <>
      {/* Ripple effects */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: `color-mix(in srgb, ${textColor} 30%, transparent)`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      ))}
      {/* Bottom face — the 3D edge */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          insetInline: 0,
          bottom: -depth,
          height: depth,
          borderRadius: `0 0 ${theme.foundation.radius}px ${theme.foundation.radius}px`,
          background: `color-mix(in srgb, ${shadow} 78%, black 22%)`,
          pointerEvents: "none",
        }}
      />
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
        {before}
        {children}
        {after}
      </span>
    </>
  );

  // Anchor mode
  if (href && !isDisabled) {
    if (!motionAllowed) {
      return (
        <a href={href} target={target ?? "_blank"} rel="noopener noreferrer" className={className} style={{ ...baseStyle, boxShadow: `0 ${depth}px 0 color-mix(in srgb, ${shadow} 88%, transparent)` }}>
          {contentEl}
        </a>
      );
    }
    return (
      <motion.a
        href={href}
        target={target ?? "_blank"}
        rel="noopener noreferrer"
        className={className}
        onClick={handleRipple}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: tiltSkew.liftY, skewY: tiltSkew.skew, boxShadow: `0 ${depth + 2}px 0 color-mix(in srgb, ${shadow} 88%, transparent)` }}
        whileTap={{ y: depth, skewY: 0, boxShadow: `0 0px 0 color-mix(in srgb, ${shadow} 88%, transparent)` }}
        transition={transition}
        style={{ ...baseStyle, boxShadow: `0 ${depth}px 0 color-mix(in srgb, ${shadow} 88%, transparent)`, transform: "translateY(0)", transformStyle: "preserve-3d" }}
      >
        {contentEl}
      </motion.a>
    );
  }

  // Button mode
  if (!motionAllowed) {
    return (
      <button
        type="button"
        className={className}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        style={{ ...baseStyle, boxShadow: `0 ${depth}px 0 color-mix(in srgb, ${shadow} 88%, transparent)` }}
      >
        {contentEl}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      className={className}
      onClick={(e) => {
        handleRipple(e);
        if (!isDisabled) onClick?.();
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={isDisabled}
      whileHover={!isDisabled ? { y: tiltSkew.liftY, skewY: tiltSkew.skew, boxShadow: `0 ${depth + 2}px 0 color-mix(in srgb, ${shadow} 88%, transparent)` } : undefined}
      whileTap={!isDisabled ? { y: depth, skewY: 0, boxShadow: `0 0px 0 color-mix(in srgb, ${shadow} 88%, transparent)` } : undefined}
      transition={transition}
      style={{ ...baseStyle, boxShadow: `0 ${depth}px 0 color-mix(in srgb, ${shadow} 88%, transparent)`, transform: "translateY(0)", transformStyle: "preserve-3d" }}
    >
      {contentEl}
    </motion.button>
  );
}
