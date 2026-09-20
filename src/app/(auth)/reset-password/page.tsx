'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { useResetPassword } from '@/app/hooks/useResetPassword';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const resetPasswordMutation = useResetPassword();

  const passwordMismatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token || passwordMismatch) {
      return;
    }

    resetPasswordMutation.mutate({
      token,
      password,
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Reset password
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        {!token && (
          <div className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Invalid or missing reset token.
          </div>
        )}

        {resetPasswordMutation.isSuccess && (
          <div className="mb-5 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
            {resetPasswordMutation.data.message}
          </div>
        )}

        {resetPasswordMutation.isError && (
          <div className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {resetPasswordMutation.error.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              New password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength={8}
              required
              disabled={
                !token ||
                resetPasswordMutation.isPending
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              minLength={8}
              required
              disabled={
                !token ||
                resetPasswordMutation.isPending
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />

            {passwordMismatch && (
              <p className="text-sm text-destructive">
                Passwords do not match.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              !token ||
              passwordMismatch ||
              resetPasswordMutation.isPending
            }
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resetPasswordMutation.isPending
              ? 'Resetting...'
              : 'Reset password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}