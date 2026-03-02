import { describe, expect, it } from "vitest";

import { createFocusVisibleState, reduceMotionTiming } from "../a11y";

describe("createFocusVisibleState", () => {
  it("marks keyboard focus as visible and pointer focus as not visible", () => {
    const focusState = createFocusVisibleState();

    focusState.onPointerDown();
    expect(focusState.isFocusVisible()).toBe(false);

    focusState.onKeyDown({ key: "Tab" });
    expect(focusState.isFocusVisible()).toBe(true);
  });
});

describe("reduce motion helpers", () => {
  it("reduces timing for reduced and off modes", () => {
    expect(reduceMotionTiming({ durationMs: 200, delayMs: 50 }, "full")).toEqual({
      durationMs: 200,
      delayMs: 50,
    });

    expect(reduceMotionTiming({ durationMs: 200, delayMs: 50 }, "reduced")).toEqual({
      durationMs: 100,
      delayMs: 0,
    });

    expect(reduceMotionTiming({ durationMs: 200, delayMs: 50 }, "minimum")).toEqual({
      durationMs: 60,
      delayMs: 0,
    });

    expect(reduceMotionTiming({ durationMs: 200, delayMs: 50 }, "off")).toEqual({
      durationMs: 0,
      delayMs: 0,
    });
  });
});
