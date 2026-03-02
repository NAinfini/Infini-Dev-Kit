import { describe, expect, it } from "vitest";

import { clampProgressScale } from "../components/ScrollProgress";

describe("scroll progress clamp", () => {
  it("clamps values below 0 to 0", () => {
    expect(clampProgressScale(-0.2)).toBe(0);
  });

  it("clamps values above 1 to 1", () => {
    expect(clampProgressScale(1.08)).toBe(1);
  });

  it("keeps values inside range unchanged", () => {
    expect(clampProgressScale(0.64)).toBe(0.64);
  });
});
