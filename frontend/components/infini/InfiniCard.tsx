import { forwardRef } from "react";

import type { InfiniCardProps } from "./dispatch-types";
import { useCardDispatch } from "./use-card-dispatch";
import { ChibiCard } from "../cards/ChibiCard";
import { CyberpunkCard } from "../cards/CyberpunkCard";
import { GlowCard } from "../cards/GlowCard";
import { NeuBrutalCard } from "../cards/NeuBrutalCard";

/**
 * Unified card that auto-dispatches to the right card variant
 * based on the active theme.
 *
 * Consumers write `<InfiniCard>content</InfiniCard>` —
 * each theme gets a unique card experience:
 *   cyberpunk     → neon HUD + glitch-on-hover
 *   chibi         → kawaii sticker — soft shadow, gentle float
 *   neu-brutalism → hard shadow sticker-stack
 *   default       → spotlight glow
 *   black-gold    → laser crosshair glow
 *   red-gold      → cosmic particle nebula glow
 */
export const InfiniCard = forwardRef<HTMLDivElement, InfiniCardProps>(
  function InfiniCard({ children, className, onClick, style, interactive = true, padding, overrides, ...rest }, ref) {
  const dispatch = useCardDispatch();

  const paddedChildren = padding != null
    ? <div style={{ padding }}>{children}</div>
    : children;

  switch (dispatch) {
    case "cyberpunk":
      return (
        <CyberpunkCard ref={ref} className={className} onClick={onClick} style={style} interactive={interactive} {...rest} {...overrides?.cyberpunk}>
          {paddedChildren}
        </CyberpunkCard>
      );

    case "chibi":
      return (
        <ChibiCard ref={ref} className={className} onClick={onClick} style={style} interactive={interactive} {...rest} {...overrides?.chibi}>
          {paddedChildren}
        </ChibiCard>
      );

    case "neu-brutal":
      return (
        <NeuBrutalCard ref={ref} className={className} onClick={onClick} style={style} interactive={interactive} {...rest} {...overrides?.neuBrutal}>
          {paddedChildren}
        </NeuBrutalCard>
      );

    case "glow-laser":
      return (
        <GlowCard ref={ref} className={className} variant="laser" spinSpeed={0.15} onClick={onClick} style={style} interactive={interactive} {...rest} {...overrides?.glow}>
          {paddedChildren}
        </GlowCard>
      );

    case "glow-cosmic":
      return (
        <GlowCard ref={ref} className={className} variant="cosmic" onClick={onClick} style={style} interactive={interactive} {...rest} {...overrides?.glow}>
          {paddedChildren}
        </GlowCard>
      );

    case "glow":
    default:
      return (
        <GlowCard ref={ref} className={className} onClick={onClick} style={style} interactive={interactive} {...rest} {...overrides?.glow}>
          {paddedChildren}
        </GlowCard>
      );
  }
  },
);
