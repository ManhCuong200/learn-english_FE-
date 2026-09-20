'use client';

import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { RegisterRequest, RegisterResponse } from '@/types/auth';

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      apiFetch<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}