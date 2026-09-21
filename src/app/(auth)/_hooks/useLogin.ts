'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastManager } from '@/components/ui/toast';
import { login } from '@/app/(auth)/_api/auth';
import { authQueryKey } from '@/lib/queryKeys';
import type { AuthUser, LoginRequest } from '@/types/auth';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: ({ user }) => {
      queryClient.setQueryData<AuthUser>(authQueryKey, user);
      toastManager.add({
        type: 'success',
        title: 'Welcome back',
        description: 'You have signed in successfully.',
      });
    },
    onError: (error) => {
      toastManager.add({
        type: 'error',
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
};