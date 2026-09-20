'use client';

import { useMutation } from '@tanstack/react-query';

import { resetPassword } from '@/lib/api/auth';
import type { ResetPasswordRequest } from '@/types/auth';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
  });
};