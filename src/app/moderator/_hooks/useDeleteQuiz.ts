import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuiz } from '../_api/quizzes';
import { toast } from 'sonner';

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderator', 'quizzes'] });
      toast.success('Quiz deleted successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete quiz.');
    },
  });
};
