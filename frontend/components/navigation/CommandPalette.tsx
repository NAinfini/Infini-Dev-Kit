import { Modal, Stack, Text } from "@mantine/core";
import { Command } from "cmdk";
import { type ReactNode, useEffect, useMemo, useState } from "react";

export type CommandPaletteItem = {
  id: string;
  title: string;
  subtitle?: string;
  group?: string;
  icon?: ReactNode;
  keywords?: string;
};

export type CommandPaletteLabels = {
  searchPlaceholder: string;
  noResults: string;
  recentSearches: string;
  loading: string;
};

const DEFAULT_LABELS: CommandPaletteLabels = {
  searchPlaceholder: "Search...",
  noResults: "No results found",
  recentSearches: "Recent searches",
  loading: "Loading...",
};

const RECENT_STORAGE_KEY = "infini-cmd-palette.recent";
const RECENT_LIMIT = 8;

function readRecentSearches(storageKey: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  } catch {
    return [];
  }
}

function writeRecentSearches(storageKey: string, items: string[]): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(items.slice(0, RECENT_LIMIT)));
  } catch {
    // Ignore storage errors
  }
}

export type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandPaletteItem[];
  onSelect: (item: CommandPaletteItem) => void;
  query?: string;
  onQueryChange?: (query: string) => void;
  loading?: boolean;
  groupBy?: (item: CommandPaletteItem) => string;
  labels?: Partial<CommandPaletteLabels>;
  /** Enable Cmd+K / Ctrl+K hotkey to toggle. Default: true */
  hotkey?: boolean;
  /** localStorage key for recent searches. Default: "infini-cmd-palette.recent" */
  storageKey?: string;
  /** Modal title */
  title?: string;
  /** Max visible results. Default: 24 */
  maxResults?: number;
};

export function CommandPalette({
  open,
  onOpenChange,
  items,
  onSelect,
  query: controlledQuery,
  onQueryChange,
  loading = false,
  groupBy,
  labels: labelsProp,
  hotkey = true,
  storageKey = RECENT_STORAGE_KEY,
  title,
  maxResults = 24,
  ...rest
}: CommandPaletteProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const [internalQuery, setInternalQuery] = useState("");
  const query = controlledQuery ?? internalQuery;
  const setQuery = onQueryChange ?? setInternalQuery;
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => readRecentSearches(storageKey));

  useEffect(() => {
    if (!hotkey) return;
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [hotkey, open, onOpenChange]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  const visibleItems = useMemo(() => {
    const normalized = debouncedQuery.trim().toLowerCase();
    if (!normalized) return items.slice(0, maxResults);
    return items
      .filter((item) => {
        const haystack = `${item.title} ${item.subtitle ?? ""} ${item.group ?? ""} ${item.keywords ?? ""}`.toLowerCase();
        return haystack.includes(normalized);
      })
      .slice(0, maxResults);
  }, [debouncedQuery, items, maxResults]);

  const groupedItems = useMemo(() => {
    const groups = new Map<string, CommandPaletteItem[]>();
    for (const item of visibleItems) {
      const key = groupBy ? groupBy(item) : (item.group ?? "");
      const list = groups.get(key) ?? [];
      list.push(item);
      groups.set(key, list);
    }
    return groups;
  }, [visibleItems, groupBy]);

  const queryIsDebouncing = query !== debouncedQuery;

  const handleSelect = (item: CommandPaletteItem) => {
    const normalized = query.trim().toLowerCase();
    if (normalized) {
      setRecentSearches((prev) => {
        const next = [normalized, ...prev.filter((v) => v !== normalized)].slice(0, RECENT_LIMIT);
        writeRecentSearches(storageKey, next);
        return next;
      });
    }
    onOpenChange(false);
    setQuery("");
    setDebouncedQuery("");
    onSelect(item);
  };

  return (
    <Modal
      title={title}
      opened={open}
      onClose={() => onOpenChange(false)}
      size="640px"
      withCloseButton
      {...rest}
    >
      <Command>
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder={labels.searchPlaceholder}
          aria-label={labels.searchPlaceholder}
          style={{
            width: "100%",
            border: "1px solid color-mix(in srgb, var(--infini-color-text, #111827) 20%, transparent)",
            borderRadius: 8,
            padding: "10px 12px",
            marginTop: 4,
            marginBottom: 12,
          }}
        />

        <Command.List style={{ maxHeight: 360, overflow: "auto" }}>
          {(loading || queryIsDebouncing) ? <Text c="dimmed">{labels.loading}</Text> : null}
          {!loading && visibleItems.length === 0 ? <Command.Empty>{labels.noResults}</Command.Empty> : null}

          {query.length === 0 && recentSearches.length > 0 ? (
            <Command.Group heading={labels.recentSearches}>
              {recentSearches.map((recent) => (
                <Command.Item
                  key={recent}
                  value={recent}
                  onSelect={() => setQuery(recent)}
                  style={{ borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}
                >
                  <Text>{recent}</Text>
                </Command.Item>
              ))}
            </Command.Group>
          ) : null}

          {Array.from(groupedItems.entries()).map(([group, groupItems]) => (
            <Command.Group key={group} heading={group || undefined}>
              {groupItems.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${item.group ?? ""} ${item.title} ${item.subtitle ?? ""} ${item.keywords ?? ""}`}
                  onSelect={() => handleSelect(item)}
                  style={{ borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}
                >
                  <Stack gap={2} style={{ width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {item.icon}
                      <Text fw={600}>{item.title}</Text>
                    </div>
                    {item.subtitle ? <Text c="dimmed" size="sm">{item.subtitle}</Text> : null}
                  </Stack>
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </Modal>
  );
}
