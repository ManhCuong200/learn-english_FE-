export type LearningActivityType = 'VOCABULARY' | 'FLASHCARD' | 'QUIZ';

export interface LearningHistoryItem {
  id: string;
  type: LearningActivityType;
  title: string;
  description: string;
  referenceId: string | null;
  createdAt: string;
}

export interface LearningHistoryMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LearningHistoryResponse {
  data: LearningHistoryItem[];
  meta: LearningHistoryMeta;
}

export interface LearningHistoryParams {
  page?: number;
  limit?: number;
  type?: LearningActivityType | 'ALL';
}

export interface CreateLearningHistoryPayload {
  type: LearningActivityType;
  title: string;
  description: string;
  referenceId?: string;
}
