'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToastManager } from '@/components/ui/toast';
import { authKeys } from '@/lib/queryKeys';
import { notifyError, notifySuccess } from '@/lib/notifications';
import { APP_ROUTES } from '@/constants/routes';
import { authMutations } from '@/lib/mutationOptions';
import { setAccessToken } from '@/lib/api-client';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toastManager = useToastManager();

  return useMutation({
    ...authMutations.logout(),
    onSuccess: () => {
      setAccessToken(null);
      queryClient.setQueryData(authKeys.me(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
      notifySuccess(toastManager, {
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
      router.push(APP_ROUTES.login);
    },
    onError: (error) => {
      setAccessToken(null);
      queryClient.setQueryData(authKeys.me(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
      notifyError(toastManager, 'Sign out failed', error);
      router.push(APP_ROUTES.login);
    },
  });
};