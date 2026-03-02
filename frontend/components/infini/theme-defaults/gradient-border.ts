import type { GradientBorderProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const GRADIENT_BORDER_DEFAULTS: ThemeDefaultsMap<GradientBorderProps> = {
  _base: { animated: true, borderWidth: 2, duration: 3 },
  chibi: { borderWidth: 3, duration: 4 },
  cyberpunk: { duration: 1.5 },
  "neu-brutalism": { animated: false, borderWidth: 4 },
  "black-gold": { colors: ["#E5C04A", "#F0D580", "#CCA84A", "#E5C04A"], duration: 5 },
  "red-gold": { colors: ["#D4AF37", "#ED2939", "#D4AF37", "#ED2939"], duration: 4.5 },
};
