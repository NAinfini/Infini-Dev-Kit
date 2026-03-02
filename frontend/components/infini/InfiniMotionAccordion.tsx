import type { MotionAccordionProps } from "../../theme/motion-types";
import { MotionAccordion } from "../MotionAccordion";
import { useThemeDefaults } from "./use-theme-defaults";
import { MOTION_ACCORDION_DEFAULTS } from "./theme-defaults/motion-accordion";

export function InfiniMotionAccordion(props: MotionAccordionProps) {
  const resolved = useThemeDefaults(props, MOTION_ACCORDION_DEFAULTS);
  return <MotionAccordion {...resolved} />;
}
