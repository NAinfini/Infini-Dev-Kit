import { describe, expect, it } from "vitest";

import { contrastRatio } from "../../utils/color";

import { composeMantineTheme } from "../theme/mantine/mantine-adapter";
import { getThemeSpec, listThemeIds } from "../theme/theme-specs";

describe("theme contrast", () => {
  it("keeps foundational text readable", () => {
    for (const themeId of listThemeIds()) {
      const theme = getThemeSpec(themeId);
      expect(contrastRatio(theme.foundation.background, theme.palette.text)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(theme.foundation.background, theme.palette.textMuted)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("keeps border colors visible against surfaces", () => {
    for (const themeId of listThemeIds()) {
      const theme = getThemeSpec(themeId);
      expect(contrastRatio(theme.foundation.surface, theme.foundation.borderColor)).toBeGreaterThanOrEqual(1.8);
    }
  });

  it("ensures semantic colors remain visible on themed surfaces", () => {
    for (const themeId of listThemeIds()) {
      const theme = getThemeSpec(themeId);
      const config = composeMantineTheme({ themeId });
      const surface = theme.foundation.surface;

      expect(contrastRatio(surface, config.token.colorInfo as string)).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(surface, config.token.colorSuccess as string)).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(surface, config.token.colorWarning as string)).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(surface, config.token.colorError as string)).toBeGreaterThanOrEqual(3);
    }
  });
});
