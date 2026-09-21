import { mutationOptions } from '@tanstack/react-query';

import { login, logout, register, forgotPassword, resetPassword } from '@/app/(auth)/_api/auth';
import type { LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/types/auth';

export const authMutations = {
  login: () =>
    mutationOptions({
      mutationFn: (input: LoginRequest) => login(input),
    }),
  logout: () =>
    mutationOptions({
      mutationFn: logout,
    }),
  register: () =>
    mutationOptions({
      mutationFn: (input: RegisterRequest) => register(input),
    }),
  forgotPassword: () =>
    mutationOptions({
      mutationFn: (input: ForgotPasswordRequest) => forgotPassword(input),
    }),
  resetPassword: () =>
    mutationOptions({
      mutationFn: (input: ResetPasswordRequest) => resetPassword(input),
    }),
};
