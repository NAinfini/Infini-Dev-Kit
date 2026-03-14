import { describe, expect, it, vi } from "vitest";

import {
  createThemeController,
  type ThemeControllerState,
} from "@infini-dev-kit/theme-core";

function createMemoryStorage() {
  const map = new Map<string, string>();

  return {
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
    removeItem(key: string) {
      map.delete(key);
    },
  };
}

describe("createThemeController", () => {
  it("uses defaults in uncontrolled mode", () => {
    const controller = createThemeController({
      defaultState: {
        themeId: "default",
        motionMode: "full",
      },
    });

    expect(controller.getState()).toEqual({
      themeId: "default",
      motionMode: "full",
    });

    controller.setTheme("cyberpunk");

    expect(controller.getState().themeId).toBe("cyberpunk");
  });

  it("loads persisted state before defaults", () => {
    const storage = createMemoryStorage();
    storage.setItem(
      "infini.theme",
      JSON.stringify({
        version: 1,
        state: {
          themeId: "cyberpunk",
          motionMode: "reduced",
        },
      }),
    );

    const controller = createThemeController({
      storage,
      storageKey: "infini.theme",
      defaultState: {
        themeId: "default",
        motionMode: "full",
      },
    });

    expect(controller.getState()).toEqual({
      themeId: "cyberpunk",
      motionMode: "reduced",
    });
  });

  it("persists updates in uncontrolled mode", () => {
    const storage = createMemoryStorage();
    const controller = createThemeController({ storage, storageKey: "infini.theme" });

    controller.setTheme("chibi");

    const saved = JSON.parse(storage.getItem("infini.theme") ?? "{}") as {
      state?: ThemeControllerState;
    };
    expect(saved.state?.themeId).toBe("chibi");
  });

  it("supports controlled mode via callback", () => {
    const onChange = vi.fn();

    const controller = createThemeController({
      controlledState: {
        themeId: "default",
        motionMode: "full",
      },
      onChange,
    });

    controller.setTheme("chibi");

    expect(controller.getState().themeId).toBe("default");
    expect(onChange).toHaveBeenCalledWith({
      themeId: "chibi",
      motionMode: "full",
    });
  });

  it("exports and imports state", () => {
    const controller = createThemeController();

    controller.setTheme("cyberpunk");
    controller.setMotionMode("off");

    const exported = controller.exportState();

    const nextController = createThemeController();
    nextController.importState(exported);

    expect(nextController.getState()).toEqual({
      themeId: "cyberpunk",
      motionMode: "off",
    });
  });

  it("migrates persisted system mode to full", () => {
    const storage = createMemoryStorage();
    storage.setItem(
      "infini.theme",
      JSON.stringify({
        version: 1,
        state: {
          themeId: "default",
          motionMode: "system",
        },
      }),
    );

    const controller = createThemeController({
      storage,
      storageKey: "infini.theme",
    });

    expect(controller.getState().motionMode).toBe("full");
  });

  it("defaults to reduced when OS prefers reduced and no saved preference exists", () => {
    const controller = createThemeController({
      prefersReducedMotion: () => true,
    });

    expect(controller.getState().motionMode).toBe("reduced");
  });
});
