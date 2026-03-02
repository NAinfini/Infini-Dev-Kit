import type { MotionToastContainerProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const MOTION_TOAST_DEFAULTS: ThemeDefaultsMap<MotionToastContainerProps> = {
  _base: { position: "top-right", entranceFrom: "right" },
  chibi: { position: "top-center", entranceFrom: "top" },
  cyberpunk: { position: "bottom-right", entranceFrom: "bottom" },
  "neu-brutalism": { position: "top-left", entranceFrom: "left" },
  "black-gold": { position: "top-right", entranceFrom: "right" },
  "red-gold": { position: "top-right", entranceFrom: "right" },
};
