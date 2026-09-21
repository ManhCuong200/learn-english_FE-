'use client';

import { useMutation } from '@tanstack/react-query';
import { useToastManager } from '@/components/ui/toast';
import { notifyError, notifySuccess } from '@/lib/notifications';
import { authMutations } from '@/lib/mutationOptions';

export const useRegister = () => {
  const toastManager = useToastManager();

  return useMutation({
    ...authMutations.register(),
    onSuccess: ({ message }) => {
      notifySuccess(toastManager, {
        title: 'Account created',
        description: message || 'Your account is ready. You can now sign in.',
      });
    },
    onError: (error) => {
      notifyError(toastManager, 'Registration failed', error);
    },
  });
};