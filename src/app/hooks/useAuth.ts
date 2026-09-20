'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { authQueryKey } from '@/lib/queryKeys';
import type { AuthUser } from '@/types/auth';

export const useAuth = () => {
  const query = useQuery({
    queryKey: authQueryKey,
    queryFn: () => apiFetch<AuthUser>('/auth/me'),
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
    error: query.error,
  };
};