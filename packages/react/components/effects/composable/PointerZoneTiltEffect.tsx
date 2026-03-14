import { motion } from "motion/react";
import { useCallback, useState, type ReactNode } from "react";

import { useMotionAllowed } from "../../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../../hooks/use-theme-transition";

type TiltZone = "left" | "middle" | "right";

export interface PointerZoneTiltEffectProps {
  children: ReactNode;
  /** Tilt pressure intensity — higher = more skew (default: 1) */
  pressure?: number;
  /** Disable tilt (default: false) */
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Zone-based skew tilt (left/middle/right) on hover.
 * Extracted from DepthButton.
 */
export function PointerZoneTiltEffect({
  children,
  pressure = 1,
  disabled = false,
  className,
  style,
}: PointerZoneTiltEffectProps) {
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("press");
  const [tiltZone, setTiltZone] = useState<TiltZone | null>(null);

  const effectivePressure = Math.max(0, pressure);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!motionAllowed || disabled) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const relX = event.clientX - rect.left;
      const third = rect.width / 3;
      if (relX < third) setTiltZone("left");
      else if (relX > third * 2) setTiltZone("right");
      else setTiltZone("middle");
    },
    [motionAllowed, disabled],
  );

  const handleMouseLeave = useCallback(() => setTiltZone(null), []);

  if (!motionAllowed || disabled) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const skewDeg = effectivePressure * 1.2;
  const skew = (() => {
    switch (tiltZone) {
      case "left": return skewDeg;
      case "right": return -skewDeg;
      case "middle":
      default: return 0;
    }
  })();

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ skewY: skew }}
      transition={transition}
      style={style}
    >
      {children}
    </motion.div>
  );
}
