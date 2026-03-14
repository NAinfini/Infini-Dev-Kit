import { getThemeSpec, type ThemeId } from "@infini-dev-kit/theme-core";
import type { MuiThemeConfig } from "./mui-types";

/**
 * Build a MUI `ThemeOptions`-compatible object from an Infini theme.
 *
 * The returned object can be passed directly to MUI's `createTheme()`.
 * It maps ThemeSpec palette, typography, foundation, depth, and motion
 * values into MUI's theme structure.
 *
 * @example
 * ```ts
 * import { buildMuiTheme } from "@infini-dev-kit/adapter-mui";
 * import { ThemeProvider, createTheme } from "@mui/material";
 *
 * const themeOptions = buildMuiTheme("cyberpunk");
 * const muiTheme = createTheme(themeOptions);
 *
 * <ThemeProvider theme={muiTheme}>
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * @example
 * ```ts
 * // Merge with your own overrides:
 * import { createTheme } from "@mui/material";
 * const base = buildMuiTheme("black-gold");
 * const theme = createTheme(base, {
 *   components: { MuiButton: { defaultProps: { variant: "contained" } } },
 * });
 * ```
 */
export function buildMuiTheme(themeId: ThemeId): MuiThemeConfig {
  const theme = getThemeSpec(themeId);
  const heading = { fontFamily: theme.typography.en.heading };

  return {
    palette: {
      mode: theme.colorScheme,
      primary: { main: theme.palette.primary },
      secondary: { main: theme.palette.secondary },
      error: { main: theme.palette.danger },
      warning: { main: theme.palette.warning },
      success: { main: theme.palette.success },
      info: { main: theme.palette.accent },
      text: { primary: theme.palette.text, secondary: theme.palette.textMuted },
      background: { default: theme.foundation.background, paper: theme.foundation.surface },
      divider: theme.foundation.borderColor,
    },
    typography: {
      fontFamily: theme.typography.en.body,
      fontWeightLight: theme.typography.weights.light,
      fontWeightRegular: theme.typography.weights.normal,
      fontWeightMedium: theme.typography.weights.medium,
      fontWeightBold: theme.typography.weights.bold,
      h1: heading, h2: heading, h3: heading,
      h4: heading, h5: heading, h6: heading,
    },
    shape: { borderRadius: theme.foundation.radius },
    transitions: {
      duration: {
        enteringScreen: theme.motion.enterMs,
        leavingScreen: theme.motion.exitMs,
      },
      easing: {
        easeInOut: theme.motion.easing,
      },
    },
    components: buildMuiComponentOverrides(themeId),
  };
}

function buildMuiComponentOverrides(themeId: ThemeId): Record<string, unknown> {
  const theme = getThemeSpec(themeId);

  return {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: theme.foundation.radius,
          boxShadow: theme.depth.buttonShadow,
          textTransform: "none" as const,
          fontWeight: theme.typography.weights.medium,
          "&:hover": { boxShadow: theme.depth.buttonShadowHover },
          "&:active": { boxShadow: theme.depth.buttonShadowPressed },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: theme.foundation.radius,
          boxShadow: theme.depth.cardShadow,
          "&:hover": { boxShadow: theme.depth.cardShadowHover },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: theme.foundation.radius,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  };
}
