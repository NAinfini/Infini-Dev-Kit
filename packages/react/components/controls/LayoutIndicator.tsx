import { forwardRef } from "react";
import { motion } from "motion/react";
import type { CSSProperties } from "react";
import clsx from "clsx";

import { useFullMotion } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";

export interface LayoutIndicatorProps {
  layoutId: string;
  className?: string;
  style?: CSSProperties;
}

export const LayoutIndicator = forwardRef<HTMLSpanElement, LayoutIndicatorProps>(
  function LayoutIndicator({ layoutId, className, style, ...rest }, ref) {
    const fullMotion = useFullMotion();
    const transition = useThemeTransition("hover");

    if (!fullMotion) {
      return <span ref={ref} className={clsx(className)} style={style} aria-hidden {...rest} />;
    }

    return (
      <motion.span
        ref={ref}
        aria-hidden
        layoutId={layoutId}
        className={clsx(className)}
        style={style}
        transition={transition}
        {...rest}
      />
    );
  }
);
