import { describe, expect, it, vi } from "vitest";

import { createOverlayService } from "../overlay-service";

describe("createOverlayService", () => {
  it("routes toast and confirm through registered handlers", async () => {
    const toast = vi.fn();
    const confirm = vi.fn(async () => true);

    const service = createOverlayService();
    service.register({ toast, confirm });

    const toastResult = service.toast({
      title: "Saved",
      status: "success",
    });
    const confirmResult = await service.confirm({
      title: "Delete",
      description: "This cannot be undone",
      intent: "danger",
    });

    expect(toastResult.delivered).toBe(true);
    expect(confirmResult).toBe(true);
    expect(toast).toHaveBeenCalledTimes(1);
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  it("returns defaults when handlers are missing", async () => {
    const service = createOverlayService();

    const toastResult = service.toast({ title: "No handler", status: "info" });
    const confirmResult = await service.confirm({
      title: "No handler",
      intent: "neutral",
    });

    expect(toastResult.delivered).toBe(false);
    expect(confirmResult).toBe(false);
  });

  it("supports unregistering handlers", async () => {
    const toast = vi.fn();
    const service = createOverlayService();

    const unregister = service.register({ toast });
    unregister();

    const toastResult = service.toast({ title: "After unregister", status: "info" });

    expect(toastResult.delivered).toBe(false);
    expect(toast).toHaveBeenCalledTimes(0);
  });
});
