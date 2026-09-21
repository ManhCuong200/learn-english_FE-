'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastManager } from '@/components/ui/toast';
import { authQueryKey } from '@/lib/queryKeys';
import { notifyError, notifySuccess } from '@/lib/notifications';
import { authMutations } from '@/lib/mutationOptions';
import type { AuthUser, LoginRequest } from '@/types/auth';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const toastManager = useToastManager();

  return useMutation({
    ...authMutations.login(),
    onSuccess: ({ user }) => {
      queryClient.setQueryData<AuthUser>(authQueryKey, user);
      queryClient.invalidateQueries({ queryKey: authQueryKey });
      notifySuccess(toastManager, {
        title: 'Welcome back',
        description: 'You have signed in successfully.',
      });
    },
    onError: (error) => {
      notifyError(toastManager, 'Login failed', error);
    },
  });
};