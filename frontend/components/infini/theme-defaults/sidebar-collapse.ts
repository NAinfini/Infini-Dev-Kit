import type { SidebarCollapseProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const SIDEBAR_COLLAPSE_DEFAULTS: ThemeDefaultsMap<SidebarCollapseProps> = {
  _base: { expandedWidth: 260, collapsedWidth: 60, togglePosition: "top", collapseStyle: "width", borderGlow: false },
  chibi: { collapsedWidth: 56, collapseStyle: "slide", borderGlow: true },
  cyberpunk: { expandedWidth: 240, collapseStyle: "fade", borderGlow: true },
  "neu-brutalism": { collapseStyle: "width", borderGlow: false },
  "black-gold": { expandedWidth: 280, borderGlow: true },
  "red-gold": { expandedWidth: 280, borderGlow: true },
};
