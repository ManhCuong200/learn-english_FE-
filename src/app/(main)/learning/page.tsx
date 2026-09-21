'use client';

import { useAuth } from '@/app/(auth)/_hooks/useAuth';
import { useLogout } from '@/app/(auth)/_hooks/useLogout';
import Header from '@/components/common/Header';
import { BookOpen, Check, ChevronRight, Flame, Headphones, LayoutDashboard, LogOut, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LearningPage = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>You are not logged in.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar px-5 py-7 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3 px-3 text-sm font-semibold tracking-[0.16em] uppercase">
          <span className="grid size-9 place-items-center rounded-full bg-sidebar-primary text-lg font-bold text-sidebar-primary-foreground">e</span>
          Eunoia
        </div>
        <nav className="mt-14 space-y-1 text-sm">
          <a href="#" className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-3 font-semibold text-sidebar-accent-foreground"><LayoutDashboard className="size-4" /> My learning</a>
          <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><BookOpen className="size-4" /> My reading list</a>
          <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><Headphones className="size-4" /> Listening room</a>
        </nav>
        <div className="mt-auto space-y-1 text-sm">
          <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><Settings className="size-4" /> Settings</a>
          <Button type="button" variant="ghost" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending} className="h-auto w-full justify-start gap-3 px-3 py-3 font-normal text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><LogOut className="size-4" /> {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}</Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <Header variant="app" />
        <div className="border-b border-border/80 bg-background/80 px-6 py-5 backdrop-blur sm:px-10">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Monday, 20 September</p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl">Good morning, {user?.name?.split(' ')[0] || 'reader'}.</h1>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:py-12">
          <section className="grid gap-5 xl:grid-cols-[1.45fr_0.8fr]">
            <div className="relative overflow-hidden rounded-2xl bg-primary px-7 py-8 text-primary-foreground sm:px-10 sm:py-10">
              <div className="relative z-10 max-w-lg">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary-foreground/75"><Sparkles className="size-4" /> Your next small win</div>
                <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">The art of noticing</h2>
                <p className="mt-4 max-w-md leading-7 text-primary-foreground/75">A short read about the details that make a city feel like home.</p>
                <Button className="mt-7 rounded-lg bg-[#f3c56f] font-semibold text-[#26373b] hover:bg-[#f7d58e]">Continue reading <ChevronRight /></Button>
              </div>
              <div className="absolute -right-16 -bottom-28 size-72 rounded-full border border-primary-foreground/20" />
              <div className="absolute right-16 -bottom-16 size-44 rounded-full border border-primary-foreground/15" />
            </div>
            <div className="rounded-2xl border border-border bg-card p-7 sm:p-8">
              <div className="flex items-center justify-between"><p className="text-sm font-semibold">Your streak</p><Flame className="size-5 text-[#d97845]" /></div>
              <p className="mt-5 font-display text-6xl">07 <span className="font-sans text-base text-muted-foreground">days</span></p>
              <div className="mt-6 flex gap-2">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={`${day}-${index}`} className={`grid size-7 place-items-center rounded-full text-[11px] font-semibold ${index < 5 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{index < 5 ? <Check className="size-3" /> : day}</span>)}</div>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">You are building a lovely habit. Keep it going today.</p>
            </div>
          </section>

          <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">This week</p><h2 className="mt-2 font-display text-3xl">Your progress</h2></div><span className="text-sm font-semibold text-primary">68% complete</span></div>
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-end justify-between border-b border-border pb-5"><div><p className="text-4xl font-semibold">4.2 <span className="text-base font-normal text-muted-foreground">hours</span></p><p className="mt-1 text-sm text-muted-foreground">of 6 hours weekly goal</p></div><div className="text-right text-sm text-muted-foreground"><p>+18%</p><p>vs last week</p></div></div>
                <div className="mt-7 flex h-32 items-end justify-between gap-3">{[42, 68, 54, 84, 62, 38, 20].map((height, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className={`w-full max-w-9 rounded-t-md ${index === 3 ? 'bg-primary' : 'bg-primary/20'}`} style={{ height: `${height}%` }} /><span className="text-xs text-muted-foreground">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span></div>)}</div>
              </div>
            </div>
            <div><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">For you</p><h2 className="mt-2 font-display text-3xl">Quick practice</h2></div></div><div className="space-y-3"><button className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary"><span className="grid size-10 place-items-center rounded-lg bg-[#e3eee7] text-primary"><BookOpen className="size-5" /></span><span className="flex-1"><span className="block font-semibold">Vocabulary review</span><span className="mt-1 block text-sm text-muted-foreground">8 words · 5 min</span></span><ChevronRight className="size-4 text-muted-foreground" /></button><button className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary"><span className="grid size-10 place-items-center rounded-lg bg-[#f8ead4] text-[#bd752e]"><Headphones className="size-5" /></span><span className="flex-1"><span className="block font-semibold">Listen & repeat</span><span className="mt-1 block text-sm text-muted-foreground">Everyday phrases · 7 min</span></span><ChevronRight className="size-4 text-muted-foreground" /></button></div></div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default LearningPage;
