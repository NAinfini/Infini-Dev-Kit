import { forwardRef } from "react";
import { ColorPicker, ColorSwatch, Group, Stack, Text, TextInput } from "@mantine/core";
import type { CSSProperties } from "react";
import { useState } from "react";

export type InfiniColorPickerProps = {
  value?: string;
  onChange?: (color: string) => void;
  swatches?: string[];
  label?: string;
  withInput?: boolean;
  format?: "hex" | "rgba" | "hsla";
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_SWATCHES = [
  "#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#6366f1",
];

export const InfiniColorPicker = forwardRef<HTMLDivElement, InfiniColorPickerProps>(
  function InfiniColorPicker({
    value: controlledValue,
    onChange,
    swatches = DEFAULT_SWATCHES,
    label,
    withInput = true,
    format = "hex",
    className,
    style,
    ...rest
  }, ref) {
    const [internal, setInternal] = useState(controlledValue ?? "#3b82f6");
    const color = controlledValue ?? internal;
    const setColor = (c: string) => { setInternal(c); onChange?.(c); };

    return (
      <Stack ref={ref} gap="xs" className={className} style={style} {...rest}>
        {label ? <Text fw={500} size="sm">{label}</Text> : null}
        <ColorPicker
          value={color}
          onChange={setColor}
          format={format}
          swatches={swatches}
          swatchesPerRow={5}
        />
        {withInput ? (
          <Group gap="xs">
            <ColorSwatch color={color} size={28} />
            <TextInput
              value={color}
              onChange={(e) => setColor(e.currentTarget.value)}
              style={{ flex: 1 }}
              size="xs"
            />
          </Group>
        ) : null}
      </Stack>
    );
  }
);
