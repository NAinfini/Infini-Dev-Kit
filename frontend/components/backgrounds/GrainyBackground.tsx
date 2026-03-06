import { motion } from "motion/react";
import { useId, useMemo } from "react";

import type { GrainyBackgroundProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion } from "../../hooks/use-motion-allowed";

/**
 * Animated grainy/noise texture background with smooth color shifting.
 * Inspired by nyxui's Animated Grainy Background.
 * Uses an SVG feTurbulence filter for the grain texture overlaid on
 * a gradient that smoothly shifts between two colors.
 */
export function GrainyBackground({
  children,
  color,
  colorSecondary,
  grainOpacity = 0.3,
  grainSize = 2,
  animated = true,
  duration = 8,
  className,
}: GrainyBackgroundProps) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const filterId = useId();

  const primaryColor = color ?? theme.palette.primary;
  const secondaryColor = colorSecondary ?? theme.palette.accent;
  const shouldAnimate = animated && fullMotion;

  // Deterministic base frequency from grain size
  const baseFrequency = useMemo(() => {
    const freq = Math.max(0.2, Math.min(2, 1 / grainSize));
    return `${freq}`;
  }, [grainSize]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: theme.foundation.radius,
      }}
    >
      {/* Color gradient background */}
      {shouldAnimate ? (
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
          animate={{
            background: [
              `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              `linear-gradient(225deg, ${secondaryColor}, ${primaryColor})`,
              `linear-gradient(315deg, ${primaryColor}, ${secondaryColor})`,
              `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            ],
          }}
          transition={{
            duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ) : (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {/* SVG noise filter */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFrequency}
              numOctaves={4}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="grayNoise"
            />
            <feBlend
              in="SourceGraphic"
              in2="grayNoise"
              mode="multiply"
            />
          </filter>
        </defs>
      </svg>

      {/* Grain overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: grainOpacity,
          filter: `url(#${filterId})`,
          background: "transparent",
          pointerEvents: "none",
          zIndex: 1,
          mixBlendMode: "overlay",
        }}
      />

      {/* Secondary grain layer for denser texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: grainOpacity * 0.5,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: `${Math.round(128 * grainSize)}px`,
          pointerEvents: "none",
          zIndex: 2,
          mixBlendMode: "soft-light",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 3 }}>
        {children}
      </div>
    </div>
  );
}
