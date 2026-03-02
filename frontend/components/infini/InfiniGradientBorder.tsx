import type { GradientBorderProps } from "../../theme/motion-types";
import { GradientBorder } from "../GradientBorder";
import { useThemeDefaults } from "./use-theme-defaults";
import { GRADIENT_BORDER_DEFAULTS } from "./theme-defaults/gradient-border";

export function InfiniGradientBorder(props: GradientBorderProps) {
  const resolved = useThemeDefaults(props, GRADIENT_BORDER_DEFAULTS);
  return <GradientBorder {...resolved} />;
}
