'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft,
  BookOpenCheck,
  Check,
  Pencil,
  Trophy,
} from 'lucide-react';

import { useAuth } from '@/app/hooks/useAuth';
import type { AuthUser } from '@/types/auth';

const levelProgress = [
  { level: 'Beginner', score: 0, words: 0, exercises: 0 },
  { level: 'Intermediate', score: 0, words: 0, exercises: 0 },
  { level: 'Advanced', score: 0, words: 0, exercises: 0 },
];

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return <ProfileEditor key={user.id} user={user} />;
}

function ProfileEditor({ user }: { user: AuthUser }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10 lg:py-14">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        <div className="mt-8 flex flex-col justify-between gap-5 border-b border-border pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Your learning profile
            </p>
            <h1 className="mt-2 font-display text-4xl">A little more about you</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              Keep your personal details up to date and see how your vocabulary habit is growing.
            </p>
          </div>
          <div className="grid size-16 place-items-center rounded-full bg-accent text-2xl font-semibold text-accent-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Pencil className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold">Personal information</h2>
                <p className="text-sm text-muted-foreground">Update how we know you.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="space-y-2">
                <label htmlFor="profile-name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="profile-name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setSaved(false);
                  }}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="profile-email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setSaved(false);
                  }}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                {saved && <Check className="size-4" />}
                {saved ? 'Changes saved' : 'Save changes'}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Learning scores</h2>
                <p className="mt-1 text-sm text-muted-foreground">Your progress by level.</p>
              </div>
              <Trophy className="size-5 text-[#d97845]" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[#e3eee7] p-4 text-[#286052]">
                <BookOpenCheck className="size-5" />
                <p className="mt-4 text-2xl font-semibold">0</p>
                <p className="text-xs font-medium">Vocabulary points</p>
              </div>
              <div className="rounded-xl bg-[#f8ead4] p-4 text-[#9b622a]">
                <Trophy className="size-5" />
                <p className="mt-4 text-2xl font-semibold">0</p>
                <p className="text-xs font-medium">Exercise points</p>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              {levelProgress.map(({ level, score, words, exercises }) => (
                <div key={level}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{level}</span>
                    <span className="text-muted-foreground">{score}% complete</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    <span>{words} words reviewed</span>
                    <span>{exercises} exercises done</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
