export type FlashcardProgressStatus = 'NEW' | 'LEARNING' | 'REVIEW';

export type FlashcardReviewResultType = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

export interface FlashcardProgress {
  status: FlashcardProgressStatus;
  reviewCount: number;
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
}

export interface FlashcardWord {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string | null;
  level: string | null;
  category: { id: string; name: string };
  progress: FlashcardProgress;
}

export interface GetFlashcardsResponse {
  data: FlashcardWord[];
  meta: { total: number };
}

export interface ReviewFlashcardPayload {
  result: FlashcardReviewResultType;
}

export interface ReviewFlashcardResponse {
  message: string;
  progress: FlashcardProgress;
}
