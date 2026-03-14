import { describe, expect, it } from "vitest";

import {
  isMotionAllowed,
  type MotionMode,
} from "../motion";

const allModes: MotionMode[] = ["full", "reduced", "minimum", "off"];

describe("MotionMode coverage", () => {
  it("accepts all defined modes", () => {
    for (const mode of allModes) {
      expect(mode).toBeTruthy();
    }
  });
});

describe("isMotionAllowed", () => {
  it("allows full, reduced, and minimum motion", () => {
    expect(isMotionAllowed("full")).toBe(true);
    expect(isMotionAllowed("reduced")).toBe(true);
    expect(isMotionAllowed("minimum")).toBe(true);
  });

  it("disables motion when mode is off", () => {
    expect(isMotionAllowed("off")).toBe(false);
  });
});
