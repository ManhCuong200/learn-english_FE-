'use client';

import { useMutation } from '@tanstack/react-query';
import { useToastManager } from '@/components/ui/toast';
import { forgotPassword } from '@/app/(auth)/_api/auth';
import type { ForgotPasswordRequest } from '@/types/auth';

export const useForgotPassword = () => {
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPassword(data),
    onSuccess: ({ message }) => {
      toastManager.add({
        type: 'success',
        title: 'Reset link sent',
        description: message,
      });
    },
    onError: (error) => {
      toastManager.add({
        type: 'error',
        title: 'Could not send reset link',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
};