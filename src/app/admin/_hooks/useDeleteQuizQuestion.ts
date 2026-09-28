import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuizQuestion } from '../_api/quizzes';
import { toast } from 'sonner';

export const useDeleteQuizQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId }: { questionId: string; quizId?: string }) =>
      deleteQuizQuestion(questionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quizzes'] });
      if (variables.quizId) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'quiz', variables.quizId] });
      }
      toast.success('Question deleted successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete question.');
    },
  });
};
