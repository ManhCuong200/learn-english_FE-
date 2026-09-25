import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastManager } from '@/components/ui/toast';
import { notifyError, notifySuccess } from '@/lib/notifications';
import { getSessions, revokeSession, generate2FA, turnOn2FA, turnOff2FA } from '../_api/security';

export const useSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  const toastManager = useToastManager();

  return useMutation({
    mutationFn: (sessionId: string) => revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      notifySuccess(toastManager, {
        title: 'Session Revoked',
        description: 'The selected device has been logged out successfully.',
      });
    },
    onError: (error) => {
      notifyError(toastManager, 'Failed to revoke session', error);
    },
  });
};

export const useGenerate2FA = () => {
  return useMutation({
    mutationFn: generate2FA,
  });
};

export const useTurnOn2FA = () => {
  const toastManager = useToastManager();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => turnOn2FA(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      notifySuccess(toastManager, {
        title: '2FA Enabled',
        description: 'Two-factor authentication has been turned on successfully.',
      });
    },
    onError: (error) => {
      notifyError(toastManager, 'Failed to turn on 2FA', error);
    },
  });
};

export const useTurnOff2FA = () => {
  const toastManager = useToastManager();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: turnOff2FA,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      notifySuccess(toastManager, {
        title: '2FA Disabled',
        description: 'Two-factor authentication has been turned off successfully.',
      });
    },
    onError: (error) => {
      notifyError(toastManager, 'Failed to turn off 2FA', error);
    },
  });
};
