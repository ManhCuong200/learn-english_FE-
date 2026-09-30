import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitQuiz } from '../_api/quizzes';
import { QuizSubmitRequest, QuizSubmitResponse } from '@/types/quiz';
import { quizKeys, historyKeys, progressKeys, dashboardKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<
    QuizSubmitResponse,
    ApiError,
    { attemptId: string; data: QuizSubmitRequest }
  >({
    mutationFn: ({ attemptId, data }) => submitQuiz(attemptId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.attempt(data.attemptId),
      });
      queryClient.invalidateQueries({
        queryKey: quizKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: historyKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: progressKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.all,
      });
    },
  });
};
