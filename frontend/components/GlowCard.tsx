import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { GlowCardProps, GlowCardVariant } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

// ── Particle state for cosmic variant ──

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

/**
 * Card with a mouse-tracking glow effect.
 * Supports 4 variants:
 *   - "spotlight" (default) — radial gradient follows cursor
 *   - "laser" — crosshair reticle with rotating conic gradient
 *   - "cosmic" — particle nebula with velocity decay physics
 *   - "glitch" — scanline noise with flickering opacity
 *
 * Inspired by nyxui's GlowCard. All variants are theme-aware
 * and respect the motion gating system.
 */
export function GlowCard({
  children,
  variant = "spotlight",
  glowColor,
  glowIntensity = 0.6,
  glowRadius = 200,
  trackMouse = true,
  className,
}: GlowCardProps) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("hover");
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const effectiveGlowColor = glowColor ?? theme.palette.primary;

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!trackMouse || !fullMotion) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setMousePos({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    },
    [trackMouse, fullMotion],
  );

  const onMouseEnter = useCallback(() => setIsHovered(true), []);
  const onMouseLeave = useCallback(() => setIsHovered(false), []);

  if (!fullMotion) {
    return (
      <div
        className={className}
        style={{
          position: "relative",
          borderRadius: theme.foundation.radius,
          border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
          background: theme.foundation.surface,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.01 }}
      transition={transition}
      style={{
        position: "relative",
        borderRadius: theme.foundation.radius,
        border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
        background: theme.foundation.surface,
        overflow: "hidden",
      }}
    >
      {/* Variant-specific glow layer */}
      <GlowVariantLayer
        variant={variant}
        isHovered={isHovered}
        mousePos={mousePos}
        glowColor={effectiveGlowColor}
        glowIntensity={glowIntensity}
        glowRadius={glowRadius}
        radius={theme.foundation.radius}
      />
      {/* Border glow overlay */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: theme.foundation.radius,
          pointerEvents: "none",
          boxShadow: isHovered
            ? `inset 0 0 0 1px color-mix(in srgb, ${effectiveGlowColor} ${Math.round(glowIntensity * 50)}%, transparent), 0 0 ${Math.round(glowRadius * 0.15)}px color-mix(in srgb, ${effectiveGlowColor} ${Math.round(glowIntensity * 30)}%, transparent)`
            : "none",
          transition: "box-shadow 0.3s ease",
          zIndex: 1,
        }}
      />
      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </motion.div>
  );
}

// ── Variant-specific rendering ──

function GlowVariantLayer({
  variant,
  isHovered,
  mousePos,
  glowColor,
  glowIntensity,
  glowRadius,
  radius,
}: {
  variant: GlowCardVariant;
  isHovered: boolean;
  mousePos: { x: number; y: number };
  glowColor: string;
  glowIntensity: number;
  glowRadius: number;
  radius: number;
}) {
  switch (variant) {
    case "laser":
      return (
        <LaserGlow
          isHovered={isHovered}
          mousePos={mousePos}
          glowColor={glowColor}
          glowIntensity={glowIntensity}
          radius={radius}
        />
      );
    case "cosmic":
      return (
        <CosmicGlow
          isHovered={isHovered}
          mousePos={mousePos}
          glowColor={glowColor}
          glowIntensity={glowIntensity}
          glowRadius={glowRadius}
          radius={radius}
        />
      );
    case "glitch":
      return (
        <GlitchGlow
          isHovered={isHovered}
          mousePos={mousePos}
          glowColor={glowColor}
          glowIntensity={glowIntensity}
          glowRadius={glowRadius}
          radius={radius}
        />
      );
    case "spotlight":
    default:
      return (
        <SpotlightGlow
          isHovered={isHovered}
          mousePos={mousePos}
          glowColor={glowColor}
          glowIntensity={glowIntensity}
          glowRadius={glowRadius}
          radius={radius}
        />
      );
  }
}

// ── Spotlight variant (original) ──

function SpotlightGlow({
  isHovered,
  mousePos,
  glowColor,
  glowIntensity,
  glowRadius,
  radius,
}: {
  isHovered: boolean;
  mousePos: { x: number; y: number };
  glowColor: string;
  glowIntensity: number;
  glowRadius: number;
  radius: number;
}) {
  const glowBackground = isHovered
    ? `radial-gradient(${glowRadius}px circle at ${mousePos.x}px ${mousePos.y}px, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 100)}%, transparent), transparent 70%)`
    : "none";

  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        inset: -1,
        borderRadius: radius,
        background: glowBackground,
        pointerEvents: "none",
        opacity: isHovered ? 1 : 0,
        transition: "opacity 0.3s ease",
        zIndex: 0,
      }}
    />
  );
}

