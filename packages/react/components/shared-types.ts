import type { ComponentPropsWithoutRef } from "react";

/**
 * Properties that conflict between React HTML attributes and Motion's event handlers.
 * These must be omitted when spreading `...rest` onto `motion.*` elements.
 */
type MotionConflictingProps =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragOver"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

/** Base HTML attribute types for forwardRef components (Motion-safe) */
export type DivProps = Omit<ComponentPropsWithoutRef<"div">, MotionConflictingProps>;
export type ButtonProps = Omit<ComponentPropsWithoutRef<"button">, MotionConflictingProps>;
export type SpanProps = Omit<ComponentPropsWithoutRef<"span">, MotionConflictingProps>;
export type CanvasProps = Omit<ComponentPropsWithoutRef<"canvas">, MotionConflictingProps>;
export type FormProps = Omit<ComponentPropsWithoutRef<"form">, MotionConflictingProps>;
export type AnchorProps = Omit<ComponentPropsWithoutRef<"a">, MotionConflictingProps>;
