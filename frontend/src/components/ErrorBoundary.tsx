import { Component, ErrorInfo } from "react";
import { ErrorBoundaryProps, ErrorBoundaryState } from "../types/todoTypes";

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary p-4 bg-red-100 text-red-800 rounded-md">
            <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
            <details className="mt-2">
              <summary>Click for error details</summary>
              {this.state.error && (
                <pre className="mt-2 p-2 bg-red-200 rounded-md overflow-auto">
                  {this.state.error.toString()}
                </pre>
              )}
              {this.state.errorInfo && (
                <pre className="mt-2 p-2 bg-red-200 rounded-md overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
