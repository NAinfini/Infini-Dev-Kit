interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function contrastRatio(background: string, foreground: string): number {
  const bg = relativeLuminance(hexToRgb(background));
  const fg = relativeLuminance(hexToRgb(foreground));
  const [lighter, darker] = bg >= fg ? [bg, fg] : [fg, bg];

  return (lighter + 0.05) / (darker + 0.05);
}

export function pickReadableTextColor(
  background: string,
  darkText = "#111111",
  lightText = "#FFFFFF",
): string {
  const darkContrast = contrastRatio(background, darkText);
  const lightContrast = contrastRatio(background, lightText);

  return darkContrast >= lightContrast ? darkText : lightText;
}

export function pickBestTextColor(background: string, candidates: string[], minContrast = 4.5): string {
  const uniqueCandidates = [...new Set(candidates)];
  let bestColor = uniqueCandidates[0] ?? pickReadableTextColor(background);
  let bestContrast = contrastRatio(background, bestColor);

  for (const candidate of uniqueCandidates) {
    const candidateContrast = contrastRatio(background, candidate);
    if (candidateContrast >= minContrast) {
      return candidate;
    }
    if (candidateContrast > bestContrast) {
      bestColor = candidate;
      bestContrast = candidateContrast;
    }
  }

  return bestColor;
}

export function deriveHoverColor(color: string): string {
  const amount = isDarkColor(color) ? 0.1 : -0.08;
  return shiftLightness(color, amount);
}

export function deriveActiveColor(color: string): string {
  const amount = isDarkColor(color) ? 0.18 : -0.16;
  return shiftLightness(color, amount);
}

function isDarkColor(color: string): boolean {
  return relativeLuminance(hexToRgb(color)) < 0.4;
}

function shiftLightness(hex: string, delta: number): string {
  const { r, g, b } = hexToRgb(hex);

  const apply = (channel: number): number => {
    const next = channel + channel * delta + 255 * delta;
    return clamp(Math.round(next), 0, 255);
  };

  return rgbToHex({
    r: apply(r),
    g: apply(g),
    b: apply(b),
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function relativeLuminance({ r, g, b }: Rgb): number {
  const toLinear = (value: number): number => {
    const normalized = value / 255;
    if (normalized <= 0.03928) {
      return normalized / 12.92;
    }

    return Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  const linearR = toLinear(r);
  const linearG = toLinear(g);
  const linearB = toLinear(b);

  return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
}

function hexToRgb(hex: string): Rgb {
  const normalized = normalizeHex(hex);

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (value: number): string => value.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function normalizeHex(hex: string): string {
  const trimmed = hex.trim().replace(/^#/, "");

  if (trimmed.length === 3) {
    return trimmed
      .split("")
      .map((character) => `${character}${character}`)
      .join("");
  }

  if (trimmed.length !== 6) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return trimmed;
}
