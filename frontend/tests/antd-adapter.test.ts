import { describe, expect, it } from "vitest";

import { contrastRatio } from "../../utils/color";
import {
  buildScopedCssVariables,
  buildScopedThemeClass,
  composeMantineTheme,
} from "../theme/mantine/mantine-adapter";
import { getThemeSpec } from "../theme/theme-specs";

describe("mantine adapter", () => {
  it("composes color scheme and theme tokens", () => {
    const config = composeMantineTheme({
      themeId: "cyberpunk",
    });

    expect(config.colorScheme).toBe("dark");
    expect(config.token.colorPrimary).toBe("#00D4E0");
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
    const config = composeMantineTheme({
      themeId: "black-gold",
    });

    expect(config.token.fontFamily).toContain("Inter");
  });

  it("sets readable segmented colors for cyberpunk", () => {
    const config = composeMantineTheme({ themeId: "cyberpunk" });
    expect(config.components.Segmented).toBeTruthy();
    expect(config.components.Segmented.itemSelectedBg).toBe("#00D4E0");
    expect(
      contrastRatio(
        config.components.Segmented.itemSelectedBg as string,
        config.components.Segmented.itemSelectedColor as string,
      ),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("expands component token coverage for controls and navigation", () => {
    const config = composeMantineTheme({ themeId: "cyberpunk" });
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

  it("brightens chibi status tags with candy palette token overrides", () => {
    const config = composeMantineTheme({ themeId: "chibi" });

    expect(config.components.Tag).toBeTruthy();
    expect(config.components.Tag.colorSuccessBg).toContain("color-mix");
    expect(config.components.Tag.colorWarningBg).toContain("color-mix");
    expect(config.components.Tag.colorErrorBg).toContain("color-mix");
  });

  it("adds status-aware glow tokens to input-like components", () => {
    const config = composeMantineTheme({ themeId: "default" });
    const input = config.components.Input;
    const select = config.components.Select;
    const cascader = config.components.Cascader;
    const treeSelect = config.components.TreeSelect;

    expect(input.activeShadow).not.toBe("none");
    expect(input.warningActiveShadow).toBeTruthy();
    expect(input.errorActiveShadow).toBeTruthy();
    expect(input.warningActiveShadow).not.toBe(input.activeShadow);
    expect(input.errorActiveShadow).not.toBe(input.activeShadow);

    expect(select.activeShadow).toBeTruthy();
    expect(select.warningActiveShadow).toBeTruthy();
    expect(select.errorActiveShadow).toBeTruthy();
    expect(cascader.activeShadow).toBeTruthy();
    expect(cascader.warningActiveShadow).toBeTruthy();
    expect(cascader.errorActiveShadow).toBeTruthy();
    expect(treeSelect.activeShadow).toBeTruthy();
    expect(treeSelect.warningActiveShadow).toBeTruthy();
    expect(treeSelect.errorActiveShadow).toBeTruthy();
  });

  it("uses display font family for heading and action tokens", () => {
    const theme = getThemeSpec("black-gold");
    const config = composeMantineTheme({ themeId: "black-gold" });

    expect(config.components.Button.fontFamily).toBe(theme.typography.display);
    expect(config.components.Typography.fontFamily).toBe(theme.typography.display);
    expect(config.components.Statistic.fontFamily).toBe(theme.typography.display);
  });
});
