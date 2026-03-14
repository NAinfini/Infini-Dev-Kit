import type { ThemeId } from "@infini-dev-kit/theme-core";

/**
 * Per-theme Ant Design component overrides that go beyond seed token derivation.
 *
 * These handle visual quirks specific to certain Infini themes that
 * can't be expressed through Ant Design's automatic token chain.
 *
 * @example
 * ```ts
 * import { getAntdOverrides } from "@infini-dev-kit/adapter-antd";
 *
 * const overrides = getAntdOverrides("neu-brutalism");
 * // → { buttonBorderWidth: 3, cardBorderWidth: 3, tagStyle: "bold", ... }
 *
 * // Apply alongside buildAntdTheme for full fidelity:
 * const theme = buildAntdTheme("neu-brutalism");
 * // Merge overrides into component tokens as needed.
 * ```
 */
export interface AntdComponentOverrides {
  buttonBorderWidth: number;
  cardBorderWidth: number;
  inputBorderWidth: number;
  tagStyle: "standard" | "pastel" | "bold";
  switchSize: "default" | "large";
}

const DEFAULTS: AntdComponentOverrides = {
  buttonBorderWidth: 1,
  cardBorderWidth: 1,
  inputBorderWidth: 1,
  tagStyle: "standard",
  switchSize: "default",
};

const OVERRIDES: Partial<Record<ThemeId, Partial<AntdComponentOverrides>>> = {
  "neu-brutalism": {
    buttonBorderWidth: 3,
    cardBorderWidth: 3,
    inputBorderWidth: 3,
    tagStyle: "bold",
    switchSize: "large",
  },
  chibi: {
    tagStyle: "pastel",
  },
};

export function getAntdOverrides(themeId: ThemeId): AntdComponentOverrides {
  const custom = OVERRIDES[themeId];
  if (!custom) return DEFAULTS;
  return { ...DEFAULTS, ...custom };
}
