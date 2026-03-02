import { describe, expect, it } from "vitest";

import { composeMantineTheme } from "../theme/mantine/mantine-adapter";
import { listThemeIds } from "../theme/theme-specs";

const REQUIRED_COMPONENT_KEYS = [
  "Button",
  "Input",
  "Table",
  "Modal",
  "Notification",
  "Select",
  "Cascader",
  "TreeSelect",
  "ColorPicker",
  "Transfer",
  "Card",
  "Collapse",
  "Timeline",
  "Descriptions",
  "Tree",
  "Tooltip",
  "Popover",
  "Popconfirm",
  "Spin",
  "Skeleton",
  "Menu",
  "Typography",
  "Divider",
  "Avatar",
  "FloatButton",
  "Form",
  "Watermark",
  "Image",
  "Empty",
  "Result",
  "Tabs",
  "Switch",
  "Slider",
  "Tag",
  "Badge",
  "Progress",
  "Drawer",
  "Segmented",
  "Alert",
  "DatePicker",
  "Checkbox",
  "Radio",
  "Rate",
  "Steps",
  "Breadcrumb",
] as const;

describe("component token audit", () => {
  it("provides themed token maps for key UI components across all themes", () => {
    for (const themeId of listThemeIds()) {
      const config = composeMantineTheme({ themeId });
      for (const key of REQUIRED_COMPONENT_KEYS) {
        expect(config.components[key]).toBeTruthy();
      }
    }
  });
});
