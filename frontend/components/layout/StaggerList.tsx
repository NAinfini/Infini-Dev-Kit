import { motion } from "motion/react";
import { Children, type CSSProperties, type ReactNode } from "react";

import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";

export interface StaggerListProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delayMs?: number;
  staggerMs?: number;
}

export function StaggerList({
  children,
  className,
  style,
  delayMs = 0,
  staggerMs = 20,
}: StaggerListProps) {
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const childCount = Math.max(1, Children.count(children));
  const staggerSeconds = Math.min(staggerMs / 1000, 0.6 / childCount);

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
      variants={{
        hidden: fullMotion ? {} : { opacity: 0.94 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delayMs / 1000,
            staggerChildren: staggerSeconds,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
