import { describe, expect, it } from "vitest";

import { buildEChartsTheme } from "../echarts-adapter";

describe("echarts adapter", () => {
  it("builds a full echarts theme for every demo theme", () => {
    const chibi = buildEChartsTheme("chibi");
    const cyberpunk = buildEChartsTheme("cyberpunk");
    const neuBrutalism = buildEChartsTheme("neu-brutalism");
    const blackGold = buildEChartsTheme("black-gold");
    const redGold = buildEChartsTheme("red-gold");

    expect(chibi.color).toHaveLength(6);
    expect(cyberpunk.color[0]).toBe("#00F0FF");
    expect(neuBrutalism.tooltip.borderColor).toBe("#000000");
    expect(blackGold.legend.textStyle.color).toBe("#F2F0E4");
    expect(redGold.valueAxis.splitLine.lineStyle.color).toContain("212,175,55");
  });
});
