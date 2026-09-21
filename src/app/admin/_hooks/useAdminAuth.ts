'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToastManager } from '@/components/ui/toast';

import { adminLogin, adminLogout } from '@/app/admin/_api/admin';
import { adminQueryKeys } from '@/lib/adminQueryKeys';

export const useAdminLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      queryClient.setQueryData(adminQueryKeys.all, data);
      toastManager.add({
        type: 'success',
        title: 'Admin sign-in successful',
        description: 'Welcome to the content workspace.',
      });
      router.push('/admin/dashboard');
    },
    onError: (error) => {
      toastManager.add({
        type: 'error',
        title: 'Admin sign-in failed',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
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
      toastManager.add({
        type: 'success',
        title: 'Signed out',
        description: 'The admin session has ended.',
      });
      router.replace('/admin/login');
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

export const clearAdminSession = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.removeQueries({ queryKey: adminQueryKeys.all });
};