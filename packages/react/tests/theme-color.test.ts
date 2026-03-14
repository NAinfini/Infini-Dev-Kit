import { afterEach, describe, expect, it, vi } from "vitest";

import { resolveColorValue } from "../utils/theme-color";

describe("theme-color resolution", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves CSS variable colors from document styles", () => {
    vi.stubGlobal("document", { documentElement: {} });
    vi.stubGlobal("getComputedStyle", () => ({
      getPropertyValue: (name: string) => (name === "--infini-button-bg-active" ? "#ED2939" : ""),
    }));

    expect(resolveColorValue("var(--infini-button-bg-active)")).toBe("#ED2939");
  });

  it("uses current theme tokens when scoped CSS variables are not yet readable", () => {
    vi.stubGlobal("document", {
      documentElement: { dataset: { themeId: "red-gold" } },
      body: { dataset: {} },
    });
    vi.stubGlobal("getComputedStyle", () => ({
      getPropertyValue: () => "",
    }));

    const result = resolveColorValue("var(--infini-button-bg-active)");
    expect(typeof result).toBe("string");
    expect(result.startsWith("#")).toBe(true);
  });

  it("uses CSS variable fallbacks when the variable is unavailable", () => {
    const result = resolveColorValue("var(--missing-button-color, #000000)");
    expect(result).toBe("#000000");
  });

  it("passes through plain hex colors", () => {
    expect(resolveColorValue("#FF0000")).toBe("#FF0000");
  });

  it("throws on circular references", () => {
    expect(() => {
      const seen = new Set(["--foo"]);
      resolveColorValue("var(--foo)", seen);
    }).toThrow("Circular");
  });
});
