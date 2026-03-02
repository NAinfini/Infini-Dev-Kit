import { describe, expect, it } from "vitest";

import { composeMantineTheme } from "../theme/mantine/mantine-adapter";
import { getThemeSpec, listThemeIds } from "../theme/theme-specs";

describe("theme depth to token mapping", () => {
  it("maps depth button shadows into Button tokens", () => {
    for (const themeId of listThemeIds()) {
      const theme = getThemeSpec(themeId);
      const config = composeMantineTheme({ themeId });

      expect(config.components.Button.boxShadow).toBe(theme.depth.buttonShadow);
      expect(config.components.Button.defaultShadow).toBe(theme.depth.buttonShadow);
      expect(config.components.Button.primaryShadow).toBe(theme.depth.buttonShadow);
    }
  });

  it("maps depth dropdown and switch shadows into component tokens", () => {
    for (const themeId of listThemeIds()) {
      const theme = getThemeSpec(themeId);
      const config = composeMantineTheme({ themeId });

      expect(config.components.Select.dropdownShadow).toBe(theme.depth.dropdownShadow);
      expect(config.components.Switch.handleShadow).toBe(theme.depth.switchShadow);
    }
  });

  it("uses theme border width as shared line width source", () => {
    const brutal = composeMantineTheme({ themeId: "neu-brutalism" });

    expect(brutal.token.lineWidth).toBe(4);
    expect(brutal.components.Card.lineWidth).toBe(4);
    expect(brutal.components.Tag.lineWidth).toBe(4);
  });
});
