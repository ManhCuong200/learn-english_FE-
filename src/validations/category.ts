import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required.')
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name cannot exceed 100 characters.'),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .trim()
    .min(2, 'Slug must be at least 2 characters.')
    .toLowerCase()
    .regex(slugRegex, 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.'),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
