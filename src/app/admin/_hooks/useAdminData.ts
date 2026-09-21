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
    queryKey: adminQueryKeys.categories,
    queryFn: getCategories,
  });
};

export const useAdminWords = (search: string) => {
  return useQuery({
    queryKey: adminQueryKeys.words(search),
    queryFn: () => getWords(search),
  });
};

export const useAdminCategoryMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories });

  const create = useMutation({ mutationFn: createCategory, onSuccess: invalidate });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof createCategory>[0] }) => updateCategory(id, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({ mutationFn: deleteCategory, onSuccess: invalidate });

  return { create, update, remove };
};

export const useAdminWordMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });

  const create = useMutation({ mutationFn: createWord, onSuccess: invalidate });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof createWord>[0] }) => updateWord(id, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({ mutationFn: deleteWord, onSuccess: invalidate });

  return { create, update, remove };
};
