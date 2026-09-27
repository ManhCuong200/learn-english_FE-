import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateWord } from '../_api/words';
import { adminQueryKeys } from '@/lib/adminQueryKeys';
import { UpdateWordRequest } from '@/types/word';
import { toast } from 'sonner';

export const useUpdateWord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWordRequest }) => updateWord(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['words'] });
      queryClient.invalidateQueries({ queryKey: ['words', variables.id] });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.all });
      toast.success('Word updated successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update word.');
    },
  });
};
