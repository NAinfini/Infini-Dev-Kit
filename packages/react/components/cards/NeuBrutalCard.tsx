import { motion } from "motion/react";
import { forwardRef } from "react";

import type { NeuBrutalCardProps } from "../../motion-types";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";

/**
 * Card with hard offset shadows and bold borders — neu-brutalism aesthetic.
 * Shadow shifts down-right on hover and snaps back on press.
 * Zero border-radius, thick borders, sticker-stack feel.
 */
export const NeuBrutalCard = forwardRef<HTMLDivElement, NeuBrutalCardProps>(
  function NeuBrutalCard({
    children,
    shadowColor,
    borderWidth,
    accentColor,
    interactive = true,
    loading = false,
    onClick,
    style,
    className,
    ...rest
  }, ref) {
  const fullMotion = useFullMotion();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("hover");

  if (loading) return null;

  const shadow = shadowColor ?? "var(--infini-color-text)";
  const border = borderWidth ?? 4;
  const accent = accentColor ?? "var(--infini-color-primary)";

  const restShadow = `${border + 2}px ${border + 2}px 0px 0px ${shadow}`;
  const hoverShadow = `${border + 5}px ${border + 5}px 0px 0px ${shadow}`;

  const baseStyle = {
    position: "relative" as const,
    background: "var(--infini-color-surface)",
    border: `${border}px solid ${shadow}`,
    borderRadius: 0,
    boxShadow: restShadow,
    overflow: "hidden",
    cursor: onClick ? "pointer" : undefined,
    ...style,
  };

  const accentStripe = (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: border,
        background: accent,
      }}
    />
  );

  // OFF: completely static
  if (!motionAllowed) {
    return (
      <div ref={ref} className={className} onClick={onClick} {...rest} style={baseStyle}>
        {accentStripe}
        <div style={{ position: "relative", paddingTop: border }}>{children}</div>
      </div>
    );
  }

  // REDUCED: subtle opacity hover only, no shadow shift or y-lift
  if (!fullMotion) {
    return (
      <motion.div
        ref={ref}
        className={className}
        onClick={onClick}
        {...rest}
        whileHover={interactive ? { opacity: 0.95 } : undefined}
        transition={transition}
        style={{ ...baseStyle, cursor: onClick ? "pointer" : "default" }}
      >
        {accentStripe}
        <div style={{ position: "relative", paddingTop: border }}>{children}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onClick={onClick}
      {...rest}
      whileHover={interactive ? {
        boxShadow: hoverShadow,
        y: -2,
        x: -2,
      } : undefined}
      whileTap={interactive ? {
        boxShadow: `2px 2px 0px 0px ${shadow}`,
        y: 2,
        x: 2,
      } : undefined}
      transition={transition}
      style={{
        ...baseStyle,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {/* Top accent stripe */}
      {accentStripe}
      {/* Content */}
      <div style={{ position: "relative", paddingTop: border }}>{children}</div>
    </motion.div>
  );
  },
);
