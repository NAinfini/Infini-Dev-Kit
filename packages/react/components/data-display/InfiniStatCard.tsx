import { forwardRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { NumberTicker } from "../data-display/NumberTicker";

import "./InfiniStatCard.css";

export type InfiniStatCardProps = {
  title: string;
  value: number;
  previousValue?: number;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  sparkline?: ReactNode;
  loading?: boolean;
  loadingContent?: ReactNode;
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
    loading,
    loadingContent,
    className,
    style,
    ...rest
  }, ref) {
    if (loading) return <>{loadingContent}</>;

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
      <div ref={ref} className={clsx("infini-stat-card", className)} style={style} {...rest}>
        <div className="infini-stat-card-inner">
          <div className="infini-stat-card-header">
            <span className="infini-stat-card-title">{title}</span>
            {icon && <span className="infini-stat-card-icon">{icon}</span>}
          </div>
          <div className="infini-stat-card-value-row">
            <span className="infini-stat-card-value">
              <NumberTicker value={value} />
            </span>
            {diff !== null && trendArrow ? (
              <span className="infini-stat-card-trend" style={{ color: trendColor }}>
                {trendArrow} {diff}
              </span>
            ) : null}
          </div>
          {sparkline && <div className="infini-stat-card-sparkline">{sparkline}</div>}
        </div>
      </div>
    );
  }
);
