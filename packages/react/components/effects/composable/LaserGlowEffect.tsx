import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";

import { useFullMotion, useMotionAllowed } from "../../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../../hooks/use-theme-transition";
import { useMouseTracker } from "../../../hooks/use-mouse-tracker";

export interface LaserGlowEffectProps {
  children: ReactNode;
  /** Glow color (default: theme primary) */
  glowColor?: string;
  /** Glow intensity 0–1 (default: 0.6) */
  glowIntensity?: number;
  /** Laser spin speed in degrees per frame (default: 1.5) */
  spinSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Rotating conic gradient + crosshair reticle glow.
 * Extracted from GlowCard "laser" variant.
 */
export function LaserGlowEffect({
  children,
  glowColor,
  glowIntensity = 0.6,
  spinSpeed = 1.5,
  className,
  style,
}: LaserGlowEffectProps) {
  const fullMotion = useFullMotion();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("hover");
  const { x, y, isHovered, handlers } = useMouseTracker(fullMotion);

  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isHovered) {
      setRotation(0);
      return;
    }
    let angle = 0;
    const spin = () => {
      angle = (angle + spinSpeed) % 360;
      setRotation(angle);
      rafRef.current = requestAnimationFrame(spin);
    };
    rafRef.current = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHovered, spinSpeed]);

  if (!motionAllowed) {
    return (
      <div className={className} style={{ position: "relative", borderRadius: "var(--infini-radius)", overflow: "hidden", ...style }}>
        {children}
      </div>
    );
  }

  const color = glowColor ?? "var(--infini-color-primary)";
  const intensityPct = Math.round(glowIntensity * 100);

  if (!fullMotion) {
    return (
      <motion.div
        className={className}
        whileHover={{ scale: 1.01 }}
        transition={transition}
        style={{ position: "relative", borderRadius: "var(--infini-radius)", overflow: "hidden", ...style }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      {...handlers}
      whileHover={{ scale: 1.01 }}
      transition={transition}
      style={{ position: "relative", borderRadius: "var(--infini-radius)", overflow: "hidden", ...style }}
    >
      {/* Rotating conic gradient */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: "var(--infini-radius)",
          background: isHovered
            ? `conic-gradient(from ${rotation}deg at ${x}px ${y}px, transparent 0deg, color-mix(in srgb, ${color} ${intensityPct}%, transparent) 60deg, transparent 120deg, color-mix(in srgb, ${color} ${Math.round(intensityPct * 0.6)}%, transparent) 240deg, transparent 360deg)`
            : "none",
          pointerEvents: "none",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s ease",
          zIndex: 0,
        }}
      />
      {/* Crosshair lines */}
      {isHovered && (
        <>
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: x - 1,
              top: 0,
              width: 2,
              height: "100%",
              background: `linear-gradient(to bottom, transparent, color-mix(in srgb, ${color} ${Math.round(glowIntensity * 40)}%, transparent) 45%, color-mix(in srgb, ${color} ${Math.round(glowIntensity * 40)}%, transparent) 55%, transparent)`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: y - 1,
              left: 0,
              height: 2,
              width: "100%",
              background: `linear-gradient(to right, transparent, color-mix(in srgb, ${color} ${Math.round(glowIntensity * 40)}%, transparent) 45%, color-mix(in srgb, ${color} ${Math.round(glowIntensity * 40)}%, transparent) 55%, transparent)`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        </>
      )}
      {/* Border glow */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: "var(--infini-radius)",
          pointerEvents: "none",
          boxShadow: isHovered
            ? `inset 0 0 0 1px color-mix(in srgb, ${color} ${Math.round(glowIntensity * 50)}%, transparent)`
            : "none",
          transition: "box-shadow 0.3s ease",
          zIndex: 1,
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </motion.div>
  );
}
