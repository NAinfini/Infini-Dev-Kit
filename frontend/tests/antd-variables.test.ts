import { describe, expect, it } from "vitest";

import { buildScopedCssVariables, buildScopedThemeClass, sanitizeScope } from "../antd-variables";

describe("antd variables", () => {
  it("builds scoped css variables for a theme", () => {
    const result = buildScopedCssVariables("chibi", ".theme-scope");

    expect(result.selector).toBe(".theme-scope");
    expect(result.variables["--infini-color-primary"]).toBe("#FF7EB6");
    expect(result.variables["--infini-shadow-hover"]).toBeTruthy();
    expect(result.variables["--infini-motion-enter"]).toMatch(/ms$/);
    expect(result.variables["--infini-bg-pattern"]).toContain("gradient");
  });

  it("builds predictable scope classes", () => {
    expect(buildScopedThemeClass("Theme Portal")).toBe("infini-theme-scope-theme-portal");
    expect(buildScopedThemeClass("  API__Scope  ")).toBe("infini-theme-scope-api-scope");
  });

  it("sanitizes scope values", () => {
    expect(sanitizeScope("  Mixed Value  ")).toBe("mixed-value");
    expect(sanitizeScope("Weird@@Name!!")).toBe("weird-name");
  });
});
