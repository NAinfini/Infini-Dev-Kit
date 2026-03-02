import type { ProgressRingProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const PROGRESS_RING_DEFAULTS: ThemeDefaultsMap<ProgressRingProps> = {
  _base: { glow: false, strokeWidth: 6, size: 80 },
  chibi: { strokeWidth: 8, glow: true },
  cyberpunk: { glow: true },
  "neu-brutalism": { strokeWidth: 8 },
  "black-gold": { glow: true, strokeWidth: 4 },
  "red-gold": { glow: true, strokeWidth: 4 },
};
