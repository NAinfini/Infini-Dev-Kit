import type { ThemeId } from "@infini-dev-kit/theme-core";

/**
 * Radix Themes accent color scale names.
 *
 * Radix provides a fixed set of named color scales. The adapter maps
 * ThemeSpec's primary color to the nearest Radix scale by hue.
 *
 * @see https://www.radix-ui.com/themes/docs/theme/color
 */
export type RadixAccentColor =
  | "tomato" | "red" | "ruby" | "crimson" | "pink" | "plum"
  | "purple" | "violet" | "iris" | "indigo" | "blue" | "cyan"
  | "teal" | "jade" | "green" | "grass" | "lime" | "mint"
  | "sky" | "orange" | "amber" | "yellow" | "brown" | "bronze" | "gold" | "gray";

/** Radix Themes gray scale names. */
export type RadixGrayColor = "auto" | "gray" | "mauve" | "slate" | "sage" | "olive" | "sand";

/** Radix Themes radius scale. */
export type RadixRadius = "none" | "small" | "medium" | "large" | "full";

/** Radix Themes scaling factor. */
export type RadixScaling = "90%" | "95%" | "100%" | "105%" | "110%";

/**
 * Props for the Radix `<Theme>` component, derived from ThemeSpec.
 */
export interface RadixThemeProps {
  appearance: "light" | "dark";
  accentColor: RadixAccentColor;
  grayColor: RadixGrayColor;
  radius: RadixRadius;
  scaling: RadixScaling;
}

/**
 * CSS variable overrides for fine-grained control beyond what
 * Radix Theme props expose. Apply via `style` prop on `<Theme>`.
 */
export type RadixCssOverrides = Record<string, string>;

/** Options for building Radix theme config. */
export interface BuildRadixOptions {
  themeId: ThemeId;
}
