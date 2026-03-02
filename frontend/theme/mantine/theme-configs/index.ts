import type { MantineThemeOverride } from "@mantine/core";
import type { ThemeId } from "../../theme-types";

import { blackGoldMantineTheme } from "./black-gold";
import { chibiMantineTheme } from "./chibi";
import { cyberpunkMantineTheme } from "./cyberpunk";
import { defaultMantineTheme } from "./default";
import { neuBrutalismMantineTheme } from "./neu-brutalism";
import { redGoldMantineTheme } from "./red-gold";

export const mantineThemes: Record<ThemeId, MantineThemeOverride> = {
  default: defaultMantineTheme,
  chibi: chibiMantineTheme,
  cyberpunk: cyberpunkMantineTheme,
  "neu-brutalism": neuBrutalismMantineTheme,
  "black-gold": blackGoldMantineTheme,
  "red-gold": redGoldMantineTheme,
};

export function getMantineTheme(themeId: ThemeId): MantineThemeOverride {
  return mantineThemes[themeId] || defaultMantineTheme;
}

export * from "./black-gold";
export * from "./chibi";
export * from "./cyberpunk";
export * from "./default";
export * from "./neu-brutalism";
export * from "./red-gold";
