import { Stack } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { forwardRef, useState, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";

export type CalendarEvent = {
  date: Date;
  label: string;
  color?: string;
};

export type InfiniCalendarProps = {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
  renderDay?: (date: Date, events: CalendarEvent[]) => ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const InfiniCalendar = forwardRef<HTMLDivElement, InfiniCalendarProps>(
  function InfiniCalendar({
    events = [],
    onDateSelect,
    onMonthChange,
    renderDay,
    className,
    style,
    ...rest
  }, ref) {
    const [selected, setSelected] = useState<Date | null>(null);

    const eventsByDate = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const key = event.date.toISOString().slice(0, 10);
      const list = eventsByDate.get(key) ?? [];
      list.push(event);
      eventsByDate.set(key, list);
    }

    return (
      <div ref={ref} className={clsx(className)} style={style} {...rest}>
        <Stack gap="xs">
          <Calendar
            getDayProps={(date) => {
              const key = date.toISOString().slice(0, 10);
              const dayEvents = eventsByDate.get(key) ?? [];
              const isSelected = selected?.toISOString().slice(0, 10) === key;

              return {
                selected: isSelected,
                onClick: () => {
                  setSelected(date);
                  onDateSelect?.(date);
                },
                style: dayEvents.length > 0
                  ? { position: "relative" as const }
                  : undefined,
                children: renderDay ? renderDay(date, dayEvents) : undefined,
              };
            }}
            onPreviousMonth={onMonthChange}
            onNextMonth={onMonthChange}
            renderDay={(date) => {
              const key = date.toISOString().slice(0, 10);
              const dayEvents = eventsByDate.get(key) ?? [];

              if (renderDay) return renderDay(date, dayEvents);

              return (
                <div style={{ position: "relative" }}>
                  <div>{date.getDate()}</div>
                  {dayEvents.length > 0 ? (
                    <div style={{
                      position: "absolute",
                      bottom: -2,
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: 2,
                    }}>
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <div
                          key={i}
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            backgroundColor: event.color ?? "var(--infini-color-primary, #3b82f6)",
                          }}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }}
          />
        </Stack>
      </div>
    );
  }
);
