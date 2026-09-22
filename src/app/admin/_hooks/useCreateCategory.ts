import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '../_api/categories';
import { CreateCategoryRequest, Category } from '@/types/category';
import { toast } from 'sonner';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, CreateCategoryRequest>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category.');
    },
  });
};
