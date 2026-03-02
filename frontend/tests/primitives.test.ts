import { describe, expect, it } from "vitest";

import { buildScopedCssVariables } from "../theme/mantine/mantine-variables";
import { getThemeSpec } from "../theme/theme-specs";

describe("scoped variable contract", () => {
  it("exposes depth values from theme spec", () => {
    const cyberpunk = getThemeSpec("cyberpunk");
    const vars = buildScopedCssVariables("cyberpunk", ".scope").variables;

    expect(vars["--infini-depth-button"]).toBe(cyberpunk.depth.buttonShadow);
    expect(vars["--infini-depth-card"]).toBe(cyberpunk.depth.cardShadow);
    expect(vars["--infini-depth-dropdown"]).toBe(cyberpunk.depth.dropdownShadow);
  });

  it("adds text and typography variables", () => {
    const blackGold = getThemeSpec("black-gold");
    const vars = buildScopedCssVariables("black-gold", ".scope").variables;

    expect(vars["--infini-color-text"]).toBe(blackGold.palette.text);
    expect(vars["--infini-color-text-muted"]).toBe(blackGold.palette.textMuted);
    expect(vars["--infini-font-mono"]).toContain("JetBrains Mono");
    expect(vars["--infini-font-display-weight"]).toBe("700");
  });

  it("panel clip is none for all themes (removed to avoid badge clipping)", () => {
    const cyber = buildScopedCssVariables("cyberpunk", ".scope").variables;
    const blackGold = buildScopedCssVariables("black-gold", ".scope").variables;
    const redGold = buildScopedCssVariables("red-gold", ".scope").variables;

    expect(cyber["--infini-panel-clip"]).toBe("none");
    expect(blackGold["--infini-panel-clip"]).toBe("none");
    expect(redGold["--infini-panel-clip"]).toBe("none");
  });
});
