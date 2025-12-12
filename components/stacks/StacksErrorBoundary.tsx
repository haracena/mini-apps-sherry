"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class StacksErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Stacks Error Boundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Log to error tracking service
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="container max-w-2xl mx-auto px-4 py-16">
          <Card className="p-8">
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="p-4 bg-destructive/10 rounded-full">
                  <AlertTriangle className="w-12 h-12 text-destructive" />
                </div>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
                <p className="text-muted-foreground">
                  We encountered an error while loading this Stacks feature.
                </p>
              </div>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-left">
                    <div className="font-mono text-xs space-y-2">
                      <div>
                        <strong>Error:</strong> {this.state.error.message}
                      </div>
                      {this.state.errorInfo && (
                        <details className="mt-2">
                          <summary className="cursor-pointer">Stack trace</summary>
                          <pre className="mt-2 text-xs overflow-auto max-h-48">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </details>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleReset} variant="default">
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={this.handleGoHome} variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Help Text */}
              <p className="text-sm text-muted-foreground">
                If this problem persists, please{" "}
                <a href="/support" className="text-primary hover:underline">
                  contact support
                </a>
                .
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
