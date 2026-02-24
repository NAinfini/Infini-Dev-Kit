import type { ThemeId } from "./theme-types";

export type AntdAlgorithm = "default" | "dark" | "compact";

export interface AntdThemeToken {
  colorPrimary: string;
  colorInfo: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorTextBase: string;
  colorBgBase: string;
  colorBgContainer: string;
  colorBorder: string;
  borderRadius: number;
  fontFamily: string;
}

export interface ScopedCssVariables {
  selector: string;
  variables: Record<string, string>;
}

export interface AntdThemeConfig {
  algorithm: AntdAlgorithm[];
  token: AntdThemeToken;
  components: Record<string, Record<string, string | number>>;
}

export interface ComposeAntdThemeOptions {
  themeId: ThemeId;
  algorithms?: AntdAlgorithm[];
}
