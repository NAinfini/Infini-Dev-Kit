import { motion } from "motion/react";
import { useMemo, useState, type MouseEvent } from "react";

import type { TiltCardProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";

type TiltState = {
  rotateX: number;
  rotateY: number;
  offsetX: number;
  offsetY: number;
};

const REST_STATE: TiltState = { rotateX: 0, rotateY: 0, offsetX: 0, offsetY: 0 };

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function TiltCard({
  children,
  tiltDegree,
  glowColor,
  glowIntensity,
  interactive = true,
  className,
}: TiltCardProps) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("hover");
  const [tilt, setTilt] = useState<TiltState>(REST_STATE);

  const maxTilt = tiltDegree ?? theme.motion.tiltDegree;
  const effectiveGlowColor = glowColor ?? theme.effects.hover.glowColor;
  const effectiveGlowIntensity = glowIntensity ?? theme.effects.hover.glowIntensity;
  const tiltEnabled = fullMotion && interactive && theme.motion.tiltEnabled;

  const baseShadow = useMemo(
    () => `0 8px 24px color-mix(in srgb, ${effectiveGlowColor} ${Math.round(effectiveGlowIntensity * 28)}%, transparent)`,
    [effectiveGlowColor, effectiveGlowIntensity],
  );

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const offsetX = (event.clientX - rect.left - centerX) / centerX;
    const offsetY = (event.clientY - rect.top - centerY) / centerY;

    setTilt({
      rotateX: clamp(-offsetY * maxTilt, -maxTilt, maxTilt),
      rotateY: clamp(offsetX * maxTilt, -maxTilt, maxTilt),
      offsetX,
      offsetY,
    });
  };

  const onMouseLeave = () => {
    if (!tiltEnabled) {
      return;
    }
    setTilt(REST_STATE);
  };

  if (!tiltEnabled) {
    return (
      <div className={className} style={{ borderRadius: theme.foundation.radius, boxShadow: baseShadow }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ perspective: 1000 }}>
    <motion.div
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: theme.motion.hoverScale,
      }}
      transition={transition}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        borderRadius: theme.foundation.radius,
        boxShadow: baseShadow,
        border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} color-mix(in srgb, ${effectiveGlowColor} 35%, ${theme.foundation.borderColor})`,
      }}
    >
      <motion.span
        aria-hidden
        animate={{
          opacity: [0.18, 0.3, 0.18],
        }}
        transition={{
          duration: 1.8,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(circle at ${50 + tilt.offsetX * 32}% ${50 + tilt.offsetY * 32}%, color-mix(in srgb, ${effectiveGlowColor} 40%, transparent) 0%, transparent 58%)`,
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          transform: "translateZ(12px)",
          transformStyle: "preserve-3d",
          borderRadius: theme.foundation.radius,
        }}
      >
        {children}
      </div>
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: theme.foundation.radius,
          pointerEvents: "none",
          boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${effectiveGlowColor} ${Math.round(effectiveGlowIntensity * 42)}%, transparent)`,
          zIndex: 2,
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: theme.foundation.radius,
          pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 38%)",
          zIndex: 2,
        }}
      />
    </motion.div>
    </div>
  );
}
