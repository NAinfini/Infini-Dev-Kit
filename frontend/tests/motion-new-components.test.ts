import { describe, expect, it } from "vitest";

import {
  GlowBorder,
  PageTransition,
  ShimmerButton,
  TiltCard,
} from "../components";

function isRenderableExport(value: unknown): boolean {
  const type = typeof value;
  return type === "function" || type === "object";
}

describe("new motion components", () => {
  it("exports reusable motion primitives", () => {
    expect(isRenderableExport(TiltCard)).toBe(true);
    expect(isRenderableExport(ShimmerButton)).toBe(true);
    expect(isRenderableExport(PageTransition)).toBe(true);
    expect(isRenderableExport(GlowBorder)).toBe(true);
  });
});
