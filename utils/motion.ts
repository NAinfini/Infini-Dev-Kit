export type MotionMode = "full" | "reduced" | "minimum" | "off";

export type EffectiveMotionMode = MotionMode;

export function isMotionAllowed(mode: EffectiveMotionMode): boolean {
  return mode !== "off";
}
