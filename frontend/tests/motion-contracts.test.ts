import { describe, expect, it } from "vitest";

import { getMotionContract } from "../motion-contracts";

describe("getMotionContract", () => {
  it("keeps cyberpunk snappier than black-gold", () => {
    const cyberpunk = getMotionContract("cyberpunk", "hover", {
      mode: "full",
      prefersReducedMotion: false,
    });
    const luxury = getMotionContract("black-gold", "hover", {
      mode: "full",
      prefersReducedMotion: false,
    });

    expect(cyberpunk.durationMs).toBeLessThan(luxury.durationMs);
  });

  it("reduces and disables motion with accessibility modes", () => {
    const reduced = getMotionContract("default", "enter", {
      mode: "reduced",
      prefersReducedMotion: false,
    });

    const off = getMotionContract("default", "enter", {
      mode: "off",
      prefersReducedMotion: false,
    });

    expect(reduced.durationMs).toBeGreaterThan(0);
    expect(reduced.distancePx).toBe(0);
    expect(off.durationMs).toBe(0);
    expect(off.distancePx).toBe(0);
  });

  it("respects system preference", () => {
    const contract = getMotionContract("default", "enter", {
      mode: "system",
      prefersReducedMotion: true,
    });

    expect(contract.durationMs).toBeLessThanOrEqual(120);
  });
});
