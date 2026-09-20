'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useForgotPassword } from '@/app/hooks/useForgotPassword';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const forgotPasswordMutation = useForgotPassword();

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    forgotPasswordMutation.mutate({
      email: email.trim(),
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Forgot password?
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a link
            to reset your password.
          </p>
        </div>

        {forgotPasswordMutation.isSuccess && (
          <div className="mb-5 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
            {forgotPasswordMutation.data.message}
          </div>
        )}

        {forgotPasswordMutation.isError && (
          <div className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {forgotPasswordMutation.error.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              disabled={forgotPasswordMutation.isPending}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={
              forgotPasswordMutation.isPending
            }
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {forgotPasswordMutation.isPending
              ? 'Sending...'
              : 'Send reset link'}
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