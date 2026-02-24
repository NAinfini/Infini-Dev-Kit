import { deriveActiveColor, deriveHoverColor, pickReadableTextColor } from "../utils/color";

import { getThemeSpec, type ThemeId } from "./theme-specs";
import type { ControlStyle, PrimitiveBoxStyle } from "./primitive-types";

export const CYBER_CLIP_PATH =
  "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
export const IMPERIAL_CLIP_PATH =
  "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)";
export const CHIBI_HAND_DRAWN_RADIUS = "255px 15px 225px 15px / 15px 225px 15px 255px";

export function buildAppShellStyle(themeId: ThemeId, style: PrimitiveBoxStyle): PrimitiveBoxStyle {
  switch (themeId) {
    case "cyberpunk":
      return {
        ...style,
        backgroundImage:
          "linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px), radial-gradient(circle at 20% 10%, rgba(252, 238, 10, 0.12), transparent 38%), radial-gradient(circle at 85% 5%, rgba(255, 42, 109, 0.1), transparent 34%)",
        backgroundSize: "40px 40px, 40px 40px, auto, auto",
      };
    case "chibi":
      return {
        ...style,
        backgroundImage:
          "linear-gradient(to right, rgba(43,27,46,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(43,27,46,0.06) 1px, transparent 1px), radial-gradient(rgba(43,27,46,0.12) 1.5px, transparent 1.5px)",
        backgroundSize: "48px 48px, 48px 48px, 22px 22px",
        backgroundPosition: "0 0, 0 0, 11px 11px",
      };
    case "neu-brutalism":
      return {
        ...style,
        backgroundImage:
          "linear-gradient(to right, rgba(0, 0, 0, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.12) 1px, transparent 1px), radial-gradient(#000000 1.5px, transparent 1.5px)",
        backgroundSize: "40px 40px, 40px 40px, 20px 20px",
        backgroundPosition: "0 0, 0 0, 10px 10px",
      };
    case "black-gold":
      return {
        ...style,
        backgroundImage:
          "linear-gradient(to right, rgba(212, 175, 55, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.025) 0.8px, transparent 0.8px)",
        backgroundSize: "40px 40px, 40px 40px, 3px 3px",
        backgroundPosition: "0 0, 0 0, 0 0",
      };
    case "red-gold":
      return {
        ...style,
        backgroundImage:
          "radial-gradient(rgba(212, 175, 55, 0.08) 1px, transparent 1px), radial-gradient(rgba(237, 41, 57, 0.08) 1px, transparent 1px)",
        backgroundSize: "28px 28px, 36px 36px",
        backgroundPosition: "0 0, 14px 14px",
      };
    default:
      return style;
  }
}

export function buildPageStyle(themeId: ThemeId, style: PrimitiveBoxStyle): PrimitiveBoxStyle {
  switch (themeId) {
    case "cyberpunk":
      return {
        ...style,
        backgroundImage:
          "linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.18))",
        backgroundSize: "100% 2px, 100% 4px",
      };
    case "black-gold":
      return {
        ...style,
        backgroundImage:
          "linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(11,11,15,0) 44%, rgba(0,0,0,0.28)), linear-gradient(to right, rgba(212,175,55,0.045) 1px, transparent 1px)",
        backgroundSize: "auto, 36px 36px",
      };
    case "red-gold":
      return {
        ...style,
        backgroundImage:
          "linear-gradient(to bottom, rgba(237, 41, 57, 0.08), rgba(237, 41, 57, 0)), linear-gradient(to right, rgba(212, 175, 55, 0.07) 1px, transparent 1px)",
        backgroundSize: "auto, 26px 26px",
      };
    case "chibi":
      return {
        ...style,
        backgroundImage: "linear-gradient(135deg, #FFF7FB 0%, #F2F7FF 50%, #FDF4FF 100%)",
      };
    case "neu-brutalism":
      return {
        ...style,
        backgroundImage: "radial-gradient(#000000 1.25px, transparent 1.25px)",
        backgroundSize: "24px 24px",
        backgroundPosition: "12px 12px",
      };
    default:
      return style;
  }
}

