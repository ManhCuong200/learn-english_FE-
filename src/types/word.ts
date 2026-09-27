import { Category } from './category';
import { Example } from './example';

export type WordProgressStatus = 'NEW' | 'LEARNING' | 'REVIEW';

export type WordProgress = {
  status: WordProgressStatus;
  reviewCount: number;
  lastReviewedAt: string | null;
  nextReviewAt?: string | null;
};

export type Word = {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string | null;
  ipa?: string | null;
  level: string | null;
  categoryId: string;
  category?: Category;
  examples?: Example[];
  progress?: WordProgress;
  createdAt: string;
  updatedAt: string;
};

export type WordQuery = {
  search?: string;
  categoryId?: string;
  level?: string;
  status?: string;
};

export type CreateWordRequest = {
  word: string;
  meaning: string;
  pronunciation?: string;
  ipa?: string;
  level?: string;
  categoryId: string;
};

export type UpdateWordRequest = Partial<CreateWordRequest>;
