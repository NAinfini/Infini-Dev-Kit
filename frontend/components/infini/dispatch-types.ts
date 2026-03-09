import type { ComponentPropsWithoutRef, ElementType, MouseEventHandler, ReactNode } from "react";

type MotionConflictingProps =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragOver"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

type MotionSafeProps<T extends ElementType> = Omit<ComponentPropsWithoutRef<T>, MotionConflictingProps>;

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

export interface InfiniButtonProps extends Omit<MotionSafeProps<"button">, "children" | "onClick" | "disabled" | "type"> {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  href?: string;
  target?: string;
  before?: ReactNode;
  after?: ReactNode;
  /** HTML button type (default: "button") */
  htmlType?: "button" | "submit" | "reset";
  /** Show loading state — disables button and shows spinner */
  loading?: boolean;
  disabled?: boolean;
  /** Button size — mapped to variant-specific size systems */
  size?: "sm" | "md" | "lg";
  /** Variant-specific overrides — only the active variant's overrides are applied */
  overrides?: {
    depth?: Partial<Omit<DepthButtonProps, "children" | "onClick" | "disabled" | "className" | "href" | "target" | "before" | "after" | "htmlType">>;
    glitch?: Partial<Omit<GlitchButtonProps, "children" | "onClick" | "disabled" | "className" | "href" | "htmlType">>;
    shimmer?: Partial<Omit<ShimmerButtonProps, "children" | "onClick" | "disabled" | "className" | "before" | "after" | "htmlType">>;
  };
}

// ── Card dispatch ──

export type CardDispatchKey = "cyberpunk" | "chibi" | "glow" | "glow-laser" | "glow-cosmic" | "neu-brutal";

export interface InfiniCardProps extends Omit<MotionSafeProps<"div">, "children" | "onClick"> {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  /** When false, disables hover/tap/glow motion effects (container-only card). Default: true */
  interactive?: boolean;
  /** Inner content padding */
  padding?: string | number;
  /** Variant-specific overrides — only the active variant's overrides are applied */
  overrides?: {
    chibi?: Partial<Omit<ChibiCardProps, "children" | "className">>;
    cyberpunk?: Partial<Omit<CyberpunkCardProps, "children" | "className">>;
    glow?: Partial<Omit<GlowCardProps, "children" | "className">>;
    neuBrutal?: Partial<Omit<NeuBrutalCardProps, "children" | "className">>;
  };
}
