'use client';

import { useMutation } from '@tanstack/react-query';
import { useToastManager } from '@/components/ui/toast';
import { forgotPassword } from '@/app/(auth)/_api/auth';
import { notifyError, notifySuccess } from '@/lib/notifications';
import type { ForgotPasswordRequest } from '@/types/auth';

export const useForgotPassword = () => {
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
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