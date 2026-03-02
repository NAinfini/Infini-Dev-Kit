import { motion } from "motion/react";

import type { ShinyTextProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion } from "../hooks/use-motion-allowed";

/**
 * Text with animated shine/gloss sweep effect.
 * The shine is a diagonal linear-gradient mask that sweeps across.
 * Theme-aware and motion-gated.
 */
export function ShinyText({
  children,
  shineColor,
  shineWidth = 30,
  duration = 3,
  angle = -45,
  animated = true,
  className,
  style,
}: ShinyTextProps) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const color = shineColor ?? `color-mix(in srgb, ${theme.foundation.background} 80%, transparent)`;
  const shouldAnimate = animated && fullMotion;

  const gradientAngle = angle;
  const bgSize = `${200 + shineWidth}% 100%`;

  return (
    <motion.span
      className={className}
      animate={
        shouldAnimate
          ? { backgroundPosition: [`${200 + shineWidth}% center`, `-${shineWidth}% center`] }
          : undefined
      }
      transition={
        shouldAnimate
          ? { duration, repeat: Infinity, ease: "linear" }
          : undefined
      }
      style={{
        display: "inline-block",
        color: theme.palette.text,
        backgroundImage: `linear-gradient(${gradientAngle}deg, transparent 0%, transparent ${50 - shineWidth / 2}%, ${color} 50%, transparent ${50 + shineWidth / 2}%, transparent 100%)`,
        backgroundSize: bgSize,
        backgroundPosition: shouldAnimate ? undefined : `${200 + shineWidth}% center`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        backgroundRepeat: "no-repeat",
        fontFamily: theme.typography.display,
        fontWeight: theme.typography.displayWeight,
        ...style,
      }}
    >
      {children}
    </motion.span>
  );
}
