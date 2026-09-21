'use client';

import { useMutation } from '@tanstack/react-query';
import { register } from '@/app/(auth)/_api/auth';
import type { RegisterRequest } from '@/types/auth';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  });
};