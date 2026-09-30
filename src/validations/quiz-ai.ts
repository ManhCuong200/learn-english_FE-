import { z } from 'zod';

export const generateQuizQuestionsSchema = z.object({
  categoryId: z.string().optional(),
  level: z.string().optional(),
  count: z
    .number()
    .int('Count must be an integer')
    .min(1, 'Minimum 1 question required')
    .max(20, 'Maximum 20 questions allowed'),
  types: z
    .array(z.enum(['MEANING', 'FILL_BLANK', 'TRANSLATION']))
    .min(1, 'Select at least one question type')
    .max(3, 'Maximum 3 question types allowed'),
});

export type GenerateQuizQuestionsFormValues = z.infer<
  typeof generateQuizQuestionsSchema
>;
