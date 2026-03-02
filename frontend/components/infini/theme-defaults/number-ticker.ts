import type { NumberTickerProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const NUMBER_TICKER_DEFAULTS: ThemeDefaultsMap<NumberTickerProps> = {
  _base: { direction: "up", duration: 1.5 },
  chibi: { duration: 2.0 },
  cyberpunk: { duration: 0.8 },
  "neu-brutalism": { duration: 0.5 },
  "black-gold": { duration: 1.8 },
  "red-gold": { duration: 1.8 },
};
