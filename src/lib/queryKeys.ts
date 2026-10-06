/**
 * Centralized Query Key Factory for TanStack Query v5
 * Follows official TanStack Query best practices for cache management & invalidation
 */

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  sessions: () => [...authKeys.all, 'sessions'] as const,
};

export const moderatorKeys = {
  all: ['moderator'] as const,
  auth: () => [...moderatorKeys.all, 'auth'] as const,
  data: () => [...moderatorKeys.all, 'data'] as const,
  categories: () => [...moderatorKeys.all, 'categories'] as const,
  category: (id: string) => [...moderatorKeys.all, 'categories', id] as const,
  words: (filters?: Record<string, unknown>) =>
    [...moderatorKeys.all, 'words', filters ?? {}] as const,
  word: (id: string) => [...moderatorKeys.all, 'words', id] as const,
  examples: (wordId: string) => [...moderatorKeys.all, 'examples', wordId] as const,
  quizzes: (filters?: Record<string, unknown>) =>
    [...moderatorKeys.all, 'quizzes', filters ?? {}] as const,
  quizDetail: (id: string) => [...moderatorKeys.all, 'quizzes', id] as const,
};

export const wordKeys = {
  all: ['words'] as const,
  lists: () => [...wordKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...wordKeys.lists(), filters ?? {}] as const,
  details: () => [...wordKeys.all, 'detail'] as const,
  detail: (id: string) => [...wordKeys.details(), id] as const,
  examples: (wordId: string) => [...wordKeys.detail(wordId), 'examples'] as const,
  progress: () => [...wordKeys.all, 'progress'] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  detail: (id: string) => [...categoryKeys.all, 'detail', id] as const,
};

export const quizKeys = {
  all: ['quizzes'] as const,
  lists: () => [...quizKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...quizKeys.lists(), filters ?? {}] as const,
  details: () => [...quizKeys.all, 'detail'] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
  attempts: () => [...quizKeys.all, 'attempts'] as const,
  attempt: (quizId: string) => [...quizKeys.attempts(), quizId] as const,
  progress: () => [...quizKeys.all, 'progress'] as const,
};

export const flashcardKeys = {
  all: ['flashcards'] as const,
  session: (level?: string, count?: number) =>
    [...flashcardKeys.all, 'session', { level, count }] as const,
  progress: () => [...flashcardKeys.all, 'progress'] as const,
};

export const historyKeys = {
  all: ['learning-history'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...historyKeys.all, 'list', filters ?? {}] as const,
};

export const progressKeys = {
  all: ['progress'] as const,
  overview: () => [...progressKeys.all, 'overview'] as const,
  activity: (days?: number) => [...progressKeys.all, 'activity', days] as const,
  vocabulary: () => [...progressKeys.all, 'vocabulary'] as const,
  flashcard: () => [...progressKeys.all, 'flashcard'] as const,
  quiz: () => [...progressKeys.all, 'quiz'] as const,
};

export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
};

// Legacy exports for backwards compatibility
export const authQueryKey = authKeys.me();
export const moderatorQueryKeys = {
  auth: moderatorKeys.auth(),
  all: moderatorKeys.data(),
  categories: moderatorKeys.categories,
  words: (search = '') => moderatorKeys.words({ search }),
  category: moderatorKeys.category,
};