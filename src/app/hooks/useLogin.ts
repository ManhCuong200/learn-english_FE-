'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { authQueryKey } from '@/lib/queryKeys';
import type { AuthUser, LoginRequest, LoginResponse } from '@/types/auth';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) =>
      apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: ({ user }) => {
      queryClient.setQueryData<AuthUser>(authQueryKey, user);
    },
  });
}