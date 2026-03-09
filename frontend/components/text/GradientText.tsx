import { motion } from "motion/react";
import { forwardRef, useMemo, type CSSProperties } from "react";
import clsx from "clsx";

import type { GradientTextProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion } from "../../hooks/use-motion-allowed";

/**
 * Text with an animated flowing gradient.
 * Complementary to GlitchText — this one is smooth and elegant
 * rather than chaotic. The gradient continuously shifts position,
 * creating a shimmering rainbow/aurora effect on text.
 */
export const GradientText = forwardRef<HTMLSpanElement, GradientTextProps>(
  function GradientText({
    children,
    colors,
    angle = 90,
    animated = true,
    duration = 3,
    className,
    style,
    ...rest
  }, ref) {
    const { theme } = useThemeSnapshot();
    const fullMotion = useFullMotion();

    const defaultColors = useMemo(
      () => [theme.palette.primary, theme.palette.accent, theme.palette.secondary, theme.palette.primary],
      [theme.palette.primary, theme.palette.accent, theme.palette.secondary],
    );

    const gradientColors = colors ?? defaultColors;
    // Ensure we loop back to the first color for seamless animation
    const stops = gradientColors.length > 0 && gradientColors[gradientColors.length - 1] !== gradientColors[0]
      ? [...gradientColors, gradientColors[0]]
      : gradientColors;

    const gradient = `linear-gradient(${angle}deg, ${stops.join(", ")})`;
    const shouldAnimate = animated && fullMotion;

    const textStyle: CSSProperties = {
      backgroundImage: gradient,
      backgroundSize: shouldAnimate ? "200% 200%" : "100% 100%",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      display: "inline-block",
      ...style,
    };

    if (!shouldAnimate) {
      return (
        <span ref={ref} className={clsx(className)} style={textStyle} {...rest}>
          {children}
        </span>
      );
    }

    return (
      <motion.span
        ref={ref}
        className={clsx(className)}
        style={textStyle}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: Math.max(0.5, duration),
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
        {...rest}
      >
        {children}
      </motion.span>
    );
  }
);
