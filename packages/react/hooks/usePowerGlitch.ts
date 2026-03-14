import { useCallback, useEffect, useRef, type MutableRefObject } from "react";

import {
  PowerGlitch,
  type GlitchPartialOptions,
  type GlitchResult,
} from "../components/effects/animation/PowerGlitch";

export interface UsePowerGlitchReturn<T extends HTMLElement> {
  ref: MutableRefObject<T | null>;
  startGlitch: () => void;
  stopGlitch: () => void;
}

function cleanupLayerContainer(container: HTMLElement | null): void {
  if (!container) {
    return;
  }

  container.onmouseenter = null;
  container.onmouseleave = null;
  container.onclick = null;
  container.removeAttribute("data-glitched");

  Array.from(container.getAnimations()).forEach((animation) => {
    animation.cancel();
  });

  if (container.firstElementChild instanceof HTMLElement) {
    container.firstElementChild.getAnimations().forEach((animation) => {
      animation.cancel();
    });
  }

  while (container.children.length > 1) {
    container.removeChild(container.children[1]);
  }
}

/**
 * React-safe wrapper around the headless `PowerGlitch` API.
 * Attach `ref` to a dedicated layer container whose first child is the element to glitch.
 * The hook forces `createContainers: false` so PowerGlitch does not restructure React-managed DOM.
 */
export function usePowerGlitch<T extends HTMLElement = HTMLDivElement>(
  options: GlitchPartialOptions = {},
): UsePowerGlitchReturn<T> {
  const ref = useRef<T | null>(null);
  const controlsRef = useRef<GlitchResult | null>(null);
  const optionsKey = JSON.stringify(options);

  useEffect(() => {
    const container = ref.current;
    if (!container || typeof window === "undefined") {
      return;
    }

    cleanupLayerContainer(container);
    controlsRef.current = PowerGlitch.glitch(container, {
      ...options,
      createContainers: false,
    });

    return () => {
      controlsRef.current?.stopGlitch();
      controlsRef.current = null;
      cleanupLayerContainer(container);
    };
  }, [optionsKey]);

  const startGlitch = useCallback(() => {
    controlsRef.current?.startGlitch();
  }, []);

  const stopGlitch = useCallback(() => {
    controlsRef.current?.stopGlitch();
  }, []);

  return {
    ref,
    startGlitch,
    stopGlitch,
  };
}
