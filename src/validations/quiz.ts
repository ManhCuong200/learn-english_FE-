import { z } from 'zod';

export const quizInfoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .nullable(),
  categoryId: z.string().optional().nullable(),
  level: z
    .string()
    .max(20, 'Level cannot exceed 20 characters')
    .optional()
    .nullable(),
});

export type QuizInfoFormValues = z.infer<typeof quizInfoSchema>;

export const quizQuestionSchema = z
  .object({
    id: z.string().optional(),
    wordId: z.string().min(1, 'Word selection is required'),
    question: z
      .string()
      .trim()
      .min(2, 'Question must be at least 2 characters')
      .max(1000, 'Question cannot exceed 1000 characters'),
    type: z.enum(['MEANING', 'FILL_BLANK', 'TRANSLATION']),
    options: z
      .array(z.string().trim().min(1, 'Option cannot be empty'))
      .length(4, 'Exactly 4 options are required')
      .refine(
        (items) => {
          const trimmed = items.map((i) => i.trim().toLowerCase());
          return new Set(trimmed).size === 4;
        },
        { message: 'Options must contain 4 unique choices' },
      ),
    correctAnswer: z.string().trim().min(1, 'Correct answer is required'),
  })
  .refine(
    (data) => {
      const trimmedOptions = data.options.map((o) => o.trim().toLowerCase());
      const trimmedCorrect = data.correctAnswer.trim().toLowerCase();
      return trimmedOptions.includes(trimmedCorrect);
    },
    {
      message: 'Correct answer must match one of the 4 options',
      path: ['correctAnswer'],
    },
  );

export type QuizQuestionFormValues = z.infer<typeof quizQuestionSchema>;
