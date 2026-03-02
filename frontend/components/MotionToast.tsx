import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

import type { MotionToastContainerProps, MotionToastData, MotionToastProps } from "../theme/motion-types";
import { useThemeSnapshot } from "../provider/InfiniProvider";
import { useFullMotion, useMotionAllowed } from "../hooks/use-motion-allowed";
import { useThemeTransition } from "../hooks/use-theme-transition";

// ── Context for imperative toast API ──

interface ToastContextValue {
  show: (toast: MotionToastData) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useMotionToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useMotionToast must be used within a MotionToastContainer");
  return ctx;
}

// ── Variant colors ──

const VARIANT_COLORS: Record<NonNullable<MotionToastData["variant"]>, (theme: ReturnType<typeof useThemeSnapshot>["theme"]) => string> = {
  info: (t) => t.palette.primary,
  success: (t) => t.palette.success,
  warning: (t) => t.palette.warning,
  error: (t) => t.palette.danger,
};

// ── Single toast ──

function MotionToastItem({ toast, onDismiss, entranceFrom = "right" }: MotionToastProps & { entranceFrom?: "left" | "right" | "top" | "bottom" }) {
  const { theme } = useThemeSnapshot();
  const fullMotion = useFullMotion();
  const transition = useThemeTransition("enter");
  const accentColor = VARIANT_COLORS[toast.variant ?? "info"](theme);

  const entranceOffset = {
    left: { x: -40, y: 0 },
    right: { x: 40, y: 0 },
    top: { x: 0, y: -40 },
    bottom: { x: 0, y: 40 },
  }[entranceFrom];
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const durationMs = toast.duration ?? 4000;

  // Auto-dismiss timer with progress bar
  const startTimer = useCallback(() => {
    if (durationMs <= 0) return;
    startRef.current = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const remaining = Math.max(0, 100 * (1 - elapsed / durationMs));
      setProgress(remaining);
      if (remaining <= 0) {
        onDismiss(toast.id!);
      } else {
        timerRef.current = requestAnimationFrame(tick);
      }
    };
    timerRef.current = requestAnimationFrame(tick);
  }, [durationMs, onDismiss, toast.id]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current !== null) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start on mount
  useState(() => {
    if (durationMs > 0) {
      // Use microtask to avoid running during render
      queueMicrotask(startTimer);
    }
  });

  return (
    <motion.div
      layout={fullMotion}
      initial={fullMotion ? { opacity: 0, ...entranceOffset, scale: 0.95 } : { opacity: 0 }}
      animate={fullMotion ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 1 }}
      exit={fullMotion ? { opacity: 0, ...entranceOffset, scale: 0.95 } : { opacity: 0 }}
      transition={transition}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      style={{
        position: "relative",
        overflow: "hidden",
        background: theme.foundation.surface,
        border: `${theme.foundation.borderWidth}px ${theme.foundation.borderStyle} ${theme.foundation.borderColor}`,
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: theme.foundation.radius,
        padding: "0.75rem 1rem",
        minWidth: 280,
        maxWidth: 400,
        boxShadow: `0 4px 12px color-mix(in srgb, ${theme.foundation.borderColor} 30%, transparent)`,
      }}
    >
      {/* Title */}
      {toast.title && (
        <div
          style={{
            fontFamily: theme.typography.display,
            fontWeight: theme.typography.displayWeight,
            fontSize: 14,
            color: theme.palette.text,
            marginBottom: 4,
          }}
        >
          {toast.title}
        </div>
      )}

      {/* Message */}
      <div
        style={{
          fontSize: 13,
          color: theme.palette.textMuted,
          lineHeight: 1.4,
        }}
      >
        {toast.message}
      </div>

      {/* Action + Close row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: toast.action ? 8 : 0 }}>
        {toast.action && (
          <button
            type="button"
            onClick={toast.action.onClick}
            style={{
              background: "none",
              border: "none",
              color: accentColor,
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
              padding: "2px 6px",
            }}
          >
            {toast.action.label}
          </button>
        )}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => onDismiss(toast.id!)}
          style={{
            background: "none",
            border: "none",
            color: theme.palette.textMuted,
            cursor: "pointer",
            fontSize: 16,
            lineHeight: 1,
            padding: "2px 4px",
          }}
        >
          &#10005;
        </button>
      </div>

      {/* Progress bar */}
      {durationMs > 0 && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 2,
            width: `${progress}%`,
            background: accentColor,
            opacity: 0.5,
            transition: "width 0.1s linear",
          }}
        />
      )}
    </motion.div>
  );
}

// ── Container + Provider ──

const POSITION_STYLES: Record<NonNullable<MotionToastContainerProps["position"]>, React.CSSProperties> = {
  "top-right": { top: 16, right: 16, alignItems: "flex-end" },
  "top-left": { top: 16, left: 16, alignItems: "flex-start" },
  "bottom-right": { bottom: 16, right: 16, alignItems: "flex-end" },
  "bottom-left": { bottom: 16, left: 16, alignItems: "flex-start" },
  "top-center": { top: 16, left: "50%", transform: "translateX(-50%)", alignItems: "center" },
  "bottom-center": { bottom: 16, left: "50%", transform: "translateX(-50%)", alignItems: "center" },
};

let toastIdCounter = 0;

export function MotionToastContainer({
  position = "top-right",
  maxVisible = 5,
  entranceFrom = "right",
  className,
  children,
}: MotionToastContainerProps & { children: ReactNode }) {
  const motionAllowed = useMotionAllowed();
  const [toasts, setToasts] = useState<(MotionToastData & { id: string })[]>([]);

  const show = useCallback((data: MotionToastData): string => {
    toastIdCounter += 1;
    const id = data.id ?? `toast-${toastIdCounter}`;
    setToasts((prev) => [...prev.slice(-(maxVisible - 1)), { ...data, id }]);
    return id;
  }, [maxVisible]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const posStyle = POSITION_STYLES[position];

  return (
    <ToastContext.Provider value={{ show, dismiss, dismissAll }}>
      {children}
      <div
        className={className}
        style={{
          position: "fixed",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
          ...posStyle,
        }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <div key={toast.id} style={{ pointerEvents: "auto" }}>
              {motionAllowed ? (
                <MotionToastItem toast={toast} onDismiss={dismiss} entranceFrom={entranceFrom} />
              ) : (
                <MotionToastItem toast={toast} onDismiss={dismiss} entranceFrom={entranceFrom} />
              )}
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
