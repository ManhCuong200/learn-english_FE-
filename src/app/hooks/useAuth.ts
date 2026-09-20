'use client';

import { useQuery } from '@tanstack/react-query';

import { apiFetch } from '../../../lib/api';
import type { AuthUser } from '../../../types/auth';
import { authQueryKey } from './useLogin';

export function useAuth() {
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
}