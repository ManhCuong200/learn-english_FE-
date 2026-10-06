'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpenCheck,
  Pencil,
  Trophy,
  LayoutDashboard,
  Menu,
  BarChart3,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAuth } from '@/app/(auth)/_hooks/useAuth';
import { useLogout } from '@/app/(auth)/_hooks/useLogout';
import { ThemeToggle } from '@/components/ThemeToggle';

type HeaderProps = {
  variant?: 'public' | 'app';
};

const Header = ({ variant = 'public' }: HeaderProps) => {
  const { user, isLoading } = useAuth();
  const logoutMutation = useLogout();
  const isPublic = variant === 'public';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <Link
          href={isPublic ? '/' : '/learning'}
          className="flex items-center gap-3 text-sm font-bold tracking-[0.16em] uppercase text-foreground transition-opacity hover:opacity-80"
        >
          <span className="grid size-8 place-items-center rounded-full bg-primary text-base text-primary-foreground shadow-sm">
            e
          </span>
          Eunoia
        </Link>

        {isPublic ? (
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#method" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              Why Eunoia
            </a>
            <a href="#review" className="transition-colors hover:text-foreground">
              The method
            </a>
          </nav>
        ) : (
          <>
            <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
              <Link href="/learning" className="transition-colors hover:text-foreground">
                My learning
              </Link>
              <Link href="/learning/toeic" className="font-semibold text-primary transition-colors hover:opacity-80">
                TOEIC ETS
              </Link>
              <Link href="/learning/vocabulary" className="transition-colors hover:text-foreground">
                Vocabulary
              </Link>
              <Link href="/learning/flashcards" className="transition-colors hover:text-foreground">
                Flashcards
              </Link>
              <Link href="/learning/quizzes" className="transition-colors hover:text-foreground">
                Quiz
              </Link>
              <Link href="/learning/progress" className="transition-colors hover:text-foreground">
                Progress
              </Link>
              <Link href="/learning/history" className="transition-colors hover:text-foreground">
                History
              </Link>
            </nav>
            <div className="flex md:hidden items-center">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="p-2 text-foreground focus:outline-none"
                    >
                      <Menu className="size-6" />
                    </button>
                  }
                />
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuItem render={<Link href="/learning" />}>
                    My learning
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/learning/toeic" />}>
                    TOEIC ETS
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/learning/vocabulary" />}>
                    Vocabulary
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/learning/flashcards" />}>
                    Flashcards
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/learning/quizzes" />}>
                    Quiz
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/learning/progress" />}>
                    Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/learning/history" />}>
                    History
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="rounded-full outline-none ring-offset-background transition-shadow hover:ring-2 hover:ring-ring hover:ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Avatar className="size-9 border border-border/50">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                }
              />

            <DropdownMenuContent
              align="end"
              className="w-80"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-semibold">
                      {user.name}
                    </span>

                    <span className="text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <div className="grid grid-cols-2 gap-2 px-2 py-2">
                <div className="rounded-lg bg-muted/50 p-3 border border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Trophy className="size-3.5" />
                    Vocabulary
                  </div>
                  <p className="mt-2 text-lg font-semibold text-foreground">0 pts</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 border border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpenCheck className="size-3.5" />
                    Exercises
                  </div>
                  <p className="mt-2 text-lg font-semibold text-foreground">0 pts</p>
                </div>
              </div>

              <div className="space-y-3 px-2 py-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Level progress
                </p>
                {[
                  ['Beginner', 0],
                  ['Intermediate', 0],
                  ['Advanced', 0],
                ].map(([level, progress]) => (
                  <div key={level}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-foreground">{level}</span>
                      <span className="text-muted-foreground">{progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem render={<Link href="/learning" />}>
                <LayoutDashboard className="size-4 mr-2" />
                Learning App
              </DropdownMenuItem>
              
              <DropdownMenuItem render={<Link href="/learning/progress" />}>
                <BarChart3 className="size-4 mr-2" />
                Progress & Stats
              </DropdownMenuItem>

              <DropdownMenuItem render={<Link href="/profile" />}>
                <Pencil className="size-4 mr-2" />
                Edit profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled={logoutMutation.isPending}
                onClick={() => {
                  logoutMutation.mutate();
                }}
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                {logoutMutation.isPending
                  ? 'Logging out...'
                  : 'Logout'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : isPublic ? (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              {isLoading ? 'Get started' : 'Start learning'}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;