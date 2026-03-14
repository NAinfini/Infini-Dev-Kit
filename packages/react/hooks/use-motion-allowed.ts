import { useSyncExternalStore } from "react";

import type { EffectiveMotionMode } from "@infini-dev-kit/utils/motion";

function getMotionModeFromDOM(): EffectiveMotionMode {
  if (typeof document === "undefined") return "full";
  const domMode = (document.documentElement.dataset.motionMode as EffectiveMotionMode) ?? "full";
  if (domMode === "full" && typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "reduced";
  }
  return domMode;
}

function subscribeToMotionMode(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion-mode"] });
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => {
    observer.disconnect();
    mql.removeEventListener("change", callback);
  };
}

export function useEffectiveMotionMode(): EffectiveMotionMode {
  return useSyncExternalStore(subscribeToMotionMode, getMotionModeFromDOM, () => "full" as const);
}

export function useMotionAllowed(): boolean {
  return useEffectiveMotionMode() !== "off";
}

export function useFullMotion(): boolean {
  return useEffectiveMotionMode() === "full";
}
