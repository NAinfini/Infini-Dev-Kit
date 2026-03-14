import type { ThemeSpec } from "@infini-dev-kit/theme-core";
/**
 * Per-theme Mantine component overrides that can't be expressed
 * through the generic ThemeSpec token system.
 *
 * Centralises all `if (themeId === "xxx")` scattered checks into a
 * single lookup.  Adding a new theme only requires adding an entry
 * here instead of hunting through N files.
 */
export interface ThemeComponentOverrides {
    switch: {
        trackMinWidth: number;
        trackHeight: number;
        trackPadding: number;
    };
    selectRadius: (baseRadius: number) => number;
    checkboxRadius: (baseRadius: number) => number;
    tagColorMix: "standard" | "pastel" | "bold";
}
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
export declare function getThemeOverrides(theme: ThemeSpec): ThemeComponentOverrides;
