import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCategory } from '../_api/categories';
import { UpdateCategoryRequest, Category } from '@/types/category';
import { toast } from 'sonner';
import { moderatorKeys, categoryKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

type UpdateArgs = {
  id: string;
  data: UpdateCategoryRequest;
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, ApiError, UpdateArgs>({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: moderatorKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: moderatorKeys.category(data.id) });
      toast.success('Category updated successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update category.');
    },
  });
};
