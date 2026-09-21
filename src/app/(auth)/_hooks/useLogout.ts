'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/(auth)/_api/auth';
import { authQueryKey } from '@/lib/queryKeys';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: authQueryKey,
      });

      router.push('/login');
    },
  });
};