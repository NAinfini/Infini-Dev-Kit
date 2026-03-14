import { describe, expect, it } from "vitest";

import type { MotionContract } from "@infini-dev-kit/theme-core";
import type { SpringProfile } from "../motion-types";
import { resolveThemeTransition } from "../hooks/transition-utils";

const contract: MotionContract = {
  durationMs: 220,
  easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  distancePx: 6,
  scaleFrom: 0.99,
  opacityFrom: 0.85,
  spring: {
    stiffness: 300,
    damping: 24,
    mass: 0.8,
    bounce: 0.15,
  },
};

const spring: SpringProfile = {
  stiffness: 300,
  damping: 24,
  mass: 0.8,
  bounce: 0.15,
};

describe("resolveThemeTransition", () => {
  it("returns a spring transition for full motion", () => {
    const transition = resolveThemeTransition("full", contract, spring);

    expect(transition).toMatchObject({
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 0.8,
      bounce: 0.15,
    });
  });

  it("returns short linear tween for reduced mode", () => {
    const transition = resolveThemeTransition("reduced", contract, spring);

    expect(transition).toMatchObject({ type: "tween", ease: "linear" });
    expect((transition as { duration: number }).duration).toBeLessThanOrEqual(0.12);
  });

  it("returns fixed linear tween for minimum mode", () => {
    const transition = resolveThemeTransition("minimum", contract, spring);

    expect(transition).toMatchObject({ type: "tween", ease: "linear", duration: 0.06 });
  });

  it("returns instant transition for off mode", () => {
    const transition = resolveThemeTransition("off", contract, spring);

    expect(transition).toMatchObject({ type: "tween", duration: 0 });
  });
});
