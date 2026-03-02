import type { MantineThemeOverride } from "@mantine/core";

import type { ThemeId } from "../theme-types";

export type MantineColorSchemePreference = "light" | "dark";

export interface MantineThemeToken {
  [key: string]: string | number;
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
  lineWidth: number;
  fontFamily: string;
}

export interface ScopedCssVariables {
  selector: string;
  variables: Record<string, string>;
}

export interface MantineThemeConfig {
  colorScheme: MantineColorSchemePreference;
  token: MantineThemeToken;
  components: Record<string, Record<string, string | number>>;
  theme: MantineThemeOverride;
}

export interface ComposeMantineThemeOptions {
  themeId: ThemeId;
  forcedColorScheme?: MantineColorSchemePreference;
}