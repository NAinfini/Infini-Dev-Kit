import { motion } from "motion/react";
import { forwardRef } from "react";
import clsx from "clsx";

import type { LampHeadingProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion } from "../../hooks/use-motion-allowed";

/**
 * Heading with a cone-of-light / spotlight effect emanating from above.
 * Inspired by nyxui's Lamp Heading.
 * A trapezoidal gradient "cone" illuminates behind the text,
 * creating a dramatic spotlight presentation.
 */
export const LampHeading = forwardRef<HTMLDivElement, LampHeadingProps>(
  function LampHeading({
    children,
    lampColor,
    coneWidth = 400,
    coneHeight = 200,
    animated = true,
    className,
    style,
    ...rest
  }, ref) {
    const { theme } = useThemeSnapshot();
    const fullMotion = useFullMotion();

    const effectiveColor = lampColor ?? theme.palette.primary;
    const shouldAnimate = animated && fullMotion;

    return (
      <div
        ref={ref}
        className={clsx(className)}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          ...style,
        }}
        {...rest}
      >
        {/* Lamp source line */}
        {shouldAnimate ? (
          <motion.div
            aria-hidden
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: coneWidth * 0.3, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              height: 2,
              background: effectiveColor,
              borderRadius: 1,
              boxShadow: `0 0 12px ${effectiveColor}, 0 0 24px color-mix(in srgb, ${effectiveColor} 50%, transparent)`,
            }}
          />
        ) : (
          <div
            aria-hidden
            style={{
              width: coneWidth * 0.3,
              height: 2,
              background: effectiveColor,
              borderRadius: 1,
              boxShadow: `0 0 12px ${effectiveColor}`,
            }}
          />
        )}

        {/* Cone of light */}
        {shouldAnimate ? (
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scaleX: 0.3 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{
              width: coneWidth,
              height: coneHeight,
              background: `linear-gradient(180deg, color-mix(in srgb, ${effectiveColor} 35%, transparent) 0%, color-mix(in srgb, ${effectiveColor} 8%, transparent) 60%, transparent 100%)`,
              clipPath: `polygon(${50 - (15)}% 0%, ${50 + 15}% 0%, 100% 100%, 0% 100%)`,
              transformOrigin: "top center",
            }}
          />
        ) : (
          <div
            aria-hidden
            style={{
              width: coneWidth,
              height: coneHeight,
              background: `linear-gradient(180deg, color-mix(in srgb, ${effectiveColor} 35%, transparent) 0%, color-mix(in srgb, ${effectiveColor} 8%, transparent) 60%, transparent 100%)`,
              clipPath: `polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)`,
            }}
          />
        )}

        {/* Text — positioned at the bottom of the cone */}
        {shouldAnimate ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ position: "relative", zIndex: 1, marginTop: -coneHeight * 0.4 }}
          >
            {children}
          </motion.div>
        ) : (
          <div style={{ position: "relative", zIndex: 1, marginTop: -coneHeight * 0.4 }}>
            {children}
          </div>
        )}

        {/* Ambient glow at the base */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: coneWidth * 1.2,
            height: coneHeight * 0.3,
            background: `radial-gradient(ellipse at center, color-mix(in srgb, ${effectiveColor} 15%, transparent), transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }
);
