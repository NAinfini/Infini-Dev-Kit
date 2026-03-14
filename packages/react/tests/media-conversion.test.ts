import { describe, expect, it, vi } from "vitest";

describe("media-conversion", () => {
  describe("getAudioConversionSupport", () => {
    it("reports unsupported when not in browser", async () => {
      vi.stubGlobal("window", undefined);
      // Force re-import
      const mod = await import("../utils/media-conversion");
      const result = mod.getAudioConversionSupport();
      expect(result.supported).toBe(false);
      if (!result.supported) {
        expect(result.reason).toContain("browser");
      }
      vi.unstubAllGlobals();
    });
  });

  describe("DEFAULT_IMAGE_WEBP_QUALITY", () => {
    it("exports a quality constant between 0 and 1", async () => {
      const mod = await import("../utils/media-conversion");
      expect(mod.DEFAULT_IMAGE_WEBP_QUALITY).toBeGreaterThan(0);
      expect(mod.DEFAULT_IMAGE_WEBP_QUALITY).toBeLessThanOrEqual(1);
    });
  });
});
