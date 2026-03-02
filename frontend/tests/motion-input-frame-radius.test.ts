import { describe, expect, it } from "vitest";

import { resolveBorderRadiusFromCorners } from "../components/MotionInputFrame";

describe("resolveBorderRadiusFromCorners", () => {
  it("returns joined corner radii when all values are present", () => {
    const radius = resolveBorderRadiusFromCorners(["12px", "10px", "8px", "6px"], "9px");

    expect(radius).toBe("12px 10px 8px 6px");
  });

  it("falls back when any corner value is missing", () => {
    const radius = resolveBorderRadiusFromCorners(["12px", "", "8px", "6px"], "9px");

    expect(radius).toBe("9px");
  });

  it("trims whitespace before joining values", () => {
    const radius = resolveBorderRadiusFromCorners([" 14px ", " 14px", "14px ", " 14px "], "9px");

    expect(radius).toBe("14px 14px 14px 14px");
  });
});
