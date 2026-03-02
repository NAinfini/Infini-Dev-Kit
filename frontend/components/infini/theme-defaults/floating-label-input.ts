import type { FloatingLabelInputProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const FLOATING_LABEL_INPUT_DEFAULTS: ThemeDefaultsMap<FloatingLabelInputProps> = {
  _base: { focusGlow: false, shakeOnError: true },
  chibi: { focusGlow: true, shakeOnError: true },
  cyberpunk: { focusGlow: true, focusGlowColor: "rgba(0,255,170,0.35)" },
  "neu-brutalism": { focusGlow: false, shakeOnError: false },
  "black-gold": { focusGlow: true, focusGlowColor: "rgba(212,175,55,0.3)" },
  "red-gold": { focusGlow: true, focusGlowColor: "rgba(212,175,55,0.25)" },
};
