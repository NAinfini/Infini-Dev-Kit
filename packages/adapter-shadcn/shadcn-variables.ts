import { getThemeSpec, type ThemeId } from "@infini-dev-kit/theme-core";
import type { ShadcnVariableMap, BuildShadcnOptions } from "./shadcn-types";

/**
 * Convert a hex color string to bare HSL values: `"H S% L%"`.
 *
 * shadcn/ui expects CSS variables as space-separated HSL without the
 * `hsl()` wrapper so Tailwind can inject opacity modifiers:
 * ```css
 * --primary: 222.2 47.4% 11.2%;
 * ```
 *
 * @param hex - Color in `#RGB`, `#RRGGBB`, or `#RRGGBBAA` format.
 * @returns Bare HSL string, e.g. `"222.2 47.4% 11.2%"`.
 */
export function hexToHsl(hex: string): string {
  const raw = hex.replace("#", "");
  const full = raw.length === 3
    ? raw.split("").map((c) => c + c).join("")
    : raw.slice(0, 6);

  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return `0 0% ${Math.round(l * 100)}%`;

  const s = l > 0.5 ? d / (2 - max - min) : d / (max - min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return `${round(h * 360)} ${round(s * 100)}% ${round(l * 100)}%`;
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Generate shadcn-compatible CSS variables from an Infini theme.
 *
 * @example
 * ```ts
 * import { buildShadcnVariables } from "@infini-dev-kit/adapter-shadcn";
 *
 * const vars = buildShadcnVariables("cyberpunk");
 * // → { "--background": "222.2 84% 4.9%", "--primary": "187 100% 50%", ... }
 *
 * // Inject into :root via inline style or a <style> tag:
 * const css = Object.entries(vars)
 *   .map(([k, v]) => `${k}: ${v};`)
 *   .join("\n");
 * ```
 *
 * @example
 * ```ts
 * // Or use the Tailwind preset for zero-config integration:
 * import { infiniTailwindPreset } from "@infini-dev-kit/adapter-shadcn";
 * // tailwind.config.ts → presets: [infiniTailwindPreset("cyberpunk")]
 * ```
 */
export function buildShadcnVariables(themeIdOrOpts: ThemeId | BuildShadcnOptions): ShadcnVariableMap {
  const themeId = typeof themeIdOrOpts === "string" ? themeIdOrOpts : themeIdOrOpts.themeId;
  const theme = getThemeSpec(themeId);

  return {
    "--background": hexToHsl(theme.foundation.background),
    "--foreground": hexToHsl(theme.palette.text),
    "--card": hexToHsl(theme.foundation.surface),
    "--card-foreground": hexToHsl(theme.palette.text),
    "--popover": hexToHsl(theme.foundation.surface),
    "--popover-foreground": hexToHsl(theme.palette.text),
    "--primary": hexToHsl(theme.palette.primary),
    "--primary-foreground": hexToHsl(theme.foundation.background),
    "--secondary": hexToHsl(theme.palette.secondary),
    "--secondary-foreground": hexToHsl(theme.palette.text),
    "--muted": hexToHsl(theme.foundation.surfaceAccent),
    "--muted-foreground": hexToHsl(theme.palette.textMuted),
    "--accent": hexToHsl(theme.palette.accent),
    "--accent-foreground": hexToHsl(theme.palette.text),
    "--destructive": hexToHsl(theme.palette.danger),
    "--destructive-foreground": hexToHsl(theme.foundation.background),
    "--border": hexToHsl(theme.foundation.borderColor),
    "--input": hexToHsl(theme.foundation.borderColor),
    "--ring": hexToHsl(theme.palette.primary),
    "--radius": `${theme.foundation.radius / 16}rem`,
    "--sidebar-background": hexToHsl(theme.foundation.sidebarBackground),
    "--sidebar-foreground": hexToHsl(theme.palette.text),
    "--sidebar-accent": hexToHsl(theme.foundation.surfaceAccent),
    "--sidebar-accent-foreground": hexToHsl(theme.palette.text),
    "--sidebar-border": hexToHsl(theme.foundation.borderColor),
    "--sidebar-ring": hexToHsl(theme.palette.primary),
  };
}

/**
 * Generate a CSS string block with all shadcn variables scoped to a selector.
 *
 * @example
 * ```ts
 * const css = buildShadcnCssBlock("cyberpunk", ":root");
 * // → ":root { --background: 222.2 84% 4.9%; ... }"
 * document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
 * ```
 */
export function buildShadcnCssBlock(themeId: ThemeId, selector = ":root"): string {
  const vars = buildShadcnVariables(themeId);
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `${selector} {\n${body}\n}`;
}
