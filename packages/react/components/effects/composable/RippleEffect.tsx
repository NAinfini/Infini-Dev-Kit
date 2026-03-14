import { motion } from "motion/react";
import { useCallback, useRef, useState, type ReactNode } from "react";

import { useMotionAllowed } from "../../../hooks/use-motion-allowed";

interface RippleState {
  x: number;
  y: number;
  id: number;
}

export interface RippleEffectProps {
  children: ReactNode;
  /** Ripple color (default: translucent white) */
  color?: string;
  /** Disable ripple (default: false) */
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Click-triggered ripple expanding circles.
 * Extracted from DepthButton.
 */
export function RippleEffect({
  children,
  color,
  disabled = false,
  className,
  style,
}: RippleEffectProps) {
  const motionAllowed = useMotionAllowed();
  const [ripples, setRipples] = useState<RippleState[]>([]);
  const rippleIdRef = useRef(0);

  const rippleColor = color ?? "color-mix(in srgb, currentColor 30%, transparent)";

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !motionAllowed) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      rippleIdRef.current += 1;
      const id = rippleIdRef.current;
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    },
    [disabled, motionAllowed],
  );

  return (
    <div
      className={className}
      onClick={handleClick}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: rippleColor,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      ))}
      {children}
    </div>
  );
}
