import { forwardRef, type CSSProperties, type ReactElement } from "react";
import { Group, Skeleton, Stack } from "@mantine/core";
import clsx from "clsx";

export type InfiniSkeletonVariant = "card" | "table" | "list" | "form" | "detail";

export type InfiniSkeletonProps = {
  variant?: InfiniSkeletonVariant;
  rows?: number;
  className?: string;
  style?: CSSProperties;
};

function CardSkeleton({ rows }: { rows: number }) {
  return (
    <Group gap="md" wrap="wrap">
      {Array.from({ length: rows }, (_, i) => (
        <Stack key={i} gap="xs" style={{ width: 260 }}>
          <Skeleton height={140} radius="md" />
          <Skeleton height={16} width="70%" />
          <Skeleton height={12} width="40%" />
        </Stack>
      ))}
    </Group>
  );
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <Stack gap={8}>
      <Group gap="md">
        <Skeleton height={14} width="20%" />
        <Skeleton height={14} width="30%" />
        <Skeleton height={14} width="25%" />
        <Skeleton height={14} width="15%" />
      </Group>
      {Array.from({ length: rows }, (_, i) => (
        <Group key={i} gap="md">
          <Skeleton height={12} width="20%" />
          <Skeleton height={12} width="30%" />
          <Skeleton height={12} width="25%" />
          <Skeleton height={12} width="15%" />
        </Group>
      ))}
    </Stack>
  );
}

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <Stack gap="xs">
      {Array.from({ length: rows }, (_, i) => (
        <Group key={i} gap="sm">
          <Skeleton height={40} width={40} circle />
          <Stack gap={4} style={{ flex: 1 }}>
            <Skeleton height={14} width="60%" />
            <Skeleton height={10} width="35%" />
          </Stack>
        </Group>
      ))}
    </Stack>
  );
}

function FormSkeleton({ rows }: { rows: number }) {
  return (
    <Stack gap="md">
      {Array.from({ length: rows }, (_, i) => (
        <Stack key={i} gap={4}>
          <Skeleton height={12} width={100} />
          <Skeleton height={36} />
        </Stack>
      ))}
      <Skeleton height={36} width={120} radius="md" />
    </Stack>
  );
}

function DetailSkeleton() {
  return (
    <Stack gap="md">
      <Group gap="md">
        <Skeleton height={80} width={80} circle />
        <Stack gap={6} style={{ flex: 1 }}>
          <Skeleton height={20} width="40%" />
          <Skeleton height={14} width="25%" />
        </Stack>
      </Group>
      <Skeleton height={12} />
      <Skeleton height={12} width="90%" />
      <Skeleton height={12} width="75%" />
    </Stack>
  );
}

const VARIANT_MAP: Record<InfiniSkeletonVariant, (props: { rows: number }) => ReactElement> = {
  card: CardSkeleton,
  table: TableSkeleton,
  list: ListSkeleton,
  form: FormSkeleton,
  detail: DetailSkeleton,
};

export const InfiniSkeleton = forwardRef<HTMLDivElement, InfiniSkeletonProps>(
  function InfiniSkeleton({
    variant = "list",
    rows = 4,
    className,
    style,
    ...rest
  }, ref) {
    const Component = VARIANT_MAP[variant];
    return (
      <div ref={ref} className={clsx(className)} style={style} {...rest}>
        <Component rows={rows} />
      </div>
    );
  }
);
