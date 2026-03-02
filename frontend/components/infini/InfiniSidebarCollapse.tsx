import type { SidebarCollapseProps } from "../../theme/motion-types";
import { SidebarCollapse } from "../SidebarCollapse";
import { useThemeDefaults } from "./use-theme-defaults";
import { SIDEBAR_COLLAPSE_DEFAULTS } from "./theme-defaults/sidebar-collapse";

export function InfiniSidebarCollapse(props: SidebarCollapseProps) {
  const resolved = useThemeDefaults(props, SIDEBAR_COLLAPSE_DEFAULTS);
  return <SidebarCollapse {...resolved} />;
}
