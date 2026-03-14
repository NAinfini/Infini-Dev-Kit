import { AnimatePresence, motion } from "motion/react";
import { forwardRef, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { pickReadableTextColor } from "@infini-dev-kit/utils/color";
import type { ProgressButtonPhase, ProgressButtonProps } from "../../motion-types";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";

const PHASE_COLORS: Record<ProgressButtonPhase, string> = {
  idle: "var(--infini-button-bg-active)",
  loading: "var(--infini-button-bg-active)",
  success: "var(--infini-color-success)",
  error: "var(--infini-color-danger)",
};

/**
 * Button that tracks an async operation's lifecycle.
 * Inspired by react-awesome-button's AwesomeButtonProgress.
 * Enhanced with theme-aware colors, configurable indicator style,
 * smooth phase transitions using Motion, and fakePress for programmatic trigger.
 */
export const ProgressButton = forwardRef<HTMLButtonElement, ProgressButtonProps>(function ProgressButton({
  children,
  onPress,
  loadingLabel = "Processing\u2026",
  successLabel = "Done",
  errorLabel = "Failed",
  resultHoldMs = 1200,
  indicator = "bar",
  fakePress = false,
  disabled,
  before,
  after,
  className,
  style,
  ...rest
}, ref) {
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("press");
  const holdTimer = useRef<number | null>(null);
  const [phase, setPhase] = useState<ProgressButtonPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [dynamicErrorLabel, setDynamicErrorLabel] = useState<string | null>(null);
  const fakePressHandled = useRef(false);

  const isDisabled = Boolean(disabled) || phase === "loading";
  const bg = PHASE_COLORS[phase];
  const textColor = pickReadableTextColor(bg);

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
    setDynamicErrorLabel(null);
    try {
      await onPress();
      setProgress(100);
      setPhase("success");
    } catch (error: unknown) {
      // Use thrown Error.message as dynamic error label when available
      if (error instanceof Error && error.message) {
        setDynamicErrorLabel(error.message);
      }
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

  const resolvedErrorLabel = dynamicErrorLabel ?? errorLabel;
  const label = phase === "loading" ? loadingLabel : phase === "success" ? successLabel : phase === "error" ? resolvedErrorLabel : children;

  return (
    <motion.button
      ref={ref}
      type="button"
      className={clsx(className)}
      aria-busy={phase === "loading"}
      aria-disabled={isDisabled}
      {...rest}
      onClick={() => void handleClick()}
      disabled={isDisabled}
      whileHover={fullMotion && !isDisabled ? { scale: 1.02 } : motionAllowed && !isDisabled ? { opacity: 0.9 } : undefined}
      whileTap={fullMotion && !isDisabled ? { scale: 0.97 } : undefined}
      transition={transition}
      style={{
        position: "relative",
        overflow: "hidden",
        border: `var(--infini-border-width) solid var(--infini-color-border)`,
        borderRadius: "var(--infini-radius)",
        background: bg,
        color: textColor,
        fontFamily: "var(--infini-font-display)",
        fontWeight: "var(--infini-font-display-weight)",
        padding: "0.55rem 1.2rem",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled && phase === "idle" ? 0.6 : 1,
        outline: "none",
        minWidth: 120,
        ...style,
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
            background: `color-mix(in srgb, ${textColor} 60%, transparent)`,
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
          {before}
          {/* Spinner for loading phase */}
          {phase === "loading" && indicator === "spinner" && (
            <motion.span
              aria-hidden
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: `2px solid color-mix(in srgb, ${textColor} 35%, transparent)`,
                borderTopColor: textColor,
                display: "inline-block",
              }}
              animate={fullMotion ? { rotate: 360 } : undefined}
              transition={fullMotion ? { duration: 0.7, ease: "linear", repeat: Number.POSITIVE_INFINITY } : undefined}
            />
          )}
          {phase === "success" && <span aria-hidden>&#10003;</span>}
          {phase === "error" && <span aria-hidden>&#10007;</span>}
          <span>{label}</span>
          {after}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
});
