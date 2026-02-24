import { describe, expect, it, vi } from "vitest";

import {
  createThemeController,
  type ThemeControllerState,
} from "../theme-controller";

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
        motionMode: "system",
      },
    });

    expect(controller.getState()).toEqual({
      themeId: "default",
      motionMode: "system",
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
        motionMode: "system",
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
        motionMode: "system",
      },
      onChange,
    });

    controller.setTheme("chibi");

    expect(controller.getState().themeId).toBe("default");
    expect(onChange).toHaveBeenCalledWith({
      themeId: "chibi",
      motionMode: "system",
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
});
