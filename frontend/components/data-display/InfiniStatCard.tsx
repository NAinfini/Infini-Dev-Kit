import { Group, Stack, Text } from "@mantine/core";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { InfiniCard } from "../infini";
import { NumberTicker } from "../data-display/NumberTicker";

export type InfiniStatCardProps = {
  title: string;
  value: number;
  previousValue?: number;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  sparkline?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const InfiniStatCard = forwardRef<HTMLDivElement, InfiniStatCardProps>(
  function InfiniStatCard({
    title,
    value,
    previousValue,
    icon,
    trend: trendProp,
    sparkline,
    className,
    style,
    ...rest
  }, ref) {
    const trend = trendProp ?? (previousValue !== undefined
      ? value > previousValue ? "up" : value < previousValue ? "down" : "neutral"
      : "neutral");

    const trendColor = trend === "up"
      ? "var(--infini-color-success, #22c55e)"
      : trend === "down"
        ? "var(--infini-color-danger, #ef4444)"
        : "var(--infini-color-text, #6b7280)";

    const trendArrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "";

    const diff = previousValue !== undefined ? Math.abs(value - previousValue) : null;

    return (
      <div ref={ref} className={clsx(className)} style={style} {...rest}>
        <InfiniCard interactive={false}>
          <Stack gap={8} p="md">
            <Group justify="space-between" align="flex-start">
              <Text c="dimmed" size="sm">{title}</Text>
              {icon}
            </Group>
            <Group align="flex-end" gap={8}>
              <Text fw={700} size="xl" style={{ lineHeight: 1 }}>
                <NumberTicker value={value} />
              </Text>
              {diff !== null && trendArrow ? (
                <Text size="sm" fw={600} style={{ color: trendColor, lineHeight: 1 }}>
                  {trendArrow} {diff}
                </Text>
              ) : null}
            </Group>
            {sparkline}
          </Stack>
        </InfiniCard>
      </div>
    );
  }
);