export function buildSectionCardStyle(themeId: ThemeId, style: PrimitiveBoxStyle): PrimitiveBoxStyle {
  switch (themeId) {
    case "cyberpunk":
      return {
        ...style,
        clipPath: CYBER_CLIP_PATH,
        borderColor: "rgba(0, 240, 255, 0.45)",
        shadow: "0 0 0 1px rgba(0, 240, 255, 0.3), 0 0 12px rgba(0, 240, 255, 0.18)",
      };
    case "chibi":
      return {
        ...style,
        borderRadiusPx: Math.max(16, style.borderRadiusPx),
        borderWidth: Math.max(2, style.borderWidth),
        borderColor: "#D9C7E0",
        shadow: "0 12px 26px rgba(43, 27, 46, 0.12)",
      };
    case "neu-brutalism":
      return {
        ...style,
        borderWidth: Math.max(4, style.borderWidth),
        borderColor: "#000000",
        shadow: "8px 8px 0px 0px #000000",
      };
    case "black-gold":
      return {
        ...style,
        borderColor: "#4A4452",
        shadow: "0 8px 20px rgba(0,0,0,0.44), inset 0 0 0 1px rgba(212,175,55,0.08)",
      };
    case "red-gold":
      return {
        ...style,
        clipPath: IMPERIAL_CLIP_PATH,
        cornerAccent: "imperial-frame",
        borderColor: "#BD8B33",
        shadow: "0 8px 22px rgba(0,0,0,0.5), 0 0 18px rgba(212,175,55,0.2)",
      };
    default:
      return style;
  }
}

export function buildPanelFrameStyle(themeId: ThemeId, style: PrimitiveBoxStyle): PrimitiveBoxStyle {
  switch (themeId) {
    case "cyberpunk":
      return {
        ...style,
        clipPath: CYBER_CLIP_PATH,
        cornerAccent: "cyber-bracket",
        borderColor: "#00F0FF",
        shadow: "0 0 0 1px rgba(0,240,255,0.45), 0 0 12px rgba(0,240,255,0.35), 0 0 24px rgba(255,42,109,0.15)",
      };
    case "chibi":
      return {
        ...style,
        borderRadiusPx: Math.max(18, style.borderRadiusPx),
        borderRadiusCss: CHIBI_HAND_DRAWN_RADIUS,
        borderWidth: Math.max(2, style.borderWidth),
        borderColor: "#D9C7E0",
        shadow: "0 12px 26px rgba(43, 27, 46, 0.14)",
      };
    case "neu-brutalism":
      return {
        ...style,
        borderWidth: Math.max(4, style.borderWidth),
        borderColor: "#000000",
        shadow: "8px 8px 0px 0px #000000",
      };
    case "black-gold":
      return {
        ...style,
        borderColor: "#4A4452",
        shadow: "0 10px 24px rgba(0,0,0,0.48), inset 0 0 0 1px rgba(212,175,55,0.16)",
      };
    case "red-gold":
      return {
        ...style,
        clipPath: IMPERIAL_CLIP_PATH,
        cornerAccent: "imperial-frame",
        borderColor: "#D4AF37",
        shadow: "0 10px 24px rgba(0,0,0,0.52), 0 0 20px rgba(212,175,55,0.2)",
      };
    default:
      return style;
  }
}

export function buildDataTableFrameStyle(themeId: ThemeId, style: PrimitiveBoxStyle): PrimitiveBoxStyle {
  switch (themeId) {
    case "cyberpunk":
      return {
        ...style,
        background: "#0F0F18",
        borderColor: "rgba(0, 240, 255, 0.28)",
        clipPath: CYBER_CLIP_PATH,
        cornerAccent: "cyber-bracket",
        shadow: "0 0 0 1px rgba(0, 240, 255, 0.2), 0 0 10px rgba(0, 240, 255, 0.16)",
      };
    case "chibi":
      return {
        ...style,
        background: "#FFFFFF",
        borderColor: "#D9C7E0",
        borderWidth: Math.max(2, style.borderWidth),
        borderRadiusPx: Math.max(16, style.borderRadiusPx),
        shadow: "0 10px 22px rgba(43, 27, 46, 0.12)",
      };
    case "neu-brutalism":
      return {
        ...style,
        borderWidth: Math.max(4, style.borderWidth),
        borderColor: "#000000",
        background: "#FFFFFF",
        shadow: "8px 8px 0px 0px #000000",
      };
    case "black-gold":
      return {
        ...style,
        background: "#1D1D22",
        borderColor: "#4A4452",
        shadow: "0 8px 20px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(212,175,55,0.12)",
      };
    case "red-gold":
      return {
        ...style,
        background: "#141217",
        borderColor: "#BD8B33",
        clipPath: IMPERIAL_CLIP_PATH,
        cornerAccent: "imperial-frame",
        shadow: "0 8px 20px rgba(0,0,0,0.5), 0 0 14px rgba(212,175,55,0.16)",
      };
    default:
      return style;
  }
}

