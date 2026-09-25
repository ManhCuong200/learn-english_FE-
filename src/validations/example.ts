import { z } from 'zod';

export const exampleSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Example content is required')
    .max(500, 'Content must not exceed 500 characters'),
  meaning: z
    .string()
    .trim()
    .max(500, 'Meaning must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export type ExampleFormData = z.infer<typeof exampleSchema>;
