'use client';

import { useMutation } from '@tanstack/react-query';
import { useToastManager } from '@/components/ui/toast';
import { resetPassword } from '@/app/(auth)/_api/auth';
import { notifyError, notifySuccess } from '@/lib/notifications';
import type { ResetPasswordRequest } from '@/types/auth';

export const useResetPassword = () => {
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
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