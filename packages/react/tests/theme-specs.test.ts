import { describe, expect, it } from "vitest";

import { getThemeSpec, listThemeIds, listThemeSpecs } from "@infini-dev-kit/theme-core";

describe("theme specs", () => {
  it("contains all six themes", () => {
    const themes = listThemeSpecs();
    expect(themes).toHaveLength(6);

    const ids = new Set(themes.map((theme) => theme.id));
    expect(ids.size).toBe(6);
  });

  it("matches cyberpunk reference details", () => {
    const cyberpunk = getThemeSpec("cyberpunk");

    expect(cyberpunk.palette.primary).toBe("#00D4E0");
    expect(cyberpunk.palette.secondary).toBe("#E0D400");
    expect(cyberpunk.palette.accent).toBe("#FF2A6D");
    expect(cyberpunk.palette.success).toBe("#00E08C");
    expect(cyberpunk.foundation.background).toBe("#07070C");
    expect(cyberpunk.foundation.backgroundPattern).toBe("circuit-scanline");
    expect(cyberpunk.typography.en.heading).toContain("YouShe BiaoTiHei");
    expect(cyberpunk.typography.en.mono).toContain("monospace");
  });

  it("matches chibi reference details", () => {
    const chibi = getThemeSpec("chibi");

    expect(chibi.palette.primary).toBe("#FF7EB6");
    expect(chibi.palette.secondary).toBe("#7AA7FF");
    expect(chibi.palette.success).toBe("#34B87A");
    expect(chibi.palette.warning).toBe("#E5A820");
    expect(chibi.palette.danger).toBe("#E84855");
    expect(chibi.depth.buttonShadow).toBe("0 5px 0 rgba(194,168,205,0.65), inset 0 1px 0 rgba(255,255,255,0.8)");
    expect(chibi.depth.buttonShadowHover).toBe("0 7px 0 rgba(194,168,205,0.75), inset 0 1px 0 rgba(255,255,255,0.85)");
    expect(chibi.depth.buttonShadowPressed).toBe("0 1px 0 rgba(194,168,205,0.4), inset 0 1px 0 rgba(255,255,255,0.6)");
    expect(chibi.foundation.background).toBe("#FFF7FB");
    expect(chibi.foundation.backgroundPattern).toBe("chibi-sparkle-grid");
    expect(chibi.typography.en.heading).toContain("MaoKen ZhuYuanTi");
    expect(chibi.motion.bounce).toBeGreaterThan(0);
  });

  it("matches red-gold reference details", () => {
    const redGold = getThemeSpec("red-gold");

    expect(redGold.palette.primary).toBe("#ED2939");
    expect(redGold.palette.secondary).toBe("#D4AF37");
    expect(redGold.palette.accent).toBe("#900101");
    expect(redGold.palette.success).toBe("#4CAF50");
    expect(redGold.palette.danger).toBe("#D44841");
    expect(redGold.foundation.background).toBe("#08070A");
    expect(redGold.foundation.backgroundPattern).toBe("imperial-grain");
    expect(redGold.foundation.borderColor).toBe("#BD8B33");
    expect(redGold.typography.en.heading).toContain("SanJi XingKai JianTi");
  });

  it("applies brutalism border language", () => {
    const brutal = getThemeSpec("neu-brutalism");

    expect(brutal.palette.primary).toBe("#FF6B6B");
    expect(brutal.palette.secondary).toBe("#E5B800");
    expect(brutal.palette.accent).toBe("#9B8AE0");
    expect(brutal.palette.textMuted).toBe("#555555");
    expect(brutal.foundation.background).toBe("#FFFDF5");
    expect(brutal.foundation.borderWidth).toBeGreaterThanOrEqual(4);
    expect(brutal.foundation.borderColor).toBe("#000000");
    expect(brutal.foundation.radius).toBe(0);
    expect(brutal.motion.easing).toBe("cubic-bezier(0.2, 0, 0, 1)");
  });

  it("uses intentional typography pairings for cyberpunk and black-gold themes", () => {
    const cyberpunk = getThemeSpec("cyberpunk");
    const brutal = getThemeSpec("neu-brutalism");
    const blackGold = getThemeSpec("black-gold");

    expect(cyberpunk.typography.en.heading).toContain("YouShe BiaoTiHei");
    expect(brutal.typography.en.heading).toContain("MaoKen ShiJinHei");
    expect(blackGold.typography.en.heading).toContain("YouShe YuFeiTe JianKangTi");
    expect(blackGold.typography.en.body).toContain("YouShe YuFeiTe JianKangTi");
    expect(blackGold.palette.accent).toBe("#CCA84A");
    expect(blackGold.foundation.backgroundPattern).toBe("aurum-grain");
  });

  it("defines component and overlay signatures for every theme", () => {
    for (const themeId of listThemeIds()) {
      const theme = getThemeSpec(themeId) as unknown as Record<string, unknown>;

      expect(theme).toHaveProperty("componentProfile");
      expect(theme).toHaveProperty("dataUi");
      expect(theme).toHaveProperty("overlays");
      expect(theme).toHaveProperty("motion");
      expect(theme).toHaveProperty("effects");
      expect(theme).toHaveProperty("button");
    }
  });

  it("provides i18n typography and advanced motion fields", () => {
    const cyberpunk = getThemeSpec("cyberpunk");

    expect(cyberpunk.typography.en.heading).toContain("YouShe BiaoTiHei");
    expect(cyberpunk.typography.zh.body).toContain("YouShe BiaoTiHei");
    expect(cyberpunk.typography.weights.bold).toBeGreaterThanOrEqual(700);
    expect(cyberpunk.motion.hoverScale).toBeGreaterThan(1);
    expect(cyberpunk.motion.tiltEnabled).toBe(true);
    expect(cyberpunk.button.progressEnabled).toBe(true);
    expect(cyberpunk.effects.hover.scanlines).toBe(true);
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
