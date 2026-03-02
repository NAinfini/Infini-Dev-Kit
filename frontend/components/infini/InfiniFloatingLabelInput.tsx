import type { FloatingLabelInputProps } from "../../theme/motion-types";
import { FloatingLabelInput } from "../FloatingLabelInput";
import { useThemeDefaults } from "./use-theme-defaults";
import { FLOATING_LABEL_INPUT_DEFAULTS } from "./theme-defaults/floating-label-input";

export function InfiniFloatingLabelInput(props: FloatingLabelInputProps) {
  const resolved = useThemeDefaults(props, FLOATING_LABEL_INPUT_DEFAULTS);
  return <FloatingLabelInput {...resolved} />;
}
