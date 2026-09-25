'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpenCheck,
  Pencil,
  Trophy,
  LayoutDashboard,
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

type HeaderProps = {
  variant?: 'public' | 'app';
};

const Header = ({ variant = 'public' }: HeaderProps) => {
  const { user, isLoading } = useAuth();
  const logoutMutation = useLogout();
  const isPublic = variant === 'public';

  return (
    <header
      className={
        isPublic
          ? 'relative z-10 border-b border-[#e2ddd0] bg-[#f5f1e8]'
          : 'relative z-10 border-b border-border bg-background'
      }
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <Link
          href={isPublic ? '/' : '/learning'}
          className={`flex items-center gap-3 text-sm font-bold tracking-[0.16em] uppercase ${
            isPublic ? 'text-[#1e3036]' : 'text-foreground'
          }`}
        >
          <span className="grid size-9 place-items-center rounded-full bg-primary text-lg text-primary-foreground">
            e
          </span>
          Eunoia
        </Link>

        {isPublic ? (
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#536266] md:flex">
            <a href="#method" className="transition hover:text-[#1e3036]">
              How it works
            </a>
            <a href="#features" className="transition hover:text-[#1e3036]">
              Why Eunoia
            </a>
            <a href="#review" className="transition hover:text-[#1e3036]">
              The method
            </a>
          </nav>
        ) : (
          <nav className="hidden items-center gap-8 text-sm font-medium text-foreground md:flex">
            <Link href="/learning" className="transition hover:text-primary">
              My learning
            </Link>
            <Link href="/learning/vocabulary" className="transition hover:text-primary">
              Vocabulary
            </Link>
            <Link href="/learning/flashcards" className="transition hover:text-primary">
              Flashcards
            </Link>
            <Link href="/learning/history" className="transition hover:text-primary">
              History
            </Link>
          </nav>
        )}

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              }
            >
              <Avatar>
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

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
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Trophy className="size-3.5" />
                    Vocabulary
                  </div>
                  <p className="mt-2 text-lg font-semibold">0 pts</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpenCheck className="size-3.5" />
                    Exercises
                  </div>
                  <p className="mt-2 text-lg font-semibold">0 pts</p>
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
                      <span>{level}</span>
                      <span className="text-muted-foreground">{progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem render={<Link href="/learning" />}>
                <LayoutDashboard className="size-4" />
                Learning App
              </DropdownMenuItem>
              
              <DropdownMenuItem render={<Link href="/profile" />}>
                <Pencil className="size-4" />
                Edit profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled={logoutMutation.isPending}
                onClick={() => {
                  logoutMutation.mutate();
                }}
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
              className="hidden px-3 py-2 text-sm font-semibold text-[#536266] transition hover:text-[#1e3036] sm:block"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-[#1e3036] px-4 py-2.5 text-sm font-semibold text-[#f8f4eb] transition hover:bg-[#31515a]"
            >
              {isLoading ? 'Get started' : 'Start learning'}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header;