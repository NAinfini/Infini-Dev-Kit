import { describe, expect, it } from "vitest";

import {
  buildScopedCssVariables,
  buildScopedThemeClass,
  composeAntdTheme,
} from "../antd-adapter";

describe("antd adapter", () => {
  it("composes algorithms and theme tokens", () => {
    const config = composeAntdTheme({
      themeId: "cyberpunk",
      algorithms: ["dark", "compact"],
    });

    expect(config.algorithm).toEqual(["dark", "compact"]);
    expect(config.token.colorPrimary).toBe("#00F0FF");
    expect(config.token.colorError).toBeTruthy();
  });

  it("creates scoped class names", () => {
    expect(buildScopedThemeClass("portal")).toBe("infini-theme-scope-portal");
  });

  it("builds scoped css variable map", () => {
    const vars = buildScopedCssVariables("red-gold", ".portal-root");

    expect(vars.selector).toBe(".portal-root");
    expect(vars.variables["--infini-color-primary"]).toBe("#ED2939");
    expect(vars.variables["--infini-motion-hover"]).toBe("180ms");
    expect(vars.variables["--infini-shadow-hover"]).toBeTruthy();
    expect(vars.variables["--infini-motion-spring"]).toBeTruthy();
  });

  it("maps black-gold body typography from stitch references", () => {
    const config = composeAntdTheme({
      themeId: "black-gold",
    });

    expect(config.token.fontFamily).toContain("Inter");
  });

  it("sets readable segmented colors for cyberpunk", () => {
    const config = composeAntdTheme({ themeId: "cyberpunk" });
    expect(config.components.Segmented).toBeTruthy();
    expect(config.components.Segmented.itemSelectedBg).toBe("#00F0FF");
    expect(config.components.Segmented.itemSelectedColor).toBe("#0A0A10");
  });

  it("expands component token coverage for controls and navigation", () => {
    const config = composeAntdTheme({ themeId: "cyberpunk" });
    expect(config.components.Select).toBeTruthy();
    expect(config.components.Cascader).toBeTruthy();
    expect(config.components.TreeSelect).toBeTruthy();
    expect(config.components.ColorPicker).toBeTruthy();
    expect(config.components.Transfer).toBeTruthy();
    expect(config.components.Card).toBeTruthy();
    expect(config.components.Collapse).toBeTruthy();
    expect(config.components.Timeline).toBeTruthy();
    expect(config.components.Descriptions).toBeTruthy();
    expect(config.components.Tree).toBeTruthy();
    expect(config.components.Tooltip).toBeTruthy();
    expect(config.components.Popover).toBeTruthy();
    expect(config.components.Popconfirm).toBeTruthy();
    expect(config.components.Spin).toBeTruthy();
    expect(config.components.Skeleton).toBeTruthy();
    expect(config.components.Menu).toBeTruthy();
    expect(config.components.Typography).toBeTruthy();
    expect(config.components.Divider).toBeTruthy();
    expect(config.components.Avatar).toBeTruthy();
    expect(config.components.FloatButton).toBeTruthy();
    expect(config.components.Form).toBeTruthy();
    expect(config.components.Watermark).toBeTruthy();
    expect(config.components.Image).toBeTruthy();
    expect(config.components.Empty).toBeTruthy();
    expect(config.components.Result).toBeTruthy();
    expect(config.components.Statistic).toBeTruthy();
    expect(config.components.QRCode).toBeTruthy();
    expect(config.components.Switch).toBeTruthy();
    expect(config.components.Slider).toBeTruthy();
    expect(config.components.Tabs).toBeTruthy();
    expect(config.components.Checkbox).toBeTruthy();
    expect(config.components.Radio).toBeTruthy();
    expect(config.components.DatePicker).toBeTruthy();
    expect(config.components.Steps).toBeTruthy();
    expect(config.components.Breadcrumb).toBeTruthy();
  });
});
