'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { login } from '../../../lib/api';
import type { LoginRequest, AuthUser } from '../../../types/auth';

export const authQueryKey = ['auth', 'me'] as const;

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: LoginRequest) => login(request),
    onSuccess: ({ user }: { user: AuthUser }) => {
      queryClient.setQueryData(authQueryKey, user);
      router.push('/dashboard');
    },
  });
}