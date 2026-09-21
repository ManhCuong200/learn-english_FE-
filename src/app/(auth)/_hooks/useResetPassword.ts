'use client';

import { useMutation } from '@tanstack/react-query';
import { useToastManager } from '@/components/ui/toast';
import { resetPassword } from '@/app/(auth)/_api/auth';
import type { ResetPasswordRequest } from '@/types/auth';

export const useResetPassword = () => {
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onSuccess: ({ message }) => {
      toastManager.add({
        type: 'success',
        title: 'Password reset',
        description: message,
      });
    },
    onError: (error) => {
      toastManager.add({
        type: 'error',
        title: 'Could not reset password',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
};