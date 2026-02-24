import type { ThemeId, ThemeSpec } from "./theme-types";

import { blackGoldTheme } from "./themes/black-gold";
import { chibiTheme } from "./themes/chibi";
import { cyberpunkTheme } from "./themes/cyberpunk";
import { defaultTheme } from "./themes/default";
import { neuBrutalismTheme } from "./themes/neu-brutalism";
import { redGoldTheme } from "./themes/red-gold";

export type {
  ThemeId,
  ThemePalette,
  ThemeTypography,
  ThemeFoundation,
  ThemeComponentProfile,
  ThemeDataUiProfile,
  ThemeOverlayProfile,
  ThemeMotion,
  ThemeSpec,
} from "./theme-types";

const THEME_SPECS: Record<ThemeId, ThemeSpec> = {
  default: defaultTheme,
  chibi: chibiTheme,
  cyberpunk: cyberpunkTheme,
  "neu-brutalism": neuBrutalismTheme,
  "black-gold": blackGoldTheme,
  "red-gold": redGoldTheme,
};

export function listThemeSpecs(): ThemeSpec[] {
  return Object.values(THEME_SPECS);
}

export function getThemeSpec(themeId: ThemeId): ThemeSpec {
  return THEME_SPECS[themeId];
}

export function resolveThemeSpec(themeId: string): ThemeSpec {
  if (themeId in THEME_SPECS) {
    return THEME_SPECS[themeId as ThemeId];
  }

  return THEME_SPECS.default;
}

export function listThemeIds(): ThemeId[] {
  return Object.keys(THEME_SPECS) as ThemeId[];
}
