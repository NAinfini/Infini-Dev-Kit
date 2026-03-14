import type { ThemeId, ThemeSpec } from "@infini-dev-kit/theme-core";

/**
 * Per-theme Mantine component overrides that can't be expressed
 * through the generic ThemeSpec token system.
 *
 * Centralises all `if (themeId === "xxx")` scattered checks into a
 * single lookup.  Adding a new theme only requires adding an entry
 * here instead of hunting through N files.
 */
export interface ThemeComponentOverrides {
  switch: { trackMinWidth: number; trackHeight: number; trackPadding: number };
  selectRadius: (baseRadius: number) => number;
  checkboxRadius: (baseRadius: number) => number;
  tagColorMix: "standard" | "pastel" | "bold";
}

const DEFAULTS: ThemeComponentOverrides = {
  switch: { trackMinWidth: 44, trackHeight: 22, trackPadding: 2 },
  selectRadius: (r) => Math.max(2, Math.round(r * 0.75)),
  checkboxRadius: (r) => Math.max(2, Math.round(r * 0.45)),
  tagColorMix: "standard",
};

const OVERRIDES: Partial<Record<ThemeId, Partial<ThemeComponentOverrides>>> = {
  "neu-brutalism": {
    switch: { trackMinWidth: 52, trackHeight: 26, trackPadding: 2 },
    selectRadius: () => 0,
    checkboxRadius: () => 0,
    tagColorMix: "bold",
  },
  chibi: {
    tagColorMix: "pastel",
  },
};

/**
 * Return component-level overrides for a given theme, merged with defaults.
 *
 * Usage:
 * ```ts
 * const o = getThemeOverrides(theme);
 * const trackWidth = o.switch.trackMinWidth;
 * const selectR    = o.selectRadius(theme.foundation.radius);
 * ```
 */
export function getThemeOverrides(theme: ThemeSpec): ThemeComponentOverrides {
  const custom = OVERRIDES[theme.id];
  if (!custom) return DEFAULTS;

  return {
    ...DEFAULTS,
    ...custom,
    switch: { ...DEFAULTS.switch, ...custom.switch },
  };
}
