import { motion } from "motion/react";
import { useCallback, useState, type MouseEvent, type TouchEvent, type ReactNode } from "react";

import { useFullMotion, useMotionAllowed } from "../../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../../hooks/use-theme-transition";

type TiltState = { rotateX: number; rotateY: number; offsetX: number; offsetY: number };
const REST: TiltState = { rotateX: 0, rotateY: 0, offsetX: 0, offsetY: 0 };

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(v, max));
}

export interface ParallaxLayerEffectProps {
  /** Layers from back to front — each is a ReactNode */
  layers: ReactNode[];
  /** Max tilt angle in degrees (default: 15) */
  tiltDegree?: number;
  /** Depth separation between layers in px (default: 30) */
  layerDepth?: number;
  /** Enable parallax on mouse move (default: true) */
  parallax?: boolean;
  /** Card width */
  width?: number | string;
  /** Card height */
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Multi-layer parallax depth with 3D tilt.
 * Extracted from LayeredCard.
 */
export function ParallaxLayerEffect({
  layers,
  tiltDegree = 15,
  layerDepth = 30,
  parallax = true,
  width,
  height,
  className,
  style,
}: ParallaxLayerEffectProps) {
  const fullMotion = useFullMotion();
  const motionAllowed = useMotionAllowed();
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
    setTilt({ rotateX: clamp(-oy * tiltDegree, -tiltDegree, tiltDegree), rotateY: clamp(ox * tiltDegree, -tiltDegree, tiltDegree), offsetX: ox, offsetY: oy });
  };

  const onMouseLeave = () => { if (tiltEnabled) setTilt(REST); };

  const onTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    const touch = event.touches[0];
    if (!touch) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ox = (touch.clientX - rect.left - cx) / cx;
    const oy = (touch.clientY - rect.top - cy) / cy;
    setTilt({ rotateX: clamp(-oy * tiltDegree, -tiltDegree, tiltDegree), rotateY: clamp(ox * tiltDegree, -tiltDegree, tiltDegree), offsetX: ox, offsetY: oy });
  }, [tiltEnabled, tiltDegree]);

  const onTouchEnd = useCallback(() => { if (tiltEnabled) setTilt(REST); }, [tiltEnabled]);

  const baseStyle = {
    position: "relative" as const,
    width,
    height,
    borderRadius: "var(--infini-radius)",
    border: "var(--infini-border-width) solid var(--infini-color-border)",
    background: "var(--infini-color-surface)",
    overflow: "hidden",
    ...style,
  };

  // OFF: static
  if (!motionAllowed) {
    return (
      <div className={className} style={baseStyle}>
        {layers.map((layer, i) => (
          <div key={i} style={{ position: i === 0 ? "relative" : "absolute", inset: i === 0 ? undefined : 0 }}>{layer}</div>
        ))}
      </div>
    );
  }

  // REDUCED: subtle scale only
  if (!tiltEnabled) {
    return (
      <motion.div className={className} whileHover={{ scale: 1.01 }} transition={transition} style={baseStyle}>
        {layers.map((layer, i) => (
          <div key={i} style={{ position: i === 0 ? "relative" : "absolute", inset: i === 0 ? undefined : 0 }}>{layer}</div>
        ))}
      </motion.div>
    );
  }

  // FULL: 3D parallax
  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        className={className}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        transition={transition}
        style={{ ...baseStyle, transformStyle: "preserve-3d", willChange: "transform", cursor: "default" }}
      >
        {layers.map((layer, i) => {
          const zDepth = i * layerDepth;
          const parallaxX = tilt.offsetX * (i * 6);
          const parallaxY = tilt.offsetY * (i * 6);
          return (
            <motion.div
              key={i}
              animate={{ x: parallaxX, y: parallaxY }}
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
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: "5%",
            bottom: -8,
            borderRadius: "var(--infini-radius)",
            background: `color-mix(in srgb, var(--infini-color-border) 30%, transparent)`,
            filter: "blur(12px)",
            transform: "translateZ(-20px)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      </motion.div>
    </div>
  );
}
