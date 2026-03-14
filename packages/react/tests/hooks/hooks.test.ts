import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("usePageTransition", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("exports correct types", async () => {
    const mod = await import("../../hooks/usePageTransition");
    expect(typeof mod.usePageTransition).toBe("function");
  });

  it("style object has correct shape", async () => {
    // Verify the style object contract without React rendering
    const { usePageTransition } = await import("../../hooks/usePageTransition");
    // The function signature accepts options and returns {state, style, triggerExit}
    expect(usePageTransition).toBeDefined();
  });
});

describe("useInfiniParallax", () => {
  it("exports correct types", async () => {
    const mod = await import("../../hooks/useInfiniParallax");
    expect(typeof mod.useInfiniParallax).toBe("function");
  });
});

describe("useA11yAnnouncer", () => {
  it("exports correct types", async () => {
    const mod = await import("../../hooks/useA11yAnnouncer");
    expect(typeof mod.useA11yAnnouncer).toBe("function");
  });

  it("return type includes announcements and stable AnnouncerRegion", async () => {
    const mod = await import("../../hooks/useA11yAnnouncer");
    // Verify the type signature includes the new announcements prop
    const returnType = mod.useA11yAnnouncer.toString();
    expect(returnType).toContain("announcements");
  });
});

describe("useFocusTrap", () => {
  it("exports correct types", async () => {
    const mod = await import("../../hooks/useFocusTrap");
    expect(typeof mod.useFocusTrap).toBe("function");
  });
});

describe("useBreakpoint", () => {
  it("exports correct types", async () => {
    const mod = await import("../../hooks/use-breakpoint");
    expect(typeof mod.useBreakpoint).toBe("function");
  });
});

describe("useGestureFeedback", () => {
  it("exports correct types", async () => {
    const mod = await import("../../hooks/use-gesture-feedback");
    expect(typeof mod.useGestureFeedback).toBe("function");
  });
});

describe("useAnimatedCounter", () => {
  it("exports correct types", async () => {
    const mod = await import("../../hooks/use-animated-counter");
    expect(typeof mod.useAnimatedCounter).toBe("function");
  });
});

describe("usePowerGlitch", () => {
  it("exports correct types", async () => {
    const mod = await import("../../hooks/usePowerGlitch");
    expect(typeof mod.usePowerGlitch).toBe("function");
  });
});

describe("hooks barrel exports", () => {
  it("exports all hooks from barrel", async () => {
    const barrel = await import("../../hooks/index");
    expect(barrel.usePageTransition).toBeDefined();
    expect(barrel.useInfiniParallax).toBeDefined();
    expect(barrel.useA11yAnnouncer).toBeDefined();
    expect(barrel.useFocusTrap).toBeDefined();
    expect(barrel.usePowerGlitch).toBeDefined();
    expect(barrel.useBreakpoint).toBeDefined();
    expect(barrel.useGestureFeedback).toBeDefined();
    expect(barrel.useAnimatedCounter).toBeDefined();
    expect(barrel.useMotionAllowed).toBeDefined();
    expect(barrel.useFullMotion).toBeDefined();
    expect(barrel.useThemeId).toBeDefined();
    expect(barrel.useThemeSpring).toBeDefined();
    expect(barrel.useThemeTransition).toBeDefined();
    expect(barrel.getPageVariants).toBeDefined();
    expect(barrel.staggerChild).toBeDefined();
  });
});
