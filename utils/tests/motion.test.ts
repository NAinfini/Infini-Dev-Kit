import { describe, expect, it } from "vitest";

import {
  isMotionAllowed,
  resolveMotionPreference,
  type MotionMode,
} from "../motion";

const allModes: MotionMode[] = ["system", "full", "reduced", "off"];

describe("resolveMotionPreference", () => {
  it("resolves each explicit mode directly", () => {
    expect(resolveMotionPreference("full", true)).toBe("full");
    expect(resolveMotionPreference("reduced", false)).toBe("reduced");
    expect(resolveMotionPreference("off", false)).toBe("off");
  });

  it("resolves system mode from OS preference", () => {
    expect(resolveMotionPreference("system", false)).toBe("full");
    expect(resolveMotionPreference("system", true)).toBe("reduced");
  });

  it("accepts all defined modes", () => {
    for (const mode of allModes) {
      expect(resolveMotionPreference(mode, false)).toBeTruthy();
    }
  });
});

describe("isMotionAllowed", () => {
  it("allows full and reduced motion", () => {
    expect(isMotionAllowed("full")).toBe(true);
    expect(isMotionAllowed("reduced")).toBe(true);
  });

  it("disables motion when mode is off", () => {
    expect(isMotionAllowed("off")).toBe(false);
  });
});
