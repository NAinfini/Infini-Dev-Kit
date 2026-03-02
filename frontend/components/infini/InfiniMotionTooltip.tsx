import type { MotionTooltipProps } from "../../theme/motion-types";
import { MotionTooltip } from "../MotionTooltip";
import { useThemeDefaults } from "./use-theme-defaults";
import { MOTION_TOOLTIP_DEFAULTS } from "./theme-defaults/motion-tooltip";

export function InfiniMotionTooltip(props: MotionTooltipProps) {
  const resolved = useThemeDefaults(props, MOTION_TOOLTIP_DEFAULTS);
  return <MotionTooltip {...resolved} />;
}
