import type { ThemeId } from "@infini-dev-kit/theme-core";

/**
 * Ant Design v5 seed tokens mapped from ThemeSpec.
 *
 * These correspond to Ant Design's `SeedToken` interface — the top-level
 * design tokens that drive the entire token derivation chain.
 *
 * @see https://ant.design/docs/react/customize-theme#seedtoken
 */
export interface AntdSeedToken {
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;
  colorTextBase: string;
  colorBgBase: string;
  borderRadius: number;
  fontFamily: string;
  fontFamilyCode: string;
  fontSize: number;
  wireframe: boolean;
}

/**
 * Ant Design v5 component-level token overrides.
 *
 * Keys are Ant Design component names (e.g. `"Button"`, `"Card"`).
 * Values are partial component token objects.
 */
export type AntdComponentTokens = Record<string, Record<string, string | number | boolean>>;

/**
 * Complete Ant Design theme config ready for `<ConfigProvider theme={...}>`.
 */
export interface AntdThemeConfig {
  token: AntdSeedToken & Record<string, string | number | boolean>;
  components: AntdComponentTokens;
}

/** Options for building Ant Design theme. */
export interface BuildAntdOptions {
  themeId: ThemeId;
  /** Override the algorithm (e.g. antd's darkAlgorithm). Not included by default. */
  algorithm?: unknown;
}
