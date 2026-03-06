import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";

import { useFullMotion } from "../../hooks/use-motion-allowed";

export interface ParallaxProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  yRange?: [number, number];
}

export function Parallax({ children, className, style, yRange = [-20, 20] }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fullMotion = useFullMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [yRange[0], yRange[1]]);

  if (!fullMotion) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ ...style, y }}>
      {children}
    </motion.div>
  );
}
