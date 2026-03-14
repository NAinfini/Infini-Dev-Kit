import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";

import { useFullMotion, useMotionAllowed } from "../../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../../hooks/use-theme-transition";
import { useMouseTracker } from "../../../hooks/use-mouse-tracker";

export interface GlitchGlowEffectProps {
  children: ReactNode;
  /** Glow color (default: theme primary) */
  glowColor?: string;
  /** Glow intensity 0–1 (default: 0.6) */
  glowIntensity?: number;
  /** Glow radius in px (default: 200) */
  glowRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Scanline noise with flickering opacity glow.
 * Extracted from GlowCard "glitch" variant.
 */
export function GlitchGlowEffect({
  children,
  glowColor,
  glowIntensity = 0.6,
  glowRadius = 200,
  className,
  style,
}: GlitchGlowEffectProps) {
  const fullMotion = useFullMotion();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("hover");
  const { x, y, isHovered, handlers } = useMouseTracker(fullMotion);

  const [scanOffset, setScanOffset] = useState(0);
  const [noiseOpacity, setNoiseOpacity] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isHovered) {
      setScanOffset(0);
      setNoiseOpacity(0);
      return;
    }
    let offset = 0;
    const tick = () => {
      offset = (offset + 2.5) % 100;
      setScanOffset(offset);
      setNoiseOpacity(0.15 + Math.random() * 0.35);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHovered]);

  if (!motionAllowed) {
    return (
      <div className={className} style={{ position: "relative", borderRadius: "var(--infini-radius)", overflow: "hidden", ...style }}>
        {children}
      </div>
    );
  }

  const color = glowColor ?? "var(--infini-color-primary)";

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

  const scanlineGradient = `repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, ${color} ${Math.round(glowIntensity * 15)}%, transparent) 2px, color-mix(in srgb, ${color} ${Math.round(glowIntensity * 15)}%, transparent) 4px)`;

  return (
    <motion.div
      className={className}
      {...handlers}
      whileHover={{ scale: 1.01 }}
      transition={transition}
      style={{ position: "relative", borderRadius: "var(--infini-radius)", overflow: "hidden", ...style }}
    >
      {/* Base glow at cursor */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: "var(--infini-radius)",
          background: isHovered
            ? `radial-gradient(${glowRadius}px circle at ${x}px ${y}px, color-mix(in srgb, ${color} ${Math.round(glowIntensity * 80)}%, transparent), transparent 70%)`
            : "none",
          pointerEvents: "none",
          opacity: isHovered ? noiseOpacity * 2 : 0,
          transition: "opacity 0.1s ease",
          zIndex: 0,
        }}
      />
      {/* Horizontal scanlines */}
      {isHovered && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "var(--infini-radius)",
            background: scanlineGradient,
            backgroundPosition: `0 ${scanOffset}%`,
            pointerEvents: "none",
            opacity: noiseOpacity,
            zIndex: 0,
          }}
        />
      )}
      {/* Random horizontal glitch bar */}
      {isHovered && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${scanOffset}%`,
            height: 3 + Math.random() * 5,
            background: `color-mix(in srgb, ${color} ${Math.round(glowIntensity * 50)}%, transparent)`,
            transform: `translateX(${(Math.random() - 0.5) * 8}px)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
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
