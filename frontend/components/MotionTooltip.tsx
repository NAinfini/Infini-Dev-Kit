import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

import type { MotionTooltipProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

const POSITION_OFFSETS: Record<NonNullable<MotionTooltipProps["position"]>, { x: number; y: number; origin: string }> = {
  top: { x: 0, y: -8, origin: "bottom center" },
  bottom: { x: 0, y: 8, origin: "top center" },
  left: { x: -8, y: 0, origin: "right center" },
  right: { x: 8, y: 0, origin: "left center" },
};

/**
 * Tooltip with spring-physics animated entrance.
 * Theme-aware colors and motion-gated animations.
 */
export function MotionTooltip({
  children,
  label,
  position = "top",
  delay = 200,
  disabled,
  entranceStyle = "fade",
  className,
}: MotionTooltipProps) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("hover");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  const show = useCallback(() => {
    if (disabled) return;
    timerRef.current = window.setTimeout(() => setVisible(true), delay);
  }, [delay, disabled]);

  const hide = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  const offset = POSITION_OFFSETS[position];

  const positionStyles: Record<string, React.CSSProperties> = {
    top: { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 6 },
    bottom: { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 6 },
    left: { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 6 },
    right: { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: 6 },
  };

  return (
    <span
      className={className}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      style={{ position: "relative", display: "inline-flex" }}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.span
            role="tooltip"
            initial={
              fullMotion
                ? entranceStyle === "scale"
                  ? { opacity: 0, scale: 0.85 }
                  : entranceStyle === "slide"
                    ? { opacity: 0, x: offset.x, y: offset.y }
                    : { opacity: 0 }
                : { opacity: 0 }
            }
            animate={
              fullMotion
                ? { opacity: 1, scale: 1, x: 0, y: 0 }
                : { opacity: 1 }
            }
            exit={
              fullMotion
                ? entranceStyle === "scale"
                  ? { opacity: 0, scale: 0.85 }
                  : entranceStyle === "slide"
                    ? { opacity: 0, x: offset.x, y: offset.y }
                    : { opacity: 0 }
                : { opacity: 0 }
            }
            transition={transition}
            style={{
              position: "absolute",
              ...positionStyles[position],
              whiteSpace: "nowrap",
              padding: "4px 10px",
              borderRadius: Math.max(4, theme.foundation.radius * 0.5),
              background: theme.palette.text,
              color: theme.foundation.background,
              fontSize: 12,
              fontFamily: theme.typography.display,
              pointerEvents: "none",
              zIndex: 9999,
              boxShadow: theme.depth.dropdownShadow,
              transformOrigin: offset.origin,
            }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
