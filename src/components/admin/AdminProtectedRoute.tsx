'use client';

import type { ReactNode } from 'react';
import { UnauthorizedWarning } from './UnauthorizedWarning';

type AdminProtectedRouteProps = {
  isAuthenticated: boolean;
  redirectTo?: string;
  loadingText?: string;
  children: ReactNode;
};

export const AdminProtectedRoute = ({
  isAuthenticated,
  children,
}: AdminProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <UnauthorizedWarning />;
  }

  return <>{children}</>;
};

