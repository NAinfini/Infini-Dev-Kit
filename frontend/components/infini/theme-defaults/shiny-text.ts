import type { ShinyTextProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const SHINY_TEXT_DEFAULTS: ThemeDefaultsMap<ShinyTextProps> = {
  _base: { animated: true, duration: 3, shineWidth: 30 },
  chibi: { duration: 2, shineWidth: 40 },
  cyberpunk: { duration: 1.5, shineWidth: 20 },
  "neu-brutalism": { animated: false },
  "black-gold": { shineColor: "rgba(212,175,55,0.6)", duration: 4, shineWidth: 25 },
  "red-gold": { shineColor: "rgba(212,175,55,0.5)", duration: 3.5, shineWidth: 25 },
};
