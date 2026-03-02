import type { ReactNode } from "react";
import type { MotionToastContainerProps } from "../../theme/motion-types";
import { MotionToastContainer } from "../MotionToast";
import { useThemeDefaults } from "./use-theme-defaults";
import { MOTION_TOAST_DEFAULTS } from "./theme-defaults/motion-toast";

export function InfiniMotionToastContainer(props: MotionToastContainerProps & { children: ReactNode }) {
  const { children, ...rest } = props;
  const resolved = useThemeDefaults(rest, MOTION_TOAST_DEFAULTS);
  return <MotionToastContainer {...resolved}>{children}</MotionToastContainer>;
}

// Re-export the hook — it's context-based, works with either container
export { useMotionToast } from "../MotionToast";
