import { useQuery } from '@tanstack/react-query';
import { getFlashcardProgress } from '../_api/progress';
import { FlashcardProgress } from '@/types/progress';
import { progressKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useFlashcardProgress = () => {
  return useQuery<FlashcardProgress, ApiError>({
    queryKey: progressKeys.flashcard(),
    queryFn: getFlashcardProgress,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
