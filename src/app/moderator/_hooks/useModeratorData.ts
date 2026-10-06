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
} from '@/app/moderator/_api/moderator';
import { useModeratorAuthContext } from '@/providers/ModeratorAuthProvider';
import { moderatorQueryKeys } from '@/lib/moderatorQueryKeys';

export const useModeratorCategories = () => {
  const { isAuthenticated } = useModeratorAuthContext();
  return useQuery({
    queryKey: moderatorQueryKeys.categories(),
    queryFn: getCategories,
    staleTime: 60_000,
    enabled: isAuthenticated,
  });
};

export const useModeratorWords = (search = '') => {
  const { isAuthenticated } = useModeratorAuthContext();
  return useQuery({
    queryKey: moderatorQueryKeys.words(search),
    queryFn: () => getWords(search),
    staleTime: 30_000,
    enabled: isAuthenticated,
  });
};

export const useModeratorCategoryMutations = () => {
  const queryClient = useQueryClient();
  const invalidateModeratorData = () => {
    queryClient.invalidateQueries({ queryKey: moderatorQueryKeys.all });
  };

  const create = useMutation({
    mutationFn: createCategory,
    onSuccess: invalidateModeratorData,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof createCategory>[0] }) =>
      updateCategory(id, input),
    onSuccess: invalidateModeratorData,
  });

  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: invalidateModeratorData,
  });

  return { create, update, remove };
};

export const useModeratorWordMutations = () => {
  const queryClient = useQueryClient();
  const invalidateModeratorData = () => {
    queryClient.invalidateQueries({ queryKey: moderatorQueryKeys.all });
  };

  const create = useMutation({
    mutationFn: createWord,
    onSuccess: invalidateModeratorData,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof createWord>[0] }) =>
      updateWord(id, input),
    onSuccess: invalidateModeratorData,
  });

  const remove = useMutation({
    mutationFn: deleteWord,
    onSuccess: invalidateModeratorData,
  });

  return { create, update, remove };
};
