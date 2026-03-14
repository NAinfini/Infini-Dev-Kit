import type { ThemeId } from "@infini-dev-kit/theme-core";

/**
 * MUI palette color entry with main + contrastText.
 * Maps to MUI's `PaletteColorOptions`.
 */
export interface MuiPaletteColor {
  main: string;
  contrastText?: string;
}

/**
 * MUI theme options generated from ThemeSpec.
 *
 * This is a plain object compatible with MUI's `ThemeOptions` interface.
 * We define it independently to avoid requiring `@mui/material` at
 * compile time — it's a peerDependency only.
 */
export interface MuiThemeConfig {
  palette: {
    mode: "light" | "dark";
    primary: MuiPaletteColor;
    secondary: MuiPaletteColor;
    error: MuiPaletteColor;
    warning: MuiPaletteColor;
    success: MuiPaletteColor;
    info: MuiPaletteColor;
    text: { primary: string; secondary: string };
    background: { default: string; paper: string };
    divider: string;
  };
  typography: {
    fontFamily: string;
    fontWeightLight: number;
    fontWeightRegular: number;
    fontWeightMedium: number;
    fontWeightBold: number;
    h1: { fontFamily: string };
    h2: { fontFamily: string };
    h3: { fontFamily: string };
    h4: { fontFamily: string };
    h5: { fontFamily: string };
    h6: { fontFamily: string };
  };
  shape: { borderRadius: number };
  shadows?: string[];
  transitions: {
    duration: {
      enteringScreen: number;
      leavingScreen: number;
    };
    easing: {
      easeInOut: string;
    };
  };
  components?: Record<string, unknown>;
}

/** Options for building MUI theme. */
export interface BuildMuiOptions {
  themeId: ThemeId;
}
