import type { MotionAccordionProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const MOTION_ACCORDION_DEFAULTS: ThemeDefaultsMap<MotionAccordionProps> = {
  _base: { chevronPosition: "right", expandStyle: "height", activeHighlight: 0.05 },
  chibi: { expandStyle: "slide", activeHighlight: 0.08 },
  cyberpunk: { expandStyle: "fade", activeHighlight: 0.1 },
  "neu-brutalism": { chevronPosition: "left", expandStyle: "height", activeHighlight: 0 },
  "black-gold": { activeHighlight: 0.06 },
  "red-gold": { activeHighlight: 0.06 },
};
