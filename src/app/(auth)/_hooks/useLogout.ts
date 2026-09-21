'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToastManager } from '@/components/ui/toast';
import { logout } from '@/app/(auth)/_api/auth';
import { authQueryKey } from '@/lib/queryKeys';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: authQueryKey,
      });

      toastManager.add({
        type: 'success',
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
      router.push('/login');
    },
    onError: (error) => {
      toastManager.add({
        type: 'error',
        title: 'Sign out failed',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
};