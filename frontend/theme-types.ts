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
  display: string;
  body: string;
  mono: string;
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
  shadowFocus?: string;
  focusRing: string;
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

export interface ThemeMotion {
  enterMs: number;
  exitMs: number;
  hoverMs: number;
  pressMs: number;
  easing: string;
  overshoot: number;
  distancePx: number;
}

export interface ThemeSpec {
  id: ThemeId;
  name: string;
  description: string;
  palette: ThemePalette;
  typography: ThemeTypography;
  foundation: ThemeFoundation;
  componentProfile: ThemeComponentProfile;
  dataUi: ThemeDataUiProfile;
  overlays: ThemeOverlayProfile;
  motion: ThemeMotion;
  signatures: string[];
}
