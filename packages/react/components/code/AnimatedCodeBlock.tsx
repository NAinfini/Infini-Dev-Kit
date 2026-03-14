import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import type { AnimatedCodeBlockProps } from "../../motion-types";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";

/**
 * Code block that types out its content character by character.
 * Inspired by nyxui's Animated Code Block.
 * Features a language header, monospace font from theme, blinking cursor,
 * and configurable typing speed. Falls back to static display when motion is off.
 */
export const AnimatedCodeBlock = forwardRef<HTMLDivElement, AnimatedCodeBlockProps>(
  function AnimatedCodeBlock({
    code,
    language = "code",
    speed = 40,
    cursor = true,
    autoStart = true,
    onComplete,
    className,
    style,
    ...rest
  }, ref) {
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(autoStart);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const effectiveSpeed = Math.max(1, speed);
  const intervalMs = 1000 / effectiveSpeed;

  const startTyping = useCallback(() => {
    setStarted(true);
    setCharIndex(0);
    setDone(false);
  }, []);

  // Type characters
  useEffect(() => {
    if (!started || !motionAllowed || done) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setCharIndex((prev) => {
        if (prev >= code.length) {
          if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
          }
          setDone(true);
          onCompleteRef.current?.();
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [code.length, done, intervalMs, motionAllowed, started]);

  // Reset when code changes
  useEffect(() => {
    setCharIndex(0);
    setDone(false);
    if (autoStart) {
      setStarted(true);
    }
  }, [code, autoStart]);

  const displayedCode = motionAllowed ? code.slice(0, charIndex) : code;
  const showCursor = cursor && motionAllowed && started && !done;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        borderRadius: "var(--infini-radius)",
        border: "var(--infini-border-width) var(--infini-border-style, solid) var(--infini-color-border)",
        overflow: "hidden",
        background: "var(--infini-color-surface)",
        ...style,
      }}
      {...rest}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          borderBottom: "var(--infini-border-width) var(--infini-border-style, solid) var(--infini-color-border)",
          fontSize: 11,
          fontFamily: "var(--infini-font-mono)",
          color: "var(--infini-color-text-muted)",
        }}
      >
        <span>{language}</span>
        {!autoStart && !started && (
          <button
            type="button"
            onClick={startTyping}
            style={{
              background: "var(--infini-color-primary)",
              color: "var(--infini-color-bg)",
              border: "none",
              borderRadius: 3,
              padding: "2px 8px",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            Run
          </button>
        )}
      </div>

      {/* Code area */}
      <pre
        style={{
          margin: 0,
          padding: 12,
          fontFamily: "var(--infini-font-mono)",
          fontSize: 13,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          minHeight: 60,
          color: "var(--infini-color-text)",
        }}
      >
        <code>
          {displayedCode}
          {showCursor && (
            <motion.span
              style={{
                display: "inline-block",
                width: "0.55em",
                height: "1.1em",
                background: "var(--infini-color-primary)",
                verticalAlign: "text-bottom",
                marginLeft: 1,
              }}
              animate={fullMotion ? { opacity: [1, 0, 1] } : undefined}
              transition={
                fullMotion
                  ? { duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                  : undefined
              }
            />
          )}
        </code>
      </pre>
    </div>
  );
  }
);
