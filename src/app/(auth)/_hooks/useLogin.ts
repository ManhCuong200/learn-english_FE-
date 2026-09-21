'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '@/app/(auth)/_api/auth';
import { authQueryKey } from '@/lib/queryKeys';
import type { AuthUser, LoginRequest } from '@/types/auth';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: ({ user }) => {
      queryClient.setQueryData<AuthUser>(authQueryKey, user);
    },
  });
};