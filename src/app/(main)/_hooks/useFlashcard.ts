import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFlashcards, getFlashcard, reviewFlashcard } from '../_api/flashcard';
import type {
  GetFlashcardsResponse,
  FlashcardWord,
  ReviewFlashcardPayload,
  ReviewFlashcardResponse,
} from '@/types/flashcard';
import { flashcardKeys, progressKeys, historyKeys, dashboardKeys } from '@/lib/queryKeys';
import { ApiError } from '@/lib/api-client';

export const useFlashcards = (limit?: number, categoryId?: string) => {
  return useQuery<GetFlashcardsResponse, ApiError>({
    queryKey: flashcardKeys.session(categoryId, limit),
    queryFn: () => getFlashcards(limit, categoryId),
    refetchOnWindowFocus: false, // Prevents session from resetting cards when switching tabs
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useFlashcard = (wordId: string) => {
  return useQuery<FlashcardWord, ApiError>({
    queryKey: ['flashcards', 'detail', wordId],
    queryFn: () => getFlashcard(wordId),
    enabled: !!wordId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useReviewFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ReviewFlashcardResponse,
    ApiError,
    { wordId: string; payload: ReviewFlashcardPayload }
  >({
    mutationFn: ({ wordId, payload }) => reviewFlashcard(wordId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flashcardKeys.all });
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      queryClient.invalidateQueries({ queryKey: historyKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
};
