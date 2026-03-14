import { getThemeSpec, type ThemeId } from "@infini-dev-kit/theme-core";
import type { AntdThemeConfig, AntdSeedToken } from "./antd-types";

/**
 * Build Ant Design v5 seed tokens from an Infini ThemeSpec.
 *
 * Maps the framework-agnostic palette, typography, and foundation
 * values to Ant Design's seed token system. Ant Design derives
 * hundreds of alias/map tokens automatically from these seeds.
 *
 * @example
 * ```ts
 * import { buildAntdSeedTokens } from "@infini-dev-kit/adapter-antd";
 * const seeds = buildAntdSeedTokens("cyberpunk");
 * // → { colorPrimary: "#00f0ff", borderRadius: 4, ... }
 * ```
 */
export function buildAntdSeedTokens(themeId: ThemeId): AntdSeedToken {
  const theme = getThemeSpec(themeId);

  return {
    colorPrimary: theme.palette.primary,
    colorSuccess: theme.palette.success,
    colorWarning: theme.palette.warning,
    colorError: theme.palette.danger,
    colorInfo: theme.palette.secondary,
    colorTextBase: theme.palette.text,
    colorBgBase: theme.foundation.background,
    borderRadius: theme.foundation.radius,
    fontFamily: theme.typography.en.body,
    fontFamilyCode: theme.typography.en.mono,
    fontSize: 14,
    wireframe: false,
  };
}

/**
 * Build a complete Ant Design v5 theme config from an Infini theme.
 *
 * Returns an object ready to pass to `<ConfigProvider theme={...}>`.
 * Includes both seed tokens and component-level overrides that map
 * ThemeSpec depth, motion, and foundation values to Ant Design's
 * component token system.
 *
 * @example
 * ```ts
 * import { buildAntdTheme } from "@infini-dev-kit/adapter-antd";
 * import { ConfigProvider } from "antd";
 *
 * const theme = buildAntdTheme("cyberpunk");
 *
 * <ConfigProvider theme={theme}>
 *   <App />
 * </ConfigProvider>
 * ```
 *
 * @example
 * ```ts
 * // With dark algorithm override:
 * import { theme as antdTheme } from "antd";
 * const config = buildAntdTheme("black-gold");
 * <ConfigProvider theme={{ ...config, algorithm: antdTheme.darkAlgorithm }}>
 *   <App />
 * </ConfigProvider>
 * ```
 */
export function buildAntdTheme(themeId: ThemeId): AntdThemeConfig {
  const theme = getThemeSpec(themeId);
  const seeds = buildAntdSeedTokens(themeId);

  return {
    token: {
      ...seeds,
      colorBgContainer: theme.foundation.surface,
      colorBgElevated: theme.foundation.surfaceAccent,
      colorBorder: theme.foundation.borderColor,
      colorBorderSecondary: theme.foundation.borderColor,
      colorTextSecondary: theme.palette.textMuted,
      boxShadow: theme.depth.cardShadow,
      boxShadowSecondary: theme.depth.dropdownShadow,
      motionDurationMid: `${theme.motion.enterMs / 1000}s`,
      motionDurationSlow: `${theme.motion.exitMs / 1000}s`,
      motionEaseInOut: theme.motion.easing,
      fontWeightStrong: theme.typography.weights.bold,
      lineHeight: theme.typography.lineHeights.normal,
    },
    components: buildAntdComponentTokens(themeId),
  };
}

function buildAntdComponentTokens(themeId: ThemeId): AntdThemeConfig["components"] {
  const theme = getThemeSpec(themeId);

  return {
    Button: {
      borderRadius: theme.foundation.radius,
      controlHeight: 36,
      fontWeight: theme.typography.weights.medium,
      primaryShadow: theme.depth.buttonShadow,
    },
    Card: {
      borderRadiusLG: theme.foundation.radius,
      boxShadow: theme.depth.cardShadow,
      boxShadowHover: theme.depth.cardShadowHover,
    },
    Input: {
      borderRadius: theme.foundation.radius,
      boxShadow: theme.depth.inputInsetShadow,
    },
    Table: {
      borderRadius: theme.foundation.radius,
      headerBg: theme.foundation.surfaceAccent,
    },
    Modal: {
      borderRadius: theme.foundation.radius,
    },
    Select: {
      borderRadius: theme.foundation.radius,
      boxShadow: theme.depth.dropdownShadow,
    },
  };
}