export function buildOverlayFrameStyle(
  themeId: ThemeId,
  style: PrimitiveBoxStyle,
  kind: "toast" | "confirm" | "command",
): PrimitiveBoxStyle {
  switch (themeId) {
    case "cyberpunk":
      return {
        ...style,
        background: "rgba(16, 16, 28, 0.82)",
        borderColor: kind === "confirm" ? "#FF2A6D" : "#00F0FF",
        clipPath: CYBER_CLIP_PATH,
        cornerAccent: "cyber-bracket",
        backdropFilter: "blur(8px)",
        shadow: "0 0 0 1px rgba(0,240,255,0.32), 0 0 14px rgba(0,240,255,0.24), 0 12px 26px rgba(0,0,0,0.55)",
      };
    case "chibi":
      return {
        ...style,
        background: kind === "toast" ? "#FDF4FF" : "#FFFFFF",
        borderRadiusPx: Math.max(18, style.borderRadiusPx),
        borderRadiusCss: kind === "command" ? CHIBI_HAND_DRAWN_RADIUS : undefined,
        borderColor: kind === "confirm" ? "#7AA7FF" : "#D9C7E0",
        borderWidth: Math.max(2, style.borderWidth),
        shadow: "0 12px 26px rgba(43, 27, 46, 0.14)",
      };
    case "neu-brutalism":
      return {
        ...style,
        background: kind === "toast" ? "#FFD93D" : "#FFFFFF",
        borderWidth: Math.max(4, style.borderWidth),
        borderColor: "#000000",
        color: "#000000",
        shadow: "8px 8px 0px 0px #000000",
      };
    case "black-gold":
      return {
        ...style,
        background: "#141418",
        borderColor: kind === "confirm" ? "#D4AF37" : "#4A4452",
        shadow: "0 14px 30px rgba(0,0,0,0.56), inset 0 0 0 1px rgba(212,175,55,0.14)",
      };
    case "red-gold":
      return {
        ...style,
        background: "#141217",
        borderColor: "#D4AF37",
        clipPath: IMPERIAL_CLIP_PATH,
        cornerAccent: "imperial-frame",
        shadow: "0 12px 24px rgba(0,0,0,0.52), 0 0 20px rgba(212,175,55,0.18)",
      };
    default:
      return style;
  }
}

export function buildPrimaryButtonStyle(themeId: ThemeId, base: ControlStyle): ControlStyle {
  switch (themeId) {
    case "cyberpunk":
      return {
        ...base,
        background: "#FCEE0A",
        borderColor: "#FCEE0A",
        borderWidth: 1,
        color: "#07070C",
        shadow: "0 0 0 1px rgba(252,238,10,0.8), 0 0 10px rgba(252,238,10,0.45), 0 0 20px rgba(0,240,255,0.25)",
        clipPath: CYBER_CLIP_PATH,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        fontFamily: "Orbitron, Rajdhani, \"Share Tech Mono\", sans-serif",
      };
    case "chibi":
      return {
        ...base,
        background: "#FF7EB6",
        borderColor: "#E6639B",
        borderWidth: 2,
        borderRadiusPx: Math.max(16, base.borderRadiusPx),
        borderBottomWidth: 2,
        borderBottomColor: "#E6639B",
        shadow: "0 8px 16px rgba(43, 27, 46, 0.16), inset 0 1px 0 rgba(255,255,255,0.6)",
        color: "#FFFFFF",
        fontFamily: "\"M PLUS Rounded 1c\", Fredoka, sans-serif",
      };
    case "neu-brutalism":
      return {
        ...base,
        background: "#FF6B6B",
        borderColor: "#000000",
        borderWidth: 4,
        color: "#000000",
        shadow: "6px 6px 0px 0px #000000",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontFamily: "Space Grotesk, sans-serif",
      };
    case "black-gold":
      return {
        ...base,
        background: "linear-gradient(145deg, #C8A43A 0%, #E2C26C 56%, #D4AF37 100%)",
        borderColor: "#8F7524",
        borderWidth: 1,
        color: "#0B0B0F",
        shadow: "0 6px 14px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.28)",
        textTransform: "none",
        letterSpacing: "0.02em",
        fontFamily: "Space Grotesk, Manrope, sans-serif",
      };
    case "red-gold":
      return {
        ...base,
        background: "linear-gradient(to right, #900101, #ED2939)",
        borderColor: "#D4AF37",
        borderWidth: 1,
        color: "#F2F0E4",
        shadow: "0 8px 18px rgba(0,0,0,0.48), 0 0 16px rgba(237,41,57,0.18), 0 0 12px rgba(212,175,55,0.14)",
        clipPath: IMPERIAL_CLIP_PATH,
        cornerAccent: "imperial-frame",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontFamily: "Space Grotesk, Manrope, sans-serif",
      };
    default:
      return {
        ...base,
        background: getThemeSpec(themeId).palette.primary,
        borderColor: getThemeSpec(themeId).palette.secondary,
        color: pickReadableTextColor(getThemeSpec(themeId).palette.primary),
        shadow: `0 0 0 1px ${getThemeSpec(themeId).palette.secondary}, ${base.shadow}`,
        fontFamily: getThemeSpec(themeId).typography.display,
      };
  }
}

