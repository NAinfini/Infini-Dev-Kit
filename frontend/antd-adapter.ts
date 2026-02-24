import { contrastRatio, deriveActiveColor } from "../utils/color";
import type { AntdThemeConfig, ComposeAntdThemeOptions } from "./antd-types";
import { getThemeSpec, type ThemeId, type ThemeSpec } from "./theme-specs";

export type {
  AntdAlgorithm,
  AntdThemeToken,
  ScopedCssVariables,
  AntdThemeConfig,
  ComposeAntdThemeOptions,
} from "./antd-types";
export { buildScopedThemeClass, buildScopedCssVariables } from "./antd-variables";

export function composeAntdTheme(options: ComposeAntdThemeOptions): AntdThemeConfig {
  const theme = getThemeSpec(options.themeId);
  const surface = theme.foundation.surface;
  const safeInfo = ensureContrastColor(theme.palette.accent, surface, 3);
  const safeSuccess = ensureContrastColor(theme.palette.success, surface, 3);
  const safeWarning = ensureContrastColor(theme.palette.warning, surface, 3);
  const safeDanger = ensureContrastColor(theme.palette.danger, surface, 3.2);
  const safeBorder = ensureContrastColor(theme.foundation.borderColor, surface, 1.8);

  return {
    algorithm: options.algorithms && options.algorithms.length > 0 ? options.algorithms : ["default"],
    token: {
      colorPrimary: theme.palette.primary,
      colorInfo: safeInfo,
      colorSuccess: safeSuccess,
      colorWarning: safeWarning,
      colorError: safeDanger,
      colorTextBase: theme.palette.text,
      colorBgBase: theme.foundation.background,
      colorBgContainer: theme.foundation.surface,
      colorBorder: safeBorder,
      borderRadius: theme.foundation.radius,
      fontFamily: theme.typography.body,
    },
    components: buildComponentTokens(options.themeId, theme),
  };
}

