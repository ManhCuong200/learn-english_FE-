'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToastManager } from '@/components/ui/toast';

import { adminLogin, adminLogout } from '@/app/admin/_api/admin';
import { adminQueryKeys } from '@/lib/adminQueryKeys';
import { notifyError, notifySuccess } from '@/lib/notifications';

export const useAdminLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      queryClient.setQueryData(adminQueryKeys.all, data);
      notifySuccess(toastManager, {
        title: 'Admin sign-in successful',
        description: 'Welcome to the content workspace.',
      });
      router.push('/admin/dashboard');
    },
    onError: (error) => {
      notifyError(toastManager, 'Admin sign-in failed', error);
    },
  });
};

export const useAdminLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: adminLogout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: adminQueryKeys.all });
      notifySuccess(toastManager, {
        title: 'Signed out',
        description: 'The admin session has ended.',
      });
      router.replace('/admin/login');
    },
    onError: (error) => {
      notifyError(toastManager, 'Sign out failed', error);
    },
  });
};

export const clearAdminSession = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.removeQueries({ queryKey: adminQueryKeys.all });
};