'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { ArrowRight, BookOpen, Mail, LockKeyhole, UserRound } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useRegister } from '../../hooks/useRegister';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registerMutation = useRegister();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    registerMutation.mutate({ name, email, password });
  }

  return (
    <div className="w-full max-w-[420px]">
        <div className="mb-9">
          <div className="mb-8 flex items-center gap-2 text-sm font-semibold tracking-[0.15em] text-primary uppercase lg:hidden">
            <BookOpen className="size-5" /> Eunoia English
          </div>
          <p className="mb-3 text-sm font-semibold tracking-[0.14em] text-primary uppercase">Your reading practice starts here</p>
          <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Create an account
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Build a daily rhythm that makes better English feel natural.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-semibold"
            >
              Name
            </label>

            <div className="relative mt-2">
              <UserRound className="absolute top-3.5 left-3.5 size-4 text-muted-foreground" />
              <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
              minLength={2}
              maxLength={50}
                className="w-full rounded-xl border bg-card py-3 pl-10 pr-4 outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

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
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              maxLength={72}
                className="w-full rounded-xl border bg-card py-3 pl-10 pr-4 outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          {registerMutation.error && (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {registerMutation.error.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            size="lg"
            className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {registerMutation.isPending ? 'Creating account...' : <>Create account <ArrowRight /></>}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
  );
}