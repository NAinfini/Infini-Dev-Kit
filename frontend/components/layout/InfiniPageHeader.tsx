import { forwardRef } from "react";
import { Breadcrumbs, Anchor, Group, Stack, Text } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";

export type BreadcrumbItem = {
  label: string;
  to?: string;
  onClick?: () => void;
};

export type InfiniPageHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const InfiniPageHeader = forwardRef<HTMLDivElement, InfiniPageHeaderProps>(
  function InfiniPageHeader({
    title,
    subtitle,
    icon,
    breadcrumbs,
    actions,
    className,
    style,
    ...rest
  }, ref) {
    return (
      <Stack ref={ref} gap={8} className={className} style={style} {...rest}>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumbs>
            {breadcrumbs.map((crumb, index) => (
              crumb.to || crumb.onClick ? (
                <Anchor key={index} size="sm" onClick={crumb.onClick} href={crumb.to}>
                  {crumb.label}
                </Anchor>
              ) : (
                <Text key={index} size="sm" c="dimmed">{crumb.label}</Text>
              )
            ))}
          </Breadcrumbs>
        ) : null}
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Group gap="sm" align="center">
            {icon}
            <Stack gap={2}>
              <Text fw={700} size="xl">{title}</Text>
              {subtitle ? <Text c="dimmed" size="sm">{subtitle}</Text> : null}
            </Stack>
          </Group>
          {actions}
        </Group>
      </Stack>
    );
  }
);
