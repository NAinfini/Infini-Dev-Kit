import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";
import { getInputVariants } from "../hooks/variants/input-variants";

export type MotionInputStatus = "default" | "error" | "warning" | "success";

export interface MotionInputFrameProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  status?: MotionInputStatus;
}

export function resolveBorderRadiusFromCorners(corners: ReadonlyArray<string | null | undefined>, fallback: string): string {
  const normalized = corners.map((corner) => (corner ?? "").trim());
  if (normalized.some((corner) => corner.length === 0)) {
    return fallback;
  }
  return normalized.join(" ");
}

export function MotionInputFrame({
  children,
  className,
  style,
  status = "default",
}: MotionInputFrameProps) {
  const { state, theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("focus");
  const frameRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [frameRadius, setFrameRadius] = useState(`${Math.max(2, Math.round(theme.foundation.radius * 0.75))}px`);
  const variants = getInputVariants(state.themeId);
  const syncFrameRadius = () => {
    const fallbackRadius = `${Math.max(2, Math.round(theme.foundation.radius * 0.75))}px`;

    if (typeof window === "undefined") {
      setFrameRadius(fallbackRadius);
      return;
    }

    const controlElement = frameRef.current?.querySelector<HTMLElement>(
      ".mantine-Input-input, .mantine-Select-input, .mantine-NumberInput-input, .mantine-PillsInput-input, input, textarea",
    );

    if (!controlElement) {
      setFrameRadius(fallbackRadius);
      return;
    }

    const computedStyle = window.getComputedStyle(controlElement);
    setFrameRadius(
      resolveBorderRadiusFromCorners(
        [
          computedStyle.borderTopLeftRadius,
          computedStyle.borderTopRightRadius,
          computedStyle.borderBottomRightRadius,
          computedStyle.borderBottomLeftRadius,
        ],
        fallbackRadius,
      ),
    );
  };
  const statusVariant = useMemo(() => {
    if (status === "error") return "error";
    if (status === "warning") return "warning";
    if (status === "success") return "success";
    return focused ? "focus" : "idle";
  }, [focused, status]);
  const reducedVariants = useMemo(
    () => ({
      idle: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: "none" },
      focus: { opacity: [0.92, 1], x: 0, y: 0, rotate: 0, scale: 1, filter: "none" },
      error: { opacity: [1, 0.8, 1], x: 0, y: 0, rotate: 0, scale: 1, filter: "none" },
      success: { opacity: [0.9, 1], x: 0, y: 0, rotate: 0, scale: 1, filter: "none" },
      warning: { opacity: [1, 0.88, 1], x: 0, y: 0, rotate: 0, scale: 1, filter: "none" },
    }),
    [],
  );

  useEffect(() => {
    syncFrameRadius();
  }, [state.themeId, theme.foundation.radius]);

  if (!motionAllowed) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={frameRef}
      className={className}
      style={{ ...style, borderRadius: style?.borderRadius ?? frameRadius }}
      variants={fullMotion ? variants : reducedVariants}
      initial="idle"
      animate={statusVariant}
      transition={transition}
      onFocusCapture={() => {
        syncFrameRadius();
        setFocused(true);
      }}
      onBlurCapture={() => setFocused(false)}
    >
      {children}
    </motion.div>
  );
}
