import { describe, expect, it } from "vitest";

import { getButtonVariants } from "../hooks/variants/button-variants";
import { getInputVariants } from "../hooks/variants/input-variants";
import { getPageVariants } from "../hooks/variants/page-variants";
import { getRevealVariants } from "../hooks/variants/reveal-variants";

describe("motion variants", () => {
  it("gives chibi buttons a playful hover profile", () => {
    const variants = getButtonVariants("chibi");
    const hover = variants.hover as { scale?: number; rotate?: number };

    expect(hover.scale).toBeGreaterThan(1);
    expect(Math.abs(hover.rotate ?? 0)).toBeGreaterThan(0);
  });

  it("provides directional page transitions", () => {
    const variants = getPageVariants("default");
    const enter = variants.enter as ((direction: number) => { x: number; opacity: number });
    const exit = variants.exit as ((direction: number) => { x: number; opacity: number });

    expect(enter(1).x).toBeGreaterThan(0);
    expect(exit(1).x).toBeLessThan(0);
    expect(enter(-1).x).toBeLessThan(0);
  });

  it("uses compact reveals for cyberpunk", () => {
    const variants = getRevealVariants("cyberpunk");
    const hidden = variants.hidden as { x?: number; opacity: number };

    expect(hidden.opacity).toBe(0);
    expect(Math.abs(hidden.x ?? 0)).toBeGreaterThan(0);
  });

  it("releases cyberpunk reveal clip-path after animation completes", () => {
    const variants = getRevealVariants("cyberpunk");
    const visible = variants.visible as { transitionEnd?: { clipPath?: string } };

    expect(visible.transitionEnd?.clipPath).toBe("none");
  });

  it("adds glow box shadows to input focus and status variants", () => {
    const chibi = getInputVariants("chibi");
    const focus = chibi.focus as { boxShadow?: string };
    const error = chibi.error as { boxShadow?: string };
    const warning = chibi.warning as { boxShadow?: string };
    const success = chibi.success as { boxShadow?: string };

    expect(focus.boxShadow).toBe("var(--infini-glow-primary, none)");
    expect(error.boxShadow).toBe("var(--infini-glow-error, none)");
    expect(warning.boxShadow).toBe("var(--infini-glow-warning, none)");
    expect(success.boxShadow).toBe("var(--infini-glow-success, none)");
  });
});
