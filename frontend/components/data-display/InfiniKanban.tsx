import { Group, ScrollArea, Stack, Text } from "@mantine/core";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { InfiniCard } from "../infini";

export type KanbanCard = {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  footer?: ReactNode;
};

export type KanbanColumn = {
  id: string;
  title: string;
  color?: string;
  cards: KanbanCard[];
};

export type InfiniKanbanProps = {
  columns: KanbanColumn[];
  onCardClick?: (card: KanbanCard, columnId: string) => void;
  renderCard?: (card: KanbanCard, columnId: string) => ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const InfiniKanban = forwardRef<HTMLDivElement, InfiniKanbanProps>(
  function InfiniKanban({
    columns,
    onCardClick,
    renderCard,
    className,
    style,
    ...rest
  }, ref) {
    return (
      <div ref={ref} className={clsx(className)} style={style} {...rest}>
        <ScrollArea type="auto" offsetScrollbars>
          <Group
            gap="md"
            align="flex-start"
            wrap="nowrap"
            style={{ minHeight: 200 }}
          >
            {columns.map((column) => (
              <Stack
                key={column.id}
                gap="xs"
                style={{
                  minWidth: 260,
                  maxWidth: 320,
                  flex: "0 0 280px",
                }}
              >
                <Group gap={8} px={4}>
                  {column.color ? (
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: column.color,
                      flexShrink: 0,
                    }} />
                  ) : null}
                  <Text fw={600} size="sm">{column.title}</Text>
                  <Text c="dimmed" size="xs">({column.cards.length})</Text>
                </Group>

                <Stack
                  gap={8}
                  style={{
                    backgroundColor: "var(--infini-color-surface, var(--mantine-color-gray-0))",
                    borderRadius: 8,
                    padding: 8,
                    minHeight: 80,
                  }}
                >
                  {column.cards.map((card) =>
                    renderCard ? (
                      <div key={card.id} onClick={() => onCardClick?.(card, column.id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") onCardClick?.(card, column.id); }}>
                        {renderCard(card, column.id)}
                      </div>
                    ) : (
                      <InfiniCard
                        key={card.id}
                        interactive
                        onClick={() => onCardClick?.(card, column.id)}
                      >
                        <Stack gap={4} p="xs">
                          <Group gap={6}>
                            {card.icon}
                            <Text fw={500} size="sm">{card.title}</Text>
                          </Group>
                          {card.description ? <Text c="dimmed" size="xs">{card.description}</Text> : null}
                          {card.footer}
                        </Stack>
                      </InfiniCard>
                    ),
                  )}
                </Stack>
              </Stack>
            ))}
          </Group>
        </ScrollArea>
      </div>
    );
  }
);
