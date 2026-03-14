import { motion } from "motion/react";
import { forwardRef, useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";

import type { DepthButtonType } from "../../motion-types";
import { useMotionAllowed } from "../../hooks/use-motion-allowed";

const SIZE_MAP = {
  xs: { paddingBlock: "0.2rem", paddingInline: "0.5rem", fontSize: 12, iconPad: "0.25rem" },
  sm: { paddingBlock: "0.35rem", paddingInline: "0.7rem", fontSize: 13, iconPad: "0.35rem" },
  md: { paddingBlock: "0.55rem", paddingInline: "1.1rem", fontSize: 15, iconPad: "0.55rem" },
  lg: { paddingBlock: "0.7rem", paddingInline: "1.5rem", fontSize: 17, iconPad: "0.7rem" },
} as const;

export interface DepthToggleProps {
  children?: ReactNode;
  /** Whether the toggle is currently pressed/active */
  pressed: boolean;
  /** Called when the toggle is clicked */
  onToggle: (pressed: boolean) => void;
  /** Semantic type variant (default: "primary") */
  type?: DepthButtonType;
  /** Pixel depth of the 3D raise effect (default: theme-aware) */
  raiseLevel?: number;
  /** Background color override */
  color?: string;
  /** Shadow color override */
  shadowColor?: string;
  /** Content before the label (e.g. icon) */
  before?: ReactNode;
  /** Content after the label (e.g. icon) */
  after?: ReactNode;
  /** Show ripple effect on press (default: true) */
  ripple?: boolean;
  /** Square icon-only button (equal padding on all sides) */
  iconOnly?: boolean;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  /** Style overrides (merged after computed inline styles) */
  style?: CSSProperties;
  title?: string;
  "aria-label"?: string;
}

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
 * Toggle variant of DepthButton.
 * When `pressed` is false, renders raised with full depth shadow.
 * When `pressed` is true, presses down ~70% and bounces back, keeping reduced shadow.
 */
export const DepthToggle = forwardRef<HTMLButtonElement, DepthToggleProps>(function DepthToggle(props, ref) {
  const {
    children,
    pressed,
    onToggle,
    type: buttonType = "primary",
    raiseLevel,
    color,
    shadowColor,
    ripple = true,
    iconOnly = false,
    disabled,
    size = "md",
    className,
    style: styleProp,
    before,
    after,
    "aria-label": ariaLabel,
    ...rest
  } = props;
  
  const motionAllowed = useMotionAllowed();
  const [ripples, setRipples] = useState<RippleState[]>([]);
  const rippleIdRef = useRef(0);

  const typeColors = resolveTypeColors(buttonType);
  const depth = raiseLevel ?? Math.max(0, 4);
  const bg = color ?? typeColors.bg;
  const shadow = shadowColor ?? typeColors.shadow;
  const isDisabled = Boolean(disabled);

  // Pressed resting state: settle at ~40% depth after releasing (spring-back feel)
  const pressedY = Math.round(depth * 0.4);
  const pressedShadow = Math.max(1, depth - pressedY);

  // Both pressed and unpressed use full type colors (matching DepthButton)
  const activeBg = bg;
  const activeTextColor = buttonType === "secondary"
    ? "var(--infini-color-text)"
    : "var(--infini-color-bg)";

  const sizing = SIZE_MAP[size];

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

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      handleRipple(e);
      if (!isDisabled) onToggle(!pressed);
    },
    [handleRipple, isDisabled, onToggle, pressed],
  );

  const baseStyle: CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: children ? 8 : 0,
    border: `var(--infini-border-width, 1px) solid var(--infini-color-border)`,
    borderRadius: "var(--infini-radius)",
    background: activeBg,
    color: activeTextColor,
    fontFamily: "var(--infini-font-heading)",
    fontWeight: 600,
    paddingBlock: sizing.paddingBlock,
    paddingInline: iconOnly ? sizing.iconPad : sizing.paddingInline,
    fontSize: sizing.fontSize,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.6 : 1,
    userSelect: "none",
    outline: "none",
    overflow: "hidden",
    ...styleProp,
  };

  const contentEl = (
    <>
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
            background: `color-mix(in srgb, ${activeTextColor} 30%, transparent)`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      ))}
      {/* Indicator light — top edge of button surface */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: 5,
          left: "50%",
          transform: "translateX(-50%)",
          height: 3,
          width: "40%",
          borderRadius: "0 0 2px 2px",
          background: pressed ? "#22c55e" : `color-mix(in srgb, var(--infini-color-text) 15%, transparent)`,
          boxShadow: pressed ? "0 0 6px 1px rgba(34,197,94,0.55)" : "none",
          transition: "background 200ms ease, box-shadow 200ms ease",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: children ? 8 : 0 }}>
        {before}
        {children}
        {after}
      </span>
    </>
  );

  // No-motion fallback
  if (!motionAllowed) {
    return (
      <button
        ref={ref}
        type="button"
        className={className}
        onClick={isDisabled ? undefined : () => onToggle(!pressed)}
        disabled={isDisabled}
        aria-pressed={pressed}
        aria-label={ariaLabel}
        {...rest}
        style={{
          ...baseStyle,
          transform: pressed ? `translateY(${pressedY}px)` : "translateY(0)",
          boxShadow: pressed
            ? `0 ${pressedShadow}px 0 color-mix(in srgb, ${shadow} 88%, transparent)`
            : `0 ${depth}px 0 color-mix(in srgb, ${shadow} 88%, transparent)`,
        }}
      >
        {contentEl}
      </button>
    );
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      className={className}
      onClick={handleClick}
      disabled={isDisabled}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      {...rest}
      animate={{
        y: pressed ? pressedY : 0,
        boxShadow: pressed
          ? `0 ${pressedShadow}px 0 color-mix(in srgb, ${shadow} 88%, transparent)`
          : `0 ${depth}px 0 color-mix(in srgb, ${shadow} 88%, transparent)`,
      }}
      whileHover={!isDisabled && !pressed ? { y: -Math.round(depth * 0.25), boxShadow: `0 ${depth + 2}px 0 color-mix(in srgb, ${shadow} 88%, transparent)` } : undefined}
      whileTap={!isDisabled ? { y: depth, boxShadow: `0 0px 0 color-mix(in srgb, ${shadow} 88%, transparent)`, transition: { type: "spring", stiffness: 400, damping: 15 } } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 12, mass: 0.8 }}
      style={{ ...baseStyle, transformStyle: "preserve-3d" }}
    >
      {contentEl}
    </motion.button>
  );
});
