import { motion } from "motion/react";
import { forwardRef } from "react";

import type { NeuBrutalCardProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion } from "../../hooks/use-motion-allowed";
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
    onClick,
    style,
    className,
    ...rest
  }, ref) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("hover");

  const shadow = shadowColor ?? theme.palette.text ?? "#000000";
  const border = borderWidth ?? theme.foundation.borderWidth ?? 4;
  const accent = accentColor ?? theme.palette.primary;

  const restShadow = `${border + 2}px ${border + 2}px 0px 0px ${shadow}`;
  const hoverShadow = `${border + 5}px ${border + 5}px 0px 0px ${shadow}`;

  if (!fullMotion) {
    return (
      <div
        ref={ref}
        className={className}
        onClick={onClick}
        {...rest}
        style={{
          position: "relative",
          background: theme.foundation.surface,
          border: `${border}px solid ${shadow}`,
          borderRadius: 0,
          boxShadow: restShadow,
          overflow: "hidden",
          cursor: onClick ? "pointer" : undefined,
          ...style,
        }}
      >
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
        <div style={{ position: "relative", paddingTop: border }}>{children}</div>
      </div>
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
        position: "relative",
        background: theme.foundation.surface,
        border: `${border}px solid ${shadow}`,
        borderRadius: 0,
        boxShadow: restShadow,
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {/* Top accent stripe */}
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
      {/* Content */}
      <div style={{ position: "relative", paddingTop: border }}>{children}</div>
    </motion.div>
  );
  },
);
