'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastManager } from '@/components/ui/toast';
import { authKeys } from '@/lib/queryKeys';
import { notifyError, notifySuccess } from '@/lib/notifications';
import { authMutations } from '@/lib/mutationOptions';
import type { AuthUser } from '@/types/auth';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const toastManager = useToastManager();

  return useMutation({
    ...authMutations.login(),
    onSuccess: (data) => {
      if (data.isTwoFactorRequired) {
        return; // Let the component handle it
      }
      queryClient.setQueryData<AuthUser>(authKeys.me(), data.user!);
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