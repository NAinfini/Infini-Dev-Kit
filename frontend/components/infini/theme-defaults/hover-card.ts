import type { HoverCardProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const HOVER_CARD_DEFAULTS: ThemeDefaultsMap<HoverCardProps> = {
  _base: { delay: 300, position: "bottom" },
  chibi: { delay: 200 },
  cyberpunk: { delay: 150, width: 320 },
  "neu-brutalism": { delay: 100 },
  "black-gold": { delay: 400, width: 300 },
  "red-gold": { delay: 400, width: 300 },
};
