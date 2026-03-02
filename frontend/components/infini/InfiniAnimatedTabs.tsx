import type { AnimatedTabsProps } from "../../theme/motion-types";
import { AnimatedTabs } from "../AnimatedTabs";
import { useThemeDefaults } from "./use-theme-defaults";
import { ANIMATED_TABS_DEFAULTS } from "./theme-defaults/animated-tabs";

export function InfiniAnimatedTabs(props: AnimatedTabsProps) {
  const resolved = useThemeDefaults(props, ANIMATED_TABS_DEFAULTS);
  return <AnimatedTabs {...resolved} />;
}
