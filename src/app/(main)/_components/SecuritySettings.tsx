'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, ShieldAlert, MonitorSmartphone, XCircle } from 'lucide-react';
import { useAuth } from '@/app/(auth)/_hooks/useAuth';
import { useSessions, useRevokeSession, useGenerate2FA, useTurnOn2FA, useTurnOff2FA } from '../_hooks/useSecurity';

export const SecuritySettings = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <TwoFactorSetup isTwoFactorEnabled={user.isTwoFactorEnabled} />
      <SessionManagement />
    </div>
  );
};

const TwoFactorSetup = ({ isTwoFactorEnabled }: { isTwoFactorEnabled?: boolean }) => {
  const [setupMode, setSetupMode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const generate2FAMutation = useGenerate2FA();
  const turnOn2FAMutation = useTurnOn2FA();
  const turnOff2FAMutation = useTurnOff2FA();

  const handleStartSetup = async () => {
    try {
      const data = await generate2FAMutation.mutateAsync();
      setQrCodeUrl(data.qrCodeDataUrl);
      setSetupMode(true);
    } catch (e) { }
  };

  const handleTurnOn = async () => {
    try {
      await turnOn2FAMutation.mutateAsync(twoFactorCode);
      setSetupMode(false);
      setTwoFactorCode('');
    } catch (e) { }
  };

  const handleTurnOff = async () => {
    if (confirm('Are you sure you want to turn off Two-Factor Authentication?')) {
      await turnOff2FAMutation.mutateAsync();
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className={`grid size-10 place-items-center rounded-xl ${isTwoFactorEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {isTwoFactorEnabled ? <ShieldCheck className="size-5" /> : <ShieldAlert className="size-5" />}
          </span>
          <div>
            <h2 className="font-semibold">Two-Factor Authentication (2FA)</h2>
            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
          </div>
        </div>
        {isTwoFactorEnabled && (
          <button
            onClick={handleTurnOff}
            disabled={turnOff2FAMutation.isPending}
            className="inline-flex items-center justify-center rounded-lg border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-muted text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50"
          >
            {turnOff2FAMutation.isPending ? 'Turning off...' : 'Turn off'}
          </button>
        )}
      </div>

      {isTwoFactorEnabled ? (
        <div className="p-4 bg-green-50 text-green-800 rounded-lg text-sm border border-green-200">
          Your account is protected by 2FA. When signing in, you will be required to enter a code from your authenticator app.
        </div>
      ) : (
        <div className="space-y-4">
          {!setupMode ? (
            <button
              onClick={handleStartSetup}
              disabled={generate2FAMutation.isPending}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {generate2FAMutation.isPending ? 'Generating...' : 'Set up 2FA'}
            </button>
          ) : (
            <div className="space-y-4 p-4 border rounded-lg bg-background">
              <p className="text-sm">1. Scan this QR code with your authenticator app (e.g. Google Authenticator).</p>
              {qrCodeUrl && (
                <div className="bg-white p-2 inline-block rounded-lg">
                  <Image src={qrCodeUrl} alt="2FA QR Code" width={150} height={150} />
                </div>
              )}

              <p className="text-sm">2. Enter the 6-digit code from the app to verify.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={handleTurnOn}
                  disabled={twoFactorCode.length !== 6 || turnOn2FAMutation.isPending}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                >
                  Verify
                </button>
                <button
                  onClick={() => {
                    setSetupMode(false);
                    setTwoFactorCode('');
                  }}
                  className="inline-flex items-center justify-center rounded-lg border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

const SessionManagement = () => {
  const { data: sessions, isLoading } = useSessions();
  const revokeSessionMutation = useRevokeSession();

  return (
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="grid size-10 place-items-center rounded-xl bg-blue-100 text-blue-600">
          <MonitorSmartphone className="size-5" />
        </span>
        <div>
          <h2 className="font-semibold">Active Sessions</h2>
          <p className="text-sm text-muted-foreground">Manage devices currently logged into your account.</p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading sessions...</p>
      ) : (
        <div className="space-y-4">
          {sessions?.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg bg-background">
              <div>
                <p className="font-medium text-sm">{session.userAgent}</p>
                <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                  <span>IP: {session.ipAddress}</span>
                  <span>Last active: {new Date(session.lastActive).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => revokeSessionMutation.mutate(session.id)}
                disabled={revokeSessionMutation.isPending}
                className="text-red-500 hover:text-red-700 transition"
                title="Revoke session"
              >
                <XCircle className="size-5" />
              </button>
            </div>
          ))}
          {sessions?.length === 0 && (
            <p className="text-sm text-muted-foreground">No active sessions found.</p>
          )}
        </div>
      )}
    </section>
  );
};
