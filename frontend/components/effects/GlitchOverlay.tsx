import { motion } from "motion/react";
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type CSSProperties } from "react";

import type { GlitchOverlayProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useMotionAllowed } from "../../hooks/use-motion-allowed";
import { useThemeTransition } from "../../hooks/use-theme-transition";

const INTENSITY_CONFIG = {
  subtle: { duration: 220, displacement: 4, opacity: 0.35 },
  medium: { duration: 320, displacement: 8, opacity: 0.5 },
  heavy: { duration: 420, displacement: 14, opacity: 0.65 },
} as const;

/**
 * Generate randomized clip-path + transform keyframe steps for a single clone layer.
 * Each call produces different random polygons and offsets.
 */
function generateLayerKeyframes(
  steps: number,
  displacement: number,
  envelope?: { start: number; end: number },
): Array<{ clipPath: string; transform: string; hueRotate: number; opacity: number }> {
  const frames: Array<{ clipPath: string; transform: string; hueRotate: number; opacity: number }> = [];

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;

    // Envelope: ramp intensity based on glitchTimeSpan
    let intensity = 1;
    if (envelope) {
      const { start, end } = envelope;
      const peak = (start + end) / 2;
      if (progress < start || progress > end) {
        intensity = 0;
      } else if (progress < peak) {
        intensity = (progress - start) / (peak - start);
      } else {
        intensity = (end - progress) / (end - peak);
      }
    }

    if (intensity < 0.01) {
      frames.push({ clipPath: "inset(0 0 0 0)", transform: "translate3d(0,0,0)", hueRotate: 0, opacity: 0 });
      continue;
    }

    // Random clip-path slice
    const top = Math.random() * 90;
    const height = 5 + Math.random() * 25;
    const bottom = Math.max(0, 100 - top - height);

    // Random displacement
    const dx = (Math.random() - 0.5) * 2 * displacement * intensity;
    const dy = (Math.random() - 0.5) * 0.6 * displacement * intensity;

    // Random hue rotation
    const hue = Math.random() * 360;

    frames.push({
      clipPath: `inset(${Math.round(top)}% 0 ${Math.round(bottom)}% 0)`,
      transform: `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`,
      hueRotate: hue,
      opacity: intensity,
    });
  }

  return frames;
}

/**
 * Glitch effect overlay for any HTML content.
 * Inspired by powerglitch — reimplemented with N procedurally-randomized
 * clone layers, chromatic aberration, pulse echo, glitch time envelope,
 * and multiple trigger modes (hover, interval, always, click, manual).
 */
