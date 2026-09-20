import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/types/auth';

const API_URL = 'http://localhost:3000';

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data
    ) {
      const message = data.message;

      if (typeof message === 'string') {
        throw new Error(message);
      }

      if (Array.isArray(message)) {
        throw new Error(message.join(', '));
      }
    }

    throw new Error('Something went wrong');
  }

  return data as T;
}

export async function logout(): Promise<void> {
  await apiFetch<{ message: string }>('/auth/logout', {
    method: 'POST',
  });
}

export function login(request: LoginRequest) {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function register(request: RegisterRequest) {
  return apiFetch<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}