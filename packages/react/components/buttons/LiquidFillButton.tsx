import { motion } from "motion/react";
import { forwardRef, useState, type CSSProperties } from "react";

import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";
import type { LiquidFillButtonProps } from "../../motion-types";

const SIZE_MAP = {
  sm: { paddingBlock: "0.4rem", paddingInline: "1rem", fontSize: 13, radius: 6 },
  md: { paddingBlock: "0.65rem", paddingInline: "1.4rem", fontSize: 15, radius: 8 },
  lg: { paddingBlock: "0.85rem", paddingInline: "2rem", fontSize: 17, radius: 10 },
} as const;

export const LiquidFillButton = forwardRef<HTMLButtonElement, LiquidFillButtonProps>(
  function LiquidFillButton({ children, disabled, size = "md", color, fillColor, className, style, ...rest }, ref) {
    const motionAllowed = useMotionAllowed();
    const fullMotion = useFullMotion();
    const isDisabled = Boolean(disabled);
    const [hovered, setHovered] = useState(false);

    const bg = color ?? "var(--infini-color-surface)";
    const fill = fillColor ?? "var(--infini-button-bg-active)";
    const sizing = SIZE_MAP[size];

    const baseStyle: CSSProperties = {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "var(--infini-border-width, 1px) solid var(--infini-color-border)",
      borderRadius: sizing.radius,
      background: bg,
      color: "var(--infini-color-text)",
      fontFamily: "var(--infini-font-heading)",
      fontWeight: 700,
      paddingBlock: sizing.paddingBlock,
      paddingInline: sizing.paddingInline,
      fontSize: sizing.fontSize,
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.6 : 1,
      userSelect: "none",
      outline: "none",
      overflow: "hidden",
      ...style,
    };

    const handlers = isDisabled ? {} : {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    };

    const fillEl = motionAllowed && fullMotion ? (
      <motion.span
        aria-hidden
        initial={{ height: "0%" }}
        animate={{ height: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          background: fill,
          borderRadius: "inherit",
          zIndex: 0,
        }}
      />
    ) : null;

    const contentEl = (
      <span style={{ position: "relative", zIndex: 1, transition: "color 300ms ease", color: hovered && fullMotion ? "var(--infini-color-bg)" : undefined }}>
        {children}
      </span>
    );

    if (!motionAllowed) {
      return (
        <button ref={ref} type="button" className={className} disabled={isDisabled} style={baseStyle} {...rest}>
          {contentEl}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        type="button"
        className={className}
        disabled={isDisabled}
        style={baseStyle}
        whileHover={!isDisabled && !fullMotion ? { opacity: 0.85 } : undefined}
        {...handlers}
        {...rest}
      >
        {fillEl}
        {contentEl}
      </motion.button>
    );
  },
);
