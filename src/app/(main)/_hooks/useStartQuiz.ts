import { useMutation } from '@tanstack/react-query';
import { startQuiz } from '../_api/quizzes';
import { QuizStartResponse } from '@/types/quiz';

export const useStartQuiz = () => {
  return useMutation<QuizStartResponse, Error, string>({
    mutationFn: (quizId: string) => startQuiz(quizId),
  });
};
