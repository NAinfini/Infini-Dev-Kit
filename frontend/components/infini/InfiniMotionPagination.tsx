import type { MotionPaginationProps } from "../../theme/motion-types";
import { MotionPagination } from "../MotionPagination";
import { useThemeDefaults } from "./use-theme-defaults";
import { MOTION_PAGINATION_DEFAULTS } from "./theme-defaults/motion-pagination";

export function InfiniMotionPagination(props: MotionPaginationProps) {
  const resolved = useThemeDefaults(props, MOTION_PAGINATION_DEFAULTS);
  return <MotionPagination {...resolved} />;
}
