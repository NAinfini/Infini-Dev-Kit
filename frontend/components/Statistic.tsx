import { type CSSProperties, type ReactNode } from "react";

export interface StatisticProps {
  title: string;
  value: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  precision?: number;
  valueStyle?: CSSProperties;
}

const containerStyle: CSSProperties = {
  display: "inline-flex",
  flexDirection: "column",
  gap: "4px",
};

const titleStyle: CSSProperties = {
  fontSize: "var(--infini-text-sm)",
  fontFamily: "var(--infini-font-body)",
  color: "var(--infini-color-text-muted)",
  lineHeight: 1.4,
};

const valueRowStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "baseline",
  gap: "4px",
};

const valueStyle: CSSProperties = {
  fontSize: "var(--infini-text-3xl)",
  fontFamily: "var(--infini-font-display)",
  fontWeight: "var(--infini-font-display-weight)" as CSSProperties["fontWeight"],
  color: "var(--infini-color-text)",
  lineHeight: 1.2,
};

const affixStyle: CSSProperties = {
  fontSize: "var(--infini-text-base)",
  fontFamily: "var(--infini-font-body)",
  color: "var(--infini-color-text-muted)",
  lineHeight: 1.2,
};

function formatValue(value: ReactNode, precision?: number): ReactNode {
  if (precision !== undefined && typeof value === "number") {
    return value.toFixed(precision);
  }
  return value;
}

export function Statistic({
  title,
  value,
  prefix,
  suffix,
  precision,
  valueStyle: customValueStyle,
}: StatisticProps) {
  return (
    <div style={containerStyle}>
      <div style={titleStyle}>{title}</div>
      <div style={valueRowStyle}>
        {prefix != null && <span style={affixStyle}>{prefix}</span>}
        <span style={{ ...valueStyle, ...customValueStyle }}>
          {formatValue(value, precision)}
        </span>
        {suffix != null && <span style={affixStyle}>{suffix}</span>}
      </div>
    </div>
  );
}
