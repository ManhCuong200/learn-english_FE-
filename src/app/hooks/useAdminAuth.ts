'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { adminLogin, adminLogout } from '@/lib/api/admin';
import { adminQueryKeys } from '@/lib/adminQueryKeys';

export const useAdminLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      queryClient.setQueryData(adminQueryKeys.all, data);
      router.push('/admin/dashboard');
    },
  });
};

export const useAdminLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: adminLogout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: adminQueryKeys.all });
      router.replace('/admin/login');
    },
  });
};

export const clearAdminSession = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.removeQueries({ queryKey: adminQueryKeys.all });
};