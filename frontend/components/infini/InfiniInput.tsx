import type { InfiniInputProps } from "./dispatch-types";
import { MotionInputFrame } from "../MotionInputFrame";

/**
 * Unified input frame — thin wrapper around MotionInputFrame for
 * API consistency with the `<Infini*>` naming convention.
 */
export function InfiniInput(props: InfiniInputProps) {
  return <MotionInputFrame {...props} />;
}
