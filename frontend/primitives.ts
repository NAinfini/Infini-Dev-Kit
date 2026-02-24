import { pickReadableTextColor } from "../utils/color";

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
  CYBER_CLIP_PATH,
} from "./primitive-builders";
import type {
  ControlKind,
  ControlStyle,
  PrimitiveBoxStyle,
  PrimitiveStyles,
} from "./primitive-types";
import { getThemeSpec, type ThemeId } from "./theme-specs";

export type {
  ControlKind,
  CornerAccent,
  PrimitiveBoxStyle,
  ControlStyle,
  PrimitiveStyles,
} from "./primitive-types";

export function getPrimitiveStyles(themeId: ThemeId): PrimitiveStyles {
  const theme = getThemeSpec(themeId);

  const base: PrimitiveBoxStyle = {
    background: theme.foundation.surface,
    borderColor: theme.foundation.borderColor,
    borderWidth: theme.foundation.borderWidth,
    borderRadiusPx: theme.foundation.radius,
    shadow: theme.foundation.shadow,
    color: theme.palette.text,
    cornerAccent: "none",
    textTransform: "none",
  };

  return {
    appShell: buildAppShellStyle(themeId, { ...base, background: theme.foundation.background }),
    page: buildPageStyle(themeId, { ...base, background: theme.foundation.surfaceAccent }),
    sectionCard: buildSectionCardStyle(themeId, { ...base }),
    panelFrame: buildPanelFrameStyle(themeId, {
      ...base,
      borderColor: theme.palette.primary,
    }),
    statusChip: {
      ...base,
      background: theme.palette.success,
      color: pickReadableTextColor(theme.palette.success),
      textTransform: themeId === "cyberpunk" || themeId === "red-gold" ? "uppercase" : "none",
      letterSpacing: themeId === "cyberpunk" ? "0.06em" : undefined,
      borderRadiusPx:
        theme.dataUi.statusShape === "dot" ? Math.max(8, Math.floor(base.borderRadiusPx * 0.4)) : base.borderRadiusPx,
    },
    metric: {
      ...base,
      borderColor: theme.palette.accent,
      clipPath: themeId === "cyberpunk" ? CYBER_CLIP_PATH : undefined,
    },
    inlineCode: {
      ...base,
      background: theme.foundation.surfaceAccent,
      borderRadiusPx: Math.max(4, Math.floor(theme.foundation.radius * 0.4)),
    },
    keyHint: {
      ...base,
      background: theme.foundation.surfaceAccent,
      borderRadiusPx: Math.max(4, Math.floor(theme.foundation.radius * 0.35)),
      textTransform: "uppercase",
      letterSpacing: "0.06em",
    },
    dataTableFrame: buildDataTableFrameStyle(themeId, { ...base, borderColor: theme.palette.primary }),
    toast: buildOverlayFrameStyle(themeId, { ...base, borderColor: theme.palette.accent }, "toast"),
    confirm: buildOverlayFrameStyle(themeId, { ...base, borderColor: theme.palette.warning }, "confirm"),
    commandPaletteFrame: buildOverlayFrameStyle(
      themeId,
      {
        ...base,
        borderColor: theme.palette.secondary,
        background: theme.foundation.surfaceAccent,
      },
      "command",
    ),
  };
}

export function getControlStyle(themeId: ThemeId, control: ControlKind): ControlStyle {
  const theme = getThemeSpec(themeId);
  const base: ControlStyle = {
    background: theme.foundation.surface,
    borderColor: theme.foundation.borderColor,
    borderWidth: theme.foundation.borderWidth,
    borderRadiusPx: theme.foundation.radius,
    shadow: theme.foundation.shadow,
    color: theme.palette.text,
    fontFamily: theme.typography.body,
    cornerAccent: "none",
    textTransform: "none",
  };

  switch (control) {
    case "button-primary":
      return buildPrimaryButtonStyle(themeId, base);
    case "button-secondary":
      return buildSecondaryButtonStyle(themeId, base);
    case "input":
      return buildInputStyle(themeId, base);
    case "select":
      return buildSelectStyle(themeId, base);
    case "table":
      return buildTableStyle(themeId, base);
    case "modal":
      return buildOverlayControlStyle(themeId, base, "modal");
    case "toast":
      return buildOverlayControlStyle(themeId, base, "toast");
    default:
      return base;
  }
}
