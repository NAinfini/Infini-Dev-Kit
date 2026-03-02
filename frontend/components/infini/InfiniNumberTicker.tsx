import type { NumberTickerProps } from "../../theme/motion-types";
import { NumberTicker } from "../NumberTicker";
import { useThemeDefaults } from "./use-theme-defaults";
import { NUMBER_TICKER_DEFAULTS } from "./theme-defaults/number-ticker";

export function InfiniNumberTicker(props: NumberTickerProps) {
  const resolved = useThemeDefaults(props, NUMBER_TICKER_DEFAULTS);
  return <NumberTicker {...resolved} />;
}
