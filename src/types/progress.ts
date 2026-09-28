export interface ProgressOverview {
  wordsLearned: number;
  wordsLearning: number;
  wordsDue: number;
  flashcardReviews: number;
  quizAttempts: number;
  averageQuizScore: number;
  learningStreak: number;
}

export interface ProgressActivityItem {
  date: string;
  count: number;
  vocabulary: number;
  flashcard: number;
  quiz: number;
}

export interface ProgressActivityResponse {
  days: number;
  data: ProgressActivityItem[];
}

export interface VocabularyProgress {
  newWords: number;
  learningWords: number;
  reviewWords: number;
  total: number;
}

export type FlashcardReviewResult = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

export interface FlashcardProgressResult {
  result: FlashcardReviewResult;
  count: number;
}

export interface FlashcardProgress {
  totalReviews: number;
  results: FlashcardProgressResult[];
}

export interface QuizProgress {
  attempts: number;
  averageScore: number;
  bestScore: number;
}
