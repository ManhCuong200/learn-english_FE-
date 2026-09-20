'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { logout } from '../../../lib/api';
import { authQueryKey } from './useLogin';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authQueryKey,
      });

      queryClient.removeQueries({
        queryKey: authQueryKey,
      });

      router.push('/login');
    },
  });
}