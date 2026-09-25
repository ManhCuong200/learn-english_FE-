import { apiFetch } from '@/api/client';

export interface Session {
  id: string;
  ipAddress: string;
  userAgent: string;
  lastActive: string;
  createdAt: string;
}

export const getSessions = () => {
  return apiFetch<Session[]>('/auth/sessions', {
    method: 'GET',
  });
};

export const revokeSession = (sessionId: string) => {
  return apiFetch<{ message: string }>(`/auth/sessions/${sessionId}/revoke`, {
    method: 'POST',
  });
};

export const generate2FA = () => {
  return apiFetch<{ secret: string; qrCodeDataUrl: string }>('/auth/2fa/generate', {
    method: 'POST',
  });
};

export const turnOn2FA = (code: string) => {
  return apiFetch<{ message: string }>('/auth/2fa/turn-on', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
};

export const turnOff2FA = () => {
  return apiFetch<{ message: string }>('/auth/2fa/turn-off', {
    method: 'POST',
  });
};