export function GlitchOverlay({
  children,
  intensity = "medium",
  trigger = "hover",
  intervalMs = 5000,
  layerCount = 6,
  sliceCount = 8,
  displacement,
  chromatic = true,
  shake = true,
  pulse = false,
  pulseScale = 1.4,
  glitchTimeSpan,
  cssFilters,
  hideOverflow = false,
  apiRef,
  display = "inline-block",
  className,
}: GlitchOverlayProps) {
  const { motion: motionState } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const transition = useThemeTransition("hover");
  const [burstActive, setBurstActive] = useState(trigger === "always");
  const burstTimeoutRef = useRef<number | undefined>(undefined);

  const isAnimated = motionAllowed && motionState.effectiveMode === "full";
  const config = INTENSITY_CONFIG[intensity];
  const effectiveDisplacement = displacement ?? config.displacement;

  // Generate keyframes for each layer (regenerated each burst for randomness)
  const [layerFrames, setLayerFrames] = useState<ReturnType<typeof generateLayerKeyframes>[]>([]);

  const regenerateKeyframes = useCallback(() => {
    const frames: ReturnType<typeof generateLayerKeyframes>[] = [];
    for (let i = 0; i < layerCount; i++) {
      frames.push(generateLayerKeyframes(sliceCount, effectiveDisplacement, glitchTimeSpan));
    }
    setLayerFrames(frames);
  }, [layerCount, sliceCount, effectiveDisplacement, glitchTimeSpan]);

  const activateBurst = useCallback(() => {
    if (!isAnimated || trigger === "always") return;

    if (burstTimeoutRef.current !== undefined) {
      window.clearTimeout(burstTimeoutRef.current);
    }

    regenerateKeyframes();
    setBurstActive(true);

    burstTimeoutRef.current = window.setTimeout(() => {
      setBurstActive(false);
      burstTimeoutRef.current = undefined;
    }, config.duration);
  }, [isAnimated, trigger, config.duration, regenerateKeyframes]);

  const stopBurst = useCallback(() => {
    if (burstTimeoutRef.current !== undefined) {
      window.clearTimeout(burstTimeoutRef.current);
      burstTimeoutRef.current = undefined;
    }
    setBurstActive(false);
  }, []);

  // Imperative API for manual trigger
  useImperativeHandle(
    apiRef,
    () => ({
      startGlitch: () => {
        regenerateKeyframes();
        setBurstActive(true);
      },
      stopGlitch: stopBurst,
    }),
    [regenerateKeyframes, stopBurst],
  );

  // Initial keyframes for "always" mode
  useEffect(() => {
    if (trigger === "always" && isAnimated) {
      regenerateKeyframes();
    }
  }, [trigger, isAnimated, regenerateKeyframes]);

  // Interval trigger
  useEffect(() => {
    if (!isAnimated || trigger !== "interval") return;
    const id = window.setInterval(() => {
      activateBurst();
    }, Math.max(intervalMs, config.duration + 200));
    return () => window.clearInterval(id);
  }, [config.duration, intervalMs, isAnimated, trigger, activateBurst]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (burstTimeoutRef.current !== undefined) {
        window.clearTimeout(burstTimeoutRef.current);
      }
    };
  }, []);

  const isEffectActive = burstActive || trigger === "always";

  // Event handlers based on trigger mode
  const eventHandlers = useMemo(() => {
    if (!isAnimated) return {};
    switch (trigger) {
      case "hover":
        return { onMouseEnter: activateBurst };
      case "click":
        return { onClick: activateBurst };
      default:
        return {};
    }
  }, [isAnimated, trigger, activateBurst]);

  if (!isAnimated) {
    return <div className={className}>{children}</div>;
  }

  // Hue offset per layer for chromatic spread
  const hueStep = 360 / Math.max(1, layerCount);

  return (
    <motion.div
      className={className}
      style={{
        position: "relative",
        display,
        isolation: "isolate",
        overflow: hideOverflow ? "hidden" : undefined,
      } as CSSProperties}
      {...eventHandlers}
      animate={
        isEffectActive && shake
          ? {
              x: [0, effectiveDisplacement * 0.4, -effectiveDisplacement * 0.3, effectiveDisplacement * 0.2, 0],
              y: [0, -effectiveDisplacement * 0.15, effectiveDisplacement * 0.1, 0],
            }
          : { x: 0, y: 0 }
      }
      transition={transition}
    >
      {/* Original content */}
      {children}

      {/* N procedural clone layers */}
      {chromatic && isEffectActive && layerFrames.map((frames, layerIdx) => (
        <GlitchLayer
          key={layerIdx}
          frames={frames}
          duration={config.duration}
          baseOpacity={config.opacity}
          hueOffset={layerIdx * hueStep}
          layerIndex={layerIdx}
          isAlways={trigger === "always"}
          cssFilters={cssFilters}
        >
          {children}
        </GlitchLayer>
      ))}

      {/* Pulse layer — scale + fade echo */}
      {pulse && isEffectActive && (
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
          initial={{ scale: 1, opacity: config.opacity * 0.5 }}
          animate={{ scale: pulseScale, opacity: 0 }}
          transition={{
            duration: config.duration / 1000,
            ease: "easeOut",
            repeat: trigger === "always" ? Number.POSITIVE_INFINITY : 0,
          }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Individual glitch clone layer ──

function GlitchLayer({
  children,
  frames,
  duration,
  baseOpacity,
  hueOffset,
  layerIndex,
  isAlways,
  cssFilters,
}: {
  children: React.ReactNode;
  frames: ReturnType<typeof generateLayerKeyframes>;
  duration: number;
  baseOpacity: number;
  hueOffset: number;
  layerIndex: number;
  isAlways: boolean;
  cssFilters?: string;
}) {
  const layerRef = useRef<HTMLDivElement>(null);

  // Apply randomized keyframes via Web Animations API
  useEffect(() => {
    const el = layerRef.current;
    if (!el || frames.length === 0) return;

    const keyframes = frames.map((f) => ({
      clipPath: f.clipPath,
      transform: f.transform,
      filter: cssFilters ?? `hue-rotate(${f.hueRotate + hueOffset}deg) saturate(1.4)`,
      opacity: f.opacity * baseOpacity,
    }));

    const animation = el.animate(keyframes, {
      duration: isAlways ? 3000 : duration,
      iterations: isAlways ? Infinity : 1,
      easing: `steps(${frames.length}, end)`,
      fill: "forwards",
    });

    return () => {
      animation.cancel();
    };
  }, [frames, duration, baseOpacity, hueOffset, isAlways]);

  // Alternate blend modes for different layers
  const blendMode = layerIndex % 2 === 0 ? "screen" : "multiply";
  // Alternate tint colors: even=cyan, odd=magenta
  const tintColor = layerIndex % 2 === 0
    ? "rgba(0, 240, 255, 0.06)"
    : "rgba(255, 42, 109, 0.06)";

  return (
    <div
      ref={layerRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0,
        mixBlendMode: blendMode,
        background: tintColor,
      }}
    >
      {children}
    </div>
  );
}
