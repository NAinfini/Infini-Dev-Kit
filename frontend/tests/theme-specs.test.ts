import { describe, expect, it } from "vitest";

import { getThemeSpec, listThemeIds, listThemeSpecs } from "../theme-specs";

describe("theme specs", () => {
  it("contains all six themes", () => {
    const themes = listThemeSpecs();
    expect(themes).toHaveLength(6);

    const ids = new Set(themes.map((theme) => theme.id));
    expect(ids.size).toBe(6);
  });

  it("matches cyberpunk reference details", () => {
    const cyberpunk = getThemeSpec("cyberpunk");

    expect(cyberpunk.palette.primary).toBe("#00F0FF");
    expect(cyberpunk.palette.secondary).toBe("#FCEE0A");
    expect(cyberpunk.palette.accent).toBe("#FF2A6D");
    expect(cyberpunk.foundation.background).toBe("#07070C");
    expect(cyberpunk.foundation.backgroundPattern).toBe("circuit-scanline");
    expect(cyberpunk.typography.display).toContain("Orbitron");
    expect(cyberpunk.typography.mono).toContain("JetBrains Mono");
  });

  it("matches chibi reference details", () => {
    const chibi = getThemeSpec("chibi");

    expect(chibi.palette.primary).toBe("#FF7EB6");
    expect(chibi.palette.secondary).toBe("#7AA7FF");
    expect(chibi.foundation.background).toBe("#FFF7FB");
    expect(chibi.foundation.backgroundPattern).toBe("chibi-sparkle-grid");
    expect(chibi.typography.display).toContain("M PLUS Rounded 1c");
    expect(chibi.motion.overshoot).toBeGreaterThan(0);
  });

  it("matches red-gold reference details", () => {
    const redGold = getThemeSpec("red-gold");

    expect(redGold.palette.primary).toBe("#ED2939");
    expect(redGold.palette.secondary).toBe("#D4AF37");
    expect(redGold.palette.accent).toBe("#900101");
    expect(redGold.foundation.background).toBe("#08070A");
    expect(redGold.foundation.backgroundPattern).toBe("imperial-grain");
    expect(redGold.typography.display).toContain("Space Grotesk");
  });

  it("applies brutalism border language", () => {
    const brutal = getThemeSpec("neu-brutalism");

    expect(brutal.palette.primary).toBe("#FF6B6B");
    expect(brutal.palette.secondary).toBe("#FFD93D");
    expect(brutal.palette.accent).toBe("#C4B5FD");
    expect(brutal.foundation.background).toBe("#FFFDF5");
    expect(brutal.foundation.borderWidth).toBeGreaterThanOrEqual(4);
    expect(brutal.foundation.borderColor).toBe("#000000");
    expect(brutal.foundation.radius).toBe(0);
    expect(brutal.motion.easing).toBe("linear");
  });

  it("uses intentional typography pairings for cyberpunk and black-gold themes", () => {
    const cyberpunk = getThemeSpec("cyberpunk");
    const brutal = getThemeSpec("neu-brutalism");
    const blackGold = getThemeSpec("black-gold");

    expect(cyberpunk.typography.display).toContain("Orbitron");
    expect(brutal.typography.display).toContain("Space Grotesk");
    expect(blackGold.typography.display).toContain("Space Grotesk");
    expect(blackGold.typography.body).toContain("Inter");
    expect(blackGold.foundation.backgroundPattern).toBe("aurum-grain");
  });

  it("defines component and overlay signatures for every theme", () => {
    for (const themeId of listThemeIds()) {
      const theme = getThemeSpec(themeId) as unknown as Record<string, unknown>;

      expect(theme).toHaveProperty("componentProfile");
      expect(theme).toHaveProperty("dataUi");
      expect(theme).toHaveProperty("overlays");
      expect(theme).toHaveProperty("motion");
    }
  });

  it("provides structured shadow variants for every theme foundation", () => {
    for (const themeId of listThemeIds()) {
      const theme = getThemeSpec(themeId);
      expect(theme.foundation.shadow).toBeTruthy();
      expect(theme.foundation.shadowSm).toBeTruthy();
      expect(theme.foundation.shadowLg).toBeTruthy();
      expect(theme.foundation.shadowHover).toBeTruthy();
      expect(theme.foundation.shadowPressed).toBeTruthy();
    }
  });
});
