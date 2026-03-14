import { motion, useMotionValue, useSpring } from "motion/react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useMergedRef } from "../../../hooks/use-merged-ref";
import clsx from "clsx";

import type { CustomCursorProps } from "../../../motion-types";
import { useFullMotion } from "../../../hooks/use-motion-allowed";

interface TrailDot {
  x: number;
  y: number;
  id: number;
}

/**
 * Custom mouse cursor that replaces the default cursor within its container.
 * Inspired by nyxui's Custom Cursor.
 * Uses spring physics for smooth following, supports circle/ring/dot shapes,
 * and an optional trail effect.
 */
export const CustomCursor = forwardRef<HTMLDivElement, CustomCursorProps>(
  function CustomCursor({
    children,
    size = 24,
    color,
    shape = "circle",
    trail = false,
    trailLength = 5,
    stiffness = 300,
    damping = 25,
    className,
    style,
    ...rest
  }, ref) {
    const fullMotion = useFullMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef(containerRef, ref);
    const [isInside, setIsInside] = useState(false);
    const [trails, setTrails] = useState<TrailDot[]>([]);
    const trailIdRef = useRef(0);

    const effectiveColor = color ?? "var(--infini-color-primary)";

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness, damping });
    const springY = useSpring(mouseY, { stiffness, damping });

    const onMouseMove = useCallback(
      (event: MouseEvent) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        mouseX.set(x);
        mouseY.set(y);

        if (trail) {
          trailIdRef.current += 1;
          const newDot = { x, y, id: trailIdRef.current };
          setTrails((prev) => {
            const updated = [...prev, newDot];
            return updated.slice(-trailLength);
          });
        }
      },
      [mouseX, mouseY, trail, trailLength],
    );

    const onMouseEnter = useCallback(() => setIsInside(true), []);
    const onMouseLeave = useCallback(() => {
      setIsInside(false);
      setTrails([]);
    }, []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container || !fullMotion) return;

      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseenter", onMouseEnter);
      container.addEventListener("mouseleave", onMouseLeave);

      return () => {
        container.removeEventListener("mousemove", onMouseMove);
        container.removeEventListener("mouseenter", onMouseEnter);
        container.removeEventListener("mouseleave", onMouseLeave);
      };
    }, [fullMotion, onMouseMove, onMouseEnter, onMouseLeave]);

    if (!fullMotion) {
      return (
        <div
          ref={(node) => {
            mergedRef(node);
          }}
          className={clsx(className)}
          style={{ position: "relative", ...style }}
          {...rest}
        >
          {children}
        </div>
      );
    }

    const cursorStyle = getCursorStyle(shape, size, effectiveColor);
    const cursorRenderSize = shape === "dot" ? size * 0.35 : size;

    return (
      <div
        ref={(node) => {
          mergedRef(node);
        }}
        className={clsx(className)}
        style={{ position: "relative", cursor: "none", ...style }}
        {...rest}
      >
        {children}

        {/* Trail dots */}
        {trail && trails.map((dot, i) => {
          const trailScale = (i + 1) / trails.length;
          const trailSize = size * 0.4 * trailScale;
          return (
            <motion.div
              key={dot.id}
              style={{
                position: "absolute",
                left: dot.x - trailSize / 2,
                top: dot.y - trailSize / 2,
                width: trailSize,
                height: trailSize,
                borderRadius: "50%",
                background: effectiveColor,
                opacity: 0.15 * trailScale,
                pointerEvents: "none",
                zIndex: 9998,
              }}
              initial={{ scale: 1 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          );
        })}

        {/* Main cursor */}
        {isInside && (
          <motion.div
            style={{
              ...cursorStyle,
              position: "absolute",
              left: -cursorRenderSize / 2,
              top: -cursorRenderSize / 2,
              x: springX,
              y: springY,
              pointerEvents: "none",
              zIndex: 9999,
            }}
          />
        )}
      </div>
    );
  }
);

function getCursorStyle(shape: "circle" | "ring" | "dot", size: number, color: string): React.CSSProperties {
  switch (shape) {
    case "ring":
      return {
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        background: "transparent",
      };
    case "dot":
      return {
        width: size * 0.35,
        height: size * 0.35,
        borderRadius: "50%",
        background: color,
      };
    case "circle":
    default:
      return {
        width: size,
        height: size,
        borderRadius: "50%",
        background: `color-mix(in srgb, ${color} 50%, transparent)`,
        border: `1.5px solid ${color}`,
      };
  }
}
