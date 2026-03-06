import { type MotionValue, motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import type { ScrollAnimationTriggerProps } from "../../theme/motion-types";
import { useMotionAllowed } from "../../hooks/use-motion-allowed";

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
export function ScrollAnimationTrigger({
  children,
  keyframes,
  startOffset = 0,
  endOffset = 1,
  className,
}: ScrollAnimationTriggerProps) {
  const motionAllowed = useMotionAllowed();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${1 - startOffset}`, `end ${1 - endOffset}`],
  });

  // Build a style object with useTransform for each keyframe property
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animatedStyle: Record<string, MotionValue<any>> = {};
  for (const [prop, [start, end]] of Object.entries(keyframes)) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    animatedStyle[prop] = useTransform(scrollYProgress, [0, 1], [start, end]);
  }

  if (!motionAllowed) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={animatedStyle}
    >
      {children}
    </motion.div>
  );
}
