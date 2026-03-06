import type { ThemeId } from "../../theme/theme-types";
import { useThemeSnapshot } from "../../provider/InfiniProvider";
import type { CardDispatchKey } from "./dispatch-types";

/**
 * Maps each theme to its dedicated card variant.
 *
 *  cyberpunk    → CyberpunkCard  (neon HUD + glitch-on-hover)
 *  chibi        → ChibiCard      (kawaii sticker — soft shadow, gentle float)
 *  neu-brutalism→ NeuBrutalCard  (hard shadow, sticker-stack)
 *  default      → GlowCard       (spotlight — radial gradient)
 *  black-gold   → GlowCard       (laser — rotating conic + crosshair)
 *  red-gold     → GlowCard       (cosmic — particle nebula)
 */
const THEME_CARD_MAP: Record<ThemeId, CardDispatchKey> = {
  cyberpunk: "cyberpunk",
  chibi: "chibi",
  "neu-brutalism": "neu-brutal",
  default: "glow",
  "black-gold": "glow-laser",
  "red-gold": "glow-cosmic",
};

export function useCardDispatch(): CardDispatchKey {
  const { state } = useThemeSnapshot();
  return THEME_CARD_MAP[state.themeId] ?? "glow";
}
