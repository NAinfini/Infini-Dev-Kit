import { describe, expect, it } from "vitest";

import {
  contrastRatio,
  deriveActiveColor,
  deriveHoverColor,
  pickReadableTextColor,
} from "../color";

describe("color helpers", () => {
  it("derives hover/active colors", () => {
    expect(deriveHoverColor("#00F2FF")).not.toBe("#00F2FF");
    expect(deriveActiveColor("#00F2FF")).not.toBe("#00F2FF");
  });

  it("computes contrast ratio", () => {
    const ratio = contrastRatio("#000000", "#FFFFFF");
    expect(ratio).toBeGreaterThan(20.5);
  });

  it("picks readable text color", () => {
    expect(pickReadableTextColor("#000000")).toBe("#FFFFFF");
    expect(pickReadableTextColor("#FFFFFF")).toBe("#111111");
  });
});
