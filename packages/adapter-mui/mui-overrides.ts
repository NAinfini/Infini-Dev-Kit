import type { ThemeId } from "@infini-dev-kit/theme-core";

/**
 * Per-theme MUI component overrides for visual quirks that can't be
 * expressed through MUI's palette/typography/shape tokens alone.
 *
 * @example
 * ```ts
 * import { getMuiOverrides } from "@infini-dev-kit/adapter-mui";
 *
 * const overrides = getMuiOverrides("neu-brutalism");
 * // → { borderWidth: 3, buttonTextTransform: "uppercase", elevationScale: 0, ... }
 * ```
 */
export interface MuiComponentOverrides {
  borderWidth: number;
  buttonTextTransform: "none" | "uppercase";
  elevationScale: number;
  tagVariant: "standard" | "pastel" | "bold";
}

const DEFAULTS: MuiComponentOverrides = {
  borderWidth: 1,
  buttonTextTransform: "none",
  elevationScale: 1,
  tagVariant: "standard",
};

const OVERRIDES: Partial<Record<ThemeId, Partial<MuiComponentOverrides>>> = {
  "neu-brutalism": {
    borderWidth: 3,
    buttonTextTransform: "uppercase",
    elevationScale: 0,
    tagVariant: "bold",
  },
  chibi: {
    tagVariant: "pastel",
  },
};

export function getMuiOverrides(themeId: ThemeId): MuiComponentOverrides {
  const custom = OVERRIDES[themeId];
  if (!custom) return DEFAULTS;
  return { ...DEFAULTS, ...custom };
}
