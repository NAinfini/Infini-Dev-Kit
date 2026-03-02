import type { MotionBreadcrumbProps } from "../../../theme/motion-types";
import type { ThemeDefaultsMap } from "../use-theme-defaults";

export const MOTION_BREADCRUMB_DEFAULTS: ThemeDefaultsMap<MotionBreadcrumbProps> = {
  _base: { separator: "/" },
  chibi: { separator: ">" },
  cyberpunk: { separator: "//" },
  "neu-brutalism": { separator: "|" },
  "black-gold": { separator: ">" },
  "red-gold": { separator: ">" },
};
