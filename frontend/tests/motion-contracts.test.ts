import { describe, expect, it } from "vitest";

import { getMotionContract } from "../theme/motion-contracts";

describe("getMotionContract", () => {
  it("keeps cyberpunk snappier than black-gold", () => {
    const cyberpunk = getMotionContract("cyberpunk", "hover", {
      mode: "full",
    });
    const luxury = getMotionContract("black-gold", "hover", {
      mode: "full",
    });

    expect(cyberpunk.durationMs).toBeLessThan(luxury.durationMs);
  });

  it("reduces and disables motion with accessibility modes", () => {
    const reduced = getMotionContract("default", "enter", {
      mode: "reduced",
    });

    const minimum = getMotionContract("default", "enter", {
      mode: "minimum",
    });

    const off = getMotionContract("default", "enter", {
      mode: "off",
    });

    expect(reduced.durationMs).toBeGreaterThan(0);
    expect(reduced.distancePx).toBe(0);
    expect(minimum.durationMs).toBe(60);
    expect(minimum.distancePx).toBe(0);
    expect(minimum.opacityFrom).toBe(0.92);
    expect(off.durationMs).toBe(0);
    expect(off.distancePx).toBe(0);
  });
});
