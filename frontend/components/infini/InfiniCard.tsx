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
export function InfiniCard({ children, className, onClick, style, interactive = true, overrides }: InfiniCardProps) {
  const dispatch = useCardDispatch();

  switch (dispatch) {
    case "cyberpunk":
      return (
        <CyberpunkCard className={className} onClick={onClick} style={style} interactive={interactive} {...overrides?.cyberpunk}>
          {children}
        </CyberpunkCard>
      );

    case "chibi":
      return (
        <ChibiCard className={className} onClick={onClick} style={style} interactive={interactive} {...overrides?.chibi}>
          {children}
        </ChibiCard>
      );

    case "neu-brutal":
      return (
        <NeuBrutalCard className={className} onClick={onClick} style={style} interactive={interactive} {...overrides?.neuBrutal}>
          {children}
        </NeuBrutalCard>
      );

    case "glow-laser":
      return (
        <GlowCard className={className} variant="laser" spinSpeed={0.15} onClick={onClick} style={style} interactive={interactive} {...overrides?.glow}>
          {children}
        </GlowCard>
      );

    case "glow-cosmic":
      return (
        <GlowCard className={className} variant="cosmic" onClick={onClick} style={style} interactive={interactive} {...overrides?.glow}>
          {children}
        </GlowCard>
      );

    case "glow":
    default:
      return (
        <GlowCard className={className} onClick={onClick} style={style} interactive={interactive} {...overrides?.glow}>
          {children}
        </GlowCard>
      );
  }
}
