import { useThemeSnapshot } from "../../provider/InfiniProvider";
import type { ButtonDispatchKey } from "./dispatch-types";

/**
 * Reads the active theme's button signals and returns the dispatch key
 * that determines which delegate button component to render.
 *
 * Priority:
 *  1. glitchOnPress → "glitch"  (cyberpunk)
 *  2. 3d-pudding / flat-shadow → "depth"  (chibi, neu-brutalism)
 *  3. standard / glass → "shimmer"  (default, black-gold, red-gold)
 */
export function useButtonDispatch(): ButtonDispatchKey {
  const { theme } = useThemeSnapshot();

  if (theme.button.glitchOnPress) return "glitch";
  if (theme.button.type === "3d-pudding" || theme.button.type === "flat-shadow") return "depth";
  return "shimmer";
}
