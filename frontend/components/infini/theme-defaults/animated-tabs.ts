import type { AnimatedTabsProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const ANIMATED_TABS_DEFAULTS: ThemeDefaultsMap<AnimatedTabsProps> = {
  _base: { contentTransition: "fade" },
  chibi: { contentTransition: "slide" },
  cyberpunk: { contentTransition: "slide" },
  "neu-brutalism": { contentTransition: "none" },
  "black-gold": { contentTransition: "fade" },
  "red-gold": { contentTransition: "fade" },
};
