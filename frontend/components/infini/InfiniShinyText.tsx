import type { ShinyTextProps } from "../../theme/motion-types";
import { ShinyText } from "../ShinyText";
import { useThemeDefaults } from "./use-theme-defaults";
import { SHINY_TEXT_DEFAULTS } from "./theme-defaults/shiny-text";

export function InfiniShinyText(props: ShinyTextProps) {
  const resolved = useThemeDefaults(props, SHINY_TEXT_DEFAULTS);
  return <ShinyText {...resolved} />;
}
