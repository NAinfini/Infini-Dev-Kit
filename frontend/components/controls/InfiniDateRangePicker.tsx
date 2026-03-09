import { forwardRef } from "react";
import { Stack, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import type { CSSProperties } from "react";
import { useState } from "react";

export type InfiniDateRangePickerProps = {
  value?: [Date | null, Date | null];
  onChange?: (range: [Date | null, Date | null]) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  style?: CSSProperties;
};

export const InfiniDateRangePicker = forwardRef<HTMLDivElement, InfiniDateRangePickerProps>(
  function InfiniDateRangePicker({
    value: controlledValue,
    onChange,
    label,
    minDate,
    maxDate,
    className,
    style,
    ...rest
  }, ref) {
    const [internal, setInternal] = useState<[Date | null, Date | null]>([null, null]);
    const range = controlledValue ?? internal;

    const setRange = (next: [Date | null, Date | null]) => {
      setInternal(next);
      onChange?.(next);
    };

    return (
      <Stack ref={ref} gap="xs" className={className} style={style} {...rest}>
        {label ? <Text fw={500} size="sm">{label}</Text> : null}
        <DatePicker
          type="range"
          value={range}
          onChange={setRange}
          minDate={minDate}
          maxDate={maxDate}
        />
      </Stack>
    );
  }
);
