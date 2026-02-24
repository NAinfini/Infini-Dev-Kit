export interface EChartsThemeColors {
  colorPalette: string[];
  backgroundColor: string;
  textColor: string;
  textColorMuted: string;
  axisLineColor: string;
  splitLineColor: string;
  tooltipBg: string;
  tooltipBorder: string;
}

export interface EChartsAxisStyle {
  axisLine: { lineStyle: { color: string } };
  axisTick: { lineStyle: { color: string } };
  axisLabel: { color: string };
  splitLine: { lineStyle: { color: string } };
}

export interface EChartsThemeConfig {
  darkMode?: boolean;
  color: string[];
  backgroundColor: string;
  textStyle: { color: string; fontFamily: string };
  title: { textStyle: { color: string; fontFamily: string } };
  legend: { textStyle: { color: string } };
  tooltip: {
    backgroundColor: string;
    borderColor: string;
    textStyle: { color: string };
  };
  categoryAxis: EChartsAxisStyle;
  valueAxis: EChartsAxisStyle;
  radar: {
    axisLine: { lineStyle: { color: string } };
    splitLine: { lineStyle: { color: string } };
    splitArea: { areaStyle: { color: string[] } };
    axisName: { color: string };
  };
}