export function buildSecondaryButtonStyle(themeId: ThemeId, base: ControlStyle): ControlStyle {
  const theme = getThemeSpec(themeId);
  switch (themeId) {
    case "cyberpunk":
      return {
        ...base,
        background: "#0D0D16",
        borderColor: "#00F0FF",
        color: "#00F0FF",
        shadow: "0 0 0 1px rgba(0,240,255,0.3), 0 0 8px rgba(0,240,255,0.18)",
        clipPath: CYBER_CLIP_PATH,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      };
    case "chibi":
      return {
        ...base,
        background: "#7AA7FF",
        borderColor: "#5F89DB",
        borderWidth: 2,
        borderRadiusPx: Math.max(16, base.borderRadiusPx),
        color: "#FFFFFF",
        shadow: "0 8px 16px rgba(43, 27, 46, 0.14), inset 0 1px 0 rgba(255,255,255,0.55)",
        fontFamily: "\"M PLUS Rounded 1c\", Nunito, sans-serif",
      };
    case "neu-brutalism":
      return {
        ...base,
        background: "#FFD93D",
        borderColor: "#000000",
        borderWidth: 4,
        color: "#000000",
        shadow: "6px 6px 0px 0px #000000",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontFamily: "Space Grotesk, sans-serif",
      };
    case "black-gold":
      return {
        ...base,
        background: "#141418",
        borderColor: "#D4AF37",
        color: "#F2F0E4",
        shadow: "0 6px 14px rgba(0,0,0,0.34), inset 0 0 0 1px rgba(226,194,108,0.16)",
        textTransform: "none",
        letterSpacing: "0.02em",
      };
    case "red-gold":
      return {
        ...base,
        background: "#141217",
        borderColor: "#D4AF37",
        color: "#F2F0E4",
        shadow: "0 8px 16px rgba(0,0,0,0.44), 0 0 12px rgba(212,175,55,0.16)",
        clipPath: IMPERIAL_CLIP_PATH,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      };
    default:
      return {
        ...base,
        background: theme.foundation.surface,
        borderColor: theme.palette.secondary,
        color: theme.palette.secondary,
      };
  }
}

export function buildInputStyle(themeId: ThemeId, base: ControlStyle): ControlStyle {
  switch (themeId) {
    case "cyberpunk":
      return {
        ...base,
        background: "#0A0A10",
        borderColor: "#00F0FF",
        borderWidth: 1,
        color: "#E9E9EF",
        clipPath: CYBER_CLIP_PATH,
        shadow: "inset 0 0 12px rgba(0, 240, 255, 0.08), 0 0 0 1px rgba(0, 240, 255, 0.28)",
        fontFamily: "JetBrains Mono, Fira Code, Consolas, monospace",
      };
    case "chibi":
      return {
        ...base,
        background: "#FFFFFF",
        borderColor: "#D9C7E0",
        borderWidth: 2,
        borderRadiusPx: Math.max(14, base.borderRadiusPx),
        shadow: "0 4px 12px rgba(43, 27, 46, 0.1)",
        fontFamily: "\"M PLUS Rounded 1c\", Nunito, sans-serif",
      };
    case "neu-brutalism":
      return {
        ...base,
        background: "#FFFFFF",
        borderColor: "#000000",
        borderWidth: 4,
        color: "#000000",
        shadow: "4px 4px 0px 0px #000000",
        fontFamily: "Space Grotesk, sans-serif",
      };
    case "black-gold":
      return {
        ...base,
        background: "#1D1D22",
        borderColor: "#4A4452",
        borderWidth: 1,
        color: "#F2F0E4",
        shadow: "inset 0 1px 0 rgba(255,255,255,0.03), inset 0 0 0 1px rgba(212,175,55,0.1)",
      };
    case "red-gold":
      return {
        ...base,
        background: "#1D1A21",
        borderColor: "#4D3F54",
        borderWidth: 1,
        color: "#F2F0E4",
        clipPath: IMPERIAL_CLIP_PATH,
        shadow: "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(212,175,55,0.12)",
      };
    default:
      return {
        ...base,
        borderColor: getThemeSpec(themeId).palette.accent,
      };
  }
}

