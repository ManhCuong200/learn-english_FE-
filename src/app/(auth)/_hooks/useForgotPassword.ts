'use client';

import { useMutation } from '@tanstack/react-query';
import { useToastManager } from '@/components/ui/toast';
import { notifyError, notifySuccess } from '@/lib/notifications';
import { authMutations } from '@/lib/mutationOptions';

export const useForgotPassword = () => {
  const toastManager = useToastManager();

  return useMutation({
    ...authMutations.forgotPassword(),
    onSuccess: ({ message }) => {
      notifySuccess(toastManager, {
        title: 'Reset link sent',
        description: message,
      });
    },
    onError: (error) => {
      notifyError(toastManager, 'Could not send reset link', error);
    },
  });
};