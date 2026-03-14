import { AnimatePresence, motion } from "motion/react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import type { AnimatedTextPreset, AnimatedTextProps } from "../../motion-types";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";

const DEFAULTS: Record<AnimatedTextPreset, { duration: number; stagger: number }> = {
  fade: { duration: 0.4, stagger: 0.03 },
  slide: { duration: 0.35, stagger: 0.025 },
  typewriter: { duration: 0.05, stagger: 0.05 },
  scramble: { duration: 1.2, stagger: 0 },
};

const DEFAULT_SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Text with multiple animation presets: fade, slide, typewriter, scramble.
 * Inspired by nyxui's AnimatedText.
 * Each character animates independently for a staggered reveal effect.
 */
export const AnimatedText = forwardRef<HTMLSpanElement, AnimatedTextProps>(
  function AnimatedText({
    children,
    preset = "fade",
    duration,
    stagger,
    autoStart = true,
    loop = false,
    scrambleChars = DEFAULT_SCRAMBLE_CHARS,
    className,
    style,
    ...rest
  }, ref) {
    const motionAllowed = useMotionAllowed();
    const fullMotion = useFullMotion();

    const effectiveDuration = duration ?? DEFAULTS[preset].duration;
    const effectiveStagger = stagger ?? DEFAULTS[preset].stagger;

    if (!motionAllowed) {
      return (
        <span ref={ref} className={clsx(className)} style={style} {...rest}>
          {children}
        </span>
      );
    }

    if (preset === "scramble") {
      return (
        <ScrambleText
          ref={ref}
          text={children}
          duration={effectiveDuration}
          scrambleChars={scrambleChars}
          autoStart={autoStart}
          loop={loop}
          className={className}
          style={style}
          rest={rest}
        />
      );
    }

    if (preset === "typewriter") {
      return (
        <TypewriterText
          ref={ref}
          text={children}
          charDuration={effectiveDuration}
          stagger={effectiveStagger}
          autoStart={autoStart}
          loop={loop}
          className={className}
          style={style}
          rest={rest}
        />
      );
    }

    // fade + slide presets use per-character motion.span
    const chars = children.split("");
    const isSlide = preset === "slide";

    return (
      <span ref={ref} className={clsx(className)} style={{ ...style, display: "inline-block" }} {...rest}>
        <AnimatePresence>
          {chars.map((char, i) => (
            <motion.span
              key={`${i}-${char}`}
              style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : undefined }}
              initial={fullMotion ? { opacity: 0, y: isSlide ? 20 : 0 } : { opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: effectiveDuration,
                delay: autoStart ? i * effectiveStagger : 0,
                ease: "easeOut",
              }}
            >
              {char}
            </motion.span>
          ))}
        </AnimatePresence>
      </span>
    );
  }
);

// ── Typewriter sub-component ──

const TypewriterText = forwardRef<HTMLSpanElement, {
  text: string;
  charDuration: number;
  stagger: number;
  autoStart: boolean;
  loop: boolean;
  className?: string;
  style?: import("react").CSSProperties;
  rest?: Record<string, unknown>;
}>(function TypewriterText({
  text,
  charDuration: _charDuration,
  stagger,
  autoStart,
  loop,
  className,
  style,
  rest,
}, ref) {
  const [visibleCount, setVisibleCount] = useState(autoStart ? 0 : text.length);
  const [started, setStarted] = useState(autoStart);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;
    setVisibleCount(0);

    intervalRef.current = window.setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= text.length) {
          if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
          if (loop) {
            setTimeout(() => setVisibleCount(0), 1000);
            setTimeout(() => {
              setStarted(true);
            }, 1500);
          }
          return prev;
        }
        return prev + 1;
      });
    }, stagger * 1000);

    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, [started, text.length, stagger, loop]);

  // Reset on text change
  useEffect(() => {
    if (autoStart) {
      setVisibleCount(0);
      setStarted(true);
    }
  }, [text, autoStart]);

  return (
    <span ref={ref} className={className} style={style} {...rest}>
      {text.slice(0, visibleCount)}
      {visibleCount < text.length && (
        <motion.span
          style={{ display: "inline-block", width: "0.55em", height: "1em", background: "currentColor", verticalAlign: "text-bottom", marginLeft: 1 }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      )}
    </span>
  );
});

// ── Scramble sub-component ──

const ScrambleText = forwardRef<HTMLSpanElement, {
  text: string;
  duration: number;
  scrambleChars: string;
  autoStart: boolean;
  loop: boolean;
  className?: string;
  style?: import("react").CSSProperties;
  rest?: Record<string, unknown>;
}>(function ScrambleText({
  text,
  duration,
  scrambleChars,
  autoStart,
  loop,
  className,
  style,
  rest,
}, ref) {
  const [display, setDisplay] = useState(autoStart ? "" : text);
  const frameRef = useRef<number | null>(null);

  const scramble = useCallback(() => {
    const totalMs = duration * 1000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalMs);

      const result = text
        .split("")
        .map((char, i) => {
          const charProgress = i / text.length;
          if (progress > charProgress + 0.3) return char;
          if (char === " ") return " ";
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join("");

      setDisplay(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
        if (loop) {
          setTimeout(() => scramble(), 2000);
        }
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [text, duration, scrambleChars, loop]);

  useEffect(() => {
    if (autoStart) scramble();
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [autoStart, scramble]);

  return (
    <span ref={ref} className={className} style={{ ...style, fontVariantNumeric: "tabular-nums" }} {...rest}>
      {display}
    </span>
  );
});
