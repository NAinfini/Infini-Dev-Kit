import { motion, useMotionValue, useTransform, useInView } from "motion/react";
import { forwardRef, useEffect, useRef, type CSSProperties } from "react";
import { useMergedRef } from "../../hooks/use-merged-ref";
import clsx from "clsx";

import type { NumberTickerProps } from "../../motion-types";
import { useMotionAllowed } from "../../hooks/use-motion-allowed";

/**
 * Slot-machine style number ticker that rolls to the target value.
 * Supports prefix/suffix, decimals, and scroll-triggered animation.
 */
export const NumberTicker = forwardRef<HTMLSpanElement, NumberTickerProps>(
  function NumberTicker({
    value,
    duration = 1.5,
    decimals = 0,
    prefix = "",
    suffix = "",
    direction = "up",
    triggerOnView = true,
    className,
    style,
    ...rest
  }, ref) {
    const motionAllowed = useMotionAllowed();
    const innerRef = useRef<HTMLSpanElement>(null);
    const mergedRef = useMergedRef(innerRef, ref);
    const isInView = useInView(innerRef, { once: true, margin: "0px 0px -50px 0px" });

    const motionValue = useMotionValue(direction === "up" ? 0 : value);
    const displayValue = useTransform(motionValue, (v) => {
      const formatted = v.toFixed(decimals);
      return `${prefix}${formatted}${suffix}`;
    });

    const shouldAnimate = triggerOnView ? isInView : true;

    useEffect(() => {
      if (!shouldAnimate) return;

      if (!motionAllowed) {
        motionValue.jump(value);
        return;
      }

      const startValue = direction === "up" ? 0 : value * 2;
      motionValue.jump(startValue);

      // Animate using spring-like easing
      const startTime = performance.now();
      const durationMs = duration * 1000;
      let frame: number;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        // EaseOutExpo for smooth deceleration
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = startValue + (value - startValue) * eased;
        motionValue.set(current);

        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        }
      };

      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }, [value, shouldAnimate, motionAllowed, duration, direction, motionValue]);

    return (
      <span
        ref={(node) => {
          mergedRef(node);
        }}
        className={clsx(className)}
        style={{
          fontFamily: "var(--infini-font-display)",
          fontWeight: "var(--infini-font-display-weight, 700)" as CSSProperties["fontWeight"],
          color: "var(--infini-color-text)",
          fontVariantNumeric: "tabular-nums",
          ...style,
        }}
        {...rest}
      >
        <motion.span>{displayValue}</motion.span>
      </span>
    );
  }
);
