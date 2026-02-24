import { afterEach, describe, expect, it, vi } from "vitest";

import { createScrollReactiveVar } from "../scroll";

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;

function restoreDomGlobals() {
  if (originalWindow === undefined) {
    Reflect.deleteProperty(globalThis, "window");
  } else {
    Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
  }

  if (originalDocument === undefined) {
    Reflect.deleteProperty(globalThis, "document");
  } else {
    Object.defineProperty(globalThis, "document", { configurable: true, value: originalDocument });
  }
}

afterEach(() => {
  restoreDomGlobals();
});

describe("createScrollReactiveVar", () => {
  it("synchronizes scroll position and cleans up listeners", () => {
    const setProperty = vi.fn();
    const removeProperty = vi.fn();
    let onScroll: (() => void) | undefined;

    const mockWindow = {
      scrollY: 12.345,
      addEventListener: vi.fn((event: string, callback: () => void) => {
        if (event === "scroll") {
          onScroll = callback;
        }
      }),
      removeEventListener: vi.fn(),
    };

    const mockDocument = {
      documentElement: {
        style: {
          setProperty,
          removeProperty,
        },
      },
    };

    Object.defineProperty(globalThis, "window", { configurable: true, value: mockWindow });
    Object.defineProperty(globalThis, "document", { configurable: true, value: mockDocument });

    const cleanup = createScrollReactiveVar();

    expect(setProperty).toHaveBeenCalledWith("--scroll-y", "12.35");

    mockWindow.scrollY = 25;
    onScroll?.();
    expect(setProperty).toHaveBeenLastCalledWith("--scroll-y", "25.00");

    cleanup();
    expect(mockWindow.removeEventListener).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(removeProperty).toHaveBeenCalledWith("--scroll-y");
  });

  it("supports custom css variable and target", () => {
    const setProperty = vi.fn();
    const removeProperty = vi.fn();

    const mockWindow = {
      scrollY: 44,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    const mockDocument = {
      documentElement: {
        style: {
          setProperty: vi.fn(),
          removeProperty: vi.fn(),
        },
      },
    };

    Object.defineProperty(globalThis, "window", { configurable: true, value: mockWindow });
    Object.defineProperty(globalThis, "document", { configurable: true, value: mockDocument });

    const target = { style: { setProperty, removeProperty } } as unknown as HTMLElement;
    const cleanup = createScrollReactiveVar({ property: "--custom-scroll", target });

    expect(setProperty).toHaveBeenCalledWith("--custom-scroll", "44.00");
    cleanup();
    expect(removeProperty).toHaveBeenCalledWith("--custom-scroll");
  });

  it("is a no-op when window/document are unavailable", () => {
    Reflect.deleteProperty(globalThis, "window");
    Reflect.deleteProperty(globalThis, "document");

    expect(() => createScrollReactiveVar()).not.toThrow();
  });
});
