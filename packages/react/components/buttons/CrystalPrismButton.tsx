import { motion } from "motion/react";
import { forwardRef, type CSSProperties } from "react";

import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";
import type { CrystalPrismButtonProps } from "../../motion-types";

const SIZE_MAP = {
  sm: { paddingBlock: "0.5rem", paddingInline: "1.4rem", fontSize: 13 },
  md: { paddingBlock: "0.75rem", paddingInline: "2rem", fontSize: 15 },
  lg: { paddingBlock: "1rem", paddingInline: "2.8rem", fontSize: 17 },
} as const;

export const CrystalPrismButton = forwardRef<HTMLButtonElement, CrystalPrismButtonProps>(
  function CrystalPrismButton({ children, disabled, size = "md", blur = 72, tint, className, style, ...rest }, ref) {
    const motionAllowed = useMotionAllowed();
    const fullMotion = useFullMotion();
    const isDisabled = Boolean(disabled);

    const bgTint = tint ?? "color-mix(in srgb, var(--infini-color-surface) 30%, transparent)";
    const borderTint = "color-mix(in srgb, var(--infini-color-surface) 80%, transparent)";
    const sizing = SIZE_MAP[size];

    const baseStyle: CSSProperties = {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: `1px solid ${borderTint}`,
      borderRadius: "2rem",
      background: bgTint,
      backdropFilter: `blur(${blur}px)`,
      WebkitBackdropFilter: `blur(${blur}px)`,
      color: "var(--infini-color-text)",
      fontFamily: "var(--infini-font-heading)",
      fontWeight: 900,
      paddingBlock: sizing.paddingBlock,
      paddingInline: sizing.paddingInline,
      fontSize: sizing.fontSize,
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.6 : 1,
      userSelect: "none",
      outline: "none",
      boxShadow: "0 10px 25px -5px color-mix(in srgb, var(--infini-color-text) 10%, transparent), 0 4px 6px -2px color-mix(in srgb, var(--infini-color-text) 5%, transparent)",
      transition: "all 300ms ease",
      ...style,
    };

    if (!motionAllowed) {
      return (
        <button ref={ref} type="button" className={className} disabled={isDisabled} style={baseStyle} {...rest}>
          {children}
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
        whileHover={!isDisabled && fullMotion
          ? { scale: 1.03, boxShadow: "0 20px 40px -10px color-mix(in srgb, var(--infini-color-primary) 20%, transparent), 0 8px 12px -4px color-mix(in srgb, var(--infini-color-text) 8%, transparent)" }
          : !isDisabled ? { opacity: 0.85 } : undefined}
        whileTap={!isDisabled && fullMotion ? { scale: 0.97 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...rest}
      >
        {children}
      </motion.button>
    );
  },
);
