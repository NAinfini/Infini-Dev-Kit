import type { EffectiveMotionMode } from "../../utils/motion";

import { useThemeSnapshot } from "../provider/InfiniProvider";

export function useEffectiveMotionMode(): EffectiveMotionMode {
  return useThemeSnapshot().motion.effectiveMode;
}

export function useMotionAllowed(): boolean {
  return useEffectiveMotionMode() !== "off";
}

export function useFullMotion(): boolean {
  return useEffectiveMotionMode() === "full";
}
