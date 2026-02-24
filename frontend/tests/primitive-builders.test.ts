import { describe, expect, it } from "vitest";

import {
  buildAppShellStyle,
  buildDataTableFrameStyle,
  buildInputStyle,
  buildOverlayControlStyle,
  buildOverlayFrameStyle,
  buildPageStyle,
  buildPanelFrameStyle,
  buildPrimaryButtonStyle,
  buildSecondaryButtonStyle,
  buildSectionCardStyle,
  buildSelectStyle,
  buildTableStyle,
} from "../primitive-builders";
import type { ControlStyle, PrimitiveBoxStyle } from "../primitive-types";

const BASE_PRIMITIVE: PrimitiveBoxStyle = {
  background: "#fff",
  borderColor: "#111",
  borderWidth: 1,
  borderRadiusPx: 8,
  shadow: "none",
  color: "#111",
};

const BASE_CONTROL: ControlStyle = {
  ...BASE_PRIMITIVE,
  fontFamily: "Inter, sans-serif",
};

function assertPrimitiveShape(style: PrimitiveBoxStyle): void {
  expect(style.background).toBeTruthy();
  expect(style.borderColor).toBeTruthy();
  expect(style.borderWidth).toBeGreaterThanOrEqual(0);
  expect(style.borderRadiusPx).toBeGreaterThanOrEqual(0);
  expect(style.shadow).toBeTruthy();
  expect(style.color).toBeTruthy();
}

function assertControlShape(style: ControlStyle): void {
  assertPrimitiveShape(style);
  expect(style.fontFamily).toBeTruthy();
}

describe("primitive builders", () => {
  it("builds valid primitive box styles for all themes", () => {
    const themes = ["default", "chibi", "cyberpunk", "neu-brutalism", "black-gold", "red-gold"] as const;

    for (const themeId of themes) {
      assertPrimitiveShape(buildAppShellStyle(themeId, BASE_PRIMITIVE));
      assertPrimitiveShape(buildPageStyle(themeId, BASE_PRIMITIVE));
      assertPrimitiveShape(buildSectionCardStyle(themeId, BASE_PRIMITIVE));
      assertPrimitiveShape(buildPanelFrameStyle(themeId, BASE_PRIMITIVE));
      assertPrimitiveShape(buildDataTableFrameStyle(themeId, BASE_PRIMITIVE));
      assertPrimitiveShape(buildOverlayFrameStyle(themeId, BASE_PRIMITIVE, "toast"));
      assertPrimitiveShape(buildOverlayFrameStyle(themeId, BASE_PRIMITIVE, "confirm"));
      assertPrimitiveShape(buildOverlayFrameStyle(themeId, BASE_PRIMITIVE, "command"));
    }
  });

  it("builds valid control styles for all themes", () => {
    const themes = ["default", "chibi", "cyberpunk", "neu-brutalism", "black-gold", "red-gold"] as const;

    for (const themeId of themes) {
      assertControlShape(buildPrimaryButtonStyle(themeId, BASE_CONTROL));
      assertControlShape(buildSecondaryButtonStyle(themeId, BASE_CONTROL));
      assertControlShape(buildInputStyle(themeId, BASE_CONTROL));
      assertControlShape(buildSelectStyle(themeId, BASE_CONTROL));
      assertControlShape(buildTableStyle(themeId, BASE_CONTROL));
      assertControlShape(buildOverlayControlStyle(themeId, BASE_CONTROL, "modal"));
      assertControlShape(buildOverlayControlStyle(themeId, BASE_CONTROL, "toast"));
    }
  });

  it("applies expected signatures for themed variants", () => {
    const cyberPrimary = buildPrimaryButtonStyle("cyberpunk", BASE_CONTROL);
    const chibiPanel = buildPanelFrameStyle("chibi", BASE_PRIMITIVE);
    const redGoldOverlay = buildOverlayFrameStyle("red-gold", BASE_PRIMITIVE, "toast");

    expect(cyberPrimary.clipPath).toContain("polygon");
    expect(chibiPanel.borderRadiusCss).toContain("/");
    expect(redGoldOverlay.cornerAccent).toBe("imperial-frame");
  });
});
