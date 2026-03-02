import type { ThemeId } from "../../theme/theme-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";

/**
 * Theme-keyed partial prop defaults for a component.
 * `_base` provides cross-theme defaults (overridden by specific theme keys).
 */
export type ThemeDefaultsMap<P> = {
  _base?: Partial<P>;
} & {
  [K in ThemeId]?: Partial<P>;
};

/**
 * Generic hook that resolves theme-aware prop defaults for any component.
 *
 * Priority (highest wins):
 *   1. Consumer-provided props (explicit overrides)
 *   2. Theme-specific defaults (themeId key)
 *   3. Base defaults (_base key)
 *   4. Component's own hardcoded defaults (already in the base component)
 */
export function useThemeDefaults<P extends object>(
  consumerProps: P,
  defaultsMap: ThemeDefaultsMap<P>,
): P {
  const { state } = useThemeSnapshot();
  const base = defaultsMap._base ?? {};
  const themeSpecific = defaultsMap[state.themeId] ?? {};

  // Merge: base < themeSpecific < consumerProps (only explicit non-undefined values)
  const merged = { ...base, ...themeSpecific } as Record<string, unknown>;

  for (const key of Object.keys(consumerProps)) {
    const val = (consumerProps as Record<string, unknown>)[key];
    if (val !== undefined) {
      merged[key] = val;
    }
  }

  return merged as P;
}
