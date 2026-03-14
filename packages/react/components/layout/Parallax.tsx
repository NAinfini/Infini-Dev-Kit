import { forwardRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { useMergedRef } from "../../hooks/use-merged-ref";

import { useFullMotion } from "../../hooks/use-motion-allowed";

export interface ParallaxProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  yRange?: [number, number];
}

export const Parallax = forwardRef<HTMLDivElement, ParallaxProps>(
  function Parallax({ children, className, style, yRange = [-20, 20], ...rest }, ref) {
    const internalRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(ref, internalRef);
    const fullMotion = useFullMotion();
    const { scrollYProgress } = useScroll({
      target: internalRef,
      offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [yRange[0], yRange[1]]);

    // OFF + REDUCED: parallax is inherently full-motion, render static
    if (!fullMotion) {
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
        style={{ position: "relative", ...style, y }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);
