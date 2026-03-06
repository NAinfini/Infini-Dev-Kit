import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { pickReadableTextColor } from "../../../utils/color";
import type { GlitchButtonProps } from "../../theme/motion-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";

// ── Intensity presets ──

const INTENSITY = {
  subtle: { cloneLayers: 2, sliceCount: 4, displacement: 4, duration: 200, hueRange: 40, pulseScale: 1.005 },
  medium: { cloneLayers: 3, sliceCount: 6, displacement: 8, duration: 320, hueRange: 80, pulseScale: 1.01 },
  heavy: { cloneLayers: 5, sliceCount: 10, displacement: 14, duration: 500, hueRange: 120, pulseScale: 1.018 },
} as const;

type IntensityConfig = (typeof INTENSITY)[keyof typeof INTENSITY];

// ── Procedural slice generation (clip-path polygons) ──

function generateSlices(count: number): Array<{ top: number; bottom: number }> {
  const slices: Array<{ top: number; bottom: number }> = [];
  for (let i = 0; i < count; i++) {
    const top = Math.random() * 90;
    const height = 3 + Math.random() * 18;
    slices.push({ top, bottom: Math.min(100, top + height) });
  }
  return slices;
}

function sliceToClipPath(slice: { top: number; bottom: number }): string {
  return `polygon(0% ${slice.top}%, 100% ${slice.top}%, 100% ${slice.bottom}%, 0% ${slice.bottom}%)`;
}

// Build N randomized keyframe sets (one per clone layer)
function buildGlitchKeyframes(
  config: IntensityConfig,
  frameCount: number,
): Array<Array<{ clipPath: string; dx: number; hue: number }>> {
  const layers: Array<Array<{ clipPath: string; dx: number; hue: number }>> = [];

  for (let layer = 0; layer < config.cloneLayers; layer++) {
    const frames: Array<{ clipPath: string; dx: number; hue: number }> = [];
    for (let f = 0; f < frameCount; f++) {
      // Triangular intensity envelope: ramp up → peak at center → ramp down
      const t = f / Math.max(1, frameCount - 1);
      const envelope = t < 0.5 ? t * 2 : (1 - t) * 2;

      const slices = generateSlices(1 + Math.floor(Math.random() * 3));
      // Merge multiple slices into a single clip-path (union via comma-separated polygons doesn't work, pick one)
      const slice = slices[Math.floor(Math.random() * slices.length)];
      const clipPath = sliceToClipPath(slice);

      const dx = (Math.random() - 0.5) * 2 * config.displacement * envelope;
      const hue = (Math.random() - 0.5) * config.hueRange * envelope;

      frames.push({ clipPath, dx, hue });
    }
    layers.push(frames);
  }
  return layers;
}

// ── Web Animations API glitch runner ──

function runGlitchAnimation(
  elements: HTMLElement[],
  keyframeData: Array<Array<{ clipPath: string; dx: number; hue: number }>>,
  duration: number,
  loop: boolean,
): Animation[] {
  const animations: Animation[] = [];

  elements.forEach((el, layerIdx) => {
    const data = keyframeData[layerIdx];
    if (!data || data.length === 0) return;

    const keyframes: Keyframe[] = data.map((frame) => ({
      clipPath: frame.clipPath,
      transform: `translateX(${frame.dx}px)`,
      filter: `hue-rotate(${frame.hue}deg)`,
    }));

    const anim = el.animate(keyframes, {
      duration,
      easing: `steps(${data.length}, jump-start)`,
      iterations: loop ? Infinity : 1,
      fill: "forwards",
    });

    animations.push(anim);
  });

  return animations;
}

// ── Shake keyframes for container ──

