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
export function applyLocaleTypography(
  locale: LocaleCode,
  token: MantineThemeToken,
  root: HTMLElement = document.documentElement,
): void {
  const bodyFont = locale === "zh" ? token.fontFamilyZh : locale === "ja" ? token.fontFamilyJa : token.fontFamily;
  const headingFont = locale === "zh" ? token.fontHeadingZh : locale === "ja" ? token.fontHeadingJa : token.fontHeading;

  root.lang = locale;
  root.style.setProperty("--mantine-font-family", bodyFont);
  root.style.setProperty("--mantine-font-family-headings", headingFont);
  root.style.setProperty("--mantine-font-family-monospace", token.fontMono);
  root.style.setProperty("--infini-font-body", bodyFont);
  root.style.setProperty("--infini-font-display", headingFont);
  root.style.setProperty("--infini-font-heading", headingFont);
  root.style.setProperty("--infini-font-mono", token.fontMono);
}
