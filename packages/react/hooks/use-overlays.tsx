import { createElement, useCallback, useRef, useState, type MouseEvent, type ReactNode } from "react";

import type { OverlayConfig, OverlayContext } from "../motion-types";
import { useFullMotion, useMotionAllowed } from "./use-motion-allowed";

import { SpectrumBorderLayer } from "../components/effects/composable/overlays/spectrum-border";
import { LiquidFillLayer } from "../components/effects/composable/overlays/liquid-fill";
import { ShimmerSweepLayer } from "../components/effects/composable/overlays/shimmer-sweep";
import { SpotlightGlowLayer } from "../components/effects/composable/overlays/spotlight-glow";
import { LaserGlowLayer } from "../components/effects/composable/overlays/laser-glow";
import { CosmicGlowLayer } from "../components/effects/composable/overlays/cosmic-glow";
import { GlitchGlowLayer } from "../components/effects/composable/overlays/glitch-glow";
import { NeonScanlinesLayer } from "../components/effects/composable/overlays/neon-scanlines";
import { RippleLayer, type RippleOverlayState } from "../components/effects/composable/overlays/ripple";
import { DirectionalRevealLayer } from "../components/effects/composable/overlays/directional-reveal";

export type { RippleOverlayState };

/** Props every overlay layer component receives from the host */
export interface OverlayLayerProps {
  ctx: OverlayContext;
  fullMotion: boolean;
  motionAllowed: boolean;
}

export interface UseOverlaysResult {
  /** Decoration nodes to render inside the host (before content, zIndex 0) */
  decorations: ReactNode;
  /** Mouse/touch handlers to merge onto the host element */
  handlers: {
    onMouseMove?: (e: MouseEvent<HTMLElement>) => void;
    onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
  };
}

const EMPTY: UseOverlaysResult = { decorations: null, handlers: {} };

/* eslint-disable @typescript-eslint/no-explicit-any -- discriminated union dispatch */
const LAYER_MAP: Record<string, React.ComponentType<any>> = {
  "spectrum-border": SpectrumBorderLayer,
  "liquid-fill": LiquidFillLayer,
  "shimmer-sweep": ShimmerSweepLayer,
  "spotlight-glow": SpotlightGlowLayer,
  "laser-glow": LaserGlowLayer,
  "cosmic-glow": CosmicGlowLayer,
  "glitch-glow": GlitchGlowLayer,
  "neon-scanlines": NeonScanlinesLayer,
  "ripple": RippleLayer,
  "directional-reveal": DirectionalRevealLayer,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Core overlay engine. Accepts an array of OverlayConfig, manages shared
 * hover/mouse state, and returns decoration nodes + handlers for the host.
 */
export function useOverlays(configs?: OverlayConfig[]): UseOverlaysResult {
  const motionAllowed = useMotionAllowed();
  const fullMotion = useFullMotion();
  const [hovered, setHovered] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  // Ripple state (click-driven)
  const [ripples, setRipples] = useState<RippleOverlayState[]>([]);
  const rippleIdRef = useRef(0);

  const onMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
  }, []);

  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);

  const onClick = useCallback((e: MouseEvent<HTMLElement>) => {
    if (!motionAllowed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rippleIdRef.current += 1;
    const id = rippleIdRef.current;
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  }, [motionAllowed]);

  if (!configs?.length) return EMPTY;

  const ctx: OverlayContext = { hovered, mouseX, mouseY };
  const needsMouse = configs.some((c) =>
    c.effect === "spotlight-glow" || c.effect === "laser-glow" ||
    c.effect === "cosmic-glow" || c.effect === "glitch-glow"
  );
  const needsClick = configs.some((c) => c.effect === "ripple");

  const nodes: ReactNode[] = configs.map((config, i) => {
    const Layer = LAYER_MAP[config.effect];
    if (!Layer) return null;
    const extra = config.effect === "ripple" ? { ripples } : {};
    return createElement(Layer, {
      key: `overlay-${config.effect}-${i}`,
      ...config,
      ctx,
      fullMotion,
      motionAllowed,
      ...extra,
    });
  });

  return {
    decorations: <>{nodes}</>,
    handlers: {
      onMouseEnter,
      onMouseLeave,
      ...(needsMouse ? { onMouseMove } : {}),
      ...(needsClick ? { onClick } : {}),
    },
  };
}
