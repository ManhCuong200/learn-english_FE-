import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),

  email: z
    .string()
    .trim()
    .email('Please enter a valid email')
    .max(100, 'Email must be at most 100 characters'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email')
    .max(100, 'Email must be at most 100 characters'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters'),
  twoFactorCode: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email')
    .max(100, 'Email must be at most 100 characters'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be at most 72 characters'),

    confirmPassword: z
      .string()
      .min(8, 'Please confirm your password')
      .max(72, 'Password must be at most 72 characters'),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    },
  );

export type RegisterFormData = z.infer<
  typeof registerSchema
>;

export type LoginFormData = z.infer<typeof loginSchema>;

export type ForgotPasswordFormData = z.infer<
  typeof forgotPasswordSchema
>;

export type ResetPasswordFormData = z.infer<
  typeof resetPasswordSchema
>;