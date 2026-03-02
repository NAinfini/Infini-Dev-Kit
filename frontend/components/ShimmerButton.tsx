import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { ShimmerButtonProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

export function ShimmerButton({
  children,
  shimmerColor,
  shimmerDuration,
  onClick,
  onPress,
  loadingLabel = "Processing...",
  resultLabel = "Done",
  releaseDelay = 800,
  disabled,
  before,
  after,
  className,
}: ShimmerButtonProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("press");
  const releaseTimer = useRef<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "success">("idle");
  const color = shimmerColor ?? theme.effects.hover.shimmerColor;
  const duration = Math.max(0.35, (shimmerDuration ?? theme.effects.hover.shimmerDuration) / 1000);
  const releaseMs = Math.max(100, releaseDelay);
  const raiseLevel = Math.max(0, theme.button.raiseLevel);
  const isBusy = phase === "loading";
  const isSuccess = phase === "success";
  const isDisabled = Boolean(disabled || isBusy);

  useEffect(
    () => () => {
      if (releaseTimer.current !== null) {
        window.clearTimeout(releaseTimer.current);
      }
    },
    [],
  );

  const handleClick = async () => {
    if (isDisabled) {
      return;
    }

    if (!onPress) {
      onClick?.();
      return;
    }

    const result = onPress();
    if (!(result instanceof Promise)) {
      return;
    }

    setPhase("loading");
    try {
      await result;
      setPhase("success");
      if (releaseTimer.current !== null) {
        window.clearTimeout(releaseTimer.current);
      }
      releaseTimer.current = window.setTimeout(() => {
        setPhase("idle");
        releaseTimer.current = null;
      }, releaseMs);
    } catch (error) {
      setPhase("idle");
      throw error;
    }
  };

  const buttonBackground = isSuccess ? theme.palette.success : theme.button.backgroundActive;
  const buttonShadow = isSuccess ? theme.palette.success : theme.button.backgroundShadow;

  return (
    <motion.button
      type="button"
      className={className}
      onClick={() => {
        void handleClick();
      }}
      disabled={isDisabled}
      whileHover={motionAllowed && !isDisabled ? { scale: theme.motion.hoverScale } : undefined}
      whileTap={motionAllowed && !isDisabled ? { scale: 0.985, y: raiseLevel, opacity: theme.button.activeOpacity } : undefined}
      transition={transition}
      style={{
        position: "relative",
        overflow: "hidden",
        transform: `translateY(${isBusy ? Math.round(raiseLevel * 0.5) : 0}px)`,
        border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
        borderRadius: theme.foundation.radius,
        background: buttonBackground,
        color: theme.foundation.background,
        fontFamily: theme.typography.display,
        fontWeight: theme.typography.displayWeight,
        padding: "0.6rem 1rem",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.82 : 1,
        boxShadow: `0 ${raiseLevel}px 0 color-mix(in srgb, ${buttonShadow} 88%, transparent)`,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          insetInline: 0,
          insetBlockEnd: -raiseLevel,
          height: "100%",
          borderRadius: theme.foundation.radius,
          background: `color-mix(in srgb, ${buttonShadow} 78%, black 22%)`,
          zIndex: 0,
        }}
      />
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(115deg, transparent 20%, color-mix(in srgb, ${color} 68%, transparent) 50%, transparent 80%)`,
          pointerEvents: "none",
        }}
        animate={
          fullMotion
            ? {
                x: ["-140%", "140%"],
              }
            : undefined
        }
        transition={
          fullMotion
            ? {
                duration,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 0.35,
              }
            : undefined
        }
      />
      <span
        style={{
          position: "relative",
          zIndex: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {before}
        {isBusy ? (
          <>
            <motion.span
              aria-hidden
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: `2px solid color-mix(in srgb, ${theme.foundation.background} 45%, transparent)`,
                borderTopColor: theme.foundation.background,
                display: "inline-block",
              }}
              animate={fullMotion ? { rotate: 360 } : undefined}
              transition={fullMotion ? { duration: 0.7, ease: "linear", repeat: Number.POSITIVE_INFINITY } : undefined}
            />
            <span>{loadingLabel}</span>
          </>
        ) : isSuccess ? (
          <span>{resultLabel}</span>
        ) : (
          children
        )}
        {after}
      </span>
    </motion.button>
  );
}
