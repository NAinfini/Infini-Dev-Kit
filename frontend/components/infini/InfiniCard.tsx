import type { InfiniCardProps } from "./dispatch-types";
import { useCardDispatch } from "./use-card-dispatch";
import { TiltCard } from "../TiltCard";
import { CyberpunkCard } from "../CyberpunkCard";
import { GlowCard } from "../GlowCard";

/**
 * Unified card that auto-dispatches to TiltCard, CyberpunkCard, or GlowCard
 * based on the active theme.
 *
 * Consumers write `<InfiniCard>content</InfiniCard>` —
 * cyberpunk gets neon HUD, chibi gets 3D tilt, glass themes get spotlight glow.
 */
export function InfiniCard({ children, className, overrides }: InfiniCardProps) {
  const dispatch = useCardDispatch();

  switch (dispatch) {
    case "cyberpunk":
      return (
        <CyberpunkCard className={className} {...overrides?.cyberpunk}>
          {children}
        </CyberpunkCard>
      );

    case "tilt":
      return (
        <TiltCard className={className} {...overrides?.tilt}>
          {children}
        </TiltCard>
      );

    case "glow":
      return (
        <GlowCard className={className} {...overrides?.glow}>
          {children}
        </GlowCard>
      );
  }
}
