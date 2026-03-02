import type { MotionTooltipProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const MOTION_TOOLTIP_DEFAULTS: ThemeDefaultsMap<MotionTooltipProps> = {
  _base: { delay: 200, position: "top", entranceStyle: "fade" },
  chibi: { delay: 150, entranceStyle: "scale" },
  cyberpunk: { delay: 100, entranceStyle: "slide" },
  "neu-brutalism": { delay: 0, entranceStyle: "fade" },
  "black-gold": { delay: 300, entranceStyle: "scale" },
  "red-gold": { delay: 300, entranceStyle: "scale" },
};
