import type { ParticleEffectProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const PARTICLE_EFFECT_DEFAULTS: ThemeDefaultsMap<ParticleEffectProps> = {
  _base: { preset: "confetti", count: 30 },
  chibi: { preset: "sparkle", count: 20, gravity: 0.5 },
  cyberpunk: { preset: "firework", count: 40 },
  "neu-brutalism": { count: 10, duration: 1 },
  "black-gold": { preset: "sparkle", count: 15, gravity: 0.8, colors: ["#E5C04A", "#F0D580", "#CCA84A"] },
  "red-gold": { preset: "sparkle", count: 15, gravity: 0.8, colors: ["#D4AF37", "#ED2939", "#F4DA84"] },
};
