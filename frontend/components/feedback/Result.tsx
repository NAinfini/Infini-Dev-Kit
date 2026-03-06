import { type CSSProperties, type ReactNode } from "react";

export type ResultStatus = "success" | "error" | "warning" | "info" | "404" | "403" | "500";

export interface ResultProps {
  status: ResultStatus;
  title: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode;
  icon?: ReactNode;
}

const STATUS_COLORS: Record<ResultStatus, string> = {
  success: "var(--infini-color-success)",
  error: "var(--infini-color-danger)",
  warning: "var(--infini-color-warning)",
  info: "var(--infini-color-primary)",
  "404": "var(--infini-color-text-muted)",
  "403": "var(--infini-color-danger)",
  "500": "var(--infini-color-danger)",
};

const STATUS_ICONS: Record<ResultStatus, string> = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
  "404": "?",
  "403": "✕",
  "500": "✕",
};

const STATUS_LABELS: Record<ResultStatus, string> = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Info",
  "404": "404",
  "403": "403",
  "500": "500",
};

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "48px 32px",
  textAlign: "center",
  gap: "16px",
  fontFamily: "var(--infini-font-body)",
};

const iconCircleBaseStyle: CSSProperties = {
  width: "72px",
  height: "72px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  fontWeight: "700",
  lineHeight: 1,
  flexShrink: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "var(--infini-text-2xl)",
  fontFamily: "var(--infini-font-display)",
  fontWeight: "var(--infini-font-display-weight)" as CSSProperties["fontWeight"],
  color: "var(--infini-color-text)",
  margin: 0,
  lineHeight: 1.3,
};

const subTitleStyle: CSSProperties = {
  fontSize: "var(--infini-text-base)",
  color: "var(--infini-color-text-muted)",
  margin: 0,
  lineHeight: 1.5,
  maxWidth: "480px",
};

const extraStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  marginTop: "8px",
};

function DefaultIcon({ status }: { status: ResultStatus }) {
  const color = STATUS_COLORS[status];
  return (
    <div
      style={{
        ...iconCircleBaseStyle,
        backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `2px solid ${color}`,
        color,
      }}
      aria-label={STATUS_LABELS[status]}
    >
      {STATUS_ICONS[status]}
    </div>
  );
}

export function Result({ status, title, subTitle, extra, icon }: ResultProps) {
  return (
    <div style={containerStyle}>
      {icon != null ? icon : <DefaultIcon status={status} />}
      <div style={titleStyle}>{title}</div>
      {subTitle != null && <div style={subTitleStyle}>{subTitle}</div>}
      {extra != null && <div style={extraStyle}>{extra}</div>}
    </div>
  );
}
