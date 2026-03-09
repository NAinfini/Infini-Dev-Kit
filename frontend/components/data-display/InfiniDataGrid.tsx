import { Group, Pagination, Select, Stack, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { forwardRef, useMemo, useState, type CSSProperties, type ReactNode, type Ref } from "react";
import clsx from "clsx";
import { InfiniTable, getCoreRowModel, getSortedRowModel, useReactTable } from "../data-display/InfiniTable";
import type { ColumnDef, SortingState } from "../data-display/InfiniTable";

export type InfiniDataGridProps<T extends Record<string, unknown>> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  pageSize?: number;
  pageSizeOptions?: number[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  toolbar?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

function InfiniDataGridInner<T extends Record<string, unknown>>({
  data,
  columns,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  searchable = false,
  searchPlaceholder = "Search...",
  searchKeys,
  toolbar,
  className,
  style,
  ...rest
}: InfiniDataGridProps<T>, ref: Ref<HTMLDivElement>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 250);
  const [sorting, setSorting] = useState<SortingState>([]);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return data;
    const needle = debouncedSearch.toLowerCase();
    return data.filter((row) => {
      const keys = searchKeys ?? (Object.keys(row) as (keyof T)[]);
      return keys.some((key) => {
        const val = row[key];
        return val != null && String(val).toLowerCase().includes(needle);
      });
    });
  }, [data, debouncedSearch, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const table = useReactTable({
    data: paged,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div ref={ref} className={clsx(className)} style={style} {...rest}>
      <Stack gap="sm">
        {(searchable || toolbar) ? (
          <Group justify="space-between" wrap="wrap">
            {searchable ? (
              <TextInput
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => { setSearch(e.currentTarget.value); setPage(1); }}
                style={{ minWidth: 220 }}
              />
            ) : null}
            {toolbar}
          </Group>
        ) : null}

        <InfiniTable table={table} />

        <Group justify="space-between" align="center">
          <Select
            data={pageSizeOptions.map((n) => ({ value: String(n), label: `${n} / page` }))}
            value={String(pageSize)}
            onChange={(val) => { if (val) { setPageSize(Number(val)); setPage(1); } }}
            style={{ width: 120 }}
            size="xs"
          />
          <Pagination total={totalPages} value={safePage} onChange={setPage} size="sm" />
        </Group>
      </Stack>
    </div>
  );
}

export const InfiniDataGrid = forwardRef(InfiniDataGridInner) as <T extends Record<string, unknown>>(
  props: InfiniDataGridProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReturnType<typeof InfiniDataGridInner>;