function buildShakeKeyframes(config: IntensityConfig, steps: number): Keyframe[] {
  const keyframes: Keyframe[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Triangular envelope
    const envelope = t < 0.5 ? t * 2 : (1 - t) * 2;
    const dx = (Math.random() - 0.5) * config.displacement * 0.5 * envelope;
    const dy = (Math.random() - 0.5) * config.displacement * 0.25 * envelope;
    const scale = 1 + (config.pulseScale - 1) * envelope;
    keyframes.push({
      transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
    });
  }
  // Ensure last frame resets
  keyframes[keyframes.length - 1] = { transform: "translate(0, 0) scale(1)" };
  return keyframes;
}

// ── Component ──

export function GlitchButton({
  children,
  intensity = "medium",
  trigger = "hover",
  color,
  chromatic = true,
  textDistort = true,
  htmlType = "button",
  onClick,
  href,
  disabled,
  className,
}: GlitchButtonProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const [glitchActive, setGlitchActive] = useState(trigger === "always");
  const burstTimeoutRef = useRef<number | undefined>(undefined);

  // Refs for Web Animations API targets
  const containerRef = useRef<HTMLElement | null>(null);
  const cloneRefs = useRef<HTMLElement[]>([]);
  const activeAnimations = useRef<Animation[]>([]);
  const scanLineRef = useRef<HTMLSpanElement | null>(null);

  const config = INTENSITY[intensity];
  const bg = color ?? theme.button.backgroundActive;
  const textColor = pickReadableTextColor(bg);
  const isDisabled = Boolean(disabled);

  // Frame count for stepped animation — more frames = smoother glitch
  const frameCount = config.sliceCount * 2;

  // ── Glitch activation ──

  const stopAllAnimations = useCallback(() => {
    for (const anim of activeAnimations.current) {
      anim.cancel();
    }
    activeAnimations.current = [];
  }, []);

  const runGlitch = useCallback(
    (loop: boolean) => {
      stopAllAnimations();

      const cloneEls = cloneRefs.current.filter(Boolean);
      if (cloneEls.length === 0 || !chromatic) return;

      const keyframeData = buildGlitchKeyframes(config, frameCount);
      const anims = runGlitchAnimation(cloneEls, keyframeData, config.duration, loop);
      activeAnimations.current.push(...anims);

      // Container shake
      if (textDistort && containerRef.current) {
        const shakeKf = buildShakeKeyframes(config, frameCount);
        const shakeAnim = containerRef.current.animate(shakeKf, {
          duration: config.duration,
          easing: `steps(${frameCount}, jump-start)`,
          iterations: loop ? Infinity : 1,
          fill: "forwards",
        });
        activeAnimations.current.push(shakeAnim);
      }

      // Scan line sweep
      if (scanLineRef.current) {
        const scanAnim = scanLineRef.current.animate(
          [{ top: "0%" }, { top: "100%" }],
          {
            duration: config.duration,
            easing: "linear",
            iterations: loop ? Infinity : 1,
            fill: "forwards",
          },
        );
        activeAnimations.current.push(scanAnim);
      }
    },
    [stopAllAnimations, chromatic, config, frameCount, textDistort],
  );

  const activateGlitch = useCallback(() => {
    if (!fullMotion || isDisabled || trigger === "always") return;
    if (burstTimeoutRef.current !== undefined) window.clearTimeout(burstTimeoutRef.current);
    setGlitchActive(true);
    runGlitch(false);
    burstTimeoutRef.current = window.setTimeout(() => {
      setGlitchActive(false);
      stopAllAnimations();
      burstTimeoutRef.current = undefined;
    }, config.duration + 50);
  }, [fullMotion, isDisabled, trigger, config.duration, runGlitch, stopAllAnimations]);

  // Always-on mode
  useEffect(() => {
    if (trigger === "always" && fullMotion && !isDisabled) {
      runGlitch(true);
      return () => stopAllAnimations();
    }
  }, [trigger, fullMotion, isDisabled, runGlitch, stopAllAnimations]);

  // Cleanup on unmount
  useEffect(() => () => stopAllAnimations(), [stopAllAnimations]);

  const eventHandlers = useMemo(() => {
    if (!fullMotion || isDisabled) return {};
    switch (trigger) {
      case "hover":
        return {
          onMouseEnter: activateGlitch,
          onMouseLeave: () => {
            stopAllAnimations();
            setGlitchActive(false);
          },
        };
      case "click":
        return {};
      default:
        return {};
    }
  }, [fullMotion, isDisabled, trigger, activateGlitch, stopAllAnimations]);

  const handleClick = () => {
    if (isDisabled) return;
    if (trigger === "click") activateGlitch();
    onClick?.();
  };

  // ── Clone layer colors (hue-rotated variants for chromatic aberration) ──

  const cloneColors = useMemo(() => {
    const colors = ["cyan", "magenta", "#FF0", "#0FF", "lime"];
    return colors.slice(0, config.cloneLayers);
  }, [config.cloneLayers]);

  const blendModes: CSSProperties["mixBlendMode"][] = ["screen", "multiply", "screen", "multiply", "screen"];

  // ── Styles ──

  const baseStyle: CSSProperties = {
    position: "relative",
    display: "inline-grid",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.55rem 1.2rem",
    border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
    borderRadius: theme.foundation.radius,
    background: bg,
    color: textColor,
    fontFamily: theme.typography.en.heading,
    fontWeight: theme.typography.weights.bold,
    fontSize: 15,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.6 : 1,
    userSelect: "none",
    outline: "none",
    overflow: "hidden",
    textDecoration: "none",
  };

  // ── Non-motion fallback ──

  if (!motionAllowed) {
    if (href && !isDisabled) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={baseStyle}>
          {children}
        </a>
      );
    }
    return (
      <button type={htmlType} className={className} onClick={handleClick} disabled={isDisabled} style={baseStyle}>
        {children}
      </button>
    );
  }

  // ── Grid-stacked content + clone layers (powerglitch approach) ──
  // All layers occupy gridArea '1/1/-1/-1' so they stack perfectly.

  const setCloneRef = (i: number) => (el: HTMLSpanElement | null) => {
    if (el) cloneRefs.current[i] = el;
  };

  const innerContent = (
    <>
      {/* Original text layer */}
      <span
        style={{
          gridArea: "1 / 1 / -1 / -1",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          position: "relative",
          zIndex: config.cloneLayers + 1,
        }}
      >
        {children}
      </span>

      {/* Clone layers for chromatic aberration + clip-path glitch */}
      {chromatic &&
        cloneColors.map((cloneColor, i) => (
          <span
            key={i}
            ref={setCloneRef(i)}
            aria-hidden
            style={{
              gridArea: "1 / 1 / -1 / -1",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: cloneColor,
              mixBlendMode: blendModes[i % blendModes.length],
              opacity: glitchActive ? 0.6 : 0,
              pointerEvents: "none",
              zIndex: i + 1,
              willChange: "clip-path, transform, filter",
              fontFamily: theme.typography.en.heading,
              fontWeight: theme.typography.weights.bold,
              fontSize: 15,
            }}
          >
            {children}
          </span>
        ))}

      {/* Scan line */}
      <span
        ref={scanLineRef}
        aria-hidden
        style={{
          gridArea: "1 / 1 / -1 / -1",
          position: "relative",
          top: 0,
          left: 0,
          width: "100%",
          height: 2,
          background: `color-mix(in srgb, ${textColor} 20%, transparent)`,
          pointerEvents: "none",
          zIndex: config.cloneLayers + 2,
          opacity: glitchActive ? 1 : 0,
          alignSelf: "start",
        }}
      />
    </>
  );

  const commonMotionProps = {
    className,
    style: baseStyle,
    ...eventHandlers,
    onClick: handleClick,
  };

  if (href && !isDisabled) {
    return (
      <a
        ref={containerRef as React.Ref<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...commonMotionProps}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      ref={containerRef as React.Ref<HTMLButtonElement>}
      type={htmlType}
      {...commonMotionProps}
      disabled={isDisabled}
    >
      {innerContent}
    </button>
  );
}

