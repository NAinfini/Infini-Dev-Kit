import { useThemeSnapshot } from "../../provider/InfiniProvider";
import type { CardDispatchKey } from "./dispatch-types";

/**
 * Reads the active theme and returns the dispatch key
 * that determines which delegate card component to render.
 *
 * Priority:
 *  1. cyberpunk themeId → "cyberpunk"  (CyberpunkCard)
 *  2. 3d-pudding button type → "tilt"  (chibi)
 *  3. everything else → "glow"  (default, neu-brutalism, black-gold, red-gold)
 */
export function useCardDispatch(): CardDispatchKey {
  const { state, theme } = useThemeSnapshot();

  if (state.themeId === "cyberpunk") return "cyberpunk";
  if (theme.button.type === "3d-pudding") return "tilt";
  return "glow";
}
