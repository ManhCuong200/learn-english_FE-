import { useQuery } from '@tanstack/react-query';
import { getFlashcardProgress } from '../_api/progress';
import { FlashcardProgress } from '@/types/progress';

export const useFlashcardProgress = () => {
  return useQuery<FlashcardProgress, Error>({
    queryKey: ['progress', 'flashcards'],
    queryFn: getFlashcardProgress,
  });
};
