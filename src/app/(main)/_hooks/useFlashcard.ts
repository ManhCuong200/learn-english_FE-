import { useQuery, useMutation } from '@tanstack/react-query';
import { getFlashcards, getFlashcard, reviewFlashcard } from '../_api/flashcard';
import type { ReviewFlashcardPayload } from '@/types/flashcard';

export const useFlashcards = (limit?: number, categoryId?: string) => {
  return useQuery({
    queryKey: ['flashcards', { limit, categoryId }],
    queryFn: () => getFlashcards(limit, categoryId),
    refetchOnWindowFocus: false, // Prevents session from refreshing cards when switching tabs
  });
};

export const useFlashcard = (wordId: string) => {
  return useQuery({
    queryKey: ['flashcard', wordId],
    queryFn: () => getFlashcard(wordId),
    enabled: !!wordId,
  });
};

export const useReviewFlashcard = () => {
  return useMutation({
    mutationFn: ({ wordId, payload }: { wordId: string; payload: ReviewFlashcardPayload }) => reviewFlashcard(wordId, payload),
  });
};
