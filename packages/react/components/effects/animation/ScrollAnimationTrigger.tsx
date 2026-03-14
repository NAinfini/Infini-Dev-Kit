import { type MotionValue, motion, useScroll, useTransform } from "motion/react";
import { forwardRef, useRef } from "react";
import { useMergedRef } from "../../../hooks/use-merged-ref";
import clsx from "clsx";

import type { ScrollAnimationTriggerProps } from "../../../motion-types";
import { useFullMotion } from "../../../hooks/use-motion-allowed";

/**
 * Binds arbitrary CSS properties to scroll progress through the viewport.
 * Inspired by nyxui's Scroll Animation Trigger.
 *
 * Unlike RevealOnScroll (which does a one-shot reveal), this component
 * continuously interpolates property values as the element scrolls
 * through the viewport — enabling parallax, scale, rotation, opacity
 * ramps, and any other transform driven by scroll position.
 *
 * Usage:
 *   <ScrollAnimationTrigger keyframes={{ opacity: [0, 1], y: [-50, 0], scale: [0.8, 1] }}>
 *     <Card>Content</Card>
 *   </ScrollAnimationTrigger>
 */
export const ScrollAnimationTrigger = forwardRef<HTMLDivElement, ScrollAnimationTriggerProps>(
  function ScrollAnimationTrigger({
    children,
    keyframes,
    startOffset = 0,
    endOffset = 1,
    className,
    style,
    ...rest
  }, ref) {
    const motionAllowed = useFullMotion();
    const innerRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(innerRef, ref);

    const { scrollYProgress } = useScroll({
      target: innerRef,
      offset: [`start ${1 - startOffset}`, `end ${1 - endOffset}`],
    });

    // Build a style object with useTransform for each keyframe property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const animatedStyle: Record<string, MotionValue<any>> = {};
    for (const [prop, [start, end]] of Object.entries(keyframes)) {
      animatedStyle[prop] = useTransform(scrollYProgress, [0, 1], [start, end]);
    }

    if (!motionAllowed) {
      return (
        <div
          ref={(node) => {
            mergedRef(node);
          }}
          className={clsx(className)}
          style={style}
          {...rest}
        >
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={(node) => {
          mergedRef(node);
        }}
        className={clsx(className)}
        style={{ ...animatedStyle, ...style }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);
