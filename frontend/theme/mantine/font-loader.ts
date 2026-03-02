/**
 * Dynamic Font Loader
 *
 * Loads theme-specific fonts dynamically when themes are activated.
 * Prevents loading all fonts upfront for better performance.
 */

interface FontConfig {
  family: string;
  weights: number[];
  display?: "auto" | "block" | "swap" | "fallback" | "optional";
}

const THEME_FONTS: Record<string, FontConfig[]> = {
  cyberpunk: [
    { family: "Rajdhani", weights: [500, 600, 700], display: "swap" },
    { family: "Electrolize", weights: [400], display: "swap" },
    { family: "Share Tech Mono", weights: [400], display: "swap" },
  ],
  chibi: [
    { family: "Comfortaa", weights: [500, 600, 700], display: "swap" },
    { family: "Varela Round", weights: [400], display: "swap" },
    { family: "Baloo 2", weights: [500, 600, 700], display: "swap" },
  ],
  "black-gold": [
    { family: "Cinzel", weights: [500, 600, 700], display: "swap" },
    { family: "Lora", weights: [400, 500, 600, 700], display: "swap" },
    { family: "Montserrat", weights: [400, 500, 600], display: "swap" },
  ],
  "neu-brutalism": [
    { family: "Bebas Neue", weights: [400], display: "block" },
    { family: "Rubik", weights: [500, 600, 700, 800], display: "swap" },
    { family: "DM Sans", weights: [500, 700], display: "swap" },
  ],
  "red-gold": [
    { family: "Crimson Text", weights: [600, 700], display: "swap" },
    { family: "EB Garamond", weights: [400, 500, 600, 700], display: "swap" },
    { family: "Libre Baskerville", weights: [400, 700], display: "swap" },
  ],
  default: [
    { family: "Inter", weights: [400, 500, 600, 700], display: "swap" },
  ],
};

// Common monospace font used across themes
const COMMON_FONTS: FontConfig[] = [
  { family: "JetBrains Mono", weights: [400, 500, 600, 700], display: "swap" },
];

const loadedFonts = new Set<string>();

function buildGoogleFontsUrl(fonts: FontConfig[]): string {
  const families = fonts.map((font) => {
    const weights = font.weights.join(";");
    const family = font.family.replace(/ /g, "+");
    return `family=${family}:wght@${weights}`;
  });

  const display = fonts[0]?.display || "swap";
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=${display}`;
}

function createFontLink(url: string): HTMLLinkElement {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  link.crossOrigin = "anonymous";
  return link;
}

export async function loadThemeFonts(themeId: string): Promise<void> {
  // Skip if already loaded
  if (loadedFonts.has(themeId)) {
    return;
  }

  const themeFonts = THEME_FONTS[themeId];
  if (!themeFonts || themeFonts.length === 0) {
    return;
  }

  // Combine theme fonts with common fonts
  const allFonts = [...themeFonts, ...COMMON_FONTS];

  // Remove duplicates
  const uniqueFonts = allFonts.filter(
    (font, index, self) => index === self.findIndex((f) => f.family === font.family)
  );

  const url = buildGoogleFontsUrl(uniqueFonts);
  const link = createFontLink(url);

  // Add to document head
  document.head.appendChild(link);

  // Wait for fonts to load
  await new Promise<void>((resolve) => {
    link.onload = () => resolve();
    link.onerror = () => {
      console.warn(`Failed to load fonts for theme: ${themeId}`);
      resolve();
    };
  });

  loadedFonts.add(themeId);
}

export function preloadCommonFonts(): void {
  const url = buildGoogleFontsUrl(COMMON_FONTS);
  const link = createFontLink(url);
  link.rel = "preload";
  link.as = "style";
  document.head.appendChild(link);

  // Also add the actual stylesheet
  const styleLink = createFontLink(url);
  document.head.appendChild(styleLink);
}

export function clearFontCache(): void {
  loadedFonts.clear();
}
