import type { MotionStepperProps } from "../../theme/motion-types";
import { MotionStepper } from "../MotionStepper";
import { useThemeDefaults } from "./use-theme-defaults";
import { MOTION_STEPPER_DEFAULTS } from "./theme-defaults/motion-stepper";

export function InfiniMotionStepper(props: MotionStepperProps) {
  const resolved = useThemeDefaults(props, MOTION_STEPPER_DEFAULTS);
  return <MotionStepper {...resolved} />;
}
