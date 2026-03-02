import type {
  ThemeButtonConfig,
  ThemeEffects,
  ThemeMotionConfig,
  ThemeTypography,
} from "../theme-types";

type LocaleFontConfig = {
  body: string;
  heading: string;
  mono: string;
};

interface ThemeTypographyInput {
  display: string;
  body: string;
  mono: string;
  displayWeight: number;
  bodyWeight: number;
  en?: Partial<LocaleFontConfig>;
  zh?: Partial<LocaleFontConfig>;
  ja?: Partial<LocaleFontConfig>;
  sizes?: Partial<ThemeTypography["sizes"]>;
  weights?: Partial<ThemeTypography["weights"]>;
  lineHeights?: Partial<ThemeTypography["lineHeights"]>;
}

interface ThemeMotionInput {
  enterMs: number;
  exitMs: number;
  easing: string;
  bounce: number;
  hoverScale: number;
  hoverDuration: number;
  glitchIntensity?: number;
  tiltEnabled: boolean;
  tiltDegree: number;
  springRelease: boolean;
  pressMs?: number;
  distancePx?: number;
}

interface ThemeEffectsInput {
  glowColor: string;
  shadowColor: string;
  shimmerColor: string;
  pattern?: string | null;
  gradientAngle?: number;
  noiseOpacity?: number;
  borderStyle?: ThemeEffects["border"]["style"];
  borderWidth?: string;
  borderRadius?: string;
  hover?: Partial<ThemeEffects["hover"]>;
  background?: Partial<ThemeEffects["background"]>;
  border?: Partial<ThemeEffects["border"]>;
}

interface ThemeButtonInput {
  type: ThemeButtonConfig["type"];
  raiseLevel: number;
  springRelease: boolean;
  activeOpacity: number;
  backgroundActive: string;
  backgroundDarker: string;
  backgroundShadow: string;
  shadowOffset?: string;
  progressEnabled: boolean;
  progressColor: string;
  glitchOnPress?: boolean;
  snapShadow?: boolean;
}

const DEFAULT_ZH: LocaleFontConfig = {
  body: "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
  heading: "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
  mono: "'Noto Sans Mono CJK SC', 'Consolas', monospace",
};

const DEFAULT_JA: LocaleFontConfig = {
  body: "'Noto Sans JP', 'Yu Gothic', sans-serif",
  heading: "'Noto Sans JP', 'Yu Gothic', sans-serif",
  mono: "'Noto Sans Mono CJK JP', 'Consolas', monospace",
};

const DEFAULT_SIZES: ThemeTypography["sizes"] = {
  xs: "11px",
  sm: "13px",
  md: "15px",
  lg: "17px",
  xl: "20px",
  xxl: "24px",
  display: "36px",
};

const DEFAULT_WEIGHTS: ThemeTypography["weights"] = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const DEFAULT_LINE_HEIGHTS: ThemeTypography["lineHeights"] = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
};

export function createThemeTypography(input: ThemeTypographyInput): ThemeTypography {
  const en: LocaleFontConfig = {
    body: input.en?.body ?? input.body,
    heading: input.en?.heading ?? input.display,
    mono: input.en?.mono ?? input.mono,
  };

  const zh: LocaleFontConfig = {
    body: input.zh?.body ?? DEFAULT_ZH.body,
    heading: input.zh?.heading ?? DEFAULT_ZH.heading,
    mono: input.zh?.mono ?? DEFAULT_ZH.mono,
  };

  const ja: LocaleFontConfig = {
    body: input.ja?.body ?? DEFAULT_JA.body,
    heading: input.ja?.heading ?? DEFAULT_JA.heading,
    mono: input.ja?.mono ?? DEFAULT_JA.mono,
  };

  const weights = {
    ...DEFAULT_WEIGHTS,
    ...input.weights,
    normal: input.bodyWeight,
    bold: input.displayWeight,
  };

  return {
    en,
    zh,
    ja,
    sizes: {
      ...DEFAULT_SIZES,
      ...input.sizes,
    },
    weights,
    lineHeights: {
      ...DEFAULT_LINE_HEIGHTS,
      ...input.lineHeights,
    },
    display: input.display,
    body: input.body,
    mono: input.mono,
    displayWeight: input.displayWeight,
    bodyWeight: input.bodyWeight,
  };
}

export function createThemeMotion(input: ThemeMotionInput): ThemeMotionConfig {
  const pressMs = input.pressMs ?? Math.max(70, Math.round(input.hoverDuration * 0.72));
  const distancePx = input.distancePx ?? Math.max(2, Math.round(input.tiltDegree * 0.5));

  return {
    enterMs: input.enterMs,
    exitMs: input.exitMs,
    easing: input.easing,
    bounce: input.bounce,
    hoverScale: input.hoverScale,
    hoverDuration: input.hoverDuration,
    glitchIntensity: input.glitchIntensity,
    tiltEnabled: input.tiltEnabled,
    tiltDegree: input.tiltDegree,
    springRelease: input.springRelease,
    hoverMs: input.hoverDuration,
    pressMs,
    overshoot: input.bounce,
    distancePx,
  };
}

export function createThemeEffects(input: ThemeEffectsInput): ThemeEffects {
  const base: ThemeEffects = {
    hover: {
      glow: true,
      glowColor: input.glowColor,
      glowIntensity: 0.5,
      glowSpread: 18,
      shadow: true,
      shadowColor: input.shadowColor,
      shadowIntensity: 0.45,
      shimmer: true,
      shimmerColor: input.shimmerColor,
      shimmerDuration: 900,
    },
    background: {
      gradient: true,
      gradientAngle: input.gradientAngle ?? 135,
      noise: true,
      noiseOpacity: input.noiseOpacity ?? 0.04,
      pattern: input.pattern ?? null,
    },
    border: {
      style: input.borderStyle ?? "solid",
      width: input.borderWidth ?? "1px",
      radius: input.borderRadius ?? "10px",
      glow: true,
      glowColor: input.glowColor,
      animated: false,
    },
  };

  return {
    hover: {
      ...base.hover,
      ...input.hover,
    },
    background: {
      ...base.background,
      ...input.background,
    },
    border: {
      ...base.border,
      ...input.border,
    },
  };
}

export function createThemeButton(input: ThemeButtonInput): ThemeButtonConfig {
  return {
    type: input.type,
    raiseLevel: input.raiseLevel,
    springRelease: input.springRelease,
    activeOpacity: input.activeOpacity,
    backgroundActive: input.backgroundActive,
    backgroundDarker: input.backgroundDarker,
    backgroundShadow: input.backgroundShadow,
    shadowOffset: input.shadowOffset,
    progressEnabled: input.progressEnabled,
    progressColor: input.progressColor,
    glitchOnPress: input.glitchOnPress,
    snapShadow: input.snapShadow,
  };
}
