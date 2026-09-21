'use client';

import { useMutation } from '@tanstack/react-query';
import { useToastManager } from '@/components/ui/toast';
import { notifyError, notifySuccess } from '@/lib/notifications';
import { authMutations } from '@/lib/mutationOptions';

export const useResetPassword = () => {
  const toastManager = useToastManager();

  return useMutation({
    ...authMutations.resetPassword(),
    onSuccess: ({ message }) => {
      notifySuccess(toastManager, {
        title: 'Password reset',
        description: message,
      });
    },
    onError: (error) => {
      notifyError(toastManager, 'Could not reset password', error);
    },
  });
};