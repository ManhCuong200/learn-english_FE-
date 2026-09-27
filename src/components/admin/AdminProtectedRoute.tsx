'use client';

import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { UnauthorizedWarning } from './UnauthorizedWarning';

type AdminProtectedRouteProps = {
  isAuthenticated: boolean;
  isLoading?: boolean;
  redirectTo?: string;
  loadingText?: string;
  children: ReactNode;
};

export const AdminProtectedRoute = ({
  isAuthenticated,
  isLoading = false,
  loadingText = 'Checking admin access...',
  children,
}: AdminProtectedRouteProps) => {
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0405] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-red-500" />
          <p className="text-sm font-medium text-slate-400">{loadingText}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <UnauthorizedWarning />;
  }

  return <>{children}</>;
};


