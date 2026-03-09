import { motion } from "motion/react";
import { forwardRef, useState, type MouseEvent } from "react";

import type { LayeredCardProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";

type TiltState = { rotateX: number; rotateY: number; offsetX: number; offsetY: number };
const REST: TiltState = { rotateX: 0, rotateY: 0, offsetX: 0, offsetY: 0 };

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * 3D card with multiple parallax layers at different depth planes.
 * Inspired by nyxui's 3D Layered Card.
 * Each layer in the `layers` array gets progressively more translateZ,
 * creating a diorama-like parallax depth effect on mouse move.
 * Distinct from TiltCard — this focuses on multi-layer separation
 * rather than single-surface tilt + glow.
 */
export const LayeredCard = forwardRef<HTMLDivElement, LayeredCardProps>(
  function LayeredCard({
  layers,
  tiltDegree = 15,
  layerDepth = 30,
  parallax = true,
  width,
  height,
  className,
  style,
  ...rest
}, ref) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("hover");
  const [tilt, setTilt] = useState<TiltState>(REST);

  const tiltEnabled = fullMotion && parallax;

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ox = (event.clientX - rect.left - cx) / cx;
    const oy = (event.clientY - rect.top - cy) / cy;

    setTilt({
      rotateX: clamp(-oy * tiltDegree, -tiltDegree, tiltDegree),
      rotateY: clamp(ox * tiltDegree, -tiltDegree, tiltDegree),
      offsetX: ox,
      offsetY: oy,
    });
  };

  const onMouseLeave = () => {
    if (tiltEnabled) setTilt(REST);
  };

  if (!tiltEnabled) {
    return (
      <div
        ref={ref}
        className={className}
        {...rest}
        style={{
          position: "relative",
          width,
          height,
          borderRadius: theme.foundation.radius,
          border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
          background: theme.foundation.surface,
          overflow: "hidden",
          ...style,
        }}
      >
        {layers.map((layer, i) => (
          <div key={i} style={{ position: i === 0 ? "relative" : "absolute", inset: i === 0 ? undefined : 0 }}>
            {layer}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} style={{ perspective: 1200 }}>
      <motion.div
        className={className}
        {...rest}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={transition}
        style={{
          position: "relative",
          width,
          height,
          transformStyle: "preserve-3d",
          willChange: "transform",
          borderRadius: theme.foundation.radius,
          border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
          background: theme.foundation.surface,
          overflow: "hidden",
          cursor: "default",
          ...style,
        }}
      >
        {layers.map((layer, i) => {
          const zDepth = i * layerDepth;
          const parallaxX = tilt.offsetX * (i * 6);
          const parallaxY = tilt.offsetY * (i * 6);

          return (
            <motion.div
              key={i}
              animate={{
                x: parallaxX,
                y: parallaxY,
              }}
              transition={transition}
              style={{
                position: i === 0 ? "relative" : "absolute",
                inset: i === 0 ? undefined : 0,
                display: i === 0 ? undefined : "flex",
                alignItems: i === 0 ? undefined : "center",
                justifyContent: i === 0 ? undefined : "center",
                transform: `translateZ(${zDepth}px)`,
                transformStyle: "preserve-3d",
                zIndex: i,
                pointerEvents: i === layers.length - 1 ? "auto" : "none",
              }}
            >
              {layer}
            </motion.div>
          );
        })}

      {/* Ambient shadow under the card */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: "5%",
          bottom: -8,
          borderRadius: theme.foundation.radius,
          background: `color-mix(in srgb, ${theme.foundation.borderColor} 30%, transparent)`,
          filter: "blur(12px)",
          transform: "translateZ(-20px)",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
      </motion.div>
    </div>
  );
  },
);
