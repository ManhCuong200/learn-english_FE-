import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuizQuestion } from '../_api/quizzes';
import type { UpdateQuizQuestionRequest } from '@/types/quiz';
import { toast } from 'sonner';

export const useUpdateQuizQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: string;
      data: UpdateQuizQuestionRequest;
      quizId?: string;
    }) => updateQuizQuestion(questionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['moderator', 'quizzes'] });
      if (variables.quizId) {
        queryClient.invalidateQueries({ queryKey: ['moderator', 'quiz', variables.quizId] });
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update question.');
    },
  });
};
