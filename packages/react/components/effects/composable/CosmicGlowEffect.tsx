import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";

import { useFullMotion, useMotionAllowed } from "../../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../../hooks/use-theme-transition";
import { useMouseTracker } from "../../../hooks/use-mouse-tracker";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const MAX_PARTICLES = 30;
const VELOCITY_DECAY = 0.997;

export interface CosmicGlowEffectProps {
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
 * Particle nebula with velocity decay physics.
 * Extracted from GlowCard "cosmic" variant.
 */
export function CosmicGlowEffect({
  children,
  glowColor,
  glowIntensity = 0.6,
  glowRadius = 200,
  className,
  style,
}: CosmicGlowEffectProps) {
  const fullMotion = useFullMotion();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("hover");
  const { x, y, isHovered, handlers } = useMouseTracker(fullMotion);

  const [particles, setParticles] = useState<Particle[]>([]);
  const particleId = useRef(0);
  const rafRef = useRef<number>(0);
  const lastSpawn = useRef(0);

  useEffect(() => {
    if (!isHovered) {
      setParticles([]);
      return;
    }

    const tick = (now: number) => {
      if (now - lastSpawn.current > 80 && particles.length < MAX_PARTICLES) {
        lastSpawn.current = now;
        particleId.current += 1;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.8;
        setParticles((prev) => [
          ...prev.slice(-(MAX_PARTICLES - 1)),
          {
            id: particleId.current,
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 2 + Math.random() * 4,
            opacity: 0.5 + Math.random() * 0.5,
          },
        ]);
      }

      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vx: p.vx * VELOCITY_DECAY,
            vy: p.vy * VELOCITY_DECAY,
            opacity: p.opacity * 0.993,
          }))
          .filter((p) => p.opacity > 0.05),
      );

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHovered, x, y]);

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

  const glowBackground = isHovered
    ? `radial-gradient(${glowRadius * 0.8}px circle at ${x}px ${y}px, color-mix(in srgb, ${color} ${Math.round(glowIntensity * 60)}%, transparent), transparent 70%)`
    : "none";

  return (
    <motion.div
      className={className}
      {...handlers}
      whileHover={{ scale: 1.01 }}
      transition={transition}
      style={{ position: "relative", borderRadius: "var(--infini-radius)", overflow: "hidden", ...style }}
    >
      {/* Nebula backdrop glow */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: "var(--infini-radius)",
          background: glowBackground,
          pointerEvents: "none",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          zIndex: 0,
        }}
      />
      {/* Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          aria-hidden
          style={{
            position: "absolute",
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: color,
            opacity: p.opacity * glowIntensity,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}
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
