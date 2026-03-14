import { afterEach, describe, expect, it, vi } from "vitest";

import { startViewTransition } from "../view-transition";

const originalDocument = globalThis.document;

afterEach(() => {
  if (originalDocument === undefined) {
    Reflect.deleteProperty(globalThis, "document");
  } else {
    Object.defineProperty(globalThis, "document", { configurable: true, value: originalDocument });
  }
});

describe("startViewTransition", () => {
  it("uses native startViewTransition when available", () => {
    const update = vi.fn();
    const start = vi.fn((callback: () => void) => {
      callback();
      return { finished: Promise.resolve() };
    });

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: { startViewTransition: start },
    });

    startViewTransition(update);

    expect(start).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(1);
  });

  it("falls back to update when startViewTransition throws", () => {
    const update = vi.fn();

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        startViewTransition: () => {
          throw new Error("unsupported");
        },
      },
    });

    startViewTransition(update);
    expect(update).toHaveBeenCalledTimes(1);
  });

  it("falls back to update when API is unavailable", () => {
    const update = vi.fn();

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {},
    });

    startViewTransition(update);
    expect(update).toHaveBeenCalledTimes(1);
  });
});
