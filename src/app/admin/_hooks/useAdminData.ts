'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createCategory,
  createWord,
  deleteCategory,
  deleteWord,
  getCategories,
  getWords,
  updateCategory,
  updateWord,
} from '@/app/admin/_api/admin';
import { adminQueryKeys } from '@/lib/adminQueryKeys';

export const useAdminCategories = () => {
  return useQuery({
    queryKey: adminQueryKeys.categories(),
    queryFn: getCategories,
    staleTime: 60_000,
  });
};

export const useAdminWords = (search = '') => {
  return useQuery({
    queryKey: adminQueryKeys.words(search),
    queryFn: () => getWords(search),
    staleTime: 30_000,
  });
};

export const useAdminCategoryMutations = () => {
  const queryClient = useQueryClient();
  const invalidateAdminData = () => {
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
  };

  const create = useMutation({
    mutationFn: createCategory,
    onSuccess: invalidateAdminData,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof createCategory>[0] }) =>
      updateCategory(id, input),
    onSuccess: invalidateAdminData,
  });

  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: invalidateAdminData,
  });

  return { create, update, remove };
};

export const useAdminWordMutations = () => {
  const queryClient = useQueryClient();
  const invalidateAdminData = () => {
    queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
  };

  const create = useMutation({
    mutationFn: createWord,
    onSuccess: invalidateAdminData,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof createWord>[0] }) =>
      updateWord(id, input),
    onSuccess: invalidateAdminData,
  });

  const remove = useMutation({
    mutationFn: deleteWord,
    onSuccess: invalidateAdminData,
  });

  return { create, update, remove };
};
