import type { MotionStepperProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const MOTION_STEPPER_DEFAULTS: ThemeDefaultsMap<MotionStepperProps> = {
  _base: { orientation: "horizontal", allowStepClick: true, completedIcon: "check", animatedConnector: true, activeGlow: false },
  chibi: { completedIcon: "filled", activeGlow: true },
  cyberpunk: { completedIcon: "number", activeGlow: true },
  "neu-brutalism": { animatedConnector: false, completedIcon: "filled", activeGlow: false },
  "black-gold": { activeGlow: true },
  "red-gold": { activeGlow: true },
};
