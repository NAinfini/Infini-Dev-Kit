import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";
import { getRevealVariants } from "../hooks/variants/reveal-variants";

export interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delayMs?: number;
  once?: boolean;
}

export function RevealOnScroll({
  children,
  className,
  style,
  delayMs = 0,
  once = true,
}: RevealOnScrollProps) {
  const { state } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("enter");

  if (!motionAllowed) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15, margin: "-60px" }}
      variants={fullMotion ? getRevealVariants(state.themeId) : { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      transition={{ ...transition, delay: delayMs / 1000 }}
    >
      {children}
    </motion.div>
  );
}
