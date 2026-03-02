import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { ProgressButtonPhase, ProgressButtonProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

const PHASE_COLORS: Record<ProgressButtonPhase, (theme: ReturnType<typeof useThemeSnapshot>["theme"]) => string> = {
  idle: (t) => t.button.backgroundActive,
  loading: (t) => t.button.backgroundActive,
  success: (t) => t.palette.success,
  error: (t) => t.palette.danger,
};

/**
 * Button that tracks an async operation's lifecycle.
 * Inspired by react-awesome-button's AwesomeButtonProgress.
 * Enhanced with theme-aware colors, configurable indicator style,
 * smooth phase transitions using Motion, and fakePress for programmatic trigger.
 */
export function ProgressButton({
  children,
  onPress,
  loadingLabel = "Processing\u2026",
  successLabel = "Done",
  errorLabel = "Failed",
  resultHoldMs = 1200,
  indicator = "bar",
  fakePress = false,
  disabled,
  className,
}: ProgressButtonProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("press");
  const holdTimer = useRef<number | null>(null);
  const [phase, setPhase] = useState<ProgressButtonPhase>("idle");
  const [progress, setProgress] = useState(0);
  const fakePressHandled = useRef(false);

  const isDisabled = Boolean(disabled) || phase === "loading";
  const bg = PHASE_COLORS[phase](theme);

  useEffect(
    () => () => {
      if (holdTimer.current !== null) {
        window.clearTimeout(holdTimer.current);
      }
    },
    [],
  );

  // Fake progress bar ticker during loading
  useEffect(() => {
    if (phase !== "loading" || indicator !== "bar") {
      return;
    }

    setProgress(0);
    let frame: number;
    let elapsed = 0;
    let last = performance.now();

    const tick = (now: number) => {
      elapsed += now - last;
      last = now;
      const pct = Math.min(90, 90 * (1 - Math.exp(-elapsed / 2000)));
      setProgress(pct);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, indicator]);

  const handleClick = async () => {
    if (isDisabled) {
      return;
    }

    setPhase("loading");
    try {
      await onPress();
      setProgress(100);
      setPhase("success");
    } catch {
      setPhase("error");
    }

    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
    }
    holdTimer.current = window.setTimeout(() => {
      setPhase("idle");
      setProgress(0);
      holdTimer.current = null;
    }, Math.max(200, resultHoldMs));
  };

  // fakePress: programmatically trigger the press cycle
  useEffect(() => {
    if (fakePress && !fakePressHandled.current && phase === "idle") {
      fakePressHandled.current = true;
      void handleClick();
    }
    if (!fakePress) {
      fakePressHandled.current = false;
    }
  }, [fakePress, phase]);

  const label = phase === "loading" ? loadingLabel : phase === "success" ? successLabel : phase === "error" ? errorLabel : children;

  return (
    <motion.button
      type="button"
      className={className}
      onClick={() => void handleClick()}
      disabled={isDisabled}
      whileHover={motionAllowed && !isDisabled ? { scale: theme.motion.hoverScale } : undefined}
      whileTap={motionAllowed && !isDisabled ? { scale: 0.97 } : undefined}
      transition={transition}
      style={{
        position: "relative",
        overflow: "hidden",
        border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
        borderRadius: theme.foundation.radius,
        background: bg,
        color: theme.foundation.background,
        fontFamily: theme.typography.display,
        fontWeight: theme.typography.displayWeight,
        padding: "0.55rem 1.2rem",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled && phase === "idle" ? 0.6 : 1,
        outline: "none",
        minWidth: 120,
      }}
    >
      {/* Progress bar indicator */}
      {indicator === "bar" && phase === "loading" && (
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 3,
            background: `color-mix(in srgb, ${theme.foundation.background} 60%, transparent)`,
            borderRadius: 2,
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.15, ease: "linear" }}
        />
      )}

      {/* Label with phase transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={phase}
          style={{
            position: "relative",
            zIndex: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
          initial={fullMotion ? { opacity: 0, y: 6 } : { opacity: 0 }}
          animate={fullMotion ? { opacity: 1, y: 0 } : { opacity: 1 }}
          exit={fullMotion ? { opacity: 0, y: -6 } : { opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Spinner for loading phase */}
          {phase === "loading" && indicator === "spinner" && (
            <motion.span
              aria-hidden
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: `2px solid color-mix(in srgb, ${theme.foundation.background} 35%, transparent)`,
                borderTopColor: theme.foundation.background,
                display: "inline-block",
              }}
              animate={fullMotion ? { rotate: 360 } : undefined}
              transition={fullMotion ? { duration: 0.7, ease: "linear", repeat: Number.POSITIVE_INFINITY } : undefined}
            />
          )}
          {phase === "success" && <span aria-hidden>&#10003;</span>}
          {phase === "error" && <span aria-hidden>&#10007;</span>}
          <span>{label}</span>
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
