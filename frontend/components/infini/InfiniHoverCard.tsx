import type { HoverCardProps } from "../../theme/motion-types";
import { HoverCard } from "../HoverCard";
import { useThemeDefaults } from "./use-theme-defaults";
import { HOVER_CARD_DEFAULTS } from "./theme-defaults/hover-card";

export function InfiniHoverCard(props: HoverCardProps) {
  const resolved = useThemeDefaults(props, HOVER_CARD_DEFAULTS);
  return <HoverCard {...resolved} />;
}
