const API_URL = 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiFetch = async <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const contentType = response.headers.get('content-type') ?? '';
  const data: unknown = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const message = data.message;

      if (typeof message === 'string') {
        throw new ApiError(message, response.status);
      }

      if (Array.isArray(message)) {
        throw new ApiError(message.join(', '), response.status);
      }
    }

    throw new ApiError('Something went wrong', response.status);
  }

  return data as T;
};
