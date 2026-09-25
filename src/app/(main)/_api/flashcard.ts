import { apiFetch } from '@/api/client';
import type { GetFlashcardsResponse, ReviewFlashcardPayload, ReviewFlashcardResponse, FlashcardWord } from '@/types/flashcard';

export const getFlashcards = async (limit?: number, categoryId?: string): Promise<GetFlashcardsResponse> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (categoryId) params.append('categoryId', categoryId);
  const qs = params.toString();
  return apiFetch<GetFlashcardsResponse>(`/flashcards${qs ? `?${qs}` : ''}`);
};

export const getFlashcard = async (wordId: string): Promise<FlashcardWord> => {
  return apiFetch<FlashcardWord>(`/flashcards/${wordId}`);
};

export const reviewFlashcard = async (wordId: string, payload: ReviewFlashcardPayload): Promise<ReviewFlashcardResponse> => {
  return apiFetch<ReviewFlashcardResponse>(`/flashcards/${wordId}/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
