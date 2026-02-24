import { describe, expect, it, vi } from "vitest";

import { createThemeProviderBridge } from "../theme-provider-bridge";

describe("createThemeProviderBridge", () => {
  it("exposes a single provider snapshot for host wrappers", () => {
    const bridge = createThemeProviderBridge({
      scope: "portal",
      algorithms: ["dark", "compact"],
      defaultState: {
        themeId: "cyberpunk",
        motionMode: "system",
      },
      prefersReducedMotion: () => false,
    });

    const snapshot = bridge.getSnapshot();

    expect(snapshot.theme.id).toBe("cyberpunk");
    expect(snapshot.scope.className).toBe("infini-theme-scope-portal");
    expect(snapshot.scope.variables.selector).toBe(".infini-theme-scope-portal");
    expect(snapshot.antd.algorithm).toEqual(["dark", "compact"]);
    expect(snapshot.motion.effectiveMode).toBe("full");
    expect(snapshot.primitives.panelFrame.borderColor).toBe("#00F0FF");
  });

  it("notifies subscribers when theme state changes", () => {
    const bridge = createThemeProviderBridge();
    const listener = vi.fn();
    const unsubscribe = bridge.subscribe(listener);

    bridge.setTheme("chibi");

    expect(listener).toHaveBeenCalledTimes(1);
    const snapshot = listener.mock.calls[0]?.[0];
    expect(snapshot.theme.id).toBe("chibi");
    unsubscribe();
  });

  it("keeps overlays context-based (no static API dependency)", async () => {
    const bridge = createThemeProviderBridge();
    const toast = vi.fn();
    const confirm = vi.fn(async () => true);

    const unregister = bridge.overlays.register({ toast, confirm });

    const toastResult = bridge.overlays.toast({
      title: "Saved",
      status: "success",
    });
    const confirmResult = await bridge.overlays.confirm({
      title: "Delete",
      intent: "danger",
    });

    expect(toastResult.delivered).toBe(true);
    expect(confirmResult).toBe(true);
    expect(toast).toHaveBeenCalledTimes(1);
    expect(confirm).toHaveBeenCalledTimes(1);

    unregister();
  });

  it("respects reduced motion in system mode", () => {
    const bridge = createThemeProviderBridge({
      defaultState: {
        themeId: "default",
        motionMode: "system",
      },
      prefersReducedMotion: () => true,
    });

    const snapshot = bridge.getSnapshot();

    expect(snapshot.motion.effectiveMode).toBe("reduced");
    expect(snapshot.motion.contracts.enter.durationMs).toBeLessThanOrEqual(120);
  });
});
