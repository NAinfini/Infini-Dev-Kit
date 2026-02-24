export type ControlKind =
  | "button-primary"
  | "button-secondary"
  | "input"
  | "select"
  | "table"
  | "modal"
  | "toast";

export type CornerAccent = "none" | "cyber-bracket" | "imperial-frame";

export interface PrimitiveBoxStyle {
  background: string;
  borderColor: string;
  borderWidth: number;
  borderRadiusPx: number;
  shadow: string;
  color: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  clipPath?: string;
  cornerAccent?: CornerAccent;
  backdropFilter?: string;
  textTransform?: "none" | "uppercase";
  letterSpacing?: string;
  borderBottomWidth?: number;
  borderBottomColor?: string;
  borderRadiusCss?: string;
}

export interface PrimitiveStyles {
  appShell: PrimitiveBoxStyle;
  page: PrimitiveBoxStyle;
  sectionCard: PrimitiveBoxStyle;
  panelFrame: PrimitiveBoxStyle;
  statusChip: PrimitiveBoxStyle;
  metric: PrimitiveBoxStyle;
  inlineCode: PrimitiveBoxStyle;
  keyHint: PrimitiveBoxStyle;
  dataTableFrame: PrimitiveBoxStyle;
  toast: PrimitiveBoxStyle;
  confirm: PrimitiveBoxStyle;
  commandPaletteFrame: PrimitiveBoxStyle;
}

export interface ControlStyle extends PrimitiveBoxStyle {
  fontFamily: string;
}
