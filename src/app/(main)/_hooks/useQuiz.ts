import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getQuizQuestions, submitQuiz } from '../_api/quiz';
import { QuizAnswerItem } from '@/types/quiz';

export const useQuizQuestions = (limit = 5) => {
  return useQuery({
    queryKey: ['quiz-questions', limit],
    queryFn: () => getQuizQuestions(limit),
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answers: QuizAnswerItem[]) => submitQuiz(answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-overview'] });
      queryClient.invalidateQueries({ queryKey: ['learner-words'] });
      queryClient.invalidateQueries({ queryKey: ['learning-history'] });
    },
  });
};
