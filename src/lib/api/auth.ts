import { apiFetch } from '@/lib/api/client';
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/types/auth';

export const logout = async (): Promise<void> => {
  await apiFetch<{ message: string }>('/auth/logout', {
    method: 'POST',
  });
};

export const login = (request: LoginRequest) => {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

export const register = (request: RegisterRequest) => {
  return apiFetch<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

export const forgotPassword = (request: ForgotPasswordRequest) => {
  return apiFetch<ForgotPasswordResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

export const resetPassword = (request: ResetPasswordRequest) => {
  return apiFetch<ResetPasswordResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

export const getCurrentUser = () => {
  return apiFetch<AuthUser>('/auth/me');
};
