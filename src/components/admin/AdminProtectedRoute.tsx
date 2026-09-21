'use client';

import type { ReactNode } from 'react';

type AdminProtectedRouteProps = {
  isAuthenticated: boolean;
  redirectTo?: string;
  loadingText?: string;
  children: ReactNode;
};

export const AdminProtectedRoute = ({
  isAuthenticated,
  loadingText = 'Checking admin access...',
  children,
}: AdminProtectedRouteProps) => {
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#17262b] text-[#f7f4eb]">
        <div className="flex items-center gap-3 text-sm font-semibold tracking-[0.14em] uppercase">
          <span className="grid size-8 place-items-center rounded-full bg-[#f5c66f] text-lg text-[#17262b]">e</span>
          {loadingText}
        </div>
      </main>
    );
  }

  return <>{children}</>;
};