// ── Laser variant — crosshair reticle with rotating conic gradient ──

function LaserGlow({
  isHovered,
  mousePos,
  glowColor,
  glowIntensity,
  radius,
}: {
  isHovered: boolean;
  mousePos: { x: number; y: number };
  glowColor: string;
  glowIntensity: number;
  radius: number;
}) {
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!isHovered) {
      setRotation(0);
      return;
    }

    let angle = 0;
    const spin = () => {
      angle = (angle + 1.5) % 360;
      setRotation(angle);
      rafRef.current = requestAnimationFrame(spin);
    };
    rafRef.current = requestAnimationFrame(spin);

    return () => cancelAnimationFrame(rafRef.current);
  }, [isHovered]);

  const intensityPct = Math.round(glowIntensity * 100);

  return (
    <>
      {/* Rotating conic gradient */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: radius,
          background: isHovered
            ? `conic-gradient(from ${rotation}deg at ${mousePos.x}px ${mousePos.y}px, transparent 0deg, color-mix(in srgb, ${glowColor} ${intensityPct}%, transparent) 60deg, transparent 120deg, color-mix(in srgb, ${glowColor} ${Math.round(intensityPct * 0.6)}%, transparent) 240deg, transparent 360deg)`
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
              left: mousePos.x - 1,
              top: 0,
              width: 2,
              height: "100%",
              background: `linear-gradient(to bottom, transparent, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 40)}%, transparent) 45%, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 40)}%, transparent) 55%, transparent)`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: mousePos.y - 1,
              left: 0,
              height: 2,
              width: "100%",
              background: `linear-gradient(to right, transparent, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 40)}%, transparent) 45%, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 40)}%, transparent) 55%, transparent)`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        </>
      )}
    </>
  );
}

// ── Cosmic variant — particle nebula with velocity physics ──

function CosmicGlow({
  isHovered,
  mousePos,
  glowColor,
  glowIntensity,
  glowRadius,
  radius,
}: {
  isHovered: boolean;
  mousePos: { x: number; y: number };
  glowColor: string;
  glowIntensity: number;
  glowRadius: number;
  radius: number;
}) {
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
      // Spawn new particle every ~80ms at cursor
      if (now - lastSpawn.current > 80 && particles.length < MAX_PARTICLES) {
        lastSpawn.current = now;
        particleId.current += 1;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.8;
        setParticles((prev) => [
          ...prev.slice(-(MAX_PARTICLES - 1)),
          {
            id: particleId.current,
            x: mousePos.x + (Math.random() - 0.5) * 20,
            y: mousePos.y + (Math.random() - 0.5) * 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 2 + Math.random() * 4,
            opacity: 0.5 + Math.random() * 0.5,
          },
        ]);
      }

      // Update positions with velocity decay
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
  }, [isHovered, mousePos.x, mousePos.y]);

  const glowBackground = isHovered
    ? `radial-gradient(${glowRadius * 0.8}px circle at ${mousePos.x}px ${mousePos.y}px, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 60)}%, transparent), transparent 70%)`
    : "none";

  return (
    <>
      {/* Nebula backdrop glow */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: radius,
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
            background: glowColor,
            opacity: p.opacity * glowIntensity,
            boxShadow: `0 0 ${p.size * 2}px ${glowColor}`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

// ── Glitch variant — scanline noise with flickering opacity ──

function GlitchGlow({
  isHovered,
  mousePos,
  glowColor,
  glowIntensity,
  glowRadius,
  radius,
}: {
  isHovered: boolean;
  mousePos: { x: number; y: number };
  glowColor: string;
  glowIntensity: number;
  glowRadius: number;
  radius: number;
}) {
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

  const scanlineGradient = useMemo(
    () =>
      `repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 15)}%, transparent) 2px, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 15)}%, transparent) 4px)`,
    [glowColor, glowIntensity],
  );

  return (
    <>
      {/* Base glow at cursor */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: radius,
          background: isHovered
            ? `radial-gradient(${glowRadius}px circle at ${mousePos.x}px ${mousePos.y}px, color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 80)}%, transparent), transparent 70%)`
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
            borderRadius: radius,
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
            background: `color-mix(in srgb, ${glowColor} ${Math.round(glowIntensity * 50)}%, transparent)`,
            transform: `translateX(${(Math.random() - 0.5) * 8}px)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}
    </>
  );
}
