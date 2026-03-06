import type { ReactNode } from "react";

import type {
  DepthButtonProps,
  GlitchButtonProps,
  ShimmerButtonProps,
  ChibiCardProps,
  CyberpunkCardProps,
  GlowCardProps,
  NeuBrutalCardProps,
} from "../../theme/motion-types";

// ── Button dispatch ──

export type ButtonDispatchKey = "glitch" | "depth" | "shimmer";

export interface InfiniButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  before?: ReactNode;
  after?: ReactNode;
  /** HTML button type (default: "button") */
  htmlType?: "button" | "submit" | "reset";
  /** Show loading state — disables button and shows spinner */
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  /** Variant-specific overrides — only the active variant's overrides are applied */
  overrides?: {
    depth?: Partial<Omit<DepthButtonProps, "children" | "onClick" | "disabled" | "className" | "href" | "target" | "before" | "after" | "htmlType">>;
    glitch?: Partial<Omit<GlitchButtonProps, "children" | "onClick" | "disabled" | "className" | "href" | "htmlType">>;
    shimmer?: Partial<Omit<ShimmerButtonProps, "children" | "onClick" | "disabled" | "className" | "before" | "after" | "htmlType">>;
  };
}

// ── Card dispatch ──

export type CardDispatchKey = "cyberpunk" | "chibi" | "glow" | "glow-laser" | "glow-cosmic" | "neu-brutal";

export interface InfiniCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  /** When false, disables hover/tap/glow motion effects (container-only card). Default: true */
  interactive?: boolean;
  /** Variant-specific overrides — only the active variant's overrides are applied */
  overrides?: {
    chibi?: Partial<Omit<ChibiCardProps, "children" | "className">>;
    cyberpunk?: Partial<Omit<CyberpunkCardProps, "children" | "className">>;
    glow?: Partial<Omit<GlowCardProps, "children" | "className">>;
    neuBrutal?: Partial<Omit<NeuBrutalCardProps, "children" | "className">>;
  };
}

