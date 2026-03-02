import type { MotionBreadcrumbProps } from "../../theme/motion-types";
import { MotionBreadcrumb } from "../MotionBreadcrumb";
import { useThemeDefaults } from "./use-theme-defaults";
import { MOTION_BREADCRUMB_DEFAULTS } from "./theme-defaults/motion-breadcrumb";

export function InfiniMotionBreadcrumb(props: MotionBreadcrumbProps) {
  const resolved = useThemeDefaults(props, MOTION_BREADCRUMB_DEFAULTS);
  return <MotionBreadcrumb {...resolved} />;
}
