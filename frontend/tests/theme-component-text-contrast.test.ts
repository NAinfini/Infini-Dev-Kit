import { describe, expect, it } from "vitest";

import { contrastRatio } from "../../utils/color";
import { composeMantineTheme } from "../theme/mantine/mantine-adapter";
import { getThemeSpec, listThemeIds } from "../theme/theme-specs";

const MIN_TEXT_CONTRAST = 4.5;

describe("theme component text contrast", () => {
  it("keeps filled button and segmented selected text readable", () => {
    for (const themeId of listThemeIds()) {
      const config = composeMantineTheme({ themeId });
      const buttonBg = config.token.colorPrimary as string;
      const buttonText = config.components.Button.colorTextLightSolid as string;
      const segmentedBg = config.components.Segmented.itemSelectedBg as string;
      const segmentedText = config.components.Segmented.itemSelectedColor as string;

      expect(contrastRatio(buttonBg, buttonText)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
      expect(contrastRatio(segmentedBg, segmentedText)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
    }
  });

  it("keeps navigation/link text readable against theme surfaces", () => {
    for (const themeId of listThemeIds()) {
      const theme = getThemeSpec(themeId);
      const config = composeMantineTheme({ themeId });
      const menuSelectedBg = config.components.Menu.itemSelectedBg as string;
      const menuSelectedText = config.components.Menu.itemSelectedColor as string;
      const linkColor = config.components.Typography.colorLink as string;

      expect(contrastRatio(menuSelectedBg, menuSelectedText)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
      expect(contrastRatio(theme.foundation.surface, linkColor)).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
    }
  });
});
