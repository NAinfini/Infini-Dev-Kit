import { motion } from "motion/react";
import { useCallback, useMemo, useState, type MouseEvent, type TouchEvent, type ReactNode } from "react";

import { useFullMotion, useMotionAllowed } from "../../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../../hooks/use-theme-transition";

type TiltState = { rotateX: number; rotateY: number; offsetX: number; offsetY: number };
const REST: TiltState = { rotateX: 0, rotateY: 0, offsetX: 0, offsetY: 0 };

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(v, max));
}

export interface Tilt3DEffectProps {
  children: ReactNode;
  /** Max tilt angle in degrees (default: 15) */
  tiltDegree?: number;
  /** Glow color (default: theme hover glow) */
  glowColor?: string;
  /** Glow intensity 0–1 (default: 0.6) */
  glowIntensity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 3D perspective tilt with radial glow + specular highlight.
 * Extracted from TiltCard.
 */
export function Tilt3DEffect({
  children,
  tiltDegree,
  glowColor,
  glowIntensity,
  className,
  style,
}: Tilt3DEffectProps) {
  const fullMotion = useFullMotion();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("hover");
  const [tilt, setTilt] = useState<TiltState>(REST);

  const maxTilt = tiltDegree ?? 15;
  const color = glowColor ?? "var(--infini-hover-glow-color)";
  const intensity = glowIntensity ?? 0.6;
  const tiltEnabled = fullMotion;

  const baseShadow = useMemo(
    () => `0 8px 24px color-mix(in srgb, ${color} ${Math.round(intensity * 28)}%, transparent)`,
    [color, intensity],
  );

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ox = (event.clientX - rect.left - cx) / cx;
    const oy = (event.clientY - rect.top - cy) / cy;
    setTilt({ rotateX: clamp(-oy * maxTilt, -maxTilt, maxTilt), rotateY: clamp(ox * maxTilt, -maxTilt, maxTilt), offsetX: ox, offsetY: oy });
  };

  const onTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    const touch = event.touches[0];
    if (!touch) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ox = (touch.clientX - rect.left - cx) / cx;
    const oy = (touch.clientY - rect.top - cy) / cy;
    setTilt({ rotateX: clamp(-oy * maxTilt, -maxTilt, maxTilt), rotateY: clamp(ox * maxTilt, -maxTilt, maxTilt), offsetX: ox, offsetY: oy });
  }, [tiltEnabled, maxTilt]);

  const onMouseLeave = () => { if (tiltEnabled) setTilt(REST); };
  const onTouchEnd = useCallback(() => { if (tiltEnabled) setTilt(REST); }, [tiltEnabled]);

  if (!motionAllowed) {
    return (
      <div className={className} style={{ borderRadius: "var(--infini-radius)", boxShadow: baseShadow, ...style }}>
        {children}
      </div>
    );
  }

  if (!tiltEnabled) {
    return (
      <motion.div className={className} whileHover={{ scale: 1.01 }} transition={transition} style={{ borderRadius: "var(--infini-radius)", boxShadow: baseShadow, ...style }}>
        {children}
      </motion.div>
    );
  }

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        className={className}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, scale: 1.02 }}
        transition={transition}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
          borderRadius: "var(--infini-radius)",
          boxShadow: baseShadow,
          border: `var(--infini-border-width) solid color-mix(in srgb, ${color} 35%, var(--infini-color-border))`,
          ...style,
        }}
      >
        <motion.span
          aria-hidden
          animate={{ opacity: [0.18, 0.3, 0.18] }}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(circle at ${50 + tilt.offsetX * 32}% ${50 + tilt.offsetY * 32}%, color-mix(in srgb, ${color} 40%, transparent) 0%, transparent 58%)`,
            mixBlendMode: "screen",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, transform: "translateZ(12px)", transformStyle: "preserve-3d", borderRadius: "var(--infini-radius)" }}>
          {children}
        </div>
        <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "var(--infini-radius)", pointerEvents: "none", boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} ${Math.round(intensity * 42)}%, transparent)`, zIndex: 2 }} />
        <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "var(--infini-radius)", pointerEvents: "none", background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 38%)", zIndex: 2 }} />
      </motion.div>
    </div>
  );
}
