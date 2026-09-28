import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitQuiz } from '../_api/quizzes';
import { QuizSubmitRequest, QuizSubmitResponse } from '@/types/quiz';

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<
    QuizSubmitResponse,
    Error,
    { attemptId: string; data: QuizSubmitRequest }
  >({
    mutationFn: ({ attemptId, data }) => submitQuiz(attemptId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['quiz-attempt', data.attemptId],
      });
      queryClient.invalidateQueries({
        queryKey: ['learning-history'],
      });
    },
  });
};
