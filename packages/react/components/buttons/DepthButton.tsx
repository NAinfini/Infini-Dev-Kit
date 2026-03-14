/* eslint-disable @typescript-eslint/no-explicit-any -- Motion element refs/spreads require boundary casts */
import { motion } from "motion/react";
import { forwardRef, useCallback, useRef, useState, type CSSProperties } from "react";

import type { DepthButtonProps, DepthButtonType } from "../../motion-types";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";
import { useOverlays } from "../../hooks/use-overlays";

const SIZE_MAP = {
  sm: { paddingBlock: "0.35rem", paddingInline: "0.7rem", fontSize: 13 },
  md: { paddingBlock: "0.55rem", paddingInline: "1.1rem", fontSize: 15 },
  lg: { paddingBlock: "0.7rem", paddingInline: "1.5rem", fontSize: 17 },
} as const;

type TiltZone = "left" | "middle" | "right";

function resolveTypeColors(type: DepthButtonType): { bg: string; shadow: string } {
  switch (type) {
    case "secondary":
      return {
        bg: "var(--infini-color-surface)",
        shadow: "var(--infini-color-border)",
      };
    case "danger":
      return {
        bg: `color-mix(in srgb, var(--infini-color-danger) 85%, var(--infini-color-surface))`,
        shadow: `color-mix(in srgb, var(--infini-color-danger) 60%, black)`,
      };
    case "success":
      return {
        bg: `color-mix(in srgb, var(--infini-color-success) 85%, var(--infini-color-surface))`,
        shadow: `color-mix(in srgb, var(--infini-color-success) 60%, black)`,
      };
    case "warning":
      return {
        bg: `color-mix(in srgb, var(--infini-color-warning) 85%, var(--infini-color-surface))`,
        shadow: `color-mix(in srgb, var(--infini-color-warning) 60%, black)`,
      };
    case "info":
      return {
        bg: `color-mix(in srgb, var(--infini-color-accent) 85%, var(--infini-color-surface))`,
        shadow: `color-mix(in srgb, var(--infini-color-accent) 60%, black)`,
      };
    case "primary":
    default:
      return {
        bg: "var(--infini-button-bg-active)",
        shadow: "var(--infini-button-bg-shadow)",
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
 * Enhanced with ripple effect, optional pointer-position-aware tilt on hover,
 * href/anchor mode, before/after icon slots, and semantic type variants.
 */
export const DepthButton = forwardRef<HTMLButtonElement, DepthButtonProps>(function DepthButton(props, ref) {
  const {
    children,
    type: buttonType = "primary",
    htmlType = "button",
    raiseLevel,
    color,
    shadowColor,
    onClick,
    href,
    target,
    before,
    after,
    ripple = true,
    hoverTilt = false,
    hoverPressure = 1,
    disabled,
    size = "md",
    className,
    style,
    overlays,
    ...rest
  } = props;
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("press");
  const [ripples, setRipples] = useState<RippleState[]>([]);
  const { decorations: overlayNodes, handlers: overlayHandlers } = useOverlays(overlays);

  const rippleIdRef = useRef(0);
  const [tiltZone, setTiltZone] = useState<TiltZone | null>(null);

  const typeColors = resolveTypeColors(buttonType);
  const depth = raiseLevel ?? 4;
  const bg = color ?? typeColors.bg;
  const shadow = shadowColor ?? typeColors.shadow;
  const textColor = buttonType === "secondary" || buttonType === "warning" ? "var(--infini-color-text)" : "var(--infini-color-bg)";
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
    border: `var(--infini-border-width) solid var(--infini-color-border)`,
    borderRadius: "var(--infini-radius)",
    background: bg,
    color: textColor,
    fontFamily: "var(--infini-font-display)",
    fontWeight: "var(--infini-font-display-weight)",
    paddingBlock: sizing.paddingBlock,
    paddingInline: sizing.paddingInline,
    fontSize: sizing.fontSize,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.6 : 1,
    userSelect: "none",
    outline: "none",
    overflow: "hidden",
    textDecoration: "none",
    ...style,
  };

  const contentEl = (
    <>
      {/* Overlay decorations */}
      {overlayNodes}
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
          borderRadius: `0 0 var(--infini-radius) var(--infini-radius)`,
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
    // OFF: static anchor
    if (!motionAllowed) {
      return (
        <a ref={ref as any} href={href} target={target ?? "_blank"} rel="noopener noreferrer" className={className} {...rest as any} style={{ ...baseStyle, boxShadow: `0 ${depth}px 0 color-mix(in srgb, ${shadow} 88%, transparent)` }}>
          {contentEl}
        </a>
      );
    }
    // REDUCED: opacity hover only, no y-lift/skew
    if (!fullMotion) {
      return (
        <motion.a
          ref={ref as any}
          href={href}
          target={target ?? "_blank"}
          rel="noopener noreferrer"
          className={className}
          {...rest as any}
          whileHover={{ opacity: 0.9 }}
          transition={transition}
          style={{ ...baseStyle, boxShadow: `0 ${depth}px 0 color-mix(in srgb, ${shadow} 88%, transparent)` }}
        >
          {contentEl}
        </motion.a>
      );
    }
    // FULL: y-lift, skew, shadow animation
    return (
      <motion.a
        ref={ref as any}
        href={href}
        target={target ?? "_blank"}
        rel="noopener noreferrer"
        className={className}
        onClick={handleRipple as any}
        onMouseMove={handleMouseMove as any}
        onMouseLeave={handleMouseLeave as any}
        {...rest as any}
        whileHover={{ y: tiltSkew.liftY, skewY: tiltSkew.skew, boxShadow: `0 ${depth + 2}px 0 color-mix(in srgb, ${shadow} 88%, transparent)` }}
        whileTap={{ y: depth, skewY: 0, boxShadow: `0 0px 0 color-mix(in srgb, ${shadow} 88%, transparent)` }}
        transition={transition}
        style={{ ...baseStyle, boxShadow: `0 ${depth}px 0 color-mix(in srgb, ${shadow} 88%, transparent)`, transform: "translateY(0)", transformStyle: "preserve-3d" }}
      >
        {contentEl}
      </motion.a>
    );
  }

  // Button mode — OFF: static
  if (!motionAllowed) {
    return (
      <button
        ref={ref}
        type={htmlType}
        className={className}

        {...rest}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        style={{ ...baseStyle, boxShadow: `0 ${depth}px 0 color-mix(in srgb, ${shadow} 88%, transparent)` }}
      >
        {contentEl}
      </button>
    );
  }

  // Button mode — REDUCED: opacity hover only
  if (!fullMotion) {
    return (
      <motion.button
        ref={ref}
        type={htmlType}
        className={className}

        {...rest}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        whileHover={!isDisabled ? { opacity: 0.9 } : undefined}
        transition={transition}
        style={{ ...baseStyle, boxShadow: `0 ${depth}px 0 color-mix(in srgb, ${shadow} 88%, transparent)` }}
      >
        {contentEl}
      </motion.button>
    );
  }

  // Button mode — FULL
  return (
    <motion.button
      ref={ref}
      type={htmlType}
      className={className}
      
      {...rest}
      onClick={(e) => {
        handleRipple(e);
        overlayHandlers.onClick?.(e as any);
        if (!isDisabled) onClick?.(e);
      }}
      onMouseMove={(e) => {
        handleMouseMove(e);
        overlayHandlers.onMouseMove?.(e as any);
      }}
      onMouseLeave={(e) => {
        handleMouseLeave();
        overlayHandlers.onMouseLeave?.(e as any);
      }}
      onMouseEnter={overlayHandlers.onMouseEnter as any}
      disabled={isDisabled}
      whileHover={!isDisabled ? { y: tiltSkew.liftY, skewY: tiltSkew.skew, boxShadow: `0 ${depth + 2}px 0 color-mix(in srgb, ${shadow} 88%, transparent)` } : undefined}
      whileTap={!isDisabled ? { y: depth, skewY: 0, boxShadow: `0 0px 0 color-mix(in srgb, ${shadow} 88%, transparent)` } : undefined}
      transition={transition}
      style={{ ...baseStyle, boxShadow: `0 ${depth}px 0 color-mix(in srgb, ${shadow} 88%, transparent)`, transform: "translateY(0)", transformStyle: "preserve-3d" }}
    >
      {contentEl}
    </motion.button>
  );
});
