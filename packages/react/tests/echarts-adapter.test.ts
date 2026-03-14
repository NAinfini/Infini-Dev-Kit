import { describe, expect, it } from "vitest";

import { buildEChartsTheme } from "@infini-dev-kit/theme-core";
import { getThemeSpec } from "@infini-dev-kit/theme-core";

describe("echarts adapter", () => {
  it("builds a full echarts theme for every demo theme", () => {
    const chibi = buildEChartsTheme("chibi");
    const cyberpunk = buildEChartsTheme("cyberpunk");
    const neuBrutalism = buildEChartsTheme("neu-brutalism");
    const blackGold = buildEChartsTheme("black-gold");
    const redGold = buildEChartsTheme("red-gold");
    const blackGoldSpec = getThemeSpec("black-gold");

    expect(chibi.color).toHaveLength(6);
    expect(cyberpunk.color[0]).toBe("#00F0FF");
    expect(neuBrutalism.tooltip.borderColor).toBe("#000000");
    expect(blackGold.legend.textStyle.color).toBe(blackGoldSpec.palette.text);
    expect(redGold.valueAxis.splitLine.lineStyle.color).toContain("212,175,55");
  });
});
