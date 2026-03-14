import { motion, useMotionValue, useSpring } from "motion/react";
import { forwardRef, useCallback, useRef, type MouseEvent } from "react";
import { useMergedRef } from "../../../hooks/use-merged-ref";
import clsx from "clsx";

import type { MagneticElementProps } from "../../../motion-types";
import { useFullMotion } from "../../../hooks/use-motion-allowed";

/**
 * Wrapper that makes its children "magnetically" attracted to the cursor.
 * When the cursor enters the element's area, the content subtly shifts
 * toward the cursor. Feels alive and interactive without being disruptive.
 *
 * Uses spring physics for a natural, bouncy feel.
 */
export const MagneticElement = forwardRef<HTMLDivElement, MagneticElementProps>(
  function MagneticElement({
    children,
    strength = 12,
    damping = 20,
    stiffness = 150,
    radius = Infinity,
    className,
    style,
    ...rest
  }, ref) {
    const fullMotion = useFullMotion();
    const innerRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(innerRef, ref);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { damping, stiffness });
    const springY = useSpring(y, { damping, stiffness });

    const handleMouseMove = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        if (!fullMotion) {
          return;
        }

        const el = innerRef.current;
        if (!el) {
          return;
        }

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = event.clientX - centerX;
        const distY = event.clientY - centerY;

        // Check if within radius
        if (radius !== Infinity) {
          const dist = Math.sqrt(distX * distX + distY * distY);
          if (dist > radius) {
            x.set(0);
            y.set(0);
            return;
          }
        }

        // Normalize displacement to max strength
        const maxDist = Math.max(rect.width, rect.height) / 2;
        const pullX = (distX / maxDist) * strength;
        const pullY = (distY / maxDist) * strength;

        x.set(pullX);
        y.set(pullY);
      },
      [fullMotion, radius, strength, x, y],
    );

    const handleMouseLeave = useCallback(() => {
      x.set(0);
      y.set(0);
    }, [x, y]);

    if (!fullMotion) {
      return (
        <div
          ref={(node) => {
            mergedRef(node);
          }}
          className={clsx(className)}
          {...rest}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={(node) => {
          mergedRef(node);
        }}
        className={clsx(className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ display: "inline-block", ...style }}
        {...rest}
      >
        <motion.div
          style={{
            x: springX,
            y: springY,
          }}
        >
          {children}
        </motion.div>
      </div>
    );
  }
);
