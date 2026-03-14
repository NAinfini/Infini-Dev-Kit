import type { MantineThemeToken } from "./mantine-types";
export type LocaleCode = "en" | "zh" | "ja";
/**
 * Apply locale-specific typography CSS variables to the document root.
 * This is a convenience utility for applications that need locale-aware fonts.
 *
 * @param locale - The locale code (en, zh, ja)
 * @param token - The Mantine theme token containing locale font stacks
 * @param root - The root element to apply variables to (defaults to document.documentElement)
 *
 * @example
 * ```tsx
 * const { token } = useThemeSnapshot().mantine;
 * useEffect(() => {
 *   applyLocaleTypography(locale, token);
 * }, [locale, token]);
 * ```
 */
export declare function applyLocaleTypography(locale: LocaleCode, token: MantineThemeToken, root?: HTMLElement): void;
