'use client';

import { useMutation } from '@tanstack/react-query';
import { useToastManager } from '@/components/ui/toast';
import { register } from '@/app/(auth)/_api/auth';
import type { RegisterRequest } from '@/types/auth';

export const useRegister = () => {
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: ({ message }) => {
      toastManager.add({
        type: 'success',
        title: 'Account created',
        description: message || 'Your account is ready. You can now sign in.',
      });
    },
    onError: (error) => {
      toastManager.add({
        type: 'error',
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
};