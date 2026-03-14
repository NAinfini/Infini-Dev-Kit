import type { ThemeId } from "@infini-dev-kit/theme-core";

/**
 * Per-theme Radix component variant hints that go beyond what
 * `<Theme>` props and CSS overrides can express.
 *
 * Use these to conditionally apply Radix component `variant` or
 * `size` props based on the active Infini theme.
 *
 * @example
 * ```ts
 * import { getRadixOverrides } from "@infini-dev-kit/adapter-radix";
 * import { Button } from "@radix-ui/themes";
 *
 * const o = getRadixOverrides("neu-brutalism");
 * <Button variant={o.buttonVariant} highContrast={o.highContrast}>
 *   Click me
 * </Button>
 * ```
 */
export interface RadixComponentOverrides {
  buttonVariant: "solid" | "soft" | "outline" | "ghost" | "surface" | "classic";
  highContrast: boolean;
  panelBackground: "solid" | "translucent";
  tagVariant: "solid" | "soft" | "outline" | "surface";
}

const DEFAULTS: RadixComponentOverrides = {
  buttonVariant: "solid",
  highContrast: false,
  panelBackground: "solid",
  tagVariant: "soft",
};

const OVERRIDES: Partial<Record<ThemeId, Partial<RadixComponentOverrides>>> = {
  "neu-brutalism": {
    buttonVariant: "outline",
    highContrast: true,
    tagVariant: "outline",
  },
  chibi: {
    buttonVariant: "soft",
    tagVariant: "soft",
  },
  cyberpunk: {
    buttonVariant: "surface",
    panelBackground: "translucent",
    tagVariant: "surface",
  },
  "black-gold": {
    panelBackground: "translucent",
  },
  "red-gold": {
    panelBackground: "translucent",
  },
};

export function getRadixOverrides(themeId: ThemeId): RadixComponentOverrides {
  const custom = OVERRIDES[themeId];
  if (!custom) return DEFAULTS;
  return { ...DEFAULTS, ...custom };
}
