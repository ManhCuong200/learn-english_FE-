'use client';

import { useMutation } from '@tanstack/react-query';
import { useToastManager } from '@/components/ui/toast';
import { register } from '@/app/(auth)/_api/auth';
import { notifyError, notifySuccess } from '@/lib/notifications';
import type { RegisterRequest } from '@/types/auth';

export const useRegister = () => {
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
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