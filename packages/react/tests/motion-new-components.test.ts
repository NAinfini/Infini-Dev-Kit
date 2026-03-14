import { describe, expect, it } from "vitest";

import * as components from "../components";

import {
  DepthButton,
  GlowBorder,
  PageTransition,
  PowerGlitch,
  ProgressButton,
  SocialButton,
  Tilt3DEffect,
} from "../components";

function isRenderableExport(value: unknown): boolean {
  const type = typeof value;
  return type === "function" || type === "object";
}

describe("component exports", () => {
  it("exports the remaining reusable primitives", () => {
    expect(isRenderableExport(Tilt3DEffect)).toBe(true);
    expect(isRenderableExport(DepthButton)).toBe(true);
    expect(isRenderableExport(ProgressButton)).toBe(true);
    expect(isRenderableExport(SocialButton)).toBe(true);
    expect(isRenderableExport(PageTransition)).toBe(true);
    expect(isRenderableExport(PowerGlitch)).toBe(true);
    expect(isRenderableExport(GlowBorder)).toBe(true);
  });

  it("exports the new base buttons and composable effects", () => {
    expect(isRenderableExport((components as Record<string, unknown>).SoftClayButton)).toBe(true);
    expect(isRenderableExport((components as Record<string, unknown>).CrystalPrismButton)).toBe(true);
    expect(isRenderableExport((components as Record<string, unknown>).SpectrumBorderEffect)).toBe(true);
    expect(isRenderableExport((components as Record<string, unknown>).LiquidFillEffect)).toBe(true);
    expect(isRenderableExport((components as Record<string, unknown>).ShimmerSweepEffect)).toBe(true);
  });

  it("does not export removed experimental buttons anymore", () => {
    expect("MotionButton" in components).toBe(false);
    expect("ShimmerButton" in components).toBe(false);
    expect("LiquidButton" in components).toBe(false);
    expect("GlitchButton" in components).toBe(false);
  });
});
