import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '../_api/categories';
import { CreateCategoryRequest, Category } from '@/types/category';
import { toast } from 'sonner';
import { adminKeys, categoryKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, ApiError, CreateCategoryRequest>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success('Category created successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category.');
    },
  });
};
