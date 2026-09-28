import { apiFetch } from '@/api/client';
import {
  FlashcardProgress,
  ProgressActivityResponse,
  ProgressOverview,
  QuizProgress,
  VocabularyProgress,
} from '@/types/progress';

export async function getProgressOverview(): Promise<ProgressOverview> {
  return apiFetch<ProgressOverview>('/progress/overview', {
    method: 'GET',
  });
}

export async function getProgressActivity(
  days = 7,
): Promise<ProgressActivityResponse> {
  return apiFetch<ProgressActivityResponse>(`/progress/activity?days=${days}`, {
    method: 'GET',
  });
}

export async function getVocabularyProgress(): Promise<VocabularyProgress> {
  return apiFetch<VocabularyProgress>('/progress/vocabulary', {
    method: 'GET',
  });
}

export async function getFlashcardProgress(): Promise<FlashcardProgress> {
  return apiFetch<FlashcardProgress>('/progress/flashcards', {
    method: 'GET',
  });
}

export async function getQuizProgress(): Promise<QuizProgress> {
  return apiFetch<QuizProgress>('/progress/quizzes', {
    method: 'GET',
  });
}
