import { motion } from "motion/react";
import { forwardRef, type CSSProperties } from "react";

import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";
import type { SoftClayButtonProps } from "../../motion-types";

const SIZE_MAP = {
  sm: { paddingBlock: "0.45rem", paddingInline: "1.2rem", fontSize: 13 },
  md: { paddingBlock: "0.75rem", paddingInline: "2.2rem", fontSize: 15 },
  lg: { paddingBlock: "1rem", paddingInline: "3rem", fontSize: 17 },
} as const;

export const SoftClayButton = forwardRef<HTMLButtonElement, SoftClayButtonProps>(
  function SoftClayButton({ children, disabled, size = "md", color, className, style, ...rest }, ref) {
    const motionAllowed = useMotionAllowed();
    const fullMotion = useFullMotion();
    const isDisabled = Boolean(disabled);

    const bg = color ?? "var(--infini-button-bg-active)";
    const sizing = SIZE_MAP[size];

    const baseStyle: CSSProperties = {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      borderRadius: 9999,
      background: bg,
      color: "var(--infini-color-bg)",
      fontFamily: "var(--infini-font-heading)",
      fontWeight: 900,
      paddingBlock: sizing.paddingBlock,
      paddingInline: sizing.paddingInline,
      fontSize: sizing.fontSize,
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.6 : 1,
      userSelect: "none",
      outline: "none",
      boxShadow: [
        "inset -8px -8px 16px rgba(0,0,0,0.15)",
        "inset 8px 8px 16px rgba(255,255,255,0.2)",
        `12px 12px 24px color-mix(in srgb, ${bg} 30%, transparent)`,
      ].join(", "),
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
        whileHover={!isDisabled && fullMotion ? { scale: 1.1 } : !isDisabled ? { opacity: 0.85 } : undefined}
        whileTap={!isDisabled && fullMotion ? { scale: 0.9 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        {...rest}
      >
        {children}
      </motion.button>
    );
  },
);
