export type ThemeId =
  | "default"
  | "chibi"
  | "cyberpunk"
  | "neu-brutalism"
  | "black-gold"
  | "red-gold";

export interface ThemePalette {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  text: string;
  textMuted: string;
}

export interface ThemeTypography {
  en: {
    body: string;
    heading: string;
    mono: string;
  };
  zh: {
    body: string;
    heading: string;
    mono: string;
  };
  ja: {
    body: string;
    heading: string;
    mono: string;
  };
  sizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    display: string;
  };
  weights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ThemeFoundation {
  background: string;
  backgroundPattern: string;
  surface: string;
  surfaceAccent: string;
  sidebarBackground: string;
  borderColor: string;
  borderWidth: number;
  borderStyle: "solid" | "dashed";
  radius: number;
  shadow: string;
  shadowSm: string;
  shadowLg: string;
  shadowHover: string;
  shadowPressed: string;
  shadowInset?: string;
  shadowDanger?: string;
}

export interface ThemeDepth {
  buttonShadow: string;
  buttonShadowHover: string;
  buttonShadowPressed: string;
  cardShadow: string;
  cardShadowHover: string;
  inputInsetShadow: string;
  switchShadow: string;
  dropdownShadow: string;
}

export interface ThemeComponentProfile {
  button: string;
  input: string;
  table: string;
  panel: string;
}

export interface ThemeDataUiProfile {
  density: string;
  rowSeparator: string;
  statusShape: string;
}

export interface ThemeOverlayProfile {
  toastTone: string;
  modalBackdrop: string;
  commandPaletteFrame: string;
}

export interface ThemeMotionConfig {
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
  pressMs: number;
  distancePx: number;
}

export type ThemeMotion = ThemeMotionConfig;

export interface ThemeEffects {
  hover: {
    glow: boolean;
    glowColor: string;
    glowIntensity: number;
    glowSpread: number;
    glowLevels?: number;
    shadow: boolean;
    shadowColor: string;
    shadowIntensity: number;
    shadowOffset?: string;
    shimmer: boolean;
    shimmerColor: string;
    shimmerDuration: number;
    scanlines?: boolean;
    scanlinesOpacity?: number;
    chromatic?: boolean;
    chromaticOffset?: number;
    hologram?: boolean;
    hologramFlicker?: number;
    lightTrails?: boolean;
    colorShift?: boolean;
    dataStream?: boolean;
  };
  background: {
    gradient: boolean;
    gradientAngle: number;
    noise: boolean;
    noiseOpacity: number;
    pattern: string | null;
    gridSize?: number;
    gridOpacity?: number;
    scanlinePattern?: boolean;
  };
  border: {
    style: "solid" | "dashed" | "dotted" | "double";
    width: string;
    radius: string;
    glow: boolean;
    glowColor: string;
    animated?: boolean;
    animationType?: string;
    cornerClip?: boolean;
    clipSize?: number;
  };
}

export interface ThemeButtonConfig {
  type: "3d-pudding" | "flat-shadow" | "glass" | "standard";
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

export interface ThemeSpec {
  id: ThemeId;
  name: string;
  description: string;
  colorScheme: "light" | "dark";
  palette: ThemePalette;
  typography: ThemeTypography;
  effects: ThemeEffects;
  button: ThemeButtonConfig;
  foundation: ThemeFoundation;
  depth: ThemeDepth;
  componentProfile: ThemeComponentProfile;
  dataUi: ThemeDataUiProfile;
  overlays: ThemeOverlayProfile;
  motion: ThemeMotionConfig;
  signatures: string[];
}
