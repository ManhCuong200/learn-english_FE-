export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeout?: number;
  params?: Record<string, string | number | boolean | null | undefined>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let refreshPromise: Promise<boolean> | null = null;

const getBearerToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Try localStorage first
  const storedToken = localStorage.getItem('accessToken');
  if (storedToken) return storedToken;

  // Try document.cookie if available
  const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const buildUrlWithParams = (
  endpoint: string,
  params?: Record<string, string | number | boolean | null | undefined>,
): string => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${normalizedEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

const extractErrorMessage = (data: unknown): string | null => {
  if (!data || typeof data !== 'object') return null;

  if ('message' in data) {
    const { message } = data;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(', ');
  }

  return null;
};

const refreshTokens = async (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(buildUrlWithParams('/auth/refresh'), {
          method: 'POST',
          credentials: 'include',
        });
        return response.ok;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
};

export const apiClient = async <T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { body, params, timeout = 30000, headers: customHeaders, ...restOptions } = options;

  const headers = new Headers(customHeaders ?? {});
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  headers.set('Accept', 'application/json');

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Request Interceptor: Attach Bearer Token if available
  const token = getBearerToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Timeout Interceptor using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const requestBody = isFormData
      ? (body as FormData)
      : body !== undefined
      ? JSON.stringify(body)
      : undefined;

    let response = await fetch(buildUrlWithParams(endpoint, params), {
      ...restOptions,
      body: requestBody,
      credentials: 'include',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Response Interceptor: Handle 401 Auto Refresh Token
    if (
      response.status === 401 &&
      !endpoint.includes('/auth/refresh') &&
      !endpoint.includes('/auth/login') &&
      !endpoint.includes('/auth/logout') &&
      !endpoint.includes('/auth/me')
    ) {
      const refreshed = await refreshTokens();
      if (refreshed) {
        // Retry original request with refreshed session
        const retryController = new AbortController();
        const retryTimeoutId = setTimeout(() => retryController.abort(), timeout);
        try {
          response = await fetch(buildUrlWithParams(endpoint, params), {
            ...restOptions,
            body: requestBody,
            credentials: 'include',
            headers,
            signal: retryController.signal,
          });
        } finally {
          clearTimeout(retryTimeoutId);
        }
      }
    }

    const contentType = response.headers.get('content-type') ?? '';
    const responseData: unknown = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : null;

    if (!response.ok) {
      const defaultMsg =
        response.status === 401
          ? 'Unauthorized access. Please sign in.'
          : response.status === 403
          ? 'Forbidden. You do not have permission to perform this action.'
          : response.status >= 500
          ? 'Internal server error. Please try again later.'
          : 'Something went wrong.';

      const message = extractErrorMessage(responseData) ?? defaultMsg;
      throw new ApiError(message, response.status, responseData);
    }

    return responseData as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout. Please check your connection.', 408);
    }

    const message = error instanceof Error ? error.message : 'Network request failed';
    throw new ApiError(message, 0, error);
  }
};

// Aliases for convenience
export const apiFetch = apiClient;
