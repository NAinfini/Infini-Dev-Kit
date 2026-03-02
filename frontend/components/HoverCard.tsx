import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

import type { HoverCardProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

const POSITION_STYLES: Record<NonNullable<HoverCardProps["position"]>, React.CSSProperties> = {
  top: { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 8 },
  bottom: { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 8 },
  left: { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 8 },
  right: { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: 8 },
};

const ORIGIN_MAP: Record<NonNullable<HoverCardProps["position"]>, string> = {
  top: "bottom center",
  bottom: "top center",
  left: "right center",
  right: "left center",
};

/**
 * Card that appears on hover with spring animation.
 * Theme-aware and motion-gated.
 */
export function HoverCard({
  children,
  content,
  position = "bottom",
  delay = 300,
  width = 280,
  disabled,
  className,
}: HoverCardProps) {
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

  const posStyle = POSITION_STYLES[position];

  return (
    <span
      className={className}
      onMouseEnter={show}
      onMouseLeave={hide}
      style={{ position: "relative", display: "inline-block" }}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={fullMotion ? { opacity: 0, scale: 0.92, y: position === "bottom" ? -4 : position === "top" ? 4 : 0 } : { opacity: 0 }}
            animate={fullMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1 }}
            exit={fullMotion ? { opacity: 0, scale: 0.92 } : { opacity: 0 }}
            transition={transition}
            onMouseEnter={() => {
              if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
              }
            }}
            onMouseLeave={hide}
            style={{
              position: "absolute",
              ...posStyle,
              width,
              zIndex: 9999,
              transformOrigin: ORIGIN_MAP[position],
              background: theme.foundation.surface,
              border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
              borderRadius: theme.foundation.radius,
              padding: "0.75rem",
              boxShadow: `0 8px 24px rgba(0, 0, 0, 0.15)`,
              color: theme.palette.text,
              fontSize: 13,
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
