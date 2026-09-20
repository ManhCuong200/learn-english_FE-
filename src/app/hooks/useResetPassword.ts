'use client';

import { useMutation } from '@tanstack/react-query';

import { apiFetch } from '@/lib/api';
import type { ResetPasswordRequest, ResetPasswordResponse } from '@/types/auth';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      apiFetch<ResetPasswordResponse>(
        '/auth/reset-password',
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
      ),
  });
};