'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AppErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <main className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              <h2 className="text-lg font-semibold">Something went wrong</h2>
              <p className="mt-2 text-sm">Please refresh the page and try again.</p>
            </div>
          </main>
        )
      );
    }

    return this.props.children;
  }
}
