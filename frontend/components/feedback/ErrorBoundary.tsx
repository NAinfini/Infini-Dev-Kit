import { Alert, Button, Stack } from "@mantine/core";
import { Component, type CSSProperties, type ErrorInfo, type ReactNode } from "react";

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
        <Stack gap={8} p="md" className={this.props.className} style={this.props.style}>
          <Alert color="infini-danger" title={this.props.fallbackMessage ?? "Something went wrong"}>
            {this.state.error.message}
          </Alert>
          <Button
            size="xs"
            variant="default"
            onClick={() => this.setState({ error: null })}
          >
            {this.props.retryLabel ?? "Retry"}
          </Button>
        </Stack>
      );
    }
    return this.props.children;
  }
}
