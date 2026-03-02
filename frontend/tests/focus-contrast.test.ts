import { describe, expect, it } from "vitest";

import { contrastRatio } from "../../utils/color";
import { getThemeSpec, listThemeIds } from "../theme/theme-specs";

const FOCUS_INNER_COLORS = {
  default: "#2563EB",
  chibi: "#4B66E8",
  cyberpunk: "#00FFD5",
  "neu-brutalism": "#000000",
  "black-gold": "#D4AF37",
  "red-gold": "#D4AF37",
} as const;

describe("focus indicator contrast", () => {
  it("keeps focus inner indicator at or above WCAG 3:1 against themed backgrounds", () => {
    for (const themeId of listThemeIds()) {
      const theme = getThemeSpec(themeId);
      const focusInner = FOCUS_INNER_COLORS[themeId];
      expect(contrastRatio(theme.foundation.background, focusInner)).toBeGreaterThanOrEqual(3);
    }
  });
});
