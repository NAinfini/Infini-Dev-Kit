import { describe, expect, it } from "vitest";

import { getThemeSpec } from "@infini-dev-kit/theme-core";

describe("mantine scoped variable contract", () => {
  it("keeps border style and typography sizes aligned with theme-core", async () => {
    const theme = getThemeSpec("default");
    const sourceModulePath = "./mantine-variables.ts";
    const { buildScopedCssVariables } = await import(sourceModulePath);
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
});
