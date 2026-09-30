import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategory } from '../_api/categories';
import { toast } from 'sonner';
import { adminKeys, categoryKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success('Category deleted successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete category.');
    },
  });
};
