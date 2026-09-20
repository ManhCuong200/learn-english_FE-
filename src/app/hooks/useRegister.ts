'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { register } from '../../../lib/api';
import type { RegisterRequest } from '../../../types/auth';

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (request: RegisterRequest) => register(request),
    onSuccess: () => {
      router.push('/login');
    },
  });
}