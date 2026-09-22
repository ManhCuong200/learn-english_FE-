import { Category } from './category';

export type Example = {
  id: string;
  wordId: string;
  sentence: string;
  translation: string;
  createdAt: string;
  updatedAt: string;
};

export type Word = {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string | null;
  level: string | null;
  categoryId: string;
  category?: Category;
  examples?: Example[];
  createdAt: string;
  updatedAt: string;
};

export type WordQuery = {
  search?: string;
  categoryId?: string;
  level?: string;
};

export type CreateWordRequest = {
  word: string;
  meaning: string;
  pronunciation?: string;
  level?: string;
  categoryId: string;
};

export type UpdateWordRequest = Partial<CreateWordRequest>;
