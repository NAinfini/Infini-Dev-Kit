import { motion } from "motion/react";
import type { CSSProperties } from "react";

import { useFullMotion } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";

export interface LayoutIndicatorProps {
  layoutId: string;
  className?: string;
  style?: CSSProperties;
}

export function LayoutIndicator({ layoutId, className, style }: LayoutIndicatorProps) {
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("hover");

  if (!fullMotion) {
    return <span className={className} style={style} aria-hidden />;
  }

  return <motion.span aria-hidden layoutId={layoutId} className={className} style={style} transition={transition} />;
}
