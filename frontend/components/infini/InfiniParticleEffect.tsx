import type { ParticleEffectProps } from "../../theme/motion-types";
import { ParticleEffect } from "../ParticleEffect";
import { useThemeDefaults } from "./use-theme-defaults";
import { PARTICLE_EFFECT_DEFAULTS } from "./theme-defaults/particle-effect";

export function InfiniParticleEffect(props: ParticleEffectProps) {
  const resolved = useThemeDefaults(props, PARTICLE_EFFECT_DEFAULTS);
  return <ParticleEffect {...resolved} />;
}