function buildComponentTokens(
  themeId: ThemeId,
  theme: ThemeSpec,
): Record<string, Record<string, string | number>> {
  const safeBorder = ensureContrastColor(theme.foundation.borderColor, theme.foundation.surface, 1.8);
  const safeSuccess = ensureContrastColor(theme.palette.success, theme.foundation.surface, 3);
  const safeInfo = ensureContrastColor(theme.palette.accent, theme.foundation.surface, 3);
  const safeWarning = ensureContrastColor(theme.palette.warning, theme.foundation.surface, 3);

  const base = {
    Button: {
      colorPrimary: theme.palette.primary,
      borderRadius: Math.max(2, theme.foundation.radius * 0.75),
      boxShadow: theme.foundation.shadow,
    },
    Input: {
      colorBorder: safeBorder,
      borderRadius: Math.max(2, theme.foundation.radius * 0.75),
    },
    Select: {
      borderRadius: Math.max(2, theme.foundation.radius * 0.75),
      optionSelectedBg: theme.foundation.surfaceAccent,
      selectorBg: theme.foundation.surface,
    },
    Cascader: {
      borderRadius: Math.max(2, theme.foundation.radius * 0.75),
      optionSelectedBg: theme.foundation.surfaceAccent,
    },
    TreeSelect: {
      borderRadius: Math.max(2, theme.foundation.radius * 0.75),
      nodeSelectedBg: theme.foundation.surfaceAccent,
    },
    ColorPicker: {
      borderRadius: Math.max(2, theme.foundation.radius * 0.75),
    },
    Transfer: {
      headerBg: theme.foundation.surfaceAccent,
      borderRadius: theme.foundation.radius,
    },
    Table: {
      headerBg: theme.foundation.surfaceAccent,
      rowHoverBg: theme.foundation.surface,
    },
    Card: {
      borderRadiusLG: theme.foundation.radius,
      headerBg: theme.foundation.surfaceAccent,
      colorBorderSecondary: safeBorder,
    },
    Collapse: {
      headerBg: theme.foundation.surfaceAccent,
      contentBg: theme.foundation.surface,
      borderRadiusLG: theme.foundation.radius,
    },
    Timeline: {
      dotBg: theme.foundation.surface,
      tailColor: safeBorder,
    },
    Descriptions: {
      labelBg: theme.foundation.surfaceAccent,
      borderRadiusLG: theme.foundation.radius,
    },
    Tree: {
      nodeSelectedBg: theme.foundation.surfaceAccent,
      nodeHoverBg: theme.foundation.surface,
      borderRadius: theme.foundation.radius,
    },
    Modal: {
      contentBg: theme.foundation.surface,
      borderRadiusLG: theme.foundation.radius,
    },
    Notification: {
      borderRadiusLG: theme.foundation.radius,
    },
    Tooltip: {
      colorBgSpotlight: theme.foundation.surfaceAccent,
      colorTextLightSolid: theme.palette.text,
      borderRadius: Math.max(2, theme.foundation.radius * 0.5),
    },
    Popover: {
      colorBgElevated: theme.foundation.surface,
      borderRadiusLG: theme.foundation.radius,
    },
    Popconfirm: {
      borderRadiusLG: theme.foundation.radius,
    },
    Spin: {
      colorPrimary: theme.palette.primary,
    },
    Skeleton: {
      borderRadiusSM: Math.max(2, theme.foundation.radius * 0.5),
      gradientFromColor: theme.foundation.surfaceAccent,
      gradientToColor: theme.foundation.surface,
    },
    Tabs: {
      cardBg: theme.foundation.surface,
      inkBarColor: theme.palette.primary,
      itemSelectedColor: theme.palette.primary,
    },
    Switch: {
      colorPrimary: theme.palette.primary,
      handleBg: theme.foundation.surface,
    },
    Slider: {
      trackBg: theme.palette.primary,
      handleColor: theme.palette.primary,
      railBg: theme.foundation.surfaceAccent,
    },
    Tag: {
      borderRadiusSM: Math.max(2, theme.foundation.radius * 0.5),
    },
    Badge: {
      colorBgContainer: theme.palette.danger,
    },
    Progress: {
      colorSuccess: safeSuccess,
      remainingColor: theme.foundation.surfaceAccent,
    },
    Drawer: {
      colorBgElevated: theme.foundation.surface,
    },
    Segmented: {
      borderRadius: theme.foundation.radius,
      itemSelectedBg: theme.palette.primary,
    },
    Alert: {
      borderRadiusLG: theme.foundation.radius,
    },
    DatePicker: {
      borderRadius: Math.max(2, theme.foundation.radius * 0.75),
      activeBorderColor: theme.palette.primary,
    },
    Menu: {
      itemBg: theme.foundation.surface,
      itemSelectedBg: theme.foundation.surfaceAccent,
      itemSelectedColor: theme.palette.primary,
      itemHoverBg: theme.foundation.surfaceAccent,
      borderRadiusLG: theme.foundation.radius,
    },
    Typography: {
      colorText: theme.palette.text,
      colorTextSecondary: theme.palette.textMuted,
      colorLink: theme.palette.primary,
      colorLinkHover: theme.palette.accent,
      fontWeightStrong: 600,
    },
    Divider: {
      colorSplit: safeBorder,
    },
    Avatar: {
      borderRadius: theme.foundation.radius,
      colorBgBase: theme.foundation.surfaceAccent,
    },
    FloatButton: {
      colorBgElevated: theme.foundation.surface,
      borderRadiusLG: theme.foundation.radius,
    },
    Checkbox: {
      colorPrimary: theme.palette.primary,
      borderRadiusSM: Math.max(2, theme.foundation.radius * 0.45),
    },
    Radio: {
      colorPrimary: theme.palette.primary,
      dotSize: 8,
    },
    Rate: {
      starColor: theme.palette.secondary,
      starSize: 18,
    },
    Steps: {
      colorPrimary: theme.palette.primary,
      iconSize: 28,
    },
    Breadcrumb: {
      itemColor: theme.palette.textMuted,
      lastItemColor: theme.palette.text,
      linkColor: theme.palette.primary,
    },
    Form: {
      labelColor: theme.palette.text,
      colorError: theme.palette.danger,
      labelRequiredMarkColor: theme.palette.danger,
    },
    Watermark: {
      colorFill: theme.palette.textMuted,
    },
    Image: {
      colorBgMask: "rgba(0,0,0,0.45)",
      previewOperationColor: theme.palette.text,
    },
    Empty: {
      colorText: theme.palette.textMuted,
      colorTextDisabled: theme.palette.textMuted,
    },
    Result: {
      colorSuccess: safeSuccess,
      colorError: theme.palette.danger,
      colorInfo: safeInfo,
      colorWarning: safeWarning,
    },
    Statistic: {
      colorTextHeading: theme.palette.text,
      colorTextDescription: theme.palette.textMuted,
    },
    QRCode: {
      colorBorder: safeBorder,
      borderRadiusLG: theme.foundation.radius,
    },
  };

  switch (themeId) {
    case "cyberpunk":
      return {
        ...base,
        Button: {
          ...base.Button,
          borderRadius: 2,
          colorPrimary: "#00F0FF",
          colorTextLightSolid: "#0A0A10",
          boxShadow: theme.foundation.shadowHover,
          primaryShadow: "0 0 8px rgba(0, 240, 255, 0.4)",
          fontWeight: 700,
        },
        Input: {
          ...base.Input,
          colorBorder: "#00F0FF",
          borderRadius: 2,
          activeShadow: "0 0 0 1px rgba(0, 255, 213, 0.65)",
          hoverBg: "rgba(15, 15, 24, 0.8)",
          activeBg: "rgba(15, 15, 24, 0.8)",
        },
        Select: {
          ...base.Select,
          borderRadius: 2,
          selectorBg: "rgba(15,15,24,0.8)",
          optionSelectedBg: "#151526",
        },
        Cascader: {
          ...base.Cascader,
          borderRadius: 2,
          optionSelectedBg: "#151526",
        },
        TreeSelect: {
          ...base.TreeSelect,
          borderRadius: 2,
          nodeSelectedBg: "#151526",
        },
        ColorPicker: {
          ...base.ColorPicker,
          borderRadius: 2,
        },
        Transfer: {
          ...base.Transfer,
          headerBg: "#10101C",
          borderRadius: 2,
        },
        Table: {
          ...base.Table,
          headerBg: "#10101C",
          headerColor: "#E9E9EF",
          rowHoverBg: "#151526",
        },
        Card: {
          ...base.Card,
          borderRadiusLG: 2,
          headerBg: "#10101C",
          colorBorderSecondary: "rgba(0,240,255,0.12)",
        },
        Collapse: {
          ...base.Collapse,
          borderRadiusLG: 2,
          headerBg: "#10101C",
          contentBg: "rgba(16,16,28,0.6)",
        },
        Timeline: {
          ...base.Timeline,
          dotBg: "#0A0A10",
          tailColor: "rgba(0,240,255,0.2)",
        },
        Descriptions: {
          ...base.Descriptions,
          labelBg: "#10101C",
          borderRadiusLG: 2,
        },
        Tree: {
          ...base.Tree,
          borderRadius: 2,
          nodeSelectedBg: "#151526",
          nodeHoverBg: "#151526",
        },
        Modal: {
          ...base.Modal,
          contentBg: "rgba(16, 16, 28, 0.86)",
          borderRadiusLG: 2,
        },
        Notification: {
          ...base.Notification,
          borderRadiusLG: 2,
        },
        Tooltip: {
          ...base.Tooltip,
          borderRadius: 2,
          colorBgSpotlight: "#10101C",
          colorTextLightSolid: "#E9E9EF",
        },
        Popover: {
          ...base.Popover,
          borderRadiusLG: 2,
          colorBgElevated: "rgba(16,16,28,0.95)",
        },
        Popconfirm: {
          ...base.Popconfirm,
          borderRadiusLG: 2,
        },
        Spin: {
          ...base.Spin,
          colorPrimary: "#00F0FF",
        },
        Skeleton: {
          ...base.Skeleton,
          borderRadiusSM: 2,
          gradientFromColor: "#151526",
          gradientToColor: "#0A0A10",
        },
        Tabs: {
          ...base.Tabs,
          cardBg: "#0F0F18",
          inkBarColor: "#00F0FF",
          itemSelectedColor: "#00F0FF",
        },
        Segmented: {
          ...base.Segmented,
          borderRadius: 2,
          itemColor: "#E9E9EF",
          itemHoverColor: "#00F0FF",
          itemSelectedBg: "#00F0FF",
          itemSelectedColor: "#0A0A10",
          trackBg: "#0F0F18",
        },
        Switch: {
          ...base.Switch,
          colorPrimary: "#00F0FF",
          handleBg: "#0A0A10",
        },
        Slider: {
          ...base.Slider,
          trackBg: "#00F0FF",
          handleColor: "#00F0FF",
          railBg: "#151526",
        },
        Tag: {
          ...base.Tag,
          borderRadiusSM: 2,
        },
        Menu: {
          ...base.Menu,
          borderRadiusLG: 2,
          itemBg: "#0A0A10",
          itemSelectedBg: "#151526",
          itemSelectedColor: "#00F0FF",
          itemHoverBg: "#151526",
        },
        Typography: {
          ...base.Typography,
          colorLink: "#00F0FF",
          colorLinkHover: "#BC13FE",
          fontWeightStrong: 700,
        },
        Divider: {
          ...base.Divider,
          colorSplit: "rgba(0,240,255,0.15)",
        },
        Avatar: {
          ...base.Avatar,
          borderRadius: 2,
          colorBgBase: "#151526",
        },
        FloatButton: {
          ...base.FloatButton,
          borderRadiusLG: 2,
          colorBgElevated: "#10101C",
        },
        Checkbox: {
          ...base.Checkbox,
          colorPrimary: "#00F0FF",
        },
        Radio: {
          ...base.Radio,
          colorPrimary: "#00F0FF",
        },
        Steps: {
          ...base.Steps,
          colorPrimary: "#00F0FF",
        },
        DatePicker: {
          ...base.DatePicker,
          activeBorderColor: "#00F0FF",
        },
        Breadcrumb: {
          ...base.Breadcrumb,
          linkColor: "#00F0FF",
        },
        Form: {
          ...base.Form,
          labelColor: "#E9E9EF",
          colorError: "#FF3366",
          labelRequiredMarkColor: "#FF3366",
        },
        Image: {
          ...base.Image,
          colorBgMask: "rgba(10,10,16,0.85)",
        },
      };
    case "chibi":
      return {
        ...base,
        Button: {
          ...base.Button,
          borderRadius: 16,
          colorPrimary: "#FF7EB6",
          colorTextLightSolid: "#FFFFFF",
          defaultBorderColor: "#C2A8CD",
          boxShadow: theme.foundation.shadowSm,
          primaryShadow: "0 4px 0 rgba(0, 0, 0, 0.1)",
          defaultShadow: "0 3px 0 rgba(0, 0, 0, 0.06)",
          fontWeight: 700,
        },
        Input: {
          ...base.Input,
          borderRadius: Math.max(14, theme.foundation.radius),
          colorBorder: "#C2A8CD",
          activeShadow: "0 0 0 3px rgba(122, 167, 255, 0.25)",
        },
        Select: {
          ...base.Select,
          borderRadius: 14,
          optionSelectedBg: "#F2F7FF",
        },
        Cascader: {
          ...base.Cascader,
          borderRadius: 14,
          optionSelectedBg: "#F2F7FF",
        },
        TreeSelect: {
          ...base.TreeSelect,
          borderRadius: 14,
          nodeSelectedBg: "#F2F7FF",
        },
        ColorPicker: {
          ...base.ColorPicker,
          borderRadius: 14,
        },
        Transfer: {
          ...base.Transfer,
          headerBg: "#F2F7FF",
          borderRadius: 16,
        },
        Table: {
          ...base.Table,
          headerBg: "#FDF4FF",
          rowHoverBg: "#F2F7FF",
        },
        Card: {
          ...base.Card,
          lineWidth: 3,
          borderRadiusLG: 24,
          headerBg: "#FDF4FF",
          colorBorderSecondary: "#C2A8CD",
        },
        Collapse: {
          ...base.Collapse,
          borderRadiusLG: 20,
          headerBg: "#FDF4FF",
        },
        Timeline: {
          ...base.Timeline,
          dotBg: "#FFFFFF",
          tailColor: "#C2A8CD",
        },
        Descriptions: {
          ...base.Descriptions,
          labelBg: "#FDF4FF",
          borderRadiusLG: 20,
        },
        Tree: {
          ...base.Tree,
          borderRadius: 14,
          nodeSelectedBg: "#F2F7FF",
        },
        Modal: {
          ...base.Modal,
          borderRadiusLG: 20,
          contentBg: "#FFFFFF",
        },
        Tooltip: {
          ...base.Tooltip,
          borderRadius: 12,
          colorBgSpotlight: "#3D2B50",
          colorTextLightSolid: "#FFFFFF",
        },
        Popover: {
          ...base.Popover,
          borderRadiusLG: 20,
        },
        Popconfirm: {
          ...base.Popconfirm,
          borderRadiusLG: 20,
        },
        Spin: {
          ...base.Spin,
          colorPrimary: "#FF7EB6",
        },
        Skeleton: {
          ...base.Skeleton,
          borderRadiusSM: 12,
          gradientFromColor: "#F2F7FF",
          gradientToColor: "#FFFFFF",
        },
        Switch: {
          ...base.Switch,
          colorPrimary: "#FF7EB6",
          handleBg: "#FFFFFF",
        },
        Slider: {
          ...base.Slider,
          handleSize: 18,
          trackBg: "#7AA7FF",
          handleColor: "#FF7EB6",
          railBg: "#EDE6FF",
        },
        Tag: {
          ...base.Tag,
          borderRadiusSM: 999,
        },
        Menu: {
          ...base.Menu,
          borderRadiusLG: 16,
          itemSelectedBg: "#F2F7FF",
          itemSelectedColor: "#5D84DF",
          itemHoverBg: "#F2F7FF",
        },
        Typography: {
          ...base.Typography,
          colorLink: "#5D84DF",
          colorLinkHover: "#7AA7FF",
          fontWeightStrong: 700,
        },
        Divider: {
          ...base.Divider,
          colorSplit: "#C2A8CD",
        },
        Avatar: {
          ...base.Avatar,
          borderRadius: 999,
        },
        FloatButton: {
          ...base.FloatButton,
          borderRadiusLG: 999,
        },
        Checkbox: {
          ...base.Checkbox,
          borderRadiusSM: 8,
          colorPrimary: "#FF7EB6",
        },
        Radio: {
          ...base.Radio,
          colorPrimary: "#FF7EB6",
          dotSize: 10,
        },
        DatePicker: {
          ...base.DatePicker,
          activeBorderColor: "#5D84DF",
          borderRadius: Math.max(14, theme.foundation.radius),
        },
        Breadcrumb: {
          ...base.Breadcrumb,
          linkColor: "#5D84DF",
        },
        Form: {
          ...base.Form,
          labelRequiredMarkColor: "#FF7EB6",
        },
      };
    case "neu-brutalism":
      return {
        ...base,
        Button: {
          ...base.Button,
          borderRadius: 0,
          lineWidth: 4,
          colorPrimary: "#FF6B6B",
          colorTextLightSolid: "#000000",
          boxShadow: theme.foundation.shadow,
          primaryShadow: "4px 4px 0 #000000",
          defaultShadow: "4px 4px 0 #000000",
          dangerShadow: "4px 4px 0 #000000",
          fontWeight: 700,
        },
        Input: {
          ...base.Input,
          borderRadius: 0,
          lineWidth: 4,
          colorBorder: "#000000",
          activeShadow: "4px 4px 0px 0px #000000",
        },
        Select: {
          ...base.Select,
          borderRadius: 0,
          optionSelectedBg: "#FFF7CE",
        },
        Cascader: {
          ...base.Cascader,
          borderRadius: 0,
          optionSelectedBg: "#FFF7CE",
        },
        TreeSelect: {
          ...base.TreeSelect,
          borderRadius: 0,
          nodeSelectedBg: "#FFF7CE",
        },
        ColorPicker: {
          ...base.ColorPicker,
          borderRadius: 0,
          lineWidth: 4,
        },
        Transfer: {
          ...base.Transfer,
          borderRadius: 0,
          headerBg: "#FFD93D",
        },
        Table: {
          ...base.Table,
          borderColor: "#000000",
          headerBg: "#FFD93D",
          headerColor: "#000000",
          rowHoverBg: "#FFF7CE",
        },
        Card: {
          ...base.Card,
          lineWidth: 3,
          borderRadiusLG: 0,
          headerBg: "#FFD93D",
          colorBorderSecondary: "#000000",
        },
        Collapse: {
          ...base.Collapse,
          borderRadiusLG: 0,
          headerBg: "#FFD93D",
          contentBg: "#FFFDF5",
        },
        Timeline: {
          ...base.Timeline,
          dotBg: "#FFFFFF",
          tailColor: "#000000",
        },
        Descriptions: {
          ...base.Descriptions,
          labelBg: "#FFD93D",
          borderRadiusLG: 0,
        },
        Tree: {
          ...base.Tree,
          borderRadius: 0,
          nodeSelectedBg: "#FFF7CE",
          nodeHoverBg: "#FFF7CE",
        },
        Modal: {
          ...base.Modal,
          borderRadiusLG: 0,
        },
        Tooltip: {
          ...base.Tooltip,
          borderRadius: 0,
          colorBgSpotlight: "#000000",
          colorTextLightSolid: "#FFFFFF",
        },
        Popover: {
          ...base.Popover,
          borderRadiusLG: 0,
        },
        Popconfirm: {
          ...base.Popconfirm,
          borderRadiusLG: 0,
        },
        Spin: {
          ...base.Spin,
          colorPrimary: "#FF6B6B",
        },
        Skeleton: {
          ...base.Skeleton,
          borderRadiusSM: 0,
          gradientFromColor: "#FFD93D",
          gradientToColor: "#FFFDF5",
        },
        Switch: {
          ...base.Switch,
          colorPrimary: "#FF6B6B",
          handleBg: "#FFFFFF",
          lineWidth: 4,
        },
        Slider: {
          ...base.Slider,
          handleLineWidth: 4,
          trackBg: "#FF6B6B",
          handleColor: "#FF6B6B",
          railBg: "#C4B5FD",
        },
        Tag: {
          ...base.Tag,
          borderRadiusSM: 0,
          lineWidth: 4,
        },
        Menu: {
          ...base.Menu,
          borderRadiusLG: 0,
          itemSelectedBg: "#FFD93D",
          itemSelectedColor: "#000000",
          itemHoverBg: "#FFF7CE",
        },
        Typography: {
          ...base.Typography,
          colorLink: "#000000",
          colorLinkHover: "#000000",
          fontWeightStrong: 900,
        },
        Divider: {
          ...base.Divider,
          colorSplit: "#000000",
        },
        Avatar: {
          ...base.Avatar,
          borderRadius: 0,
        },
        FloatButton: {
          ...base.FloatButton,
          borderRadiusLG: 0,
        },
        Checkbox: {
          ...base.Checkbox,
          borderRadiusSM: 0,
          lineWidth: 4,
          colorPrimary: "#FF6B6B",
        },
        Radio: {
          ...base.Radio,
          colorPrimary: "#FF6B6B",
          dotSize: 10,
        },
        Steps: {
          ...base.Steps,
          colorPrimary: "#FF6B6B",
          iconSize: 30,
        },
        DatePicker: {
          ...base.DatePicker,
          borderRadius: 0,
          activeBorderColor: "#000000",
        },
        Breadcrumb: {
          ...base.Breadcrumb,
          linkColor: "#000000",
        },
        Form: {
          ...base.Form,
          labelColor: "#000000",
        },
      };
    case "black-gold":
      return {
        ...base,
        Button: {
          ...base.Button,
          colorPrimary: "#D4AF37",
          colorTextLightSolid: "#0B0B0F",
          borderRadius: Math.max(6, Math.round(theme.foundation.radius * 0.8)),
          boxShadow: theme.foundation.shadowHover,
          primaryShadow: "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
          fontWeight: 700,
        },
        Input: {
          ...base.Input,
          colorBorder: "#4A4452",
          borderRadius: Math.max(6, Math.round(theme.foundation.radius * 0.75)),
          activeShadow: "0 0 0 2px rgba(212, 175, 55, 0.32)",
        },
        Select: {
          ...base.Select,
          borderRadius: 6,
          optionSelectedBg: "#1D1D22",
        },
        Cascader: {
          ...base.Cascader,
          borderRadius: 6,
          optionSelectedBg: "#1D1D22",
        },
        TreeSelect: {
          ...base.TreeSelect,
          borderRadius: 6,
          nodeSelectedBg: "#1D1D22",
        },
        ColorPicker: {
          ...base.ColorPicker,
          borderRadius: 6,
        },
        Transfer: {
          ...base.Transfer,
          headerBg: "#1D1D22",
          borderRadius: 6,
        },
        Table: {
          ...base.Table,
          headerBg: "#1D1D22",
          headerColor: "#F2F0E4",
          rowHoverBg: "#18181D",
        },
        Card: {
          ...base.Card,
          headerBg: "#1D1D22",
          colorBorderSecondary: "rgba(212,175,55,0.15)",
        },
        Collapse: {
          ...base.Collapse,
          headerBg: "#1D1D22",
          contentBg: "#141418",
        },
        Timeline: {
          ...base.Timeline,
          dotBg: "#141418",
          tailColor: "rgba(212,175,55,0.2)",
        },
        Descriptions: {
          ...base.Descriptions,
          labelBg: "#1D1D22",
        },
        Tree: {
          ...base.Tree,
          nodeSelectedBg: "#1D1D22",
        },
        Modal: {
          ...base.Modal,
          contentBg: "#141418",
          borderRadiusLG: Math.max(8, theme.foundation.radius),
        },
        Tooltip: {
          ...base.Tooltip,
          colorBgSpotlight: "#1D1D22",
          colorTextLightSolid: "#F2F0E4",
        },
        Popover: {
          ...base.Popover,
          colorBgElevated: "#141418",
        },
        Popconfirm: {
          ...base.Popconfirm,
          borderRadiusLG: 8,
        },
        Spin: {
          ...base.Spin,
          colorPrimary: "#D4AF37",
        },
        Skeleton: {
          ...base.Skeleton,
          gradientFromColor: "#1D1D22",
          gradientToColor: "#141418",
        },
        Tabs: {
          ...base.Tabs,
          cardBg: "#141418",
          itemSelectedColor: "#D4AF37",
          inkBarColor: "#D4AF37",
        },
        Switch: {
          ...base.Switch,
          colorPrimary: "#D4AF37",
          handleBg: "#141418",
        },
        Slider: {
          ...base.Slider,
          trackBg: "#D4AF37",
          handleColor: "#E2C26C",
          railBg: "#4A4452",
        },
        Tag: {
          ...base.Tag,
          borderRadiusSM: 6,
        },
        Menu: {
          ...base.Menu,
          itemBg: "#141418",
          itemSelectedBg: "#1D1D22",
          itemSelectedColor: "#D4AF37",
          itemHoverBg: "#1D1D22",
        },
        Typography: {
          ...base.Typography,
          colorLink: "#D4AF37",
          colorLinkHover: "#E2C26C",
        },
        Divider: {
          ...base.Divider,
          colorSplit: "rgba(212,175,55,0.15)",
        },
        Avatar: {
          ...base.Avatar,
          colorBgBase: "#1D1D22",
        },
        FloatButton: {
          ...base.FloatButton,
          colorBgElevated: "#141418",
        },
        Checkbox: {
          ...base.Checkbox,
          colorPrimary: "#D4AF37",
          borderRadiusSM: 4,
        },
        Radio: {
          ...base.Radio,
          colorPrimary: "#D4AF37",
        },
        DatePicker: {
          ...base.DatePicker,
          activeBorderColor: "#D4AF37",
          borderRadius: Math.max(6, Math.round(theme.foundation.radius * 0.75)),
        },
        Breadcrumb: {
          ...base.Breadcrumb,
          linkColor: "#D4AF37",
        },
        Form: {
          ...base.Form,
          labelColor: "#F2F0E4",
          labelRequiredMarkColor: "#D4AF37",
        },
        Image: {
          ...base.Image,
          colorBgMask: "rgba(11,11,15,0.85)",
        },
      };
    case "red-gold":
      return {
        ...base,
        Button: {
          ...base.Button,
          colorPrimary: "#ED2939",
          colorError: "#B71C1C",
          borderRadius: Math.max(8, Math.round(theme.foundation.radius * 0.8)),
          boxShadow: theme.foundation.shadowHover,
          colorTextLightSolid: "#F2F0E4",
          fontWeight: 700,
        },
        Input: {
          ...base.Input,
          colorBorder: "#4D3F54",
          borderRadius: Math.max(8, Math.round(theme.foundation.radius * 0.7)),
          activeShadow: "0 0 0 2px rgba(212, 175, 55, 0.35)",
        },
        Select: {
          ...base.Select,
          borderRadius: 8,
          optionSelectedBg: "#1D1A21",
        },
        Cascader: {
          ...base.Cascader,
          borderRadius: 8,
          optionSelectedBg: "#1D1A21",
        },
        TreeSelect: {
          ...base.TreeSelect,
          borderRadius: 8,
          nodeSelectedBg: "#1D1A21",
        },
        ColorPicker: {
          ...base.ColorPicker,
          borderRadius: 6,
        },
        Transfer: {
          ...base.Transfer,
          borderRadius: 8,
          headerBg: "#1D1A21",
        },
        Table: {
          ...base.Table,
          headerBg: "#1D1A21",
          headerColor: "#F2F0E4",
          rowHoverBg: "#18151C",
        },
        Card: {
          ...base.Card,
          headerBg: "#1D1A21",
          colorBorderSecondary: "rgba(212,175,55,0.12)",
        },
        Collapse: {
          ...base.Collapse,
          headerBg: "#1D1A21",
          contentBg: "#141217",
        },
        Timeline: {
          ...base.Timeline,
          dotBg: "#141217",
          tailColor: "rgba(212,175,55,0.15)",
        },
        Descriptions: {
          ...base.Descriptions,
          labelBg: "#1D1A21",
        },
        Tree: {
          ...base.Tree,
          nodeSelectedBg: "#1D1A21",
          nodeHoverBg: "#1D1A21",
        },
        Modal: {
          ...base.Modal,
          contentBg: "#141217",
          borderRadiusLG: Math.max(8, theme.foundation.radius),
        },
        Tooltip: {
          ...base.Tooltip,
          colorBgSpotlight: "#1D1A21",
          colorTextLightSolid: "#F2F0E4",
        },
        Popover: {
          ...base.Popover,
          colorBgElevated: "#141217",
        },
        Popconfirm: {
          ...base.Popconfirm,
          borderRadiusLG: 8,
        },
        Spin: {
          ...base.Spin,
          colorPrimary: "#ED2939",
        },
        Skeleton: {
          ...base.Skeleton,
          gradientFromColor: "#1D1A21",
          gradientToColor: "#141217",
        },
        Switch: {
          ...base.Switch,
          colorPrimary: "#D4AF37",
          handleBg: "#141217",
        },
        Slider: {
          ...base.Slider,
          trackBg: "#D4AF37",
          handleColor: "#ED2939",
          railBg: "#4D3F54",
        },
        Tag: {
          ...base.Tag,
          borderRadiusSM: 8,
        },
        Tabs: {
          ...base.Tabs,
          itemSelectedColor: "#D4AF37",
          inkBarColor: "#D4AF37",
        },
        Menu: {
          ...base.Menu,
          itemBg: "#141217",
          itemSelectedBg: "#1D1A21",
          itemSelectedColor: "#D4AF37",
          itemHoverBg: "#1D1A21",
        },
        Typography: {
          ...base.Typography,
          colorLink: "#D4AF37",
          colorLinkHover: "#E2C26C",
        },
        Divider: {
          ...base.Divider,
          colorSplit: "rgba(212,175,55,0.12)",
        },
        Avatar: {
          ...base.Avatar,
          colorBgBase: "#1D1A21",
        },
        FloatButton: {
          ...base.FloatButton,
          colorBgElevated: "#141217",
        },
        DatePicker: {
          ...base.DatePicker,
          activeBorderColor: "#D4AF37",
          borderRadius: Math.max(8, Math.round(theme.foundation.radius * 0.7)),
        },
        Breadcrumb: {
          ...base.Breadcrumb,
          linkColor: "#D4AF37",
        },
        Form: {
          ...base.Form,
          labelColor: "#F2F0E4",
          labelRequiredMarkColor: "#ED2939",
        },
        Image: {
          ...base.Image,
          colorBgMask: "rgba(11,11,15,0.85)",
        },
      };
    default:
      return base;
  }
}

function ensureContrastColor(color: string, background: string, minContrast: number): string {
  let next = color;
  let attempts = 0;

  while (contrastRatio(background, next) < minContrast && attempts < 6) {
    next = deriveActiveColor(next);
    attempts += 1;
  }

  return next;
}
