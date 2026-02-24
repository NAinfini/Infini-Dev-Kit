import { getThemeSpec, type ThemeId } from "./theme-specs";
import type { EChartsThemeConfig } from "./echarts-types";

function getThemeColorPalette(themeId: ThemeId): string[] {
  switch (themeId) {
    case "chibi":
      return ["#FF7EB6", "#7AA7FF", "#C4B5FD", "#6EE7B7", "#FFD166", "#FF6B6B"];
    case "cyberpunk":
      return ["#00F0FF", "#BC13FE", "#FF2A6D", "#05FFA1", "#FCEE0A", "#FF7A00"];
    case "neu-brutalism":
      return ["#FF6B6B", "#FFD93D", "#C4B5FD", "#6EE7B7", "#FF9F43", "#000000"];
    case "black-gold":
      return ["#D4AF37", "#E2C26C", "#8A7023", "#F4CF57", "#B8860B", "#C5A028"];
    case "red-gold":
      return ["#ED2939", "#D4AF37", "#B71C1C", "#E2C26C", "#FF5252", "#8A7023"];
    default:
      return [];
  }
}

export function buildEChartsTheme(themeId: ThemeId): EChartsThemeConfig {
  const theme = getThemeSpec(themeId);
  const darkMode = themeId === "cyberpunk" || themeId === "black-gold" || themeId === "red-gold";
  const palette =
    getThemeColorPalette(themeId).length > 0
      ? getThemeColorPalette(themeId)
      : [
          theme.palette.primary,
          theme.palette.accent,
          theme.palette.success,
          theme.palette.warning,
          theme.palette.danger,
          theme.palette.secondary,
        ];

  const textColor =
    themeId === "default" ? "#333333" : themeId === "cyberpunk" ? "#E9E9EF" : theme.palette.text;

  const axisLineColor =
    themeId === "default"
      ? "#cccccc"
      : themeId === "cyberpunk"
        ? "rgba(0,240,255,0.2)"
        : themeId === "neu-brutalism"
          ? "#000000"
          : themeId === "black-gold"
            ? "rgba(212,175,55,0.2)"
            : "rgba(212,175,55,0.15)";

  const splitLineColor =
    themeId === "default"
      ? "#eeeeee"
      : themeId === "cyberpunk"
        ? "rgba(0,240,255,0.06)"
        : themeId === "neu-brutalism"
          ? "#cccccc"
          : themeId === "black-gold"
            ? "rgba(212,175,55,0.08)"
            : "rgba(212,175,55,0.06)";

  const tooltipBg =
    themeId === "default"
      ? "#ffffff"
      : themeId === "cyberpunk"
        ? "rgba(16,16,28,0.95)"
        : themeId === "neu-brutalism"
          ? "#FFD93D"
          : themeId === "black-gold"
            ? "#1D1D22"
            : "#1D1A21";

  const tooltipBorder =
    themeId === "default"
      ? "#cccccc"
      : themeId === "cyberpunk"
        ? "rgba(0,240,255,0.3)"
        : themeId === "neu-brutalism"
          ? "#000000"
          : themeId === "black-gold"
            ? "rgba(212,175,55,0.2)"
            : "rgba(212,175,55,0.15)";

  const axisTemplate = {
    axisLine: { lineStyle: { color: axisLineColor } },
    axisTick: { lineStyle: { color: axisLineColor } },
    axisLabel: { color: textColor },
    splitLine: { lineStyle: { color: splitLineColor } },
  };

  return {
    darkMode,
    color: palette,
    backgroundColor: "transparent",
    textStyle: { color: textColor, fontFamily: theme.typography.body },
    title: { textStyle: { color: textColor, fontFamily: theme.typography.display } },
    legend: { textStyle: { color: textColor } },
    tooltip: {
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      textStyle: { color: textColor },
    },
    categoryAxis: axisTemplate,
    valueAxis: axisTemplate,
    radar: {
      axisLine: { lineStyle: { color: axisLineColor } },
      splitLine: { lineStyle: { color: splitLineColor } },
      splitArea: {
        areaStyle: {
          color: [
            "rgba(255,255,255,0.04)",
            "rgba(255,255,255,0.02)",
            "rgba(255,255,255,0.01)",
          ],
        },
      },
      axisName: { color: textColor },
    },
  };
}
