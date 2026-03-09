import { Timeline, Text } from "@mantine/core";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";

type ThemeColor = "success" | "danger" | "warning" | "primary" | "info";

const COLOR_MAP: Record<ThemeColor, string> = {
  success: "var(--infini-color-success, #22c55e)",
  danger: "var(--infini-color-danger, #ef4444)",
  warning: "var(--infini-color-warning, #f59e0b)",
  primary: "var(--infini-color-primary, #3b82f6)",
  info: "var(--infini-color-info, #06b6d4)",
};

export type InfiniTimelineItem = {
  title: string;
  description?: string;
  time?: string;
  icon?: ReactNode;
  color?: ThemeColor;
};

export type InfiniTimelineProps = {
  items: InfiniTimelineItem[];
  active?: number;
  className?: string;
  style?: CSSProperties;
};

export const InfiniTimeline = forwardRef<HTMLDivElement, InfiniTimelineProps>(
  function InfiniTimeline({ items, active, className, style, ...rest }, ref) {
    return (
      <div ref={ref} className={clsx(className)} style={style} {...rest}>
        <Timeline
          active={active ?? items.length - 1}
          bulletSize={24}
          lineWidth={2}
        >
          {items.map((item, index) => (
            <Timeline.Item
              key={index}
              bullet={item.icon}
              title={item.title}
              color={item.color ? COLOR_MAP[item.color] : undefined}
            >
              {item.description ? <Text c="dimmed" size="sm">{item.description}</Text> : null}
              {item.time ? <Text size="xs" c="dimmed" mt={4}>{item.time}</Text> : null}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    );
  }
);
