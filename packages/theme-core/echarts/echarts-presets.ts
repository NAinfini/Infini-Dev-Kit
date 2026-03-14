import type { EChartsThemeConfig } from "./echarts-types";

type SeriesData = { name: string; value: number }[];

type BasePresetOptions = {
  theme: EChartsThemeConfig;
  title?: string;
  animation?: boolean;
};

type LinePresetOptions = BasePresetOptions & {
  xData: string[];
  series: { name: string; data: number[] }[];
  smooth?: boolean;
  area?: boolean;
};

type BarPresetOptions = BasePresetOptions & {
  xData: string[];
  series: { name: string; data: number[] }[];
  horizontal?: boolean;
  stacked?: boolean;
};

type PiePresetOptions = BasePresetOptions & {
  data: SeriesData;
  donut?: boolean;
};

type RadarPresetOptions = BasePresetOptions & {
  indicators: { name: string; max: number }[];
  series: { name: string; data: number[] }[];
};

type GaugePresetOptions = BasePresetOptions & {
  value: number;
  min?: number;
  max?: number;
  label?: string;
};

function baseOption(opts: BasePresetOptions) {
  return {
    backgroundColor: opts.theme.backgroundColor,
    textStyle: opts.theme.textStyle,
    title: opts.title
      ? { text: opts.title, ...opts.theme.title }
      : undefined,
    tooltip: { trigger: "axis" as const, ...opts.theme.tooltip },
    legend: { ...opts.theme.legend },
    animation: opts.animation !== false,
    color: opts.theme.color,
  };
}

export function linePreset(opts: LinePresetOptions) {
  return {
    ...baseOption(opts),
    xAxis: {
      type: "category" as const,
      data: opts.xData,
      ...opts.theme.categoryAxis,
    },
    yAxis: { type: "value" as const, ...opts.theme.valueAxis },
    series: opts.series.map((s) => ({
      name: s.name,
      type: "line" as const,
      data: s.data,
      smooth: opts.smooth ?? false,
      areaStyle: opts.area ? { opacity: 0.15 } : undefined,
    })),
  };
}

export function barPreset(opts: BarPresetOptions) {
  const categoryAxis = {
    type: "category" as const,
    data: opts.xData,
    ...opts.theme.categoryAxis,
  };
  const valueAxis = { type: "value" as const, ...opts.theme.valueAxis };

  return {
    ...baseOption(opts),
    tooltip: { trigger: "axis" as const, ...opts.theme.tooltip },
    xAxis: opts.horizontal ? valueAxis : categoryAxis,
    yAxis: opts.horizontal ? categoryAxis : valueAxis,
    series: opts.series.map((s) => ({
      name: s.name,
      type: "bar" as const,
      data: s.data,
      stack: opts.stacked ? "total" : undefined,
    })),
  };
}

export function piePreset(opts: PiePresetOptions) {
  return {
    ...baseOption(opts),
    tooltip: { trigger: "item" as const, ...opts.theme.tooltip },
    series: [
      {
        type: "pie" as const,
        radius: opts.donut ? ["40%", "70%"] : "70%",
        data: opts.data,
        label: { color: opts.theme.textStyle.color },
      },
    ],
  };
}

export function radarPreset(opts: RadarPresetOptions) {
  return {
    ...baseOption(opts),
    radar: {
      indicator: opts.indicators,
      ...opts.theme.radar,
    },
    series: [
      {
        type: "radar" as const,
        data: opts.series.map((s) => ({
          name: s.name,
          value: s.data,
        })),
      },
    ],
  };
}

export function gaugePreset(opts: GaugePresetOptions) {
  return {
    ...baseOption(opts),
    series: [
      {
        type: "gauge" as const,
        min: opts.min ?? 0,
        max: opts.max ?? 100,
        data: [{ value: opts.value, name: opts.label ?? "" }],
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.3, opts.theme.color[4] ?? "#ef4444"],
              [0.7, opts.theme.color[3] ?? "#f59e0b"],
              [1, opts.theme.color[2] ?? "#22c55e"],
            ],
          },
        },
        detail: { color: opts.theme.textStyle.color },
        title: { color: opts.theme.textStyle.color },
      },
    ],
  };
}
