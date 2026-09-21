import { ApiError } from '@/api/client';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export type ToastManagerLike = {
  add: (toast: {
    type: ToastType;
    title: string;
    description?: string;
  }) => unknown;
};

export type ToastOptions = {
  title: string;
  description?: string;
};

export const getErrorMessage = (
  error: unknown,
  fallback = 'Please try again.',
): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return typeof error === 'string' && error.length > 0 ? error : fallback;
};

export const notifySuccess = (
  toastManager: ToastManagerLike,
  { title, description }: ToastOptions,
) => {
  toastManager.add({
    type: 'success',
    title,
    description: description ?? 'Operation completed successfully.',
  });
};

export const notifyError = (
  toastManager: ToastManagerLike,
  title: string,
  error: unknown,
  fallback = 'Please try again.',
) => {
  toastManager.add({
    type: 'error',
    title,
    description: getErrorMessage(error, fallback),
  });
};
