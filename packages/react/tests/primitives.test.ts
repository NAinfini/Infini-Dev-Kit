import { describe, expect, it } from "vitest";

import { buildScopedCssVariables, getThemeSpec } from "@infini-dev-kit/theme-core";

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
    expect(vars["--infini-font-mono"]).toContain("monospace");
    expect(vars["--infini-font-display-weight"]).toBe("700");
  });

  it("surfaces foundation border style and theme typography sizes", () => {
    const theme = getThemeSpec("default");
    const vars = buildScopedCssVariables("default", ".scope").variables;

    expect(vars["--infini-border-style"]).toBe(theme.foundation.borderStyle);
    expect(vars["--infini-text-xs"]).toBe(theme.typography.sizes.xs);
    expect(vars["--infini-text-sm"]).toBe(theme.typography.sizes.sm);
    expect(vars["--infini-text-base"]).toBe(theme.typography.sizes.md);
    expect(vars["--infini-text-lg"]).toBe(theme.typography.sizes.lg);
    expect(vars["--infini-text-xl"]).toBe(theme.typography.sizes.xl);
    expect(vars["--infini-text-2xl"]).toBe(theme.typography.sizes.xxl);
    expect(vars["--infini-text-3xl"]).toBe(theme.typography.sizes.display);
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
