import type { ProgressRingProps } from "../../theme/motion-types";
import { ProgressRing } from "../ProgressRing";
import { useThemeDefaults } from "./use-theme-defaults";
import { PROGRESS_RING_DEFAULTS } from "./theme-defaults/progress-ring";

export function InfiniProgressRing(props: ProgressRingProps) {
  const resolved = useThemeDefaults(props, PROGRESS_RING_DEFAULTS);
  return <ProgressRing {...resolved} />;
}
