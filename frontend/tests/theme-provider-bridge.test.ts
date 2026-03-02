import { describe, expect, it, vi } from "vitest";

import { createThemeProviderBridge } from "../theme/theme-provider-bridge";

describe("createThemeProviderBridge", () => {
  it("exposes a single provider snapshot for host wrappers", () => {
    const bridge = createThemeProviderBridge({
      scope: "portal",
      defaultState: {
        themeId: "cyberpunk",
        motionMode: "full",
      },
    });

    const snapshot = bridge.getSnapshot();

    expect(snapshot.theme.id).toBe("cyberpunk");
    expect(snapshot.scope.className).toBe("infini-theme-scope-portal");
    expect(snapshot.scope.variables.selector).toBe(".infini-theme-scope-portal");
    expect(snapshot.mantine.colorScheme).toBe("dark");
    expect(snapshot.motion.effectiveMode).toBe("full");
    expect(snapshot.mantine.components.Card.colorBorderSecondary).toBeTruthy();
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

  it("supports minimum mode contracts", () => {
    const bridge = createThemeProviderBridge({
      defaultState: {
        themeId: "default",
        motionMode: "minimum",
      },
    });

    const snapshot = bridge.getSnapshot();

    expect(snapshot.motion.effectiveMode).toBe("minimum");
    expect(snapshot.motion.contracts.enter.durationMs).toBe(60);
    expect(snapshot.motion.contracts.enter.distancePx).toBe(0);
  });
});
