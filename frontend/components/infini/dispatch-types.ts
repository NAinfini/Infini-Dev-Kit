import type { ReactNode } from "react";

import type {
  DepthButtonProps,
  GlitchButtonProps,
  ShimmerButtonProps,
  TiltCardProps,
  CyberpunkCardProps,
  GlowCardProps,
} from "../../theme/motion-types";
import type { MotionInputFrameProps } from "../MotionInputFrame";

// ── Button dispatch ──

export type ButtonDispatchKey = "glitch" | "depth" | "shimmer";

export interface InfiniButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  before?: ReactNode;
  after?: ReactNode;
  disabled?: boolean;
  className?: string;
  /** Variant-specific overrides — only the active variant's overrides are applied */
  overrides?: {
    depth?: Partial<Omit<DepthButtonProps, "children" | "onClick" | "disabled" | "className" | "href" | "target" | "before" | "after">>;
    glitch?: Partial<Omit<GlitchButtonProps, "children" | "onClick" | "disabled" | "className" | "href">>;
    shimmer?: Partial<Omit<ShimmerButtonProps, "children" | "onClick" | "disabled" | "className" | "before" | "after">>;
  };
}

// ── Card dispatch ──

export type CardDispatchKey = "cyberpunk" | "tilt" | "glow";

export interface InfiniCardProps {
  children: ReactNode;
  className?: string;
  /** Variant-specific overrides — only the active variant's overrides are applied */
  overrides?: {
    tilt?: Partial<Omit<TiltCardProps, "children" | "className">>;
    cyberpunk?: Partial<Omit<CyberpunkCardProps, "children" | "className">>;
    glow?: Partial<Omit<GlowCardProps, "children" | "className">>;
  };
}

// ── Input dispatch ──

export type InfiniInputProps = MotionInputFrameProps;
