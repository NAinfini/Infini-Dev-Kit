import { motion } from "motion/react";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";

import { useFullMotion, useMotionAllowed } from "../../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../../hooks/use-theme-transition";
import { getRevealVariants } from "../../../hooks/variants/reveal-variants";
import { useThemeId } from "../../../hooks/use-theme-spring";

export interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delayMs?: number;
  once?: boolean;
}

export const RevealOnScroll = forwardRef<HTMLDivElement, RevealOnScrollProps>(
  function RevealOnScroll({
    children,
    className,
    style,
    delayMs = 0,
    once = true,
    ...rest
  }, ref) {
    const themeId = useThemeId();
    const motionAllowed = useMotionAllowed();
    const fullMotion = useFullMotion();
    const transition = useThemeTransition("enter");

    if (!motionAllowed) {
      return (
        <div ref={ref} className={clsx(className)} style={style} {...rest}>
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={clsx(className)}
        style={style}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.15, margin: "-60px" }}
        variants={fullMotion ? getRevealVariants(themeId) : { hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        transition={{ ...transition, delay: delayMs / 1000 }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);
