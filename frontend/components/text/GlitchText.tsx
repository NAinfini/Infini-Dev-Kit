import { motion } from "motion/react";
import { forwardRef, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import clsx from "clsx";

import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useMotionAllowed } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";
import "./GlitchText.css";

export type GlitchTextIntensity = "subtle" | "medium" | "heavy";
export type GlitchTextTrigger = "hover" | "interval" | "always";

export interface GlitchTextProps {
  children: string;
  className?: string;
  style?: CSSProperties;
  intensity?: GlitchTextIntensity;
  trigger?: GlitchTextTrigger;
  intervalMs?: number;
  chromaticOffset?: number;
  sliceJitter?: number;
  active?: boolean;
}

const BURST_DURATION_BY_INTENSITY: Record<GlitchTextIntensity, number> = {
  subtle: 240,
  medium: 320,
  heavy: 420,
};

export const GlitchText = forwardRef<HTMLSpanElement, GlitchTextProps>(
  function GlitchText({
    children,
    className,
    style,
    intensity = "subtle",
    trigger = "hover",
    intervalMs = 4000,
    chromaticOffset = 1.2,
    sliceJitter = 1.2,
    active,
    ...rest
  }, ref) {
    const { motion: motionState } = useThemeSnapshot();
    const motionAllowed = useMotionAllowed();
    const transition = useThemeTransition("hover");
    const [burstActive, setBurstActive] = useState(trigger === "always");
    const burstTimeoutRef = useRef<number | undefined>(undefined);
    const isAnimated = motionAllowed && motionState.effectiveMode === "full";
    const burstMs = BURST_DURATION_BY_INTENSITY[intensity];
    const isEffectActive = (active ?? false) || burstActive || trigger === "always";

    const activateBurst = () => {
      if (!isAnimated || trigger === "always") {
        return;
      }

      if (burstTimeoutRef.current !== undefined) {
        window.clearTimeout(burstTimeoutRef.current);
      }

      setBurstActive(true);
      burstTimeoutRef.current = window.setTimeout(() => {
        setBurstActive(false);
        burstTimeoutRef.current = undefined;
      }, burstMs);
    };

    useEffect(() => {
      if (!isAnimated || trigger !== "interval") {
        return;
      }

      const id = window.setInterval(() => {
        activateBurst();
      }, Math.max(intervalMs, burstMs + 120));

      return () => {
        window.clearInterval(id);
      };
    }, [burstMs, intervalMs, isAnimated, trigger]);

    useEffect(() => {
      return () => {
        if (burstTimeoutRef.current !== undefined) {
          window.clearTimeout(burstTimeoutRef.current);
        }
      };
    }, []);

    const glitchClassName = useMemo(
      () =>
        clsx(
          "infini-glitch-text",
          `infini-glitch-text--${intensity}`,
          trigger === "always" && "infini-glitch-text--always",
          isEffectActive && "infini-glitch-text--active",
          className,
        ),
      [className, intensity, isEffectActive, trigger],
    );

    if (!isAnimated) {
      return (
        <span ref={ref} className={clsx(className)} style={style} {...rest}>
          {children}
        </span>
      );
    }

    return (
      <motion.span
        ref={ref}
        className={glitchClassName}
        style={
          {
            ...style,
            "--infini-glitch-offset": `${chromaticOffset}px`,
            "--infini-glitch-jitter": `${sliceJitter}px`,
          } as CSSProperties
        }
        data-text={children}
        onMouseEnter={trigger === "hover" ? activateBurst : undefined}
        animate={
          isEffectActive
            ? { opacity: [1, 0.84, 1, 0.92, 1] }
            : { opacity: 1 }
        }
        transition={transition}
        {...rest}
      >
        {children}
      </motion.span>
    );
  }
);
