import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCategory } from '../_api/categories';
import { UpdateCategoryRequest, Category } from '@/types/category';
import { toast } from 'sonner';

type UpdateArgs = {
  id: string;
  data: UpdateCategoryRequest;
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, UpdateArgs>({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', data.id] });
      toast.success('Category updated successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update category.');
    },
  });
};
