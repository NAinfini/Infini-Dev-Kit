import { motion } from "motion/react";
import { forwardRef, useState, type CSSProperties } from "react";

import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";
import type { SlideRevealButtonProps } from "../../motion-types";

const SIZE_MAP = {
  sm: { width: 120, height: 32, iconWidth: 32, fontSize: 13, textOffset: 16 },
  md: { width: 150, height: 40, iconWidth: 39, fontSize: 15, textOffset: 22 },
  lg: { width: 180, height: 48, iconWidth: 46, fontSize: 17, textOffset: 26 },
} as const;

export const SlideRevealButton = forwardRef<HTMLButtonElement, SlideRevealButtonProps>(
  function SlideRevealButton({ children, disabled, size = "md", icon, color, className, style, ...rest }, ref) {
    const motionAllowed = useMotionAllowed();
    const fullMotion = useFullMotion();
    const isDisabled = Boolean(disabled);
    const [hovered, setHovered] = useState(false);

    const bg = color ?? `color-mix(in srgb, var(--infini-color-success) 85%, var(--infini-color-surface))`;
    const borderColor = `color-mix(in srgb, var(--infini-color-success) 60%, black)`;
    const iconBg = `color-mix(in srgb, var(--infini-color-success) 70%, black)`;
    const sizing = SIZE_MAP[size];

    const baseStyle: CSSProperties = {
      position: "relative",
      display: "flex",
      alignItems: "center",
      width: sizing.width,
      height: sizing.height,
      border: `1px solid ${borderColor}`,
      borderRadius: 0,
      background: bg,
      color: "#fff",
      fontFamily: "var(--infini-font-heading)",
      fontWeight: 600,
      fontSize: sizing.fontSize,
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.6 : 1,
      userSelect: "none",
      outline: "none",
      overflow: "hidden",
      padding: 0,
      ...style,
    };

    const handlers = isDisabled ? {} : {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    };

    const showSlide = motionAllowed && fullMotion;
    const iconContainerWidth = showSlide && hovered ? sizing.width - 2 : sizing.iconWidth;

    const textEl = (
      <span style={{
        transform: `translateX(${sizing.textOffset}px)`,
        transition: "color 300ms ease",
        color: showSlide && hovered ? "transparent" : "#fff",
        whiteSpace: "nowrap",
        zIndex: 1,
      }}>
        {children}
      </span>
    );

    const iconEl = showSlide ? (
      <motion.span
        aria-hidden
        animate={{ width: iconContainerWidth }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20 }}>
          {icon}
        </span>
      </motion.span>
    ) : (
      <span style={{
        position: "absolute",
        right: 0,
        top: 0,
        height: "100%",
        width: sizing.iconWidth,
        background: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20 }}>
          {icon}
        </span>
      </span>
    );

    if (!motionAllowed) {
      return (
        <button ref={ref} type="button" className={className} disabled={isDisabled} style={baseStyle} {...rest}>
          {textEl}
          {iconEl}
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
        {textEl}
        {iconEl}
      </motion.button>
    );
  },
);
