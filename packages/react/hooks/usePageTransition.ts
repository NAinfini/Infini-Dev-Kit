import { useEffect, useRef, useState } from "react";

export type PageTransitionState = "entering" | "entered" | "exiting" | "exited";

export type UsePageTransitionOptions = {
  duration?: number;
  onEntered?: () => void;
  onExited?: () => void;
};

export function usePageTransition({
  duration = 300,
  onEntered,
  onExited,
}: UsePageTransitionOptions = {}) {
  const [state, setState] = useState<PageTransitionState>("entering");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setState("entering");
    timeoutRef.current = setTimeout(() => {
      setState("entered");
      onEntered?.();
    }, duration);
    return () => clearTimeout(timeoutRef.current);
  }, [duration, onEntered]);

  const triggerExit = (callback?: () => void) => {
    setState("exiting");
    timeoutRef.current = setTimeout(() => {
      setState("exited");
      onExited?.();
      callback?.();
    }, duration);
  };

  const style: React.CSSProperties = {
    transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
    opacity: state === "entered" ? 1 : 0,
    transform: state === "entering"
      ? "translateY(8px)"
      : state === "exiting"
        ? "translateY(-8px)"
        : "translateY(0)",
  };

  return { state, style, triggerExit };
}
