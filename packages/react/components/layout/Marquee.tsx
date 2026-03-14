import { forwardRef } from "react";
import { motion } from "motion/react";
import { useRef, type CSSProperties } from "react";
import clsx from "clsx";
import { useMergedRef } from "../../hooks/use-merged-ref";

import type { MarqueeProps } from "../../motion-types";
import { useFullMotion } from "../../hooks/use-motion-allowed";

/**
 * Infinite scrolling content strip that loops seamlessly.
 * Inspired by nyxui's Marquee component.
 * Duplicates children for a seamless loop, uses CSS animation for
 * GPU-accelerated scrolling, and pauses on hover.
 */
export const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(
  function Marquee({
    children,
    speed = 40,
    direction = "left",
    pauseOnHover = true,
    gap = 24,
    className,
    style,
    ...rest
  }, ref) {
    const fullMotion = useFullMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, containerRef);

    const isHorizontal = direction === "left" || direction === "right";
    const isReverse = direction === "right" || direction === "down";

    // For non-animated fallback, just show the children once
    if (!fullMotion) {
      return (
        <div
          ref={(node) => {
            mergedRef(node);
          }}
          className={clsx(className)}
          style={{ overflow: "hidden", ...style }}
          {...rest}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isHorizontal ? "row" : "column",
              gap,
            }}
          >
            {children}
          </div>
        </div>
      );
    }

    // Calculate animation duration based on speed
    // Approximate — real duration depends on content width, but speed gives a consistent feel
    const durationPerLoop = Math.max(2, 600 / Math.max(1, speed));

    const trackStyle: CSSProperties = {
      display: "flex",
      flexDirection: isHorizontal ? "row" : "column",
      gap,
      width: isHorizontal ? "max-content" : undefined,
      height: !isHorizontal ? "max-content" : undefined,
    };

    const translateProp = isHorizontal ? "x" : "y";
    const translateValues = isReverse ? ["100%", "0%"] : ["0%", "-100%"];

    return (
      <div
        ref={(node) => {
          mergedRef(node);
        }}
        className={clsx(className)}
        style={{
          overflow: "hidden",
          maskImage: isHorizontal
            ? "linear-gradient(to right, transparent, black 5%, black 95%, transparent)"
            : "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage: isHorizontal
            ? "linear-gradient(to right, transparent, black 5%, black 95%, transparent)"
            : "linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)",
          ...style,
        }}
        {...rest}
      >
        <motion.div
          style={trackStyle}
          animate={{ [translateProp]: translateValues }}
          transition={{
            duration: durationPerLoop,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
          whileHover={pauseOnHover ? { animationPlayState: "paused" } : undefined}
          onMouseEnter={
            pauseOnHover
              ? (event) => {
                  const el = event.currentTarget;
                  el.style.animationPlayState = "paused";
                  // Motion doesn't support pausing via whileHover for animate,
                  // so we use a CSS override
                  el.getAnimations().forEach((a) => a.pause());
                }
              : undefined
          }
          onMouseLeave={
            pauseOnHover
              ? (event) => {
                  const el = event.currentTarget;
                  el.style.animationPlayState = "running";
                  el.getAnimations().forEach((a) => a.play());
                }
              : undefined
          }
        >
          {/* Original */}
          <div style={{ display: "flex", flexDirection: isHorizontal ? "row" : "column", gap, flexShrink: 0 }}>
            {children}
          </div>
          {/* Duplicate for seamless loop */}
          <div aria-hidden style={{ display: "flex", flexDirection: isHorizontal ? "row" : "column", gap, flexShrink: 0 }}>
            {children}
          </div>
        </motion.div>
      </div>
    );
  }
);
