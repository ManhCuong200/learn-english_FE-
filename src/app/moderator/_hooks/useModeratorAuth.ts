'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToastManager } from '@/components/ui/toast';

import { moderatorLogin, moderatorLogout } from '@/app/moderator/_api/moderator';
import { moderatorQueryKeys } from '@/lib/moderatorQueryKeys';
import { notifyError, notifySuccess } from '@/lib/notifications';
import { setAccessToken } from '@/lib/api-client';

export const useModeratorLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: moderatorLogin,
    onSuccess: (data) => {
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }
      queryClient.setQueryData(moderatorQueryKeys.auth, data.user);
      notifySuccess(toastManager, {
        title: 'Moderator sign-in successful',
        description: 'Welcome to the content workspace.',
      });
      router.push('/moderator/dashboard');
    },
    onError: (error) => {
      notifyError(toastManager, 'Moderator sign-in failed', error);
    },
  });
};

export const useModeratorLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: moderatorLogout,
    onSuccess: () => {
      setAccessToken(null);
      queryClient.removeQueries({ queryKey: moderatorQueryKeys.auth });
      queryClient.removeQueries({ queryKey: moderatorQueryKeys.all });
      notifySuccess(toastManager, {
        title: 'Signed out',
        description: 'The moderator session has ended.',
      });
      router.replace('/moderator/login');
    },
    onError: (error) => {
      notifyError(toastManager, 'Sign out failed', error);
    },
  });
};

export const clearModeratorSession = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.removeQueries({ queryKey: moderatorQueryKeys.auth });
  queryClient.removeQueries({ queryKey: moderatorQueryKeys.all });
};