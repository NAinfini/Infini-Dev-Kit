import { Component, type CSSProperties, type ErrorInfo, type ReactNode } from "react";

import "./ErrorBoundary.css";

export type ErrorBoundaryProps = {
  children: ReactNode;
  fallbackMessage?: string;
  retryLabel?: string;
  onError?: (error: Error, info: ErrorInfo) => void;
  className?: string;
  style?: CSSProperties;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info.componentStack);
    this.props.onError?.(error, info);
  }

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <div className={`infini-error-boundary ${this.props.className ?? ""}`} style={this.props.style}>
          <div className="infini-error-alert" role="alert">
            <div className="infini-error-title">{this.props.fallbackMessage ?? "Something went wrong"}</div>
            <div className="infini-error-message">{this.state.error.message}</div>
          </div>
          <button
            type="button"
            className="infini-error-retry"
            onClick={() => this.setState({ error: null })}
          >
            {this.props.retryLabel ?? "Retry"}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
