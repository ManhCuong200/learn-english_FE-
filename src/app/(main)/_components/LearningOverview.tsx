import { BookOpen, Check, Flame, Trophy, Play, Plus, GraduationCap, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useDashboardOverview } from '../_hooks/useDashboard';
import { Skeleton } from '@/components/ui/skeleton';

type LearningOverviewProps = {
  firstName: string;
};

const LearningOverview = ({ firstName }: LearningOverviewProps) => {
  const { data, isLoading } = useDashboardOverview();

  const getTodayFormatted = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const currentStreak = data?.streak.currentStreak || 0;
  const thisWeekActivity = data?.streak.thisWeekActivity || [false, false, false, false, false, false, false];
  const hoursThisWeek = data?.progress.hoursThisWeek || 0;
  const percentVsLastWeek = data?.progress.percentVsLastWeek || 0;
  const thisWeekDailyPercents = data?.progress.thisWeekDailyPercents || [0, 0, 0, 0, 0, 0, 0];
  const dueCount = data?.flashcard.dueCount || 0;
  const estimatedMinutes = data?.flashcard.estimatedMinutes || 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8">
        <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2">{getTodayFormatted()}</p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">
          Good morning, {firstName}.
        </h1>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Main Hero & Streak */}
        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr] mb-10">
          {/* Main Call to Action */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-teal-600 px-8 py-10 text-white sm:px-12 sm:py-12 shadow-xl shadow-primary/20">
            <div className="relative z-10 max-w-lg">
              <div className="flex items-center gap-2 text-sm font-bold text-white/80 tracking-widest uppercase mb-4">
                <GraduationCap className="size-5" /> 
                {dueCount > 0 ? "Daily Review" : "All Caught Up"}
              </div>
              <h2 className="font-display text-4xl leading-tight sm:text-5xl font-extrabold mb-4">
                {isLoading ? (
                  <Skeleton className="h-12 w-64 bg-white/20" />
                ) : dueCount > 0 ? (
                  `You have ${dueCount} words waiting.`
                ) : (
                  "Great job today!"
                )}
              </h2>
              <p className="max-w-md leading-relaxed text-white/90 text-lg mb-8">
                {dueCount > 0 
                  ? `It will only take about ${estimatedMinutes} minutes to complete your flashcard session. Keep your memory sharp!`
                  : "You've completed all your reviews for today. Feel free to explore new vocabulary."}
              </p>
              
              {dueCount > 0 ? (
                <Link href="/learning/flashcards">
                  <Button size="lg" className="rounded-full bg-white text-primary hover:bg-slate-100 shadow-xl px-8 h-14 text-lg font-bold transition-transform hover:scale-105">
                    <Play className="mr-2 fill-current size-5" /> Start Review
                  </Button>
                </Link>
              ) : (
                <Link href="/learning/vocabulary">
                  <Button size="lg" className="rounded-full bg-white text-primary hover:bg-slate-100 shadow-xl px-8 h-14 text-lg font-bold transition-transform hover:scale-105">
                    <Plus className="mr-2 size-5" /> Explore Words
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Decorative circles */}
            <div className="absolute -right-20 -bottom-32 size-[32rem] rounded-full border-[2rem] border-white/10" />
            <div className="absolute right-12 -top-12 size-40 rounded-full bg-white/10 blur-2xl" />
          </div>

          {/* Streak Card */}
          <div className="flex flex-col rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your Streak</p>
              <div className="p-2 bg-orange-100 rounded-full">
                <Flame className="size-5 text-orange-500" />
              </div>
            </div>
            
            {isLoading ? (
              <Skeleton className="h-20 w-32 mb-4" />
            ) : (
              <div className="flex items-baseline gap-2 mb-6">
                <p className="font-display text-7xl font-extrabold text-foreground">
                  {currentStreak}
                </p>
                <span className="text-xl font-medium text-muted-foreground">days</span>
              </div>
            )}

            <div className="mt-auto">
              <div className="flex justify-between gap-1 sm:gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                  const isActive = thisWeekActivity[index];
                  return (
                    <div key={`${day}-${index}`} className="flex flex-col items-center gap-2">
                      <span className={`grid size-9 sm:size-10 place-items-center rounded-full text-sm font-bold transition-all ${isActive ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-muted text-muted-foreground'}`}>
                        {isActive ? <Check className="size-4" /> : day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-sm font-medium text-muted-foreground text-center">
                Consistency is key. Keep up the great work!
              </p>
            </div>
          </div>
        </section>

        {/* Secondary Stats */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Progress Chart */}
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Activity className="size-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Study Time</h3>
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-full text-sm">
                  {hoursThisWeek} hrs this week
                </span>
              )}
            </div>

            <div className="flex items-end justify-between gap-2 h-40 mt-4">
              {thisWeekDailyPercents.map((height, index) => (
                <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-3 group">
                  <div 
                    className={`w-full max-w-[40px] rounded-xl transition-all duration-700 ease-out ${thisWeekActivity[index] ? 'bg-blue-500 group-hover:bg-blue-600' : 'bg-muted'}`} 
                    style={{ height: `${Math.max(10, height)}%` }} 
                  />
                  <span className={`text-xs font-bold ${thisWeekActivity[index] ? 'text-blue-600' : 'text-muted-foreground'}`}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-medium">Compared to last week</p>
              {isLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <span className={`px-2 py-1 rounded text-sm font-bold ${percentVsLastWeek >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {percentVsLastWeek > 0 ? '+' : ''}{percentVsLastWeek}%
                </span>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2 px-2">
              <Trophy className="size-5 text-muted-foreground" />
              <h3 className="font-bold text-lg text-foreground">Quick Actions</h3>
            </div>
            
            <Link href="/learning/flashcards" className="group flex items-center gap-5 rounded-[1.5rem] border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
              <div className="grid size-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                <BookOpen className="size-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">Review Flashcards</h4>
                {isLoading ? (
                  <Skeleton className="h-4 w-32 mt-2" />
                ) : (
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {dueCount} words waiting • {estimatedMinutes} min
                  </p>
                )}
              </div>
              <div className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ChevronRight className="size-5" />
              </div>
            </Link>

            <Link href="/learning/vocabulary" className="group flex items-center gap-5 rounded-[1.5rem] border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
              <div className="grid size-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-600 group-hover:scale-110 transition-transform">
                <Plus className="size-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">Discover Vocabulary</h4>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Expand your dictionary today
                </p>
              </div>
              <div className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ChevronRight className="size-5" />
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LearningOverview;
