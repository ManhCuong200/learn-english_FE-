export const adminQueryKeys = {
  all: ['admin'] as const,
  categories: ['admin', 'categories'] as const,
  words: (search = '') => ['admin', 'words', search] as const,
};