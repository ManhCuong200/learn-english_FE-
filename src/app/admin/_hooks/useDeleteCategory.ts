import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategory } from '../_api/categories';
import { toast } from 'sonner';

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete category.');
    },
  });
};
