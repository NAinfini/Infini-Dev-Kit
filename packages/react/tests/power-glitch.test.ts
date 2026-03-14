import { describe, expect, it } from "vitest";

import { PowerGlitch, mergeOptions, type PowerGlitchOptions } from "../components/effects/animation/PowerGlitch";

describe("PowerGlitch", () => {
  it("returns the original click defaults", () => {
    const options = PowerGlitch.getDefaultOptions("click");

    expect(options.playMode).toBe("click");
    expect(options.timing.duration).toBe(250);
    expect(options.timing.iterations).toBe(1);
    expect(options.slice.count).toBe(15);
    expect(options.glitchTimeSpan).toEqual({ start: 0, end: 1 });
  });

  it("deep merges nested options without overwriting siblings with undefined", () => {
    const merged = mergeOptions(
      PowerGlitch.getDefaultOptions("hover"),
      {
        timing: { duration: 900, easing: "ease-in-out" },
        pulse: { scale: 1.12 },
        slice: { count: 8 },
      },
      {
        timing: { easing: undefined },
      },
    ) as PowerGlitchOptions;

    expect(merged.timing.duration).toBe(900);
    expect(merged.timing.iterations).toBe(1);
    expect(merged.timing.easing).toBe("ease-in-out");
    expect(merged.pulse).toEqual({ scale: 1.12 });
    expect(merged.slice.count).toBe(8);
    expect(merged.slice.velocity).toBe(15);
  });

  it("generates one base layer plus the configured slice layers", () => {
    const options = mergeOptions(PowerGlitch.getDefaultOptions("always"), {
      pulse: { scale: 1.08 },
      slice: { count: 4 },
    }) as PowerGlitchOptions;

    const layers = PowerGlitch.generateLayers(options);

    expect(layers).toHaveLength(6);
    expect(layers[0].steps.length).toBeGreaterThan(0);
    expect(layers[1].steps).toEqual([
      { transform: "scale(1)", opacity: "1" },
      { transform: "scale(1.08)", opacity: "0" },
    ]);
  });
});
