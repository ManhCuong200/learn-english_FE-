'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToastManager } from '@/components/ui/toast';
import { authQueryKey } from '@/lib/queryKeys';
import { notifyError, notifySuccess } from '@/lib/notifications';
import { APP_ROUTES } from '@/constants/routes';
import { authMutations } from '@/lib/mutationOptions';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toastManager = useToastManager();

  return useMutation({
    ...authMutations.logout(),
    onSuccess: () => {
      queryClient.setQueryData(authQueryKey, null);
      queryClient.removeQueries({ queryKey: authQueryKey });
      notifySuccess(toastManager, {
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
      router.push(APP_ROUTES.login);
    },
    onError: (error) => {
      queryClient.setQueryData(authQueryKey, null);
      queryClient.removeQueries({ queryKey: authQueryKey });
      notifyError(toastManager, 'Sign out failed', error);
      router.push(APP_ROUTES.login);
    },
  });
};