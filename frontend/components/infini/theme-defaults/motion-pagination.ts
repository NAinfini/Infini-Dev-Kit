import type { MotionPaginationProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const MOTION_PAGINATION_DEFAULTS: ThemeDefaultsMap<MotionPaginationProps> = {
  _base: { siblings: 1, shape: "rounded", hoverScale: 1.05, activeGlow: false },
  chibi: { shape: "pill", hoverScale: 1.1, activeGlow: true },
  cyberpunk: { shape: "square", hoverScale: 1.08, activeGlow: true },
  "neu-brutalism": { shape: "square", hoverScale: 1, activeGlow: false },
  "black-gold": { shape: "rounded", activeGlow: true },
  "red-gold": { shape: "rounded", activeGlow: true },
};
