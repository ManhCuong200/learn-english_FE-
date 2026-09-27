export const adminQueryKeys = {
  auth: ['admin-auth'] as const,
  all: ['admin-data'] as const,
  categories: () => [...adminQueryKeys.all, 'categories'] as const,
  words: (search = '') => [...adminQueryKeys.all, 'words', search] as const,
  category: (id: string) => [...adminQueryKeys.all, 'categories', id] as const,
};