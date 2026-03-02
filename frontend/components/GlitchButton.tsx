import { motion } from "motion/react";
import { useCallback, useMemo, useRef, useState, type CSSProperties } from "react";

import type { GlitchButtonProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

const INTENSITY = {
  subtle: { displacement: 3, sliceCount: 3, duration: 180, opacity: 0.3 },
  medium: { displacement: 6, sliceCount: 5, duration: 260, opacity: 0.5 },
  heavy: { displacement: 12, sliceCount: 8, duration: 360, opacity: 0.65 },
} as const;

/**
 * Button with glitch distortion effect on hover/click.
 * Completes the glitch family: GlitchText (text), GlitchOverlay (any content),
 * GlitchButton (interactive button). Uses procedurally randomized clip-path
 * slices on pseudo-clone layers with chromatic aberration.
 */
export function GlitchButton({
  children,
  intensity = "medium",
  trigger = "hover",
  color,
  chromatic = true,
  textDistort = true,
  onClick,
  href,
  disabled,
  className,
}: GlitchButtonProps) {
  const { theme } = useThemeSnapshot();
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("press");
  const [glitchActive, setGlitchActive] = useState(trigger === "always");
  const burstRef = useRef<number | undefined>(undefined);

  const config = INTENSITY[intensity];
  const bg = color ?? theme.button.backgroundActive;
  const isDisabled = Boolean(disabled);

  const activateGlitch = useCallback(() => {
    if (!fullMotion || isDisabled || trigger === "always") return;
    if (burstRef.current !== undefined) window.clearTimeout(burstRef.current);
    setGlitchActive(true);
    burstRef.current = window.setTimeout(() => {
      setGlitchActive(false);
      burstRef.current = undefined;
    }, config.duration);
  }, [fullMotion, isDisabled, trigger, config.duration]);

  const eventHandlers = useMemo(() => {
    if (!fullMotion || isDisabled) return {};
    switch (trigger) {
      case "hover":
        return { onMouseEnter: activateGlitch };
      case "click":
        return {};
      default:
        return {};
    }
  }, [fullMotion, isDisabled, trigger, activateGlitch]);

  const handleClick = () => {
    if (isDisabled) return;
    if (trigger === "click") activateGlitch();
    onClick?.();
  };

  // Generate random slice clip-paths for the clones
  const slices = useMemo(() => {
    if (!glitchActive) return [];
    const result: Array<{ top: number; height: number; dx: number }> = [];
    for (let i = 0; i < config.sliceCount; i++) {
      result.push({
        top: Math.random() * 85,
        height: 5 + Math.random() * 20,
        dx: (Math.random() - 0.5) * 2 * config.displacement,
      });
    }
    return result;
  }, [glitchActive, config.sliceCount, config.displacement]);

  const baseStyle: CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "0.55rem 1.2rem",
    border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
    borderRadius: theme.foundation.radius,
    background: bg,
    color: theme.foundation.background,
    fontFamily: theme.typography.display,
    fontWeight: theme.typography.displayWeight,
    fontSize: 15,
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.6 : 1,
    userSelect: "none",
    outline: "none",
    overflow: "hidden",
    textDecoration: "none",
  };

  if (!motionAllowed) {
    if (href && !isDisabled) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={baseStyle}>
          {children}
        </a>
      );
    }
    return (
      <button type="button" className={className} onClick={handleClick} disabled={isDisabled} style={baseStyle}>
        {children}
      </button>
    );
  }

  const shakeAnimation = glitchActive && textDistort
    ? {
        x: [0, config.displacement * 0.3, -config.displacement * 0.2, config.displacement * 0.15, 0],
      }
    : { x: 0 };

  const content = (
    <>
      {/* Text content with optional shake */}
      <motion.span
        style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: 8 }}
        animate={shakeAnimation}
        transition={{ duration: config.duration / 1000, ease: "easeInOut" }}
      >
        {children}
      </motion.span>

      {/* Clone layers for chromatic aberration */}
      {chromatic && glitchActive && (
        <>
          {/* Cyan clone */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "cyan",
              mixBlendMode: "screen",
              opacity: config.opacity,
              transform: `translateX(${config.displacement * 0.4}px)`,
              clipPath: slices.length > 0
                ? `inset(${slices[0].top}% 0 ${Math.max(0, 100 - slices[0].top - slices[0].height)}% 0)`
                : undefined,
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <span style={{ fontFamily: theme.typography.display, fontWeight: theme.typography.displayWeight, fontSize: 15 }}>
              {children}
            </span>
          </span>

          {/* Magenta clone */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "magenta",
              mixBlendMode: "multiply",
              opacity: config.opacity * 0.85,
              transform: `translateX(${-config.displacement * 0.35}px)`,
              clipPath: slices.length > 1
                ? `inset(${slices[1].top}% 0 ${Math.max(0, 100 - slices[1].top - slices[1].height)}% 0)`
                : undefined,
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <span style={{ fontFamily: theme.typography.display, fontWeight: theme.typography.displayWeight, fontSize: 15 }}>
              {children}
            </span>
          </span>
        </>
      )}

      {/* Scan line flicker */}
      {glitchActive && (
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 2,
            background: `color-mix(in srgb, ${theme.foundation.background} 20%, transparent)`,
            pointerEvents: "none",
            zIndex: 3,
          }}
          animate={{ top: ["0%", "100%"] }}
          transition={{
            duration: config.duration / 1000,
            ease: "linear",
            repeat: trigger === "always" ? Number.POSITIVE_INFINITY : 0,
          }}
        />
      )}
    </>
  );

  if (href && !isDisabled) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={baseStyle}
        {...eventHandlers}
        onClick={handleClick}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.97 } : undefined}
        transition={transition}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      className={className}
      style={baseStyle}
      {...eventHandlers}
      onClick={handleClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.97 } : undefined}
      transition={transition}
    >
      {content}
    </motion.button>
  );
}
