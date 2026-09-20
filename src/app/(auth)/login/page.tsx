'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { ArrowRight, BookOpen, Mail, LockKeyhole } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useLogin } from '../../hooks/useLogin';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    loginMutation.mutate({ email, password });
  }

  return (
    <div className="w-full max-w-[420px]">
        <div className="mb-9">
          <div className="mb-8 flex items-center gap-2 text-sm font-semibold tracking-[0.15em] text-primary uppercase lg:hidden">
            <BookOpen className="size-5" /> Eunoia English
          </div>
          <p className="mb-3 text-sm font-semibold tracking-[0.14em] text-primary uppercase">Welcome back</p>
          <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Welcome back
          </h1>
          <p className="mt-4 max-w-sm text-base leading-7 text-muted-foreground">
            Pick up where you left off. Your next good read is waiting.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold"
            >
              Email
            </label>
            <div className="relative mt-2">
              <Mail className="absolute top-3.5 left-3.5 size-4 text-muted-foreground" />
              <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
                className="w-full rounded-xl border bg-card py-3 pl-10 pr-4 outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold"
            >
              Password
            </label>

            <div className="relative mt-2">
              <LockKeyhole className="absolute top-3.5 left-3.5 size-4 text-muted-foreground" />
              <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
                className="w-full rounded-xl border bg-card py-3 pl-10 pr-4 outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          {loginMutation.error && (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {loginMutation.error.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            size="lg"
            className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {loginMutation.isPending ? 'Signing in...' : <>Sign in <ArrowRight /></>}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-foreground hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
  );
}