export function buildSelectStyle(themeId: ThemeId, base: ControlStyle): ControlStyle {
  const input = buildInputStyle(themeId, base);
  if (themeId === "chibi") {
    return {
      ...input,
      borderColor: "#7AA7FF",
    };
  }

  if (themeId === "red-gold") {
    return {
      ...input,
      borderColor: "#D4AF37",
    };
  }

  if (themeId === "black-gold") {
    return {
      ...input,
      borderColor: "#D4AF37",
    };
  }

  return input;
}

export function buildTableStyle(themeId: ThemeId, base: ControlStyle): ControlStyle {
  switch (themeId) {
    case "cyberpunk":
      return {
        ...base,
        background: "#0F0F18",
        borderColor: "rgba(0, 240, 255, 0.28)",
        borderWidth: 1,
        clipPath: CYBER_CLIP_PATH,
        cornerAccent: "cyber-bracket",
        shadow: "0 0 0 1px rgba(0, 240, 255, 0.2), 0 0 10px rgba(0, 240, 255, 0.16)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      };
    case "chibi":
      return {
        ...base,
        background: "#FFFFFF",
        borderColor: "#D9C7E0",
        borderWidth: 2,
        borderRadiusPx: Math.max(16, base.borderRadiusPx),
        shadow: "0 10px 20px rgba(43, 27, 46, 0.12)",
      };
    case "neu-brutalism":
      return {
        ...base,
        background: "#FFFFFF",
        borderWidth: 4,
        borderColor: "#000000",
        shadow: "8px 8px 0px 0px #000000",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      };
    case "black-gold":
      return {
        ...base,
        background: "#141418",
        borderColor: "#4A4452",
        shadow: "0 8px 20px rgba(0,0,0,0.42), inset 0 0 0 1px rgba(212,175,55,0.12)",
      };
    case "red-gold":
      return {
        ...base,
        background: "#141217",
        borderColor: "#BD8B33",
        clipPath: IMPERIAL_CLIP_PATH,
        cornerAccent: "imperial-frame",
        shadow: "0 8px 18px rgba(0,0,0,0.48), 0 0 12px rgba(212,175,55,0.16)",
      };
    default:
      return {
        ...base,
        borderColor: getThemeSpec(themeId).palette.primary,
      };
  }
}

export function buildOverlayControlStyle(
  themeId: ThemeId,
  base: ControlStyle,
  kind: "modal" | "toast",
): ControlStyle {
  switch (themeId) {
    case "cyberpunk":
      return {
        ...base,
        background: "rgba(16, 16, 28, 0.82)",
        borderColor: kind === "modal" ? "#00F0FF" : "#FF2A6D",
        borderWidth: 1,
        clipPath: CYBER_CLIP_PATH,
        cornerAccent: "cyber-bracket",
        backdropFilter: "blur(8px)",
        shadow: "0 0 0 1px rgba(0,240,255,0.32), 0 0 14px rgba(0,240,255,0.24), 0 12px 26px rgba(0,0,0,0.55)",
      };
    case "chibi":
      return {
        ...base,
        background: kind === "toast" ? "#FDF4FF" : "#FFFFFF",
        borderColor: kind === "toast" ? "#FF7EB6" : "#C4B5FD",
        borderRadiusPx: Math.max(16, base.borderRadiusPx),
        borderWidth: 2,
        shadow: "0 10px 20px rgba(43, 27, 46, 0.14)",
      };
    case "neu-brutalism":
      return {
        ...base,
        background: kind === "toast" ? "#FFD93D" : "#FFFFFF",
        color: "#000000",
        borderColor: "#000000",
        borderWidth: 4,
        shadow: "6px 6px 0px 0px #000000",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      };
    case "black-gold":
      return {
        ...base,
        background: kind === "toast" ? "#1D1D22" : "#141418",
        borderColor: kind === "toast" ? "#D4AF37" : "#4A4452",
        shadow: "0 12px 26px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(212,175,55,0.14)",
      };
    case "red-gold":
      return {
        ...base,
        background: "#141217",
        borderColor: "#D4AF37",
        clipPath: IMPERIAL_CLIP_PATH,
        cornerAccent: "imperial-frame",
        shadow: "0 10px 22px rgba(0,0,0,0.5), 0 0 16px rgba(212,175,55,0.16)",
      };
    default:
      return {
        ...base,
        background: deriveHoverColor(getThemeSpec(themeId).foundation.surface),
        borderColor: deriveActiveColor(getThemeSpec(themeId).palette.accent),
      };
  }
}
