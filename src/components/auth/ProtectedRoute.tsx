'use client';

import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  isLoading: boolean;
  isAuthenticated: boolean;
  redirectTo: string;
  loadingText?: string;
  children: ReactNode;
};

export const ProtectedRoute = ({
  isLoading,
  isAuthenticated,
  loadingText = 'Loading...',
  children,
}: ProtectedRouteProps) => {
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm font-semibold tracking-[0.14em] text-primary uppercase">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">e</span>
          {loadingText}
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
