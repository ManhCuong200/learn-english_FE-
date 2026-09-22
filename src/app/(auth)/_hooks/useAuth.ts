'use client';

import { useQuery } from '@tanstack/react-query';
import { authQueryOptions } from '@/lib/authQuery';

export const useAuth = () => {
  const query = useQuery(authQueryOptions());

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
    error: query.error,
  };
};