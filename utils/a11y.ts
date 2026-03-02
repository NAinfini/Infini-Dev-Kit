import type { EffectiveMotionMode } from "./motion";

export interface Timing {
  durationMs: number;
  delayMs?: number;
}

export interface FocusVisibleState {
  onPointerDown(): void;
  onKeyDown(event: { key: string }): void;
  isFocusVisible(): boolean;
}

export function createFocusVisibleState(): FocusVisibleState {
  let keyboardMode = false;

  return {
    onPointerDown() {
      keyboardMode = false;
    },
    onKeyDown(event) {
      if (
        event.key === "Tab" ||
        event.key.startsWith("Arrow") ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        keyboardMode = true;
      }
    },
    isFocusVisible() {
      return keyboardMode;
    },
  };
}

export function reduceMotionTiming(timing: Timing, mode: EffectiveMotionMode): Required<Timing> {
  const delayMs = timing.delayMs ?? 0;

  if (mode === "off") {
    return {
      durationMs: 0,
      delayMs: 0,
    };
  }

  if (mode === "reduced") {
    return {
      durationMs: Math.min(120, Math.max(60, Math.round(timing.durationMs * 0.5))),
      delayMs: 0,
    };
  }

  if (mode === "minimum") {
    return {
      durationMs: 60,
      delayMs: 0,
    };
  }

  return {
    durationMs: timing.durationMs,
    delayMs,
  };
}
