export type MotionMode = "system" | "full" | "reduced" | "off";

export type EffectiveMotionMode = Exclude<MotionMode, "system">;

export function resolveMotionPreference(
  mode: MotionMode,
  prefersReducedMotion: boolean,
): EffectiveMotionMode {
  if (mode === "system") {
    return prefersReducedMotion ? "reduced" : "full";
  }

  return mode;
}

export function isMotionAllowed(mode: EffectiveMotionMode): boolean {
  return mode !== "off";
}
