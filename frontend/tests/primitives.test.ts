import { describe, expect, it } from "vitest";

import { getControlStyle, getPrimitiveStyles } from "../primitives";

describe("primitives", () => {
  it("builds cyberpunk panel frame with neon style", () => {
    const styles = getPrimitiveStyles("cyberpunk");

    expect(styles.panelFrame.borderColor).toBe("#00F0FF");
    expect(styles.panelFrame.background).toBe("#10101C");
    expect(styles.panelFrame.clipPath).toContain("polygon");
    expect(styles.panelFrame.cornerAccent).toBe("cyber-bracket");
  });

  it("builds red-gold primary button from imperial reference", () => {
    const style = getControlStyle("red-gold", "button-primary");

    expect(style.background).toContain("#900101");
    expect(style.background).toContain("#ED2939");
    expect(style.borderColor).toBe("#D4AF37");
    expect(style.clipPath).toContain("polygon");
    expect(style.textTransform).toBe("uppercase");
  });

  it("builds black-gold controls with restrained metallic language", () => {
    const button = getControlStyle("black-gold", "button-primary");
    const panel = getPrimitiveStyles("black-gold").panelFrame;

    expect(button.background).toContain("#C8A43A");
    expect(button.borderColor).toBe("#8F7524");
    expect(button.textTransform).toBe("none");
    expect(panel.borderColor).toBe("#4A4452");
    expect(panel.shadow).toContain("rgba(212,175,55,0.16)");
  });

  it("builds chibi input with plush radius", () => {
    const button = getControlStyle("chibi", "button-primary");
    const style = getControlStyle("chibi", "input");
    const primitives = getPrimitiveStyles("chibi");

    expect(style.borderRadiusPx).toBeGreaterThanOrEqual(16);
    expect(style.fontFamily).toContain("Nunito");
    expect(primitives.appShell.backgroundImage).toContain("radial-gradient");
    expect(button.shadow).toContain("inset");
  });

  it("builds brutalism section card with hard border", () => {
    const styles = getPrimitiveStyles("neu-brutalism");
    const primaryButton = getControlStyle("neu-brutalism", "button-primary");

    expect(styles.sectionCard.borderWidth).toBe(4);
    expect(styles.sectionCard.shadow).toContain("8px");
    expect(primaryButton.background).toBe("#FF6B6B");
    expect(primaryButton.borderWidth).toBeGreaterThanOrEqual(4);
    expect(primaryButton.textTransform).toBe("uppercase");
  });
});
