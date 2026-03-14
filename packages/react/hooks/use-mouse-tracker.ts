import { useCallback, useState, type MouseEvent, type TouchEvent } from "react";

export interface MouseTrackerState {
  x: number;
  y: number;
  isHovered: boolean;
}

const REST: MouseTrackerState = { x: 0, y: 0, isHovered: false };

/**
 * Shared mouse/touch position tracker for glow effects.
 * Returns position state + event handlers to spread onto a container.
 */
export function useMouseTracker(enabled: boolean) {
  const [state, setState] = useState<MouseTrackerState>(REST);

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!enabled) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setState({ x: event.clientX - rect.left, y: event.clientY - rect.top, isHovered: true });
    },
    [enabled],
  );

  const onMouseEnter = useCallback(() => {
    if (enabled) setState((s) => ({ ...s, isHovered: true }));
  }, [enabled]);

  const onMouseLeave = useCallback(() => {
    setState((s) => ({ ...s, isHovered: false }));
  }, []);

  const onTouchMove = useCallback(
    (event: TouchEvent<HTMLElement>) => {
      if (!enabled) return;
      const touch = event.touches[0];
      if (!touch) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setState({ x: touch.clientX - rect.left, y: touch.clientY - rect.top, isHovered: true });
    },
    [enabled],
  );

  const onTouchEnd = useCallback(() => {
    setState((s) => ({ ...s, isHovered: false }));
  }, []);

  return {
    ...state,
    handlers: { onMouseMove, onMouseEnter, onMouseLeave, onTouchMove, onTouchEnd },
  } as const;
}
