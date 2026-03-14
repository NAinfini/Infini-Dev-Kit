import { forwardRef, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion } from "motion/react";

import type { TerminalProps } from "../../motion-types";
import { useFullMotion, useMotionAllowed } from "../../hooks/use-motion-allowed";

interface TerminalLine {
  type: "prompt" | "output";
  text: string;
  revealed: boolean;
}

/**
 * Simulated CLI terminal with typing animation and command responses.
 * Inspired by nyxui's Terminal.
 * Types out commands character-by-character, then reveals output instantly.
 * Features a macOS-style title bar, blinking cursor, and monospace font.
 */
export const Terminal = forwardRef<HTMLDivElement, TerminalProps>(
  function Terminal({
    commands,
    speed = 30,
    prompt = "$ ",
    title = "Terminal",
    autoStart = true,
    loop = false,
    onComplete,
    className,
    style,
    ...rest
  }, ref) {
    const motionAllowed = useMotionAllowed();
    const fullMotion = useFullMotion();
    const [lines, setLines] = useState<TerminalLine[]>([]);
    const [typingIndex, setTypingIndex] = useState(0);
    const [currentCmd, setCurrentCmd] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [started] = useState(autoStart);
    const containerRef = useRef<HTMLDivElement>(null);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    const intervalMs = 1000 / Math.max(1, speed);

    const scrollToBottom = useCallback(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, []);

    // Type commands sequentially
    useEffect(() => {
      if (!started || !motionAllowed || currentCmd >= commands.length) return;

      const cmd = commands[currentCmd];
      const delay = cmd.delay ?? 500;

      // Start typing after delay
      const delayTimer = window.setTimeout(() => {
        setIsTyping(true);
        setTypingIndex(0);

        // Add the prompt line (empty, will be built up)
        setLines((prev) => [...prev, { type: "prompt", text: "", revealed: false }]);
      }, delay);

      return () => window.clearTimeout(delayTimer);
    }, [started, motionAllowed, currentCmd, commands]);

    // Character-by-character typing
    useEffect(() => {
      if (!isTyping || currentCmd >= commands.length) return;

      const cmd = commands[currentCmd];

      if (typingIndex >= cmd.command.length) {
        // Done typing — reveal output
        setIsTyping(false);

        // Mark command as revealed and add output lines
        setLines((prev) => {
          const updated = [...prev];
          const lastPromptIdx = updated.length - 1;
          updated[lastPromptIdx] = { ...updated[lastPromptIdx], text: cmd.command, revealed: true };

          if (cmd.output) {
            for (const line of cmd.output) {
              updated.push({ type: "output", text: line, revealed: true });
            }
          }

          return updated;
        });

        // Move to next command
        const nextCmd = currentCmd + 1;
        if (nextCmd >= commands.length) {
          onCompleteRef.current?.();
          if (loop) {
            window.setTimeout(() => {
              setLines([]);
              setCurrentCmd(0);
              setTypingIndex(0);
            }, 2000);
          }
        } else {
          setCurrentCmd(nextCmd);
        }

        return;
      }

      const timer = window.setTimeout(() => {
        setTypingIndex((prev) => prev + 1);
        setLines((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = { ...updated[lastIdx], text: cmd.command.slice(0, typingIndex + 1) };
          return updated;
        });
        scrollToBottom();
      }, intervalMs);

      return () => window.clearTimeout(timer);
    }, [isTyping, typingIndex, currentCmd, commands, intervalMs, scrollToBottom, loop]);

    // Static fallback — show all commands and output at once
    if (!motionAllowed) {
      return (
        <TerminalShell ref={ref} title={title} className={className} style={style} {...rest}>
          {commands.map((cmd, i) => (
            <div key={i}>
              <div style={{ color: "var(--infini-color-text)" }}>
                <span style={{ color: "var(--infini-color-primary)" }}>{prompt}</span>
                {cmd.command}
              </div>
              {cmd.output?.map((line, j) => (
                <div key={j} style={{ color: "var(--infini-color-text-muted)" }}>{line}</div>
              ))}
            </div>
          ))}
        </TerminalShell>
      );
    }

    return (
      <TerminalShell ref={ref} title={title} className={className} style={style} {...rest}>
        <div ref={containerRef} style={{ maxHeight: 300, overflowY: "auto" }}>
          {lines.map((line, i) => (
            <div key={i} style={{ color: line.type === "output" ? "var(--infini-color-text-muted)" : "var(--infini-color-text)" }}>
              {line.type === "prompt" && (
                <span style={{ color: "var(--infini-color-primary)" }}>{prompt}</span>
              )}
              {line.text}
              {/* Blinking cursor on the currently typing line */}
              {line.type === "prompt" && !line.revealed && isTyping && i === lines.length - 1 && (
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
                  transition={fullMotion ? { duration: 0.7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } : undefined}
                />
              )}
            </div>
          ))}
          {/* Idle cursor when not typing */}
          {!isTyping && started && currentCmd >= commands.length && (
            <div>
              <span style={{ color: "var(--infini-color-primary)" }}>{prompt}</span>
              <motion.span
                style={{
                  display: "inline-block",
                  width: "0.55em",
                  height: "1.1em",
                  background: "var(--infini-color-primary)",
                  verticalAlign: "text-bottom",
                }}
                animate={fullMotion ? { opacity: [1, 0, 1] } : undefined}
                transition={fullMotion ? { duration: 0.7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } : undefined}
              />
            </div>
          )}
        </div>
      </TerminalShell>
    );
  }
);

// ── Terminal chrome wrapper ──

const TerminalShell = forwardRef<HTMLDivElement, {
  title: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}>(function TerminalShell({ title, className, style, children, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={className}
      style={{
        borderRadius: "var(--infini-radius)",
        border: "var(--infini-border-width) var(--infini-border-style, solid) var(--infini-color-border)",
        overflow: "hidden",
        background: "var(--infini-color-bg)",
        fontFamily: "var(--infini-font-mono)",
        fontSize: 13,
        lineHeight: 1.6,
        ...style,
      }}
      {...rest}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderBottom: "var(--infini-border-width) var(--infini-border-style, solid) var(--infini-color-border)",
          background: "var(--infini-color-surface)",
        }}
      >
        {/* Traffic lights */}
        <span style={{ display: "flex", gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
        </span>
        <span style={{ flex: 1, textAlign: "center", fontSize: 11, color: "var(--infini-color-text-muted)" }}>
          {title}
        </span>
        <span style={{ width: 42 }} />
      </div>

      {/* Terminal body */}
      <div style={{ padding: 12, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {children}
      </div>
    </div>
  );
});
