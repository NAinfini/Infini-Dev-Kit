import type { ThemeId } from "@infini-dev-kit/theme-core";

/**
 * HSL string without the `hsl()` wrapper, formatted as shadcn expects:
 * `"222.2 84% 4.9%"` (space-separated H S% L%).
 */
export type HslString = string;

/** A single shadcn color token mapped to an HSL value. */
export interface ShadcnColorToken {
  variable: string;
  value: HslString;
}

/**
 * Complete set of shadcn CSS variables generated from a ThemeSpec.
 *
 * Keys are CSS custom property names (e.g. `"--background"`).
 * Values are bare HSL strings (e.g. `"222.2 84% 4.9%"`).
 */
export type ShadcnVariableMap = Record<string, string>;

/** Options for building shadcn variables. */
export interface BuildShadcnOptions {
  themeId: ThemeId;
  /** CSS selector to scope variables under. Defaults to `":root"`. */
  selector?: string;
}
