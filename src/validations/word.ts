import { z } from 'zod';

export const wordSchema = z.object({
  word: z
    .string()
    .min(1, 'Word is required.')
    .trim()
    .max(100, 'Word cannot exceed 100 characters.'),
  meaning: z
    .string()
    .min(1, 'Meaning is required.')
    .trim()
    .max(500, 'Meaning cannot exceed 500 characters.'),
  pronunciation: z
    .string()
    .trim()
    .max(100, 'Pronunciation cannot exceed 100 characters.')
    .optional()
    .or(z.literal('')),
  level: z
    .string()
    .trim()
    .max(20, 'Level cannot exceed 20 characters.')
    .optional()
    .or(z.literal('')),
  categoryId: z
    .string()
    .min(1, 'Category is required.'),
});

export type WordFormValues = z.infer<typeof wordSchema>;
