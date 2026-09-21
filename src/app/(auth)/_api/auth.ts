import { apiFetch } from '@/api/client';
import type {
  AuthUser,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/types/auth';

const authApi = {
  logout: () => apiFetch<{ message: string }>('/auth/logout', { method: 'POST' }),
  login: (request: LoginRequest) =>
    apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
  register: (request: RegisterRequest) =>
    apiFetch<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
  forgotPassword: (request: ForgotPasswordRequest) =>
    apiFetch<ForgotPasswordResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
  resetPassword: (request: ResetPasswordRequest) =>
    apiFetch<ResetPasswordResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
  getCurrentUser: () => apiFetch<AuthUser>('/auth/me'),
};

export const logout = authApi.logout;
export const login = authApi.login;
export const register = authApi.register;
export const forgotPassword = authApi.forgotPassword;
export const resetPassword = authApi.resetPassword;
export const getCurrentUser = authApi.getCurrentUser;