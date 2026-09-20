'use client';

import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { ForgotPasswordRequest, ForgotPasswordResponse } from '@/types/auth';

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      apiFetch<ForgotPasswordResponse>(
        '/auth/forgot-password',
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
      ),
  });
